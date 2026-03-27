import { useState, useEffect, useCallback } from 'react';
import { getBookings, getTours, updateBookingStatus, AuthenticationError } from '../../services/api';
import Loader from '../../components/common/Loader';
import Button from '../../components/common/Button';
import Modal from '../../components/common/Modal';

const formatDate = (d) => {
  if (!d) return '—';
  return new Date(d).toLocaleDateString('en-GB', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
};

const formatDateTime = (d) => {
  if (!d) return '—';
  return new Date(d).toLocaleString('en-GB', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

const statusStyles = {
  pending: 'bg-amber-100 text-amber-700   px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wide border border-amber-200  shadow-sm',
  confirmed: 'bg-emerald-100 text-emerald-700   px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wide border border-emerald-200  shadow-sm',
  paid: 'bg-blue-100 text-blue-700   px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wide border border-blue-200  shadow-sm',
  cancelled: 'bg-red-100 text-red-700   px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wide border border-red-200  shadow-sm',
};



const Bookings = () => {
  const [bookings, setBookings] = useState([]);
  const [filteredBookings, setFilteredBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sortOrder, setSortOrder] = useState('newest');
  const [searchQuery, setSearchQuery] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [bookingTypeFilter, setBookingTypeFilter] = useState('all'); // 'all' | 'group' | 'private'

  const fetchBookings = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const params = {};
      if (bookingTypeFilter === 'group' || bookingTypeFilter === 'private') params.bookingType = bookingTypeFilter;
      const data = await getBookings(params);
      const bookingsList = data.data?.bookings ?? [];
      setBookings(bookingsList);
    } catch (err) {
      // Don't display authentication errors - they're handled globally
      if (err instanceof AuthenticationError || err.isAuthError) {
        return;
      }
      setError(err.message || 'Failed to load bookings.');
    } finally {
      setLoading(false);
    }
  }, [bookingTypeFilter]);

  const handleStatusChange = async (id, newStatus) => {
    try {
      await updateBookingStatus(id, newStatus);
      setBookings((prev) => prev.map((b) => b._id === id ? { ...b, status: newStatus } : b));
    } catch (err) {
      setError(err.message || 'Failed to update booking status');
    }
  };

  useEffect(() => {
    fetchBookings();
  }, [fetchBookings]);

  const getDateOnlyString = (d) => {
    if (!d) return '';
    const date = new Date(d);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  // Filter + sort bookings based on search query, date filter, and sort order
  useEffect(() => {
    let filtered = [...bookings];

    // Apply search query filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      filtered = filtered.filter((booking) => {
        const tourName = booking.tourId?.name?.toLowerCase() || '';
        const customerName = booking.customerName?.toLowerCase() || '';
        const customerEmail = booking.customerEmail?.toLowerCase() || '';
        const customerPhone = booking.customerPhone?.toLowerCase() || '';
        const bookingDate = formatDate(booking.bookingDate).toLowerCase();

        return (
          tourName.includes(query) ||
          customerName.includes(query) ||
          customerEmail.includes(query) ||
          customerPhone.includes(query) ||
          bookingDate.includes(query)
        );
      });
    }

    // Apply date-based filter for 'booked for' (bookingDate)
    if (startDate || endDate) {
      const s = startDate ? new Date(startDate + 'T00:00:00.000Z') : new Date('1970-01-01');
      const e = endDate ? new Date(endDate + 'T23:59:59.999Z') : new Date('2099-12-31');

      filtered = filtered.filter((booking) => {
        const d = new Date(booking.bookingDate);
        if (Number.isNaN(d.getTime())) return false;
        return d >= s && d <= e;
      });
    }

    // Sort by "Booked on" (createdAt) newest/oldest
    filtered.sort((a, b) => {
      const dateA = new Date(a.createdAt || a.bookingDate || 0).getTime();
      const dateB = new Date(b.createdAt || b.bookingDate || 0).getTime();
      if (sortOrder === 'oldest') {
        return dateA - dateB;
      }
      // default: newest first
      return dateB - dateA;
    });

    setFilteredBookings(filtered);
  }, [searchQuery, bookings, sortOrder, startDate, endDate, bookingTypeFilter]);


  const isInitialLoad = loading && bookings.length === 0;

  if (isInitialLoad) {
    return (
      <div className="flex flex-col">
        <div className="bg-gradient-to-r from-blue-500 to-cyan-500 px-6 py-4">
          <h2 className="text-xl font-bold text-white">Recent Bookings</h2>
        </div>
        <h1 className="text-3xl font-bold mb-6 text-gray-800 ">
          Bookings
        </h1>
        <Loader />
      </div>
    );
  }

  return (
    <div>
      {error && (
        <div className="bg-red-100  border border-red-400  text-red-700  px-4 py-3 rounded-lg mb-4 flex flex-wrap items-center justify-between gap-2">
          <span>{error}</span>
          <Button variant="outline" size="sm" onClick={() => { setError(null); fetchBookings(); }}>
            Try again
          </Button>
        </div>
      )}
      <div className="flex flex-col gap-4 mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <h1 className="text-3xl font-bold text-gray-800 ">
            Bookings
          </h1>

        </div>
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-sm text-gray-600  whitespace-nowrap">Type:</span>
            <div className="flex rounded-lg border border-gray-300  overflow-hidden bg-white  shadow-sm">
              {['all', 'group', 'private'].map((type) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => setBookingTypeFilter(type)}
                  className={`px-4 py-2.5 text-sm font-medium capitalize transition-colors ${bookingTypeFilter === type
                    ? 'bg-blue-600  text-white'
                    : 'bg-white  text-gray-700  hover:bg-gray-50 '
                    }`}
                >
                  {type === 'all' ? 'All' : type}
                </button>
              ))}
            </div>
          </div>
          <div className="flex items-center gap-3 flex-wrap">
            <div className="flex items-center gap-2">
              <label className="text-sm text-gray-600 whitespace-nowrap font-medium">Booked for:</label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="px-3 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 hover:border-gray-400 text-sm cursor-pointer bg-white shadow-sm hover:shadow-md"
              />
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-500">to</span>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="px-3 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 hover:border-gray-400 text-sm cursor-pointer bg-white shadow-sm hover:shadow-md"
              />
            </div>
          </div>
          <div className="flex items-center gap-2 flex-1 flex-wrap">
            <div className="flex-1 min-w-[180px]">
              <input
                type="text"
                placeholder="Search by tour, customer name, email, phone, or booked for..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300  rounded-lg   focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div className="flex items-center gap-2">
              <label htmlFor="sort-order" className="text-sm text-gray-600  whitespace-nowrap">
                Sort:
              </label>
              <div className="relative">
                <select
                  id="sort-order"
                  value={sortOrder}
                  onChange={(e) => setSortOrder(e.target.value)}
                  className="pl-3 pr-9 py-2 border border-gray-300  rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500   transition-all duration-200 hover:border-gray-400  text-sm cursor-pointer appearance-none bg-white "
                >
                  <option value="newest">Newest first</option>
                  <option value="oldest">Oldest first</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                  <svg
                    className="h-4 w-4 text-gray-500 "
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
              {(searchQuery || startDate || endDate || sortOrder !== 'newest' || bookingTypeFilter !== 'all') && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setSearchQuery('');
                    setStartDate('');
                    setEndDate('');
                    setSortOrder('newest');
                    setBookingTypeFilter('all');
                  }}
                >
                  Clear
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white  rounded-xl shadow overflow-hidden border border-gray-200 ">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200  bg-white  rounded-2xl shadow-lg overflow-hidden">
            <thead className="bg-gray-50  border-b border-gray-200 ">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-bold text-gray-700  uppercase tracking-wider">Tour</th>
                <th className="px-6 py-4 text-left text-sm font-bold text-gray-700  uppercase tracking-wider">Type</th>
                <th className="px-6 py-4 text-left text-sm font-bold text-gray-700  uppercase tracking-wider">Customer</th>
                <th className="px-6 py-4 text-left text-sm font-bold text-gray-700  uppercase tracking-wider">Booked for</th>
                <th className="px-6 py-4 text-left text-sm font-bold text-gray-700  uppercase tracking-wider">Booked on</th>
                <th className="px-6 py-4 text-left text-sm font-bold text-gray-700  uppercase tracking-wider">People</th>
                <th className="px-6 py-4 text-left text-sm font-bold text-gray-700  uppercase tracking-wider">Amount</th>
                <th className="px-6 py-4 text-left text-sm font-bold text-gray-700  uppercase tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 ">
              {filteredBookings.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-6 py-12 text-center text-gray-600 ">
                    {searchQuery ? 'No bookings match your search.' : 'No bookings found.'}
                  </td>
                </tr>
              ) : (
                filteredBookings.map((b) => (
                  <tr key={b._id} className={`${filteredBookings.indexOf(b) % 2 === 0 ? 'bg-gray-50/50 ' : 'bg-white '} hover:bg-blue-50  transition-all duration-200 cursor-pointer`}>
                    <td className="px-6 py-4 text-sm font-medium text-gray-900 ">
                      <div className="font-semibold">{b.tourId?.name ?? '—'}</div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-700 ">
                      <span className={`inline-flex px-2 py-0.5 text-xs font-medium rounded ${b.bookingType === 'private' ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800'}`}>
                        {b.bookingType === 'private' ? 'Private' : 'Group'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-700 ">
                      <div className="flex flex-col">
                        <span className="font-medium text-gray-900 ">{b.customerName || '—'}</span>
                        {b.customerEmail && (
                          <span className="text-xs text-gray-600 ">{b.customerEmail}</span>
                        )}
                        {b.customerPhone && (
                          <span className="text-xs text-gray-600 ">+91 {b.customerPhone}</span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-700 ">
                      {formatDate(b.bookingDate)}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-700 ">
                      {formatDateTime(b.createdAt)}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-700 ">{b.peopleCount}</td>
                    <td className="px-6 py-4 text-sm text-gray-700 ">
                      {b.totalAmount ? `₹${b.totalAmount.toLocaleString()}` : '—'}
                    </td>
                    <td className="px-6 py-4">
                      <select
                        value={b.status}
                        onChange={(e) => handleStatusChange(b._id, e.target.value)}
                        className={`inline-flex pl-3 pr-8 py-1 text-xs font-bold rounded-full transition-all duration-200 hover:scale-105 cursor-pointer appearance-none ${statusStyles[b.status] || ''}`}
                      >
                        <option value="pending" className="bg-white text-gray-800">Pending</option>
                        <option value="confirmed" className="bg-white text-gray-800">Confirmed</option>
                        <option value="paid" className="bg-white text-gray-800">Paid</option>
                        <option value="cancelled" className="bg-white text-gray-800">Cancelled</option>
                      </select>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>


    </div>
  );
};

export default Bookings;
