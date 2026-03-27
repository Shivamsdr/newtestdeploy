import { useState, useEffect, useCallback } from 'react';
import { getAvailabilityForRange } from '../../services/api';

const Calendar = ({ tourId, selectedDate, onDateSelect, maxGroupSize, refreshTrigger }) => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [availabilityMap, setAvailabilityMap] = useState({});
  const [loading, setLoading] = useState(false);
  const [lastRefresh, setLastRefresh] = useState(Date.now());

  // Threshold for showing "Few left" - show when 5 or fewer spots available
  const FEW_LEFT_THRESHOLD = 5;

  // Helper to format date as YYYY-MM-DD in local timezone (not UTC)
  const formatDateLocal = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  // Get first and last day of the month
  const getMonthStart = (date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1);
  };

  const getMonthEnd = (date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0);
  };

  // Fetch availability for the current month
  const fetchAvailability = useCallback(async () => {
    if (!tourId) return;

    setLoading(true);
    try {
      const start = getMonthStart(currentMonth);
      const end = getMonthEnd(currentMonth);
      const startStr = formatDateLocal(start);
      const endStr = formatDateLocal(end);

      // Always fetch fresh data with cache-busting
      const data = await getAvailabilityForRange(tourId, startStr, endStr);
      const map = {};
      
      if (data?.data?.availability) {
        data.data.availability.forEach((item) => {
          // Backend returns UTC dates in YYYY-MM-DD format
          // Convert to local date string to match formatDateLocal() used in getDateStatus()
          let dateStr = item.date;
          if (typeof dateStr === 'string') {
            dateStr = dateStr.slice(0, 10); // Ensure YYYY-MM-DD format
            // Convert UTC date string to local date string for proper matching
            // This ensures the map key matches what formatDateLocal() produces
            const utcDate = new Date(dateStr + 'T12:00:00.000Z'); // Use noon UTC to avoid timezone edge cases
            dateStr = formatDateLocal(utcDate);
          } else if (dateStr instanceof Date) {
            dateStr = formatDateLocal(new Date(dateStr));
          }
          
          const availableSlots = Number(item.availableSlots) ?? 0;
          const totalSlots = Number(item.totalSlots) ?? 0;
          
          map[dateStr] = {
            availableSlots: availableSlots,
            totalSlots: totalSlots,
          };
        });
      }
      
      // Force update by creating a new object reference - this ensures React detects the change
      setAvailabilityMap({ ...map });
      setLastRefresh(Date.now());
    } catch (error) {
      console.error('Failed to fetch availability:', error);
      // Don't clear the map on error - keep showing last known data
    } finally {
      setLoading(false);
    }
  }, [tourId, currentMonth, maxGroupSize]);

  useEffect(() => {
    fetchAvailability();
  }, [fetchAvailability]);

  // Refresh when refreshTrigger changes (from parent component)
  useEffect(() => {
    if (refreshTrigger !== undefined && refreshTrigger !== null) {
      fetchAvailability();
    }
  }, [refreshTrigger, fetchAvailability]);

  // NOTE: Removed periodic polling to avoid server overload.
  // Availability refresh is event-driven:
  // - on mount
  // - on month change
  // - on explicit refresh button
  // - on parent refreshTrigger (e.g., after booking flow)

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Limit bookings to the next 3 months
  const maxBookingDate = new Date(today);
  maxBookingDate.setMonth(maxBookingDate.getMonth() + 3);

  const monthStart = getMonthStart(currentMonth);
  const monthEnd = getMonthEnd(currentMonth);
  const startDate = new Date(monthStart);
  startDate.setDate(startDate.getDate() - startDate.getDay()); // Start from Sunday

  const days = [];
  const currentDate = new Date(startDate);

  // Generate 42 days (6 weeks)
  for (let i = 0; i < 42; i++) {
    days.push(new Date(currentDate));
    currentDate.setDate(currentDate.getDate() + 1);
  }

  const getDateStatus = (date) => {
    const dateStr = formatDateLocal(date);
    const availability = availabilityMap[dateStr];

    // Use maxGroupSize as fallback, but prefer actual data from backend
    const fallbackTotalSlots = maxGroupSize || 50;

    // If no availability data, assume it's available (default to green)
    if (!availability || availability.totalSlots === undefined || availability.totalSlots === null) {
      // Default to available if no data - allows booking
      return { 
        status: 'available', 
        color: 'green', 
        availableSlots: fallbackTotalSlots, 
        totalSlots: fallbackTotalSlots,
        showFewLeft: false
      };
    }

    const { availableSlots, totalSlots } = availability;
    
    // Use actual totalSlots from backend (this reflects admin changes)
    // If totalSlots is 0 or invalid, use maxGroupSize as fallback
    const effectiveTotalSlots = (totalSlots > 0) ? totalSlots : fallbackTotalSlots;
    const effectiveAvailableSlots = (availableSlots >= 0) ? availableSlots : effectiveTotalSlots;
    
    // Calculate percentage for color logic
    const percentage = effectiveTotalSlots > 0 ? (effectiveAvailableSlots / effectiveTotalSlots) * 100 : 100;
    
    // Determine if we should show "Few left" (5 or fewer spots)
    const showFewLeft = effectiveAvailableSlots > 0 && effectiveAvailableSlots <= FEW_LEFT_THRESHOLD;

    if (effectiveAvailableSlots === 0) {
      return { 
        status: 'full', 
        color: 'red', 
        availableSlots: 0, 
        totalSlots: effectiveTotalSlots,
        showFewLeft: false
      };
    } else if (percentage <= 30 || showFewLeft) {
      return { 
        status: 'limited', 
        color: 'yellow', 
        availableSlots: effectiveAvailableSlots, 
        totalSlots: effectiveTotalSlots,
        showFewLeft: showFewLeft
      };
    } else {
      return { 
        status: 'available', 
        color: 'green', 
        availableSlots: effectiveAvailableSlots, 
        totalSlots: effectiveTotalSlots,
        showFewLeft: false
      };
    }
  };

  const handleDateClick = (date) => {
    if (date < today) return; // Can't select past dates
    
    const status = getDateStatus(date);
    if (status.status === 'full') return; // Can't select fully booked dates

    const dateStr = formatDateLocal(date);
    onDateSelect(dateStr);
  };

  const isSelected = (date) => {
    if (!selectedDate) return false;
    return formatDateLocal(date) === selectedDate;
  };

  const isToday = (date) => {
    return formatDateLocal(date) === formatDateLocal(today);
  };

  const isPast = (date) => {
    return date < today;
  };

  const isBeyondMax = (date) => {
    return date > maxBookingDate;
  };

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const navigateMonth = (direction) => {
    setCurrentMonth((prev) => {
      const newDate = new Date(prev);
      newDate.setMonth(prev.getMonth() + direction);

      const newMonthStart = getMonthStart(newDate);

      // Prevent navigating beyond the max booking window
      if (direction > 0 && newMonthStart > maxBookingDate) {
        return prev;
      }

      return newDate;
    });
  };

  return (
    <div className="bg-white  rounded-xl shadow-lg border border-gray-200  p-4 sm:p-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-4 sm:mb-6">
        <button
          onClick={() => navigateMonth(-1)}
          className="p-2 hover:bg-gray-100  rounded-lg transition-colors"
          aria-label="Previous month"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <div className="flex items-center gap-3">
          <h3 className="text-xl font-bold text-gray-800 ">
            {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
          </h3>
          <button
            onClick={() => fetchAvailability()}
            className="p-1.5 hover:bg-gray-100  rounded-lg transition-colors"
            title="Refresh availability"
            aria-label="Refresh availability"
          >
            <svg className="w-4 h-4 text-gray-600 " fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
          </button>
        </div>
        <button
          onClick={() => navigateMonth(1)}
          className="p-2 hover:bg-gray-100  rounded-lg transition-colors"
          aria-label="Next month"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      {loading && (
        <div className="text-center py-4 text-gray-500 ">
          Loading availability...
        </div>
      )}

      <div className="grid grid-cols-7 gap-1 sm:gap-2 mb-2 sm:mb-4 text-xs sm:text-sm">
        {dayNames.map((day) => (
          <div
            key={day}
            className="text-center text-sm font-semibold text-gray-600  py-2"
          >
            {day}
          </div>
        ))}
      </div>

      <div className="overflow-x-auto">
        <div className="grid grid-cols-7 gap-1 sm:gap-2 min-w-[320px]">
        {days.map((date, idx) => {
          const isCurrentMonth = date.getMonth() === currentMonth.getMonth();
          const dateStatus = getDateStatus(date);
          const selected = isSelected(date);
          const todayDate = isToday(date);
          const past = isPast(date);
          const beyondMax = isBeyondMax(date);

          let bgColor = '';
          let textColor = 'text-gray-400 ';
          let borderColor = '';
          let cursor = 'cursor-pointer';

          if (!isCurrentMonth) {
            bgColor = 'bg-transparent';
            textColor = 'text-gray-300 ';
          } else if (past) {
            bgColor = 'bg-gray-100 ';
            cursor = 'cursor-not-allowed';
            textColor = 'text-gray-400 ';
          } else if (beyondMax) {
            bgColor = 'bg-gray-100 ';
            cursor = 'cursor-not-allowed';
            textColor = 'text-gray-400 ';
          } else if (dateStatus.status === 'full') {
            bgColor = 'bg-red-100 ';
            cursor = 'cursor-not-allowed';
            textColor = 'text-gray-800 ';
            borderColor = 'border border-red-300 ';
          } else if (dateStatus.status === 'available') {
            bgColor = 'bg-green-100 ';
            textColor = 'text-gray-800 ';
            borderColor = selected ? 'border-2 border-green-600 ' : 'border border-green-300 ';
          } else if (dateStatus.status === 'limited') {
            bgColor = 'bg-yellow-100 ';
            textColor = 'text-gray-800 ';
            borderColor = selected ? 'border-2 border-yellow-600 ' : 'border border-yellow-300 ';
            // Make "Few left" dates more prominent
            if (dateStatus.showFewLeft) {
              bgColor = 'bg-amber-100 ';
              borderColor = selected ? 'border-2 border-amber-600 ' : 'border-2 border-amber-400 ';
            }
          } else {
            // Fallback - default to available (green)
            bgColor = 'bg-green-100 ';
            textColor = 'text-gray-800 ';
            borderColor = selected ? 'border-2 border-green-600 ' : 'border border-green-300 ';
          }

          if (selected) {
            bgColor += ' ring-2 ring-blue-500 ';
          }

          if (todayDate) {
            borderColor = 'border-2 border-blue-500 ';
          }

          return (
            <button
              key={idx}
              onClick={() => handleDateClick(date)}
              disabled={past || beyondMax || dateStatus.status === 'full' || !isCurrentMonth}
              className={`
                ${bgColor}
                ${textColor}
                ${borderColor}
                ${cursor}
                rounded-lg px-1.5 py-2 sm:px-2 sm:py-3 text-xs sm:text-sm font-medium min-h-[44px]
                transition-all hover:scale-105
                disabled:hover:scale-100
                ${todayDate ? 'font-bold' : ''}
                ${selected ? 'ring-2 ring-blue-500 ' : ''}
              `}
              title={
                isCurrentMonth && !past && !beyondMax
                  ? dateStatus.status === 'full'
                    ? 'Fully booked'
                    : dateStatus.showFewLeft
                    ? `Only ${dateStatus.availableSlots} spot${dateStatus.availableSlots === 1 ? '' : 's'} left!`
                    : `${dateStatus.availableSlots} of ${dateStatus.totalSlots} spots available`
                  : past
                  ? 'Past date'
                  : beyondMax
                  ? `Bookings available only up to ${formatDateLocal(maxBookingDate)}`
                  : ''
              }
            >
              <div className="font-semibold">{date.getDate()}</div>
              {isCurrentMonth && !past && dateStatus.status !== 'full' && dateStatus.showFewLeft && (
                <div className="text-xs mt-1 font-bold text-amber-700 ">
                  Few left
                </div>
              )}
            </button>
          );
        })}
        </div>
      </div>

      {/* Legend */}
      <div className="mt-4 sm:mt-6 pt-3 sm:pt-4 border-t border-gray-200  flex flex-col sm:flex-row flex-wrap gap-3 sm:gap-4 justify-center text-xs sm:text-sm">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-green-100  border border-green-300 "></div>
          <span className="text-gray-600 ">Available</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-yellow-100  border border-yellow-300 "></div>
          <span className="text-gray-600 ">Limited</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-red-100  border border-red-300 "></div>
          <span className="text-gray-600 ">Fully Booked</span>
        </div>
      </div>
    </div>
  );
};

export default Calendar;
