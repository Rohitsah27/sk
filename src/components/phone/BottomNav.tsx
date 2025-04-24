'use client';
import { useRouter } from 'next/navigation';
import { Home, Grid, Info, Phone } from 'lucide-react';

// Define or import the NavItem component
const NavItem = ({ icon, label, onClick }: { icon: JSX.Element; label: string; onClick: () => void }) => (
  <button
    className="flex flex-col items-center text-gray-600 hover:text-gray-800 focus:outline-none"
    onClick={onClick}
  >
    {icon}
    <span className="text-xs mt-1">{label}</span>
  </button>
);

const BottomNav = () => {
  const router = useRouter();

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg flex justify-around items-center py-2 z-50 rounded-t-xl md:hidden">
      <NavItem icon={<Home size={17} />} label="Home" onClick={() => router.push('/')} />
      <NavItem icon={<Grid size={17} />} label="Category" onClick={() => router.push('/products')} />
      <NavItem icon={<Info size={17} />} label="About Us" onClick={() => router.push('/about-us')} /> {/* ✅ This will work */}
      <NavItem icon={<Phone size={17} />} label="Contact Us" onClick={() => router.push('/contact-us')} />
    </div>
  );
};

export default BottomNav;
