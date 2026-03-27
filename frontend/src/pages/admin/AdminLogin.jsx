import { Navigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import AdminLoginForm from '../../components/forms/AdminLoginForm';
import Navbar from '../../components/layout/Navbar';

const AdminLogin = () => {
  const { isAuthenticated } = useAuth();

  if (isAuthenticated) {
    return <Navigate to="/admin/dashboard" replace />;
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-black via-[#050509] to-black">
      <Navbar />
      <main className="flex-grow pt-20 flex items-center justify-center px-4">
        <div className="relative w-full max-w-md">
          {/* Background Effects */}
          <div className="absolute -top-24 -left-24 w-[400px] h-[400px] sm:-top-32 sm:-left-32 sm:w-[520px] sm:h-[520px] rounded-full bg-[#F5B400]/10 blur-3xl"></div>
          <div className="absolute -bottom-32 -right-32 w-[440px] h-[440px] sm:-bottom-40 sm:-right-40 sm:w-[560px] sm:h-[560px] rounded-full bg-white/5 blur-3xl"></div>
          
          {/* Login Container */}
          <div className="relative bg-black/60 backdrop-blur-2xl rounded-2xl sm:rounded-3xl border border-white/10 p-6 sm:p-8 shadow-[0_0_45px_rgba(0,0,0,0.7)]">
            <div className="text-center mb-6 sm:mb-8">
              <div className="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 bg-[#F5B400]/20 rounded-full mb-4 sm:mb-6">
                <svg className="w-8 h-8 sm:w-10 sm:h-10 text-[#F5B400]" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-white mb-2">Admin Portal</h2>
              <p className="text-white/60 text-sm sm:text-base">Sign in to manage your heritage tours</p>
            </div>
            <AdminLoginForm />
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminLogin;
