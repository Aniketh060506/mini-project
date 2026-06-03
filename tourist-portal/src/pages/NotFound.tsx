import { Link } from 'react-router-dom';
import { FiArrowLeft } from 'react-icons/fi';
import { RiCompassDiscoverLine } from 'react-icons/ri';

const NotFound = () => (
  <div className="min-h-screen page-wrapper flex items-center justify-center px-6">
    <div className="text-center animate-slide-up">
      <div className="travel-brand justify-center mb-8 drop-shadow">
        <RiCompassDiscoverLine size={22} className="text-white" />
        TRAVEL
      </div>
      <h1 className="hero-heading text-[8rem] text-white/30 leading-none mb-4">404</h1>
      <h2 className="text-2xl font-black text-white mb-3 drop-shadow-lg">Page Not Found</h2>
      <p className="text-white/60 text-sm mb-8 max-w-xs mx-auto font-medium">
        Looks like you've ventured off the trail. Let's get you back on track.
      </p>
      <Link to="/" className="btn-signin inline-flex items-center gap-3 !w-auto !px-8 !py-3.5">
        <FiArrowLeft size={18} />
        Back to Home
      </Link>
    </div>
  </div>
);

export default NotFound;
