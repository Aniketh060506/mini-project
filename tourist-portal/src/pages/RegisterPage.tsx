import { useState } from 'react';
import { FiUser, FiPhone, FiCpu, FiMapPin, FiArrowRight, FiArrowLeft, FiSend, FiCheck } from 'react-icons/fi';
import { RiCompassDiscoverLine } from 'react-icons/ri';
import SuccessModal from '@/components/SuccessModal';
import ErrorAlert from '@/components/ErrorAlert';
import { registerTourist } from '@/services/api';

interface FormData {
  fullName: string; age: string; email: string; phone: string;
  emergencyContactName: string; emergencyContactPhone: string;
  deviceId: string; trekDestination: string; trekStartDate: string; trekEndDate: string;
}

const initial: FormData = {
  fullName: '', age: '', email: '', phone: '', emergencyContactName: '',
  emergencyContactPhone: '', deviceId: '', trekDestination: '', trekStartDate: '', trekEndDate: '',
};

const steps = [
  { id: 0, label: 'Personal', icon: <FiUser size={15} /> },
  { id: 1, label: 'Emergency', icon: <FiPhone size={15} /> },
  { id: 2, label: 'Device', icon: <FiCpu size={15} /> },
  { id: 3, label: 'Trek', icon: <FiMapPin size={15} /> },
];

const CustomInput = ({ label, name, type = 'text', placeholder, hint, form, set, errors }: {
  label: string; name: keyof FormData; type?: string; placeholder?: string; hint?: string;
  form: FormData; set: (k: keyof FormData, v: string) => void; errors: Partial<Record<keyof FormData, string>>;
}) => (
  <div className="space-y-1.5">
    <label className="glass-label">{label}</label>
    <input
      type={type}
      value={form[name]}
      onChange={e => set(name, e.target.value)}
      placeholder={placeholder}
      className={`w-full px-4 py-3.5 rounded-xl ${errors[name] ? '!border-red-400 !bg-red-50' : ''}`}
    />
    {errors[name] && <p className="text-xs text-red-200 font-semibold drop-shadow mt-1">{errors[name]}</p>}
    {hint && !errors[name] && <p className="text-xs text-white/55 mt-1">{hint}</p>}
  </div>
);

const RegisterPage = () => {
  const [step, setStep] = useState(0);
  const [form, setForm] = useState<FormData>(initial);
  const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>({});
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState('');
  const [modal, setModal] = useState({ open: false, touristId: '', blockchainId: '' });

  const set = (key: keyof FormData, value: string) => {
    setForm(f => ({ ...f, [key]: value }));
    setErrors(e => ({ ...e, [key]: undefined }));
  };

  const validateStep = (): boolean => {
    const e: typeof errors = {};
    if (step === 0) {
      if (!form.fullName.trim()) e.fullName = 'Required';
      if (!form.age || +form.age < 1 || +form.age > 120) e.age = 'Enter valid age (1-120)';
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = 'Invalid email address';
      if (!/^\+\d{10,15}$/.test(form.phone)) e.phone = 'E.164 format: +919876543210';
    } else if (step === 1) {
      if (!form.emergencyContactName.trim()) e.emergencyContactName = 'Required';
      if (!/^\+\d{10,15}$/.test(form.emergencyContactPhone)) e.emergencyContactPhone = 'E.164 format';
    } else if (step === 2) {
      if (!/^ESP32-[A-Z0-9]{6}$/.test(form.deviceId)) e.deviceId = 'Format: ESP32-XXXXXX';
    } else if (step === 3) {
      if (!form.trekDestination.trim()) e.trekDestination = 'Required';
      if (!form.trekStartDate) e.trekStartDate = 'Required';
      if (!form.trekEndDate) e.trekEndDate = 'Required';
      if (form.trekStartDate && form.trekEndDate && form.trekEndDate <= form.trekStartDate)
        e.trekEndDate = 'Must be after start date';
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const next = () => { if (validateStep()) setStep(s => Math.min(s + 1, 3)); };
  const back = () => setStep(s => Math.max(s - 1, 0));

  const submit = async () => {
    if (!validateStep()) return;
    setLoading(true); setApiError('');
    try {
      const payload: any = {
        ...form, name: form.fullName,
        emergencyContact: form.emergencyContactPhone,
        emergencyName: form.emergencyContactName,
        age: parseInt(form.age),
      };
      const response = await registerTourist(payload);
      setModal({ open: true, touristId: response.touristId || response.id || 'N/A', blockchainId: response.blockchainId || 'N/A' });
      setForm(initial); setStep(0);
    } catch (err: any) {
      setApiError(err.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  const previewFields = [
    { label: 'Name', value: form.fullName },
    { label: 'Age', value: form.age ? `${form.age} yrs` : '' },
    { label: 'Phone', value: form.phone },
    { label: 'Emergency', value: form.emergencyContactName },
    { label: 'Device', value: form.deviceId },
    { label: 'Destination', value: form.trekDestination },
    { label: 'Dates', value: form.trekStartDate && form.trekEndDate ? `${form.trekStartDate} → ${form.trekEndDate}` : '' },
  ].filter(f => f.value);

  const completion = Math.round(((step + 1) / 4) * 100);

  return (
    <div className="min-h-screen page-wrapper">
      <div className="max-w-7xl mx-auto px-6 pt-24 pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-8 items-start">

          {/* ── Form Column ── */}
          <div>
            <div className="mb-8 animate-slide-up">
              <div className="travel-brand mb-4 drop-shadow">
                <RiCompassDiscoverLine size={18} className="text-white" />
                TRAVEL
              </div>
              <h1 className="hero-heading text-[clamp(2.2rem,5vw,3.8rem)] mb-2">
                TOURIST<br />REGISTRATION
              </h1>
              <p className="text-white/70 text-sm font-medium drop-shadow">Get your blockchain-verified trekking identity</p>
            </div>

            {/* Step bar */}
            <div className="flex items-center gap-0 mb-8 animate-slide-up delay-100">
              {steps.map((s, i) => (
                <div key={s.id} className="flex items-center flex-1 last:flex-initial">
                  <button
                    onClick={() => { if (i < step) setStep(i); }}
                    className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all duration-300 shrink-0 ${
                      i === step
                        ? 'bg-white text-blue-600 shadow-lg shadow-white/30'
                        : i < step
                        ? 'bg-white/30 text-white border border-white/40'
                        : 'text-white/55'
                    }`}
                  >
                    {i < step ? <FiCheck size={14} /> : s.icon}
                    <span className="hidden sm:inline">{s.label}</span>
                  </button>
                  {i < steps.length - 1 && (
                    <div className={`step-line mx-2 ${i < step ? 'step-line-active' : 'step-line-inactive'}`} />
                  )}
                </div>
              ))}
            </div>

            {apiError && <div className="mb-5"><ErrorAlert message={apiError} onClose={() => setApiError('')} /></div>}

            {/* Form card */}
            <div className="glass-card rounded-3xl p-8 animate-fade-in" key={step}>
              {step === 0 && (
                <div className="space-y-5">
                  <p className="text-white/65 text-xs font-bold uppercase tracking-wider mb-1">Personal Information</p>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                    <div className="sm:col-span-2">
                      <CustomInput form={form} set={set} errors={errors} label="Full Name" name="fullName" placeholder="Rajesh Kumar" />
                    </div>
                    <CustomInput form={form} set={set} errors={errors} label="Age" name="age" type="number" placeholder="28" />
                  </div>
                  <CustomInput form={form} set={set} errors={errors} label="Email Address" name="email" type="email" placeholder="rajesh@example.com" />
                  <CustomInput form={form} set={set} errors={errors} label="Phone Number" name="phone" placeholder="+919876543210" hint="Include country code (E.164)" />
                </div>
              )}
              {step === 1 && (
                <div className="space-y-5">
                  <p className="text-white/65 text-xs font-bold uppercase tracking-wider mb-1">Emergency Contact</p>
                  <div className="p-4 rounded-2xl bg-amber-500/20 border border-amber-300/30">
                    <p className="text-sm text-amber-100 font-semibold">⚠️ This contact will be notified if SOS is triggered</p>
                  </div>
                  <CustomInput form={form} set={set} errors={errors} label="Contact Name" name="emergencyContactName" placeholder="Priya Kumar" />
                  <CustomInput form={form} set={set} errors={errors} label="Contact Phone" name="emergencyContactPhone" placeholder="+919876543211" hint="Include country code" />
                </div>
              )}
              {step === 2 && (
                <div className="space-y-5">
                  <p className="text-white/65 text-xs font-bold uppercase tracking-wider mb-1">IoT Device</p>
                  <div className="p-4 rounded-2xl bg-blue-500/20 border border-blue-300/30">
                    <p className="text-sm text-blue-100 font-semibold">🔧 Enter the ID printed on your ESP32 wearable device</p>
                  </div>
                  <CustomInput form={form} set={set} errors={errors} label="Device ID" name="deviceId" placeholder="ESP32-A1B2C3" hint="Format: ESP32- followed by 6 alphanumeric characters" />
                </div>
              )}
              {step === 3 && (
                <div className="space-y-5">
                  <p className="text-white/65 text-xs font-bold uppercase tracking-wider mb-1">Trek Details</p>
                  <CustomInput form={form} set={set} errors={errors} label="Trek Destination" name="trekDestination" placeholder="Kedarkantha Peak" />
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <CustomInput form={form} set={set} errors={errors} label="Start Date" name="trekStartDate" type="date" />
                    <CustomInput form={form} set={set} errors={errors} label="End Date" name="trekEndDate" type="date" />
                  </div>
                </div>
              )}

              {/* Nav buttons */}
              <div className="flex items-center justify-between mt-8 pt-6 border-t border-white/20">
                {step > 0 ? (
                  <button onClick={back} className="flex items-center gap-2 px-5 py-3 rounded-xl text-white/65 font-semibold hover:text-white hover:bg-white/18 transition-all text-sm">
                    <FiArrowLeft size={16} /> Back
                  </button>
                ) : <div />}
                {step < 3 ? (
                  <button onClick={next} className="btn-signin !w-auto !py-3 !px-8 !text-sm !rounded-xl flex items-center gap-2">
                    Continue <FiArrowRight size={15} />
                  </button>
                ) : (
                  <button
                    onClick={submit}
                    disabled={loading}
                    className="btn-signin !w-auto !py-3 !px-8 !text-sm !rounded-xl flex items-center gap-2 disabled:opacity-60"
                  >
                    {loading ? (
                      <span className="flex items-center gap-2">
                        <span className="w-4 h-4 rounded-full border-2 border-white/25 border-t-white animate-spin" />
                        Processing...
                      </span>
                    ) : (
                      <><FiSend size={15} /> Register & Get ID</>
                    )}
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* ── Preview Card ── */}
          <div className="hidden lg:block">
            <div className="sticky top-24 animate-slide-left">
              <p className="text-xs font-bold text-white/55 uppercase tracking-wider mb-3 drop-shadow">Live ID Preview</p>
              <div className="glass-card rounded-3xl overflow-hidden">
                <div className="bg-gradient-to-r from-blue-500/70 to-indigo-600/70 backdrop-blur-sm p-6">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center">
                      <FiUser className="text-white" size={22} />
                    </div>
                    <div>
                      <p className="font-bold text-white text-lg">{form.fullName || 'Your Name'}</p>
                      <p className="text-xs text-white/55 font-mono">TSP-XXXXXXX</p>
                    </div>
                  </div>
                </div>

                <div className="p-5">
                  {previewFields.length > 0 ? previewFields.map((f, i) => (
                    <div key={i} className="flex justify-between py-3 border-b border-white/18 last:border-0 animate-fade-in">
                      <span className="text-xs text-white/50 font-medium">{f.label}</span>
                      <span className="text-sm font-bold text-white text-right max-w-[60%] truncate">{f.value}</span>
                    </div>
                  )) : (
                    <div className="py-8 text-center text-sm text-white/40">
                      Start filling the form to see<br />your ID card preview
                    </div>
                  )}
                </div>

                <div className="px-5 pb-5">
                  <div className="flex items-center justify-between text-xs mb-2">
                    <span className="text-white/50 font-medium">Completion</span>
                    <span className="font-black text-white">{completion}%</span>
                  </div>
                  <div className="bar-gauge-track">
                    <div
                      className="bar-gauge-fill"
                      style={{ width: `${completion}%`, background: 'linear-gradient(90deg, hsl(214 100% 52%), hsl(228 90% 62%))', transition: 'width 0.5s ease-out' }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <SuccessModal
        isOpen={modal.open}
        onClose={() => setModal(m => ({ ...m, open: false }))}
        touristId={modal.touristId}
        blockchainId={modal.blockchainId}
      />
    </div>
  );
};

export default RegisterPage;
