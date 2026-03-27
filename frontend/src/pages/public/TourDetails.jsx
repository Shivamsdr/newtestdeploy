import { useState, useEffect, useCallback, useRef } from "react";
import { useParams, Link, useNavigate, useLocation } from "react-router-dom";
import {
  getTour,
  getTimelineStepsByTour,
  getAvailability,
  getTourAvailability,
} from "../../services/api";
import Loader from "../../components/common/Loader";
import Button from "../../components/common/Button";
import LoadingOverlay from "../../components/common/LoadingOverlay";
import { parseSummaryToNodes } from "../../utils/richSummary";

const inputClass =
  "w-full px-4 py-2 border border-white/10 rounded-lg focus:ring-2 focus:ring-[#F5B400] focus:border-transparent bg-white/5 text-white placeholder-white/30";

// Local YYYY-MM-DD for date range
const toLocalYMD = (d) => {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
};

// Display label for a date string (e.g. "Wed, 4 Feb 2026")
const formatDateLabel = (dateStr) => {
  if (!dateStr) return "";
  const d = new Date(dateStr + "T12:00:00");
  return d.toLocaleDateString("en-GB", {
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};

const TourDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [tour, setTour] = useState(null);
  const [timelineSteps, setTimelineSteps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [bookingForm, setBookingForm] = useState({
    date: "",
    guests: 1,
    time: "",
    bookingType: "group",
  });
  const [availability, setAvailability] = useState(null);
  const [availabilityLoadError, setAvailabilityLoadError] = useState(false);
  const [bookingSubmitting, setBookingSubmitting] = useState(false);
  const [bookingError, setBookingError] = useState(null);
  const [availabilityRefreshing, setAvailabilityRefreshing] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [availableTimes, setAvailableTimes] = useState([]);
  const [availableDates, setAvailableDates] = useState([]); // [{ date, remainingSlots }]
  const [datesLoading, setDatesLoading] = useState(false);
  const [dateDropdownOpen, setDateDropdownOpen] = useState(false);
  const dateDropdownRef = useRef(null);

  const fetchAvailability = useCallback(async (tourId, date) => {
    if (!date || !tourId) {
      setAvailability(null);
      setAvailabilityLoadError(false);
      return;
    }
    setAvailabilityLoadError(false);
    try {
      const res = await getAvailability(tourId, date);
      const payload = res?.data ?? res ?? {};
      const availableSlots = Number(payload.availableSlots) ?? 0;
      const totalSlots = Number(payload.totalSlots) ?? 0;
      const times = Array.isArray(payload.times) ? payload.times : [];
      setAvailability({
        available: availableSlots > 0,
        remainingSlots: availableSlots,
        totalSlots,
      });
      setAvailableTimes(times);
    } catch {
      setAvailability(null);
      setAvailabilityLoadError(true);
      setAvailableTimes([]);
    }
  }, []);

  // If user searched with a date, prefill the booking date when arriving here
  useEffect(() => {
    const preselectedDate = location.state?.preselectedDate;
    if (preselectedDate && !bookingForm.date) {
      setBookingForm((f) => ({ ...f, date: preselectedDate }));
    }
    // intentionally ignore bookingForm.date to only run once for initial prefill
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.state]);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const [tourData, stepsData] = await Promise.all([
        getTour(id),
        getTimelineStepsByTour(id),
      ]);
      setTour(tourData.data?.tour);
      setTimelineSteps(stepsData.data?.steps ?? []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    if (id) {
      fetchData();
    }
  }, [id, fetchData]);

  // When tour allows only one booking type, preselect it
  useEffect(() => {
    if (!tour) return;
    const allowed =
      Array.isArray(tour.allowedBookingTypes) && tour.allowedBookingTypes.length
        ? tour.allowedBookingTypes
        : ["group", "private"];
    if (allowed.length === 1) {
      setBookingForm((f) =>
        f.bookingType === allowed[0] ? f : { ...f, bookingType: allowed[0] },
      );
    }
  }, [tour]);

  // Fetch explicit future availability dates from backend (admin-configured only)
  useEffect(() => {
    if (!id) return;
    setDatesLoading(true);
    getTourAvailability(id)
      .then((list) => {
        const safeList = Array.isArray(list) ? list : [];
        setAvailableDates(safeList);
        // If a preselected date exists but is no longer available, clear it
        if (
          bookingForm.date &&
          !safeList.some((d) => d.date === bookingForm.date)
        ) {
          setBookingForm((f) => ({ ...f, date: "", time: "" }));
        }
      })
      .catch((err) => {
        console.error("Failed to load availability:", err);
        setAvailableDates([]);
      })
      .finally(() => setDatesLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  // Auto-change images every 3 seconds
  useEffect(() => {
    const gallery = [tour?.imageCover, ...(tour?.images || [])].filter(Boolean);
    if (gallery.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % gallery.length);
    }, 3000);

    return () => clearInterval(interval);
  }, [tour?.imageCover, tour?.images]);

  useEffect(() => {
    if (id && bookingForm.date) {
      fetchAvailability(id, bookingForm.date);
    } else {
      setAvailability(null);
    }
  }, [id, bookingForm.date, fetchAvailability]);

  useEffect(() => {
    if (location.state?.refreshCalendar || location.state?.fromBooking) {
      if (bookingForm.date && id) {
        fetchAvailability(id, bookingForm.date);
        setTimeout(() => fetchAvailability(id, bookingForm.date), 1000);
      }
      navigate(location.pathname, { replace: true, state: {} });
    }
  }, [
    location.state,
    location.pathname,
    navigate,
    id,
    bookingForm.date,
    fetchAvailability,
  ]);

  // Close date dropdown when clicking outside
  useEffect(() => {
    if (!dateDropdownOpen) return;
    const handleClick = (e) => {
      if (
        dateDropdownRef.current &&
        !dateDropdownRef.current.contains(e.target)
      )
        setDateDropdownOpen(false);
    };
    document.addEventListener("click", handleClick);
    return () => document.removeEventListener("click", handleClick);
  }, [dateDropdownOpen]);

  if (loading) return <Loader />;
  if (error)
    return <div className="text-center py-12 text-red-600">{error}</div>;
  if (!tour)
    return <div className="text-center py-12 text-white">Tour not found</div>;

  const summaryNodes = parseSummaryToNodes(tour.summary, {
    paragraph: "text-white/80 leading-relaxed",
    list: "list-disc list-inside space-y-1 my-2 text-white/80 leading-relaxed",
    listItem: "pl-1",
  });

  return (
    <div className="min-h-screen bg-black pt-20">
      <LoadingOverlay
        show={availabilityRefreshing}
        message="Refreshing availability…"
      />
      {/* Main Content Layout */}
      <div className="w-full max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 relative z-10">
        {/* Viator-style Top Header */}
        <div className="mb-6">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4 break-words font-satisfy">
            {tour.name}
          </h1>
          <div className="flex flex-wrap items-center gap-3 sm:gap-4 text-white/80 text-sm">
            <span className="flex items-center gap-1.5 font-medium">
              <svg
                className="w-4 h-4 text-[#F5B400]"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
              {tour.duration} {tour.duration === 1 ? "hour" : "hours"}
            </span>
            <span className="text-white/30">•</span>
            <span className="flex items-center gap-1.5 font-medium">
              <svg
                className="w-4 h-4 text-[#F5B400]"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
              Max {tour.maxGroupSize}
            </span>
            <span className="text-white/30">•</span>
            <span
              className={`px-2 py-0.5 rounded text-xs font-semibold uppercase tracking-wider ${tour.difficulty === "easy"
                ? "bg-green-500/20 text-green-400 border border-green-500/30"
                : tour.difficulty === "medium"
                  ? "bg-amber-500/20 text-amber-400 border border-amber-500/30"
                  : "bg-red-500/20 text-red-400 border border-red-500/30"
                }`}
            >
              {tour.difficulty}
            </span>
          </div>
        </div>

        {/* 2-Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 xl:gap-14 relative">
          {/* LEFT COLUMN: Sticky Booking Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-32 z-20 max-h-[calc(100vh-8rem)] overflow-y-auto custom-scrollbar pb-4 pr-1">
              <div
                id="booking-section"
                className="bg-[#111] rounded-xl shadow-2xl p-4 md:p-5 border border-white/10 relative overflow-hidden"
              >
                {/* Subtle background glow */}
                <div className="absolute top-0 right-0 w-48 h-48 bg-[#F5B400]/5 rounded-full blur-3xl -mr-24 -mt-24 pointer-events-none" />

                {/* Price Highlight Header */}
                <div className="mb-4 pb-4 border-b border-white/10 relative z-10">
                  <span className="text-xs text-white/50 block mb-1">From</span>
                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl font-bold text-white">
                      ₹{tour.price?.toLocaleString()}
                    </span>
                    <span className="text-xs text-white/50">per person</span>
                  </div>
                </div>

                {/* Booking Form (Using the existing booking form code) */}
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    setBookingError(null);

                    if (!bookingForm.date) {
                      setBookingError("Please select a date");
                      return;
                    }

                    // Ensure selected date is one of the admin-configured dates
                    if (
                      !availableDates.some((d) => d.date === bookingForm.date)
                    ) {
                      setBookingError(
                        "Selected date is not available for this tour.",
                      );
                      return;
                    }

                    if (!bookingForm.time) {
                      setBookingError("Please select a time slot");
                      return;
                    }

                    if (
                      availableTimes.length > 0 &&
                      !availableTimes.includes(bookingForm.time)
                    ) {
                      setBookingError(
                        "Selected time is no longer available. Please choose another time slot.",
                      );
                      return;
                    }

                    // Enforce booking window: today .. today + 3 months
                    const todayLocal = new Date();
                    todayLocal.setHours(0, 0, 0, 0);
                    const maxBookingDate = new Date(todayLocal);
                    maxBookingDate.setMonth(maxBookingDate.getMonth() + 3);
                    const selectedDate = new Date(
                      bookingForm.date + "T00:00:00",
                    );
                    if (selectedDate > maxBookingDate) {
                      setBookingError(
                        "Bookings are only available within the next 3 months.",
                      );
                      return;
                    }

                    if (!bookingForm.guests || bookingForm.guests < 1) {
                      setBookingError("Please enter the number of guests");
                      return;
                    }

                    const peopleCount = Number(bookingForm.guests) || 1;

                    // Validate against available slots
                    if (availability != null) {
                      if (!availability.available) {
                        setBookingError(
                          "This date is fully booked. Please select another date.",
                        );
                        return;
                      }
                      if (peopleCount > availability.remainingSlots) {
                        setBookingError(
                          `Only ${availability.remainingSlots} spot${availability.remainingSlots === 1 ? "" : "s"} available, but ${peopleCount} requested. Please reduce the number of guests or select another date.`,
                        );
                        return;
                      }
                    }

                    // Validate against maxGroupSize as fallback
                    if (peopleCount > (tour?.maxGroupSize ?? 50)) {
                      setBookingError(
                        `Maximum ${tour.maxGroupSize} guests allowed per booking.`,
                      );
                      return;
                    }

                    setBookingSubmitting(true);
                    const totalSlots =
                      availability?.totalSlots ?? tour?.maxGroupSize ?? 0;

                    const allowed =
                      Array.isArray(tour.allowedBookingTypes) &&
                        tour.allowedBookingTypes.length
                        ? tour.allowedBookingTypes
                        : ["group", "private"];
                    const chosenType = allowed.includes(bookingForm.bookingType)
                      ? bookingForm.bookingType
                      : allowed[0];
                    navigate("/book/details", {
                      state: {
                        bookingSummary: {
                          tourId: tour._id,
                          tour: {
                            name: tour.name,
                            price: tour.price,
                            maxGroupSize: tour.maxGroupSize,
                            allowedBookingTypes: tour.allowedBookingTypes,
                          },
                          bookingDate: bookingForm.date,
                          bookingTime: bookingForm.time,
                          peopleCount,
                          bookingType: chosenType,
                          totalSlotsPerDay: totalSlots,
                          remainingSlots: availability?.remainingSlots,
                        },
                      },
                    });
                    setBookingSubmitting(false);
                  }}
                  className="relative z-10"
                >
                  {bookingError && (
                    <div className="mb-4 bg-red-400/10 border border-red-400/30 text-red-200 px-4 py-3 rounded-lg">
                      {bookingError}
                    </div>
                  )}
                  {(() => {
                    const allowedTypes =
                      Array.isArray(tour.allowedBookingTypes) &&
                        tour.allowedBookingTypes.length
                        ? tour.allowedBookingTypes
                        : ["group", "private"];
                    if (allowedTypes.length < 2) return null;
                    return (
                      <div className="mb-3">
                        <label className="block text-xs font-semibold text-white/80 mb-1">
                          Booking type
                        </label>
                        <div className="flex rounded-lg border border-white/10 overflow-hidden bg-white/5 p-1">
                          {allowedTypes.includes("group") && (
                            <button
                              type="button"
                              onClick={() =>
                                setBookingForm((f) => ({
                                  ...f,
                                  bookingType: "group",
                                }))
                              }
                              className={`flex-1 px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${bookingForm.bookingType === "group"
                                ? "bg-[#F5B400] text-black shadow-lg font-bold"
                                : "text-white/60 hover:text-white hover:bg-white/10"
                                }`}
                            >
                              Group
                            </button>
                          )}
                          {allowedTypes.includes("private") && (
                            <button
                              type="button"
                              onClick={() =>
                                setBookingForm((f) => ({
                                  ...f,
                                  bookingType: "private",
                                }))
                              }
                              className={`flex-1 px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${bookingForm.bookingType === "private"
                                ? "bg-[#F5B400] text-black shadow-lg font-bold"
                                : "text-white/60 hover:text-white hover:bg-white/10"
                                }`}
                            >
                              Private
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })()}
                  <div className="grid gap-3">
                    <div className="relative" ref={dateDropdownRef}>
                      <label className="block text-xs font-semibold text-white/80 mb-1">
                        Selected Date
                      </label>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setDateDropdownOpen((o) => !o);
                        }}
                        className={`${inputClass} !py-1.5 !px-3 text-sm font-medium w-full text-left flex items-center justify-between gap-2`}
                        disabled={datesLoading}
                      >
                        <span>
                          {bookingForm.date
                            ? formatDateLabel(bookingForm.date)
                            : "Select date"}
                        </span>
                        <span className="text-white/40">
                          {dateDropdownOpen ? "▲" : "▼"}
                        </span>
                      </button>
                      {dateDropdownOpen && (
                        <div className="absolute z-20 mt-1 w-full rounded-lg border border-white/10 bg-[#1a1a1a] shadow-xl max-h-56 overflow-y-auto custom-scrollbar">
                          {datesLoading ? (
                            <div className="p-3 text-sm text-white/50">
                              Loading dates…
                            </div>
                          ) : availableDates.length === 0 ? (
                            <div className="p-3 text-sm text-white/50">
                              No upcoming dates available for this tour.
                            </div>
                          ) : (
                            availableDates.map((item) => (
                              <button
                                key={item.date}
                                type="button"
                                onClick={() => {
                                  setBookingForm((f) => ({
                                    ...f,
                                    date: item.date,
                                    time: "",
                                  }));
                                  setDateDropdownOpen(false);
                                }}
                                className="w-full px-4 py-2.5 text-left text-sm flex items-center gap-2 hover:bg-white/5 border-b border-white/5 last:border-b-0 text-white/90 transition-colors"
                              >
                                <span className="text-[#F5B400]" aria-hidden>
                                  ●
                                </span>
                                <span>{formatDateLabel(item.date)}</span>
                                {typeof item.remainingSlots === "number" && (
                                  <span className="ml-auto text-xs text-white/50">
                                    {item.remainingSlots} left
                                  </span>
                                )}
                              </button>
                            ))
                          )}
                        </div>
                      )}
                      {/* In-control helper text */}
                      {!datesLoading && availableDates.length === 0 && (
                        <p className="mt-2 text-sm text-white/50">
                          No upcoming dates available for this tour.
                        </p>
                      )}
                      {bookingForm.date && availability != null && (
                        <p className="mt-2 text-sm font-medium text-white/70 flex items-center gap-1">
                          {availabilityLoadError ? (
                            <>
                              Unable to load availability. You can still try to
                              book.
                            </>
                          ) : availability.available ? (
                            <>
                              <svg
                                className="w-4 h-4 text-green-500"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M5 13l4 4L19 7"
                                />
                              </svg>
                              {availability.remainingSlots} of{" "}
                              {availability.totalSlots} spots available
                            </>
                          ) : (
                            <>
                              <svg
                                className="w-4 h-4 text-red-500"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M6 18L18 6M6 6l12 12"
                                />
                              </svg>
                              Fully booked ({availability.totalSlots} spots per
                              day)
                            </>
                          )}
                        </p>
                      )}
                      {bookingForm.date && (
                        <button
                          type="button"
                          className="mt-2 text-xs text-white/60 hover:text-[#47E4FF] hover:underline"
                          onClick={async () => {
                            if (!id || !bookingForm.date) return;
                            try {
                              setAvailabilityRefreshing(true);
                              await fetchAvailability(id, bookingForm.date);
                            } finally {
                              setAvailabilityRefreshing(false);
                            }
                          }}
                        >
                          Refresh availability
                        </button>
                      )}
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-white/80 mb-1">
                        Time Slot
                      </label>
                      <select
                        value={bookingForm.time}
                        onChange={(e) =>
                          setBookingForm((f) => ({
                            ...f,
                            time: e.target.value,
                          }))
                        }
                        className={`${inputClass} !py-1.5 !px-3 text-sm font-medium appearance-none`}
                        disabled={availableTimes.length === 0}
                        style={{
                          backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%23ffffff80' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`,
                          backgroundPosition: `right 0.5rem center`,
                          backgroundRepeat: `no-repeat`,
                          backgroundSize: `1.5em 1.5em`,
                        }}
                      >
                        <option value="" className="bg-[#111] text-white">
                          Select a time
                        </option>
                        {availableTimes.map((t) => (
                          <option
                            key={t}
                            value={t}
                            className="bg-[#111] text-white"
                          >
                            {t}
                          </option>
                        ))}
                      </select>
                      {bookingForm.date &&
                        availableTimes.length === 0 &&
                        !availabilityLoadError && (
                          <p className="mt-2 text-sm text-white/50">
                            No specific time slots configured for this date.
                            Please contact us if you need a particular time.
                          </p>
                        )}
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-white/80 mb-1">
                        Number of Guests
                      </label>
                      <input
                        type="number"
                        min={1}
                        max={Math.min(
                          tour?.maxGroupSize ?? 50,
                          availability?.remainingSlots ??
                          tour?.maxGroupSize ??
                          50,
                        )}
                        value={bookingForm.guests}
                        onChange={(e) =>
                          setBookingForm((f) => ({
                            ...f,
                            guests: e.target.value,
                          }))
                        }
                        className={`${inputClass} !py-1.5 !px-3 text-sm`}
                        required
                      />
                      {availability != null && availability.available && (
                        <p className="mt-2 text-sm font-medium text-white/60">
                          {availability.remainingSlots} spot
                          {availability.remainingSlots === 1 ? "" : "s"}{" "}
                          available (max{" "}
                          {Math.min(
                            availability.remainingSlots,
                            tour?.maxGroupSize ?? 50,
                          )}
                          )
                        </p>
                      )}
                      {availability == null && tour?.maxGroupSize != null && (
                        <p className="mt-2 text-sm text-white/50">
                          Max {tour.maxGroupSize} per day for this tour
                        </p>
                      )}
                    </div>
                    <div>
                      <Button
                        type="submit"
                        variant="primary"
                        size="lg"
                        disabled={
                          bookingSubmitting ||
                          !bookingForm.date ||
                          (availability != null && !availability.available)
                        }
                        className="w-full h-10 text-base font-semibold bg-[#F5B400] text-black hover:bg-[#ffc107] border-none"
                      >
                        {bookingSubmitting
                          ? "Processing..."
                          : "Book your seat @ ₹0 →"}
                      </Button>
                    </div>
                  </div>
                </form>

                {/* Alternative CTA (e.g. Lowest price guarantee, free cancellation) */}
                <div className="mt-4 flex items-center gap-2 text-[11px] text-green-400 justify-center">
                  <svg
                    className="w-4 h-4 shrink-0"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <span>Lowest price guarantee</span>
                </div>
              </div>

              {/* Support Block below sticky sidebar */}
              <div className="mt-3 p-4 rounded-xl border border-white/5 bg-white/5 text-center">
                <h4 className="font-semibold text-white mb-1 text-sm">
                  Have questions?
                </h4>
                <p className="text-white/60 text-xs mb-3">
                  Our travel experts are here to help you plan your perfect
                  trip.
                </p>
                <Link to="/contact">
                  <Button
                    variant="outline"
                    className="w-full border-white/20 text-white hover:bg-white/10 !py-1.5 text-sm"
                  >
                    Contact Support
                  </Button>
                </Link>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: Image + Overview Information */}
          <div className="lg:col-span-2 space-y-12">
            {/* Image Gallery Header pushed into right column */}
            <div className="w-full h-[400px] sm:h-[500px] md:h-[600px] rounded-2xl overflow-hidden relative group shadow-2xl border border-white/10">
              {/* Image Slider */}
              <div className="w-full h-full relative">
                {(() => {
                  const gallery = [tour.imageCover, ...(tour.images || [])].filter(Boolean);
                  if (gallery.length === 0) {
                    return (
                      <div className="w-full h-full bg-gradient-to-br from-stone-900 to-black flex items-center justify-center">
                        <svg className="w-32 h-32 text-white/20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                      </div>
                    );
                  }
                  return (
                    <>
                      {gallery.map((img, idx) => (
                        <div
                          key={idx}
                          className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${idx === currentImageIndex ? 'opacity-100 z-10' : 'opacity-0 z-0'
                            }`}
                        >
                          <img
                            src={img}
                            alt={`${tour.name} - image ${idx + 1}`}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      ))}

                      {/* Dot Navigation */}
                      {gallery.length > 1 && (
                        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex gap-2.5">
                          {gallery.map((_, idx) => (
                            <button
                              key={idx}
                              onClick={() => setCurrentImageIndex(idx)}
                              className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${idx === currentImageIndex
                                ? 'bg-white w-8 shadow-[0_0_10px_rgba(255,255,255,0.5)]'
                                : 'bg-white/40 hover:bg-white/60'
                                }`}
                              aria-label={`Go to slide ${idx + 1}`}
                            />
                          ))}
                        </div>
                      )}

                      {/* Navigation Arrows (Visible on hover) */}
                      {gallery.length > 1 && (
                        <>
                          <button
                            onClick={() => setCurrentImageIndex((prev) => (prev - 1 + gallery.length) % gallery.length)}
                            className="absolute left-4 top-1/2 -translate-y-1/2 z-20 p-2 rounded-full bg-black/30 hover:bg-black/50 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 backdrop-blur-sm border border-white/10"
                            aria-label="Previous image"
                          >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
                          </button>
                          <button
                            onClick={() => setCurrentImageIndex((prev) => (prev + 1) % gallery.length)}
                            className="absolute right-4 top-1/2 -translate-y-1/2 z-20 p-2 rounded-full bg-black/30 hover:bg-black/50 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 backdrop-blur-sm border border-white/10"
                            aria-label="Next image"
                          >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                          </button>
                        </>
                      )}
                    </>
                  );
                })()}
                <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-black/60 to-transparent pointer-events-none z-10" />
              </div>
            </div>

            {/* Overview */}
            <section>
              <h2 className="text-2xl font-bold text-white mb-4">Overview</h2>
              {summaryNodes.length > 0 ? (
                <div className="space-y-4 text-base text-white/80 leading-relaxed font-light">
                  {summaryNodes}
                </div>
              ) : (
                <p className="text-white/80 leading-relaxed text-base font-light">
                  Discover Goa beyond the postcards. This curated walk blends
                  local stories, hidden bylanes, and landmark sites into a slow,
                  immersive experience designed for travellers who want to feel
                  the soul of the place—not just tick off a checklist.
                </p>
              )}
            </section>

            <hr className="border-white/10" />

            {/* Itinerary */}
            {timelineSteps.length > 0 && (
              <section>
                <h2 className="text-2xl font-bold text-white mb-6">
                  What to expect
                </h2>
                <div className="relative pl-2 sm:pl-4">
                  {/* Vertical line connecting steps */}
                  <div
                    className="absolute left-6 sm:left-8 top-8 bottom-0 w-px bg-white/20"
                    aria-hidden="true"
                  />

                  {timelineSteps.map((step) => (
                    <div
                      key={step._id}
                      className="relative flex gap-4 sm:gap-6 pb-12 last:pb-0 group"
                    >
                      {/* Step Indicator */}
                      <div className="relative z-10 flex-shrink-0 w-10 h-10 rounded-full bg-[#111] border-2 border-[#F5B400] text-[#F5B400] flex items-center justify-center font-bold text-base mt-2 ring-4 ring-black shadow-[0_0_15px_rgba(245,180,0,0.3)] transition-transform duration-300 group-hover:scale-110">
                        {step.order}
                      </div>

                      {/* Step Content Card */}
                      <div className="flex-1 min-w-0 bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl p-5 sm:p-6 transition-colors duration-300 backdrop-blur-sm shadow-xl">
                        <div className="flex flex-wrap items-center gap-3 mb-3">
                          <h3 className="font-bold text-white text-lg sm:text-xl tracking-wide">
                            {step.title}
                          </h3>
                        </div>
                        {step.duration && (
                          <div className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold bg-[#F5B400] text-black px-3 py-1 rounded-full mb-4">
                            <svg
                              className="w-4 h-4"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                              />
                            </svg>
                            {step.duration}
                          </div>
                        )}
                        {step.description && (
                          <p className="text-white/80 leading-relaxed text-sm sm:text-base font-light">
                            {step.description}
                          </p>
                        )}
                        {step.image && (
                          <div className="mt-5 rounded-xl overflow-hidden shadow-2xl border border-white/10 inline-block w-full max-w-sm">
                            <img
                              src={step.image}
                              alt={step.title}
                              className="w-full h-48 object-cover transition-transform duration-700 hover:scale-105"
                              loading="lazy"
                            />
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {timelineSteps.length > 0 && <hr className="border-white/10" />}

            {/* FAQ Section */}
            {tour?.faqs && tour.faqs.length > 0 && (
              <section>
                <h2 className="text-2xl font-bold text-white mb-6">
                  Frequently Asked Questions
                </h2>
                <div className="space-y-6">
                  {tour.faqs.map((faq, index) => (
                    <div
                      key={index}
                      className="bg-[#111] border border-white/5 rounded-xl p-5 hover:bg-white/5 transition-colors"
                    >
                      <h3 className="text-lg font-semibold text-white mb-3 flex items-start gap-3">
                        <span className="text-[#F5B400] shrink-0 mt-0.5">
                          Q.
                        </span>
                        {faq.question}
                      </h3>
                      <p className="text-white/70 leading-relaxed text-sm sm:text-base font-light pl-6">
                        {faq.answer}
                      </p>
                    </div>
                  ))}
                </div>
              </section>
            )}
          </div>
        </div>
      </div>

      {/* Back Link */}
      <div className="mt-8 text-center pb-12">
        <Link
          to="/tours"
          className="text-white/60 hover:text-[#47E4FF] hover:underline inline-flex items-center gap-2 transition-colors"
        >
          ← Back to All Tours
        </Link>
      </div>
    </div>
  );
};

export default TourDetails;
