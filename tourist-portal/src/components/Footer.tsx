import { Link } from 'react-router-dom';
import { RiCompassDiscoverLine } from 'react-icons/ri';
import { FiMail, FiPhone, FiMapPin } from 'react-icons/fi';

const Footer = () => (
  <footer className="relative z-10 border-t border-white/20">
    <div className="navbar-glass">
      <div className="max-w-7xl mx-auto px-6 py-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          <div className="md:col-span-2">
            <div className="travel-brand mb-4 drop-shadow">
              <RiCompassDiscoverLine size={18} className="text-white" />
              TRAVEL
            </div>
            <p className="text-sm text-white/60 leading-relaxed max-w-sm">
              Where every corner of the world is within your reach. Safe trekking through IoT monitoring, blockchain verification, and real-time emergency response.
            </p>
          </div>

          <div>
            <h4 className="text-white/90 font-bold text-sm mb-4 tracking-wider uppercase">Explore</h4>
            <div className="space-y-2.5">
              {[
                { to: '/', label: 'Home' },
                { to: '/register', label: 'Register' },
                { to: '/dashboard', label: 'Dashboard' },
                { to: '/verify', label: 'Verify' },
              ].map((l) => (
                <Link key={l.to} to={l.to} className="block text-sm text-white/55 hover:text-white transition-colors font-medium">
                  {l.label}
                </Link>
              ))}
            </div>
          </div>

          <div>
            <h4 className="text-white/90 font-bold text-sm mb-4 tracking-wider uppercase">Contact</h4>
            <div className="space-y-2.5 text-sm text-white/55">
              <p className="flex items-center gap-2 font-medium"><FiMail size={13} className="text-white/80" />support@treksafe.in</p>
              <p className="flex items-center gap-2 font-medium"><FiPhone size={13} className="text-white/80" />+91 1800-XXX-XXXX</p>
              <p className="flex items-center gap-2 font-medium"><FiMapPin size={13} className="text-white/80" />Dehradun, India</p>
            </div>
          </div>
        </div>

        <div className="border-t border-white/18 mt-8 pt-6 text-center text-xs text-white/40 font-medium">
          © 2026 TrekSafe Portal — Powered by IoT × Blockchain
        </div>
      </div>
    </div>
  </footer>
);

export default Footer;
