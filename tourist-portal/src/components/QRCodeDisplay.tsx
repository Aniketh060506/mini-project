import { QRCodeSVG } from 'qrcode.react';

const QRCodeDisplay = ({ value, size = 128 }: { value: string; size?: number }) => (
  <div className="inline-flex flex-col items-center gap-2 p-4 rounded-xl bg-card border border-border">
    <QRCodeSVG value={value} size={size} bgColor="transparent" fgColor="hsl(220, 20%, 20%)" level="H" />
    <p className="text-[10px] text-muted-foreground font-mono truncate max-w-[160px]">{value}</p>
  </div>
);

export default QRCodeDisplay;
