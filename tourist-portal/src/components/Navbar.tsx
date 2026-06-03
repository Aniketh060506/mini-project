import { Link, useLocation } from 'react-router-dom';
import { useState } from 'react';
import { FiMenu, FiX } from 'react-icons/fi';
import { RiCompassDiscoverLine } from 'react-icons/ri';

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const location = useLocation();

  const links = [
    { to: '/', label: 'Home' },
    { to: '/register', label: 'Register' },
    { to: '/dashboard', label: 'Dashboard' },
    { to: '/verify', label: 'Verify' },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 navbar-glass">
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between h-16">

        {/* Brand */}
        <Link to="/" className="travel-brand group drop-shadow">
          <RiCompassDiscoverLine size={20} className="text-white group-hover:rotate-12 transition-transform duration-300" />
          TRAVEL
        </Link>

        {/* Right Section: Links + CTA */}
        <div className="hidden md:flex items-center gap-6">
          {/* Desktop links */}
          <div className="flex items-center gap-1">
            {links.map((l) => (
              <Link
                key={l.to}
                to={l.to}
                className={`px-4 py-2 rounded-lg text-sm font-bold tracking-wide transition-all duration-300 ${
                  isActive(l.to)
                    ? 'text-white border-b-2 border-white'
                    : 'text-white/60 hover:text-white'
                }`}
              >
                {l.label}
              </Link>
            ))}
          </div>

          {/* CTA */}
          <div className="w-px h-6 bg-white/20"></div>
          <Link
            to="/register"
            className="btn-signin !w-auto !px-6 !py-2.5 !text-xs !rounded-lg inline-block shadow-lg shadow-blue-500/20"
          >
            REGISTER NOW
          </Link>
        </div>

        {/* Mobile hamburger */}
        <button
          onClick={() => setOpen(!open)}
          className="md:hidden p-2 rounded-lg text-white hover:bg-white/20 transition-colors"
        >
          {open ? <FiX size={20} /> : <FiMenu size={20} />}
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden glass-card border-t border-white/20 px-6 pb-5 animate-slide-up">
          <div className="pt-4 space-y-1">
            {links.map((l) => (
              <Link
                key={l.to}
                to={l.to}
                onClick={() => setOpen(false)}
                className={`block px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
                  isActive(l.to)
                    ? 'bg-white/28 text-white'
                    : 'text-white/75 hover:bg-white/18 hover:text-white'
                }`}
              >
                {l.label}
              </Link>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
