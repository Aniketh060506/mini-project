const LoadingSpinner = ({ size = 'md', text }: { size?: 'sm' | 'md' | 'lg'; text?: string }) => {
  const dims = { sm: 'w-5 h-5', md: 'w-8 h-8', lg: 'w-12 h-12' };
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-8">
      <div className={`${dims[size]} rounded-full border-2 border-blue-400/20 border-t-blue-400 animate-spin`} />
      {text && <p className="text-sm text-white/40 animate-pulse">{text}</p>}
    </div>
  );
};

export default LoadingSpinner;
