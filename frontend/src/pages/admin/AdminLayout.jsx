import { Suspense } from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import Sidebar from '../../components/layout/Sidebar';
import Topbar from '../../components/layout/Topbar';
import Loader from '../../components/common/Loader';

const AdminLayout = () => {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/admin/login" replace />;
  }

  return (
    <div className="bg-gray-50 text-gray-900 overflow-x-hidden font-sans" style={{ minHeight: '112vh', zoom: 0.9 }}>
      <Topbar />
      <Sidebar />
      <main className="pt-20 md:pt-24 p-3 sm:p-4 md:p-6 md:ml-64 relative z-10">
        <div className="max-w-7xl mx-auto">
          <Suspense fallback={<div className="mt-20"><Loader minHeightClass="min-h-[60vh]" /></div>}>
            <Outlet />
          </Suspense>
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;
