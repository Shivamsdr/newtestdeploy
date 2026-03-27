import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';
import FloatingContact from '../common/FloatingContact';


const PublicLayout = () => {
  return (
    <div className="min-h-screen flex flex-col bg-black [zoom:0.9]">
      <Navbar />
      <main className="flex-grow pt-16">
        <Outlet />
      </main>
      <Footer />
      <FloatingContact />
    </div>
  );
};


export default PublicLayout;
