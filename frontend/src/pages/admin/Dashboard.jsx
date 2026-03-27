import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getDashboardStats, AuthenticationError } from '../../services/api';
import Loader from '../../components/common/Loader';

const StatCard = ({ title, value, color, link }) => {
  const content = (
    <div className="bg-white  p-6 rounded-lg shadow border border-gray-200  hover:shadow-md transition-shadow">
      <h3 className="text-lg font-semibold text-gray-800  mb-2">
        {title}
      </h3>
      <p className={`text-3xl font-bold ${color}`}>{value}</p>
    </div>
  );

  if (link) {
    return <Link to={link}>{content}</Link>;
  }
  return content;
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

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [recentBookings, setRecentBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await getDashboardStats();
        setStats(data.data?.stats ?? null);
        setRecentBookings(data.data?.recentBookings ?? []);
      } catch (err) {
        // Don't display authentication errors - they're handled globally
        if (err instanceof AuthenticationError || err.isAuthError) {
          return;
        }
        setError(err.message || 'Failed to load dashboard stats.');
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col">
        <h1 className="text-3xl font-bold mb-6 text-gray-800 ">
          Dashboard
        </h1>
        <Loader />
      </div>
    );
  }

  if (error) {
    return (
      <div>
        <h1 className="text-3xl font-bold mb-6 text-gray-800 ">
          Dashboard
        </h1>
        <div className="bg-red-100  border border-red-400  text-red-700  px-4 py-3 rounded-lg">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6 text-gray-800 ">
        Dashboard
      </h1>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          title="Total Bookings"
          value={stats?.totalBookings ?? 0}
          color="text-blue-600"
          link="/admin/bookings"
        />
        <StatCard
          title="Total Tours"
          value={stats?.totalTours ?? 0}
          color="text-purple-600"
          link="/admin/tours"
        />
      </div>

      {/* Recent Bookings */}
      <div className="bg-white  rounded-xl shadow border border-gray-200 ">
        <div className="px-6 py-4 border-b border-gray-200  flex justify-between items-center">
          <h2 className="text-xl font-semibold text-gray-800 ">
            Recent Bookings
          </h2>
          <Link
            to="/admin/bookings"
            className="text-sm text-blue-600  hover:underline"
          >
            View all
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 ">
            <thead className="bg-gray-50 ">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600  uppercase">
                  Tour
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600  uppercase">
                  Customer
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600  uppercase">
                  Booked for
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600  uppercase">
                  Booked on
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600  uppercase">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 ">
              {recentBookings.length === 0 ? (
                <tr>
                  <td
                    colSpan={5}
                    className="px-4 py-8 text-center text-gray-500 "
                  >
                    No bookings yet.
                  </td>
                </tr>
              ) : (
                recentBookings.map((booking) => (
                  <tr key={booking._id} className="hover:bg-gray-50 ">
                    <td className="px-4 py-3 text-sm text-gray-800  font-medium">
                      {booking.tourId?.name ?? '—'}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600 ">
                      {booking.customerName || '—'}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600 ">
                      {formatDate(booking.bookingDate)}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600 ">
                      {formatDateTime(booking.createdAt)}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex px-2.5 py-1 text-xs font-medium rounded-full ${booking.status === 'confirmed'
                          ? 'bg-green-100  text-green-800 '
                          : booking.status === 'pending'
                            ? 'bg-amber-100  text-amber-800 '
                            : 'bg-gray-100  text-gray-600 '
                          }`}
                      >
                        {booking.status}
                      </span>
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

export default Dashboard;
