import { Link } from 'react-router-dom';
import { FiMapPin, FiShield, FiActivity, FiAlertTriangle, FiArrowRight } from 'react-icons/fi';
import { RiCompassDiscoverLine } from 'react-icons/ri';

const stats = [
  { label: 'Tourists Registered', value: '12,847' },
  { label: 'Active Treks Today', value: '342' },
  { label: 'Safe Returns', value: '99.8%' },
  { label: 'Emergency Response', value: '<2 min' },
  { label: 'Tourists Registered', value: '12,847' },
  { label: 'Active Treks Today', value: '342' },
  { label: 'Safe Returns', value: '99.8%' },
  { label: 'Emergency Response', value: '<2 min' },
];

const features = [
  {
    icon: <FiMapPin size={24} />,
    title: 'Real-time GPS Tracking',
    description: 'Track trekker locations live via ESP32 IoT devices with precise GPS coordinates.',
  },
  {
    icon: <FiActivity size={24} />,
    title: 'Health Monitoring',
    description: 'Heart rate, SpO2 & temperature continuously tracked and monitored.',
  },
  {
    icon: <FiAlertTriangle size={24} />,
    title: 'Fall Detection & SOS',
    description: 'Automatic fall detection with instant emergency alerts to contacts.',
  },
  {
    icon: <FiShield size={24} />,
    title: 'Blockchain Verification',
    description: 'Tamper-proof identity stored on Polygon blockchain for checkpoint verification.',
  },
];

const HomePage = () => (
  <div className="min-h-screen page-wrapper">

    {/* ── Hero: Full-screen, reference-image layout ── */}
    <section className="relative min-h-screen flex items-center">
      <div className="w-full max-w-7xl mx-auto px-8 pt-16 pb-10">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-12 items-center min-h-[calc(100vh-72px)]">

          {/* Left: Branding + Hero text */}
          <div className="animate-slide-up">
            <div className="travel-brand mb-7 drop-shadow-lg">
              <RiCompassDiscoverLine size={20} className="text-white" />
              TRAVEL
            </div>

            <h1 className="hero-heading text-[clamp(3.8rem,9vw,7rem)] mb-5">
              EXPLORE<br />HORIZONS
            </h1>

            <p className="text-white font-semibold text-lg mb-2 drop-shadow-md">
              Where Your Dream Destinations Become Reality.
            </p>
            <p className="text-white/75 text-sm leading-relaxed max-w-xs mb-10 drop-shadow">
              Embark on a journey where every corner of the world is within your reach.
            </p>

            <div className="flex flex-wrap gap-4">
              <Link
                to="/register"
                className="group inline-flex items-center gap-3 px-8 py-4 rounded-xl btn-signin !w-auto"
              >
                Register Now
                <FiArrowRight className="group-hover:translate-x-1 transition-transform" size={18} />
              </Link>
              <Link
                to="/dashboard"
                className="inline-flex items-center gap-3 px-7 py-4 rounded-xl glass text-white font-semibold text-sm hover:bg-white/30 transition-all duration-200 border border-white/40"
              >
                View Dashboard
              </Link>
            </div>

            {/* Stats */}
            <div className="flex flex-wrap gap-10 mt-14">
              {[
                { val: '12,847', lbl: 'Registered' },
                { val: '99.8%', lbl: 'Safe Returns' },
                { val: '<2 min', lbl: 'Response' },
              ].map((s, i) => (
                <div key={i}>
                  <p className="text-2xl font-black text-white drop-shadow-md">{s.val}</p>
                  <p className="text-xs text-white/65 mt-0.5 font-medium tracking-wide">{s.lbl}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Right: Glassmorphism card — Live Tracker */}
          <div className="animate-slide-left">
            <div className="glass-card rounded-[2rem] p-8 md:p-10 border border-white/20">
              <div className="w-14 h-14 rounded-2xl bg-white/10 border border-white/20 flex items-center justify-center mb-6 text-white drop-shadow">
                <FiActivity size={26} />
              </div>
              <h2 className="text-white font-black text-2xl mb-2 drop-shadow-sm">Live Tracker</h2>
              <p className="text-white/70 text-sm font-medium mb-8 leading-relaxed">
                Monitor trekker vitals and location in real-time. No password required.
              </p>

              <div className="space-y-5">
                <div>
                  <label className="glass-label mb-2">Tourist ID or Blockchain TxID</label>
                  <input
                    type="text"
                    placeholder="e.g. TSP-K7M2X9"
                    className="w-full px-5 py-4 rounded-xl shadow-inner bg-white/90 focus:bg-white transition-colors text-slate-800 font-medium"
                  />
                </div>

                <Link to="/dashboard" className="btn-signin block text-center mt-2 !py-4 shadow-lg shadow-blue-500/20">
                  Track Trekker Live
                </Link>

                <div className="or-divider my-2">or</div>

                <div className="text-center">
                  <Link to="/verify" className="text-sm font-bold text-white/80 hover:text-white hover:underline transition-all drop-shadow-sm">
                    Verify ID on Polygon Blockchain
                  </Link>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>

    {/* ── Refined Features Section ── */}
    <section className="relative z-10 max-w-5xl mx-auto px-8 py-24">
      <div className="text-center mb-16 animate-slide-up">
        <p className="text-white/80 text-xs font-bold uppercase tracking-[0.3em] mb-4 drop-shadow">The Technology</p>
        <h2 className="text-3xl md:text-4xl font-black text-white tracking-tight drop-shadow-lg">
          Safety at Every Step
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {features.map((f, i) => (
          <div
            key={i}
            className="glass-card rounded-[2rem] p-8 flex flex-col sm:flex-row items-start gap-6 hover:-translate-y-1 transition-transform duration-500 animate-slide-up"
            style={{ animationDelay: `${i * 0.1}s` }}
          >
            <div className="w-14 h-14 shrink-0 rounded-2xl bg-white/10 border border-white/20 flex items-center justify-center text-white drop-shadow">
              {f.icon}
            </div>
            <div>
              <h3 className="text-lg font-bold text-white mb-2 drop-shadow-sm">{f.title}</h3>
              <p className="text-sm text-white/70 leading-relaxed font-medium">{f.description}</p>
            </div>
          </div>
        ))}
      </div>
    </section>

    {/* ── Refined CTA ── */}
    <section className="relative z-10 max-w-4xl mx-auto px-8 pb-32">
      <div className="glass-card border border-white/30 bg-gradient-to-br from-white/10 to-white/5 rounded-[2.5rem] p-12 text-center relative overflow-hidden">
        {/* Subtle background glow inside the CTA */}
        <div className="absolute inset-0 bg-blue-400/10 blur-[80px]" />
        
        <div className="relative z-10">
          <h2 className="text-3xl md:text-4xl font-black text-white mb-6 drop-shadow-lg">
            Ready to Trek Safely?
          </h2>
          <p className="text-white/75 mb-10 text-base max-w-lg mx-auto font-medium">
            Register today and receive your blockchain-verified digital ID in under 2 minutes. Secure your peace of mind.
          </p>
          <Link
            to="/register"
            className="group inline-flex items-center gap-3 px-10 py-4 rounded-xl btn-signin !w-auto shadow-2xl shadow-blue-500/20"
          >
            Get Started
            <FiArrowRight className="group-hover:translate-x-1 transition-transform" size={18} />
          </Link>
        </div>
      </div>
    </section>
  </div>
);

export default HomePage;
