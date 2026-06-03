import { Tourist } from '@/services/api';
import { FiUser, FiPhone, FiMail, FiMapPin, FiCalendar, FiCpu, FiLink } from 'react-icons/fi';

const TouristCard = ({ tourist }: { tourist: Tourist }) => {
  const fields = [
    { icon: <FiUser size={14} />, label: 'Name', value: tourist.fullName },
    { icon: <FiUser size={14} />, label: 'Age', value: `${tourist.age} years` },
    { icon: <FiPhone size={14} />, label: 'Phone', value: tourist.phone },
    { icon: <FiMail size={14} />, label: 'Email', value: tourist.email },
    { icon: <FiMapPin size={14} />, label: 'Destination', value: tourist.trekDestination },
    { icon: <FiCalendar size={14} />, label: 'Trek Dates', value: `${tourist.trekStartDate} → ${tourist.trekEndDate}` },
    { icon: <FiCpu size={14} />, label: 'Device ID', value: tourist.deviceId },
    { icon: <FiCalendar size={14} />, label: 'Registered', value: tourist.registrationDate },
  ];

  return (
    <div className="glass-card-strong rounded-2xl overflow-hidden animate-slide-up">
      <div className="gradient-primary p-5">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-primary-foreground/20 flex items-center justify-center">
            <FiUser className="text-primary-foreground" size={22} />
          </div>
          <div>
            <h3 className="text-lg font-bold text-primary-foreground">{tourist.fullName}</h3>
            <p className="text-xs text-primary-foreground/70">ID: {tourist.id}</p>
          </div>
        </div>
      </div>
      <div className="p-5 space-y-3">
        {fields.map((f, i) => (
          <div key={i} className="flex items-center gap-3 text-sm">
            <span className="text-primary">{f.icon}</span>
            <span className="text-muted-foreground w-24 shrink-0">{f.label}</span>
            <span className="text-foreground font-medium truncate">{f.value}</span>
          </div>
        ))}
        <div className="flex items-center gap-3 text-sm">
          <span className="text-primary"><FiLink size={14} /></span>
          <span className="text-muted-foreground w-24 shrink-0">Blockchain</span>
          <a
            href={`https://polygonscan.com/tx/${tourist.blockchainId}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary font-mono text-xs hover:underline truncate"
          >
            {tourist.blockchainId}
          </a>
        </div>
      </div>
    </div>
  );
};

export default TouristCard;
