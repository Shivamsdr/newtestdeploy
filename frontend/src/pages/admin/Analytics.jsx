import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import Loader from '../../components/common/Loader';
import Button from '../../components/common/Button';
import { AuthenticationError, getAnalytics, getBookings, getTours } from '../../services/api';

const currency = (n) => {
  const v = Number(n || 0);
  return `₹${v.toLocaleString(undefined, { maximumFractionDigits: 0 })}`;
};

const isoDay = (d) => {
  const dt = new Date(d);
  const y = dt.getFullYear();
  const m = String(dt.getMonth() + 1).padStart(2, '0');
  const day = String(dt.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
};

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

const StatCard = ({ title, value, sub, color = 'text-blue-600', icon, link }) => {
  const content = (
    <div className="bg-white  p-6 rounded-xl shadow border border-gray-200  hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="text-sm font-semibold text-gray-600  mb-2">{title}</h3>
          <p className={`text-3xl font-bold ${color}`}>{value}</p>
          {sub ? <p className="mt-2 text-xs text-gray-500 ">{sub}</p> : null}
        </div>
        {icon ? (
          <div className="p-2 rounded-lg bg-gray-50  text-gray-700 ">
            {icon}
          </div>
        ) : null}
      </div>
    </div>
  );

  if (link) return <Link to={link}>{content}</Link>;
  return content;
};

const TooltipBox = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  const p = payload[0]?.payload;
  return (
    <div className="rounded-lg border border-gray-200  bg-white  px-3 py-2 shadow">
      <div className="text-xs font-semibold text-gray-700 ">{label}</div>
      <div className="mt-1 text-xs text-gray-600 ">
        Revenue: <span className="font-semibold">{currency(p?.revenue)}</span>
      </div>
      <div className="text-xs text-gray-600 ">
        Bookings: <span className="font-semibold">{p?.bookings ?? 0}</span>
      </div>
      <div className="text-xs text-gray-600 ">
        Customers: <span className="font-semibold">{p?.customers ?? 0}</span>
      </div>
    </div>
  );
};

const Analytics = () => {
  const today = useMemo(() => new Date(), []);
  const [tours, setTours] = useState([]);

  const [rangePreset, setRangePreset] = useState('month'); // 7d | 30d | month | custom
  const [start, setStart] = useState(() => isoDay(new Date(today.getFullYear(), today.getMonth(), 1)));
  const [end, setEnd] = useState(() => isoDay(new Date(today.getFullYear(), today.getMonth() + 1, 0)));
  const [groupBy, setGroupBy] = useState('day');
  const [tour, setTour] = useState('');
  const [bookingStatus, setBookingStatus] = useState('');

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [data, setData] = useState(null);

  // Details table (client-side)
  const [allBookings, setAllBookings] = useState([]);
  const [bookingSearch, setBookingSearch] = useState('');
  const [bookingSort, setBookingSort] = useState({ key: 'bookingDate', dir: 'desc' }); // bookingDate|createdAt|amount|status|tour|customer

  const applyPreset = (preset) => {
    const now = new Date();
    setRangePreset(preset);
    if (preset === '7d') {
      setStart(isoDay(new Date(now.getTime() - 6 * 24 * 60 * 60 * 1000)));
      setEnd(isoDay(now));
      setGroupBy('day');
    } else if (preset === '30d') {
      setStart(isoDay(new Date(now.getTime() - 29 * 24 * 60 * 60 * 1000)));
      setEnd(isoDay(now));
      setGroupBy('day');
    } else if (preset === 'month') {
      const first = new Date(now.getFullYear(), now.getMonth(), 1);
      const last = new Date(now.getFullYear(), now.getMonth() + 1, 0);
      setStart(isoDay(first));
      setEnd(isoDay(last));
      setGroupBy('day');
    }
  };

  useEffect(() => {
    const loadTours = async () => {
      try {
        const t = await getTours();
        setTours(t.data?.tours ?? []);
      } catch {
        // optional
      }
    };
    loadTours();
  }, []);

  useEffect(() => {
    const loadBookings = async () => {
      try {
        const b = await getBookings();
        setAllBookings(b.data?.bookings ?? []);
      } catch (err) {
        if (err instanceof AuthenticationError || err.isAuthError) return;
      }
    };
    loadBookings();
  }, []);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await getAnalytics({
        start,
        end,
        groupBy,
        tour: tour || undefined,
        bookingStatus: bookingStatus || undefined,
      });
      setData(res.data ?? null);
    } catch (err) {
      if (err instanceof AuthenticationError || err.isAuthError) return;
      setError(err.message || 'Failed to load analytics.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [start, end, groupBy, tour, bookingStatus]);

  const summary = data?.summary;
  const series = data?.series ?? [];
  const topTours = data?.breakdowns?.topTours ?? [];
  const paymentMethods = data?.breakdowns?.paymentMethods ?? [];

  const revenueLabel = 'Revenue (Confirmed/Paid Bookings)';

  const filteredBookings = useMemo(() => {
    const s = new Date(start + 'T00:00:00.000Z');
    const e = new Date(end + 'T23:59:59.999Z');
    const q = bookingSearch.trim().toLowerCase();

    return allBookings
      .filter((b) => {
        const d = new Date(b.bookingDate);
        if (Number.isNaN(d.getTime())) return false;
        if (d < s || d > e) return false;
        if (tour && b.tourId?._id !== tour) return false;
        if (bookingStatus && b.status !== bookingStatus) return false;
        if (!q) return true;

        const tourName = b.tourId?.name?.toLowerCase() || '';
        const customerName = b.customerName?.toLowerCase() || '';
        const customerEmail = b.customerEmail?.toLowerCase() || '';
        const customerPhone = b.customerPhone?.toLowerCase() || '';
        const amt = String(b.totalAmount ?? '');
        return (
          tourName.includes(q) ||
          customerName.includes(q) ||
          customerEmail.includes(q) ||
          customerPhone.includes(q) ||
          amt.includes(q)
        );
      })
      .sort((a, b) => {
        const dir = bookingSort.dir === 'asc' ? 1 : -1;
        const key = bookingSort.key;

        const get = (x) => {
          if (key === 'bookingDate') return new Date(x.bookingDate).getTime();
          if (key === 'createdAt') return new Date(x.createdAt).getTime();
          if (key === 'amount') return Number(x.totalAmount || 0);
          if (key === 'status') return String(x.status || '');
          if (key === 'tour') return String(x.tourId?.name || '');
          if (key === 'customer') return String(x.customerName || '');
          return 0;
        };

        const av = get(a);
        const bv = get(b);
        if (av < bv) return -1 * dir;
        if (av > bv) return 1 * dir;
        return 0;
      });
  }, [allBookings, start, end, tour, bookingStatus, bookingSearch, bookingSort]);

  const toggleSort = (key) => {
    setBookingSort((prev) => {
      if (prev.key !== key) return { key, dir: 'desc' };
      return { key, dir: prev.dir === 'desc' ? 'asc' : 'desc' };
    });
  };

  if (loading && !data) {
    return (
      <div className="flex flex-col">
        <h1 className="text-3xl font-bold mb-6 text-gray-800 ">Analytics</h1>
        <Loader />
      </div>
    );
  }

  return (
    <div>
      <div className="flex flex-col gap-4 mb-6">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 ">Analytics</h1>
            <p className="text-sm text-gray-600  mt-1">
              YouTube Studio style overview: revenue, customers, trends, and top performers.
            </p>
          </div>
          <Button variant="outline" size="sm" onClick={fetchAnalytics}>
            Refresh
          </Button>
        </div>

        {error ? (
          <div className="bg-red-100  border border-red-400  text-red-700  px-4 py-3 rounded-lg flex flex-wrap items-center justify-between gap-2">
            <span>{error}</span>
            <Button variant="outline" size="sm" onClick={fetchAnalytics}>
              Try again
            </Button>
          </div>
        ) : null}

        {/* Filters */}
        <div className="bg-white  rounded-xl shadow border border-gray-200  p-4">
          <div className="flex flex-col lg:flex-row lg:items-end gap-3">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-semibold text-gray-600  uppercase tracking-wide">
                Range
              </span>
              <button
                className={`px-3 py-1.5 rounded-lg text-sm border transition-colors ${rangePreset === '7d'
                  ? 'bg-blue-600 text-white border-blue-600'
                  : 'bg-white  text-gray-700  border-gray-200  hover:bg-gray-50 '
                  }`}
                onClick={() => applyPreset('7d')}
                type="button"
              >
                7 days
              </button>
              <button
                className={`px-3 py-1.5 rounded-lg text-sm border transition-colors ${rangePreset === '30d'
                  ? 'bg-blue-600 text-white border-blue-600'
                  : 'bg-white  text-gray-700  border-gray-200  hover:bg-gray-50 '
                  }`}
                onClick={() => applyPreset('30d')}
                type="button"
              >
                30 days
              </button>
              <button
                className={`px-3 py-1.5 rounded-lg text-sm border transition-colors ${rangePreset === 'month'
                  ? 'bg-blue-600 text-white border-blue-600'
                  : 'bg-white  text-gray-700  border-gray-200  hover:bg-gray-50 '
                  }`}
                onClick={() => applyPreset('month')}
                type="button"
              >
                This month
              </button>
              <button
                className={`px-3 py-1.5 rounded-lg text-sm border transition-colors ${rangePreset === 'custom'
                  ? 'bg-blue-600 text-white border-blue-600'
                  : 'bg-white  text-gray-700  border-gray-200  hover:bg-gray-50 '
                  }`}
                onClick={() => setRangePreset('custom')}
                type="button"
              >
                Custom
              </button>
            </div>

            <div className="flex flex-wrap gap-3">
              <div>
                <label className="block text-xs font-semibold text-gray-600  uppercase tracking-wide mb-1">
                  Start
                </label>
                <input
                  type="date"
                  value={start}
                  onChange={(e) => {
                    setRangePreset('custom');
                    setStart(e.target.value);
                  }}
                  className="px-4 py-3 border border-gray-300  rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500   transition-all duration-200 hover:border-gray-400  text-base sm:text-sm cursor-pointer"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600  uppercase tracking-wide mb-1">
                  End
                </label>
                <input
                  type="date"
                  value={end}
                  onChange={(e) => {
                    setRangePreset('custom');
                    setEnd(e.target.value);
                  }}
                  className="px-4 py-3 border border-gray-300  rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500   transition-all duration-200 hover:border-gray-400  text-base sm:text-sm cursor-pointer"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600  uppercase tracking-wide mb-1">
                  Group by
                </label>
                <select
                  value={groupBy}
                  onChange={(e) => setGroupBy(e.target.value)}
                  className="px-4 py-3 border border-gray-300  rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500   transition-all duration-200 hover:border-gray-400  text-base sm:text-sm cursor-pointer appearance-none bg-white "
                >
                  <option value="day">Day</option>
                  <option value="week">Week</option>
                  <option value="month">Month</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600  uppercase tracking-wide mb-1">
                  Tour
                </label>
                <select
                  value={tour}
                  onChange={(e) => setTour(e.target.value)}
                  className="px-4 py-3 border border-gray-300  rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500   transition-all duration-200 hover:border-gray-400  text-base sm:text-sm cursor-pointer appearance-none bg-white  min-w-[220px]"
                >
                  <option value="">All tours</option>
                  {tours.map((t) => (
                    <option key={t._id} value={t._id}>
                      {t.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600  uppercase tracking-wide mb-1">
                  Booking status
                </label>
                <select
                  value={bookingStatus}
                  onChange={(e) => setBookingStatus(e.target.value)}
                  className="px-4 py-3 border border-gray-300  rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500   transition-all duration-200 hover:border-gray-400  text-base sm:text-sm cursor-pointer appearance-none bg-white "
                >
                  <option value="">All</option>
                  <option value="confirmed">Confirmed</option>
                  <option value="pending">Pending</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>

            </div>
          </div>
        </div>
      </div>

      {/* Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          title="Revenue"
          value={currency(summary?.revenueCaptured ?? 0)}
          sub={revenueLabel}
          color="text-emerald-600"
        />
        <StatCard
          title="Distinct customers"
          value={summary?.distinctCustomers ?? summary?.customers ?? 0}
          sub="Unique customers (by email/phone)"
          color="text-blue-600"
        />
        <StatCard
          title="Repeated customers"
          value={summary?.repeatedCustomers ?? 0}
          sub="Customers with more than one booking in range"
          color="text-indigo-600"
        />
        <StatCard
          title="Bookings"
          value={summary?.bookings ?? 0}
          sub={`Confirmed: ${summary?.confirmedBookings ?? 0} • Pending: ${summary?.pendingBookings ?? 0}`}
          color="text-purple-600"
          link="/admin/bookings"
        />
        <StatCard
          title="Avg order value"
          value={currency(summary?.avgOrderValue ?? 0)}
          sub="Based on captured payments"
          color="text-amber-600"
        />
      </div>

      {/* Trend chart */}
      <div className="bg-white  rounded-xl shadow border border-gray-200  mb-8">
        <div className="px-6 py-4 border-b border-gray-200  flex flex-wrap items-center justify-between gap-2">
          <div>
            <h2 className="text-xl font-semibold text-gray-800 ">Revenue trend</h2>
            <p className="text-sm text-gray-600 ">Revenue, bookings, and customers over time</p>
          </div>
          <div className="text-xs text-gray-500 ">
            {start} → {end}
          </div>
        </div>
        <div className="p-6 h-[320px]">
          {loading ? (
            <Loader />
          ) : series.length === 0 ? (
            <div className="h-full flex items-center justify-center text-gray-500 ">
              No data for selected filters.
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={series} margin={{ top: 5, right: 10, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="revFill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.35} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0.05} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="bucket" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} tickFormatter={(v) => `₹${Number(v || 0).toFixed(0)}`} />
                <Tooltip content={<TooltipBox />} />
                <Area
                  type="monotone"
                  dataKey="revenue"
                  stroke="#10b981"
                  strokeWidth={2}
                  fill="url(#revFill)"
                />
              </AreaChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      {/* Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white  rounded-xl shadow border border-gray-200 ">
          <div className="px-6 py-4 border-b border-gray-200 ">
            <h2 className="text-xl font-semibold text-gray-800 ">Top tours</h2>
            <p className="text-sm text-gray-600 ">Ranked by captured revenue</p>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 ">
              <thead className="bg-gray-50 ">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600  uppercase">
                    Tour
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-semibold text-gray-600  uppercase">
                    Revenue
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-semibold text-gray-600  uppercase">
                    Bookings
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 ">
                {topTours.length === 0 ? (
                  <tr>
                    <td colSpan={3} className="px-4 py-10 text-center text-gray-500 ">
                      No tours found for this range.
                    </td>
                  </tr>
                ) : (
                  topTours.map((t) => (
                    <tr key={t.tourId} className="hover:bg-gray-50 ">
                      <td className="px-4 py-3 text-sm font-medium text-gray-800 ">
                        {t.name}
                      </td>
                      <td className="px-4 py-3 text-sm text-right text-gray-600 ">
                        {currency(t.revenue)}
                      </td>
                      <td className="px-4 py-3 text-sm text-right text-gray-600 ">
                        {t.bookings}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="bg-white  rounded-xl shadow border border-gray-200 ">
          <div className="px-6 py-4 border-b border-gray-200 ">
            <h2 className="text-xl font-semibold text-gray-800 ">Payment methods</h2>
            <p className="text-sm text-gray-600 ">Captured payments only</p>
          </div>
          <div className="p-6 space-y-3">
            {paymentMethods.length === 0 ? (
              <div className="text-gray-500 ">No captured payments in this range.</div>
            ) : (
              paymentMethods.map((m) => (
                <div key={m.method} className="flex items-center justify-between gap-3">
                  <div className="text-sm font-medium text-gray-800  capitalize">{m.method}</div>
                  <div className="text-sm text-gray-600 ">
                    {currency(m.revenue)} <span className="text-xs text-gray-500 ">({m.payments})</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Detailed table */}
      <div className="bg-white  rounded-xl shadow border border-gray-200  mt-8">
        <div className="px-6 py-4 border-b border-gray-200  flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-xl font-semibold text-gray-800 ">Bookings (details)</h2>
            <p className="text-sm text-gray-600 ">
              Search
            </p>
          </div>
          <div className="flex items-center gap-2">
            <input
              type="text"
              placeholder="Search tour/customer/email/phone/amount…"
              value={bookingSearch}
              onChange={(e) => setBookingSearch(e.target.value)}
              className="w-full md:w-[360px] px-4 py-2 border border-gray-300  rounded-lg   focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            {bookingSearch ? (
              <Button variant="outline" size="sm" onClick={() => setBookingSearch('')}>
                Clear
              </Button>
            ) : null}
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 ">
            <thead className="bg-gray-50 ">
              <tr>
                <th
                  className="px-4 py-3 text-left text-xs font-semibold text-gray-600  uppercase cursor-pointer select-none"
                  onClick={() => toggleSort('tour')}
                >
                  Tour
                </th>
                <th
                  className="px-4 py-3 text-left text-xs font-semibold text-gray-600  uppercase cursor-pointer select-none"
                  onClick={() => toggleSort('customer')}
                >
                  Customer
                </th>
                <th
                  className="px-4 py-3 text-left text-xs font-semibold text-gray-600  uppercase cursor-pointer select-none"
                  onClick={() => toggleSort('bookingDate')}
                >
                  Booked for
                </th>
                <th
                  className="px-4 py-3 text-left text-xs font-semibold text-gray-600  uppercase cursor-pointer select-none"
                  onClick={() => toggleSort('createdAt')}
                >
                  Booked on
                </th>
                <th
                  className="px-4 py-3 text-right text-xs font-semibold text-gray-600  uppercase cursor-pointer select-none"
                  onClick={() => toggleSort('amount')}
                >
                  Amount
                </th>
                <th
                  className="px-4 py-3 text-left text-xs font-semibold text-gray-600  uppercase cursor-pointer select-none"
                  onClick={() => toggleSort('status')}
                >
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 ">
              {filteredBookings.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-12 text-center text-gray-500 ">
                    No bookings match the selected range/filters.
                  </td>
                </tr>
              ) : (
                filteredBookings.slice(0, 200).map((b) => (
                  <tr key={b._id} className="hover:bg-gray-50 ">
                    <td className="px-4 py-3 text-sm font-medium text-gray-800 ">
                      {b.tourId?.name ?? '—'}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600 ">
                      <div className="flex flex-col">
                        <span className="font-medium text-gray-800 ">{b.customerName || '—'}</span>
                        {b.customerEmail ? (
                          <span className="text-xs text-gray-500 ">{b.customerEmail}</span>
                        ) : null}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600 ">
                      {formatDate(b.bookingDate)}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600 ">
                      {formatDateTime(b.createdAt)}
                    </td>
                    <td className="px-4 py-3 text-sm text-right text-gray-600 ">
                      {b.totalAmount ? currency(b.totalAmount) : '—'}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600 ">{b.status}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        {filteredBookings.length > 200 ? (
          <div className="px-6 py-3 text-xs text-gray-500  border-t border-gray-200 ">
            Showing first 200 of {filteredBookings.length} rows. (If you want server-side pagination + sorting, I can add it.)
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default Analytics;

