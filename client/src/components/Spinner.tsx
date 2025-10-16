interface SpinnerProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  color?: 'blue' | 'white' | 'slate';
  className?: string;
}

export default function Spinner({ size = 'md', color = 'blue', className = '' }: SpinnerProps) {
  const sizeStyles = {
    sm: 'h-4 w-4 border-2',
    md: 'h-8 w-8 border-2',
    lg: 'h-12 w-12 border-2',
    xl: 'h-16 w-16 border-3',
  };

  const colorStyles = {
    blue: 'border-blue-600 border-t-transparent',
    white: 'border-white border-t-transparent',
    slate: 'border-slate-600 border-t-transparent',
  };

  return (
    <div
      className={`
        animate-spin rounded-full
        ${sizeStyles[size]}
        ${colorStyles[color]}
        ${className}
      `}
    />
  );
}
