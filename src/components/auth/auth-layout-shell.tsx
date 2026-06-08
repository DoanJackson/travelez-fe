interface AuthLayoutShellProps {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}

export function AuthLayoutShell({
  title,
  subtitle,
  children,
}: AuthLayoutShellProps) {
  return (
    <div className="space-y-4">
      <div className="space-y-1">
        <h2 className="text-2xl font-bold text-gray-900">{title}</h2>
        {subtitle && (
          <p className="text-gray-500 text-sm">{subtitle}</p>
        )}
      </div>
      {children}
    </div>
  );
}
