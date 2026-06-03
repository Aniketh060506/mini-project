interface TelemetryGaugeProps {
  label: string;
  value: number;
  unit: string;
  min: number;
  max: number;
  color: 'primary' | 'success' | 'destructive' | 'warning';
  icon: React.ReactNode;
}

const TelemetryGauge = ({ label, value, unit, min, max, color, icon }: TelemetryGaugeProps) => {
  const pct = Math.min(100, Math.max(0, ((value - min) / (max - min)) * 100));
  const circumference = 2 * Math.PI * 42;
  const dashOffset = circumference - (pct / 100) * circumference;

  const colorMap = {
    primary: { stroke: 'hsl(221, 83%, 53%)', bg: 'hsl(221, 83%, 53%, 0.1)' },
    success: { stroke: 'hsl(160, 60%, 45%)', bg: 'hsl(160, 60%, 45%, 0.1)' },
    destructive: { stroke: 'hsl(0, 72%, 51%)', bg: 'hsl(0, 72%, 51%, 0.1)' },
    warning: { stroke: 'hsl(38, 92%, 50%)', bg: 'hsl(38, 92%, 50%, 0.1)' },
  };

  return (
    <div className="glass-card rounded-xl p-5 flex flex-col items-center gap-3 hover:shadow-xl transition-shadow">
      <div className="relative w-28 h-28">
        <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
          <circle cx="50" cy="50" r="42" fill="none" stroke="hsl(var(--border))" strokeWidth="6" />
          <circle
            cx="50" cy="50" r="42" fill="none"
            stroke={colorMap[color].stroke}
            strokeWidth="6"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={dashOffset}
            className="transition-all duration-700 ease-out"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-xl font-bold text-foreground">{typeof value === 'number' ? value.toFixed(value % 1 ? 1 : 0) : value}</span>
          <span className="text-[10px] text-muted-foreground">{unit}</span>
        </div>
      </div>
      <div className="flex items-center gap-1.5 text-sm font-medium text-foreground">
        {icon}
        {label}
      </div>
    </div>
  );
};

export default TelemetryGauge;
