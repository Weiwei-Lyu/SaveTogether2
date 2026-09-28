export function ProgressBar({
  value,
  label,
}: {
  value: number;
  label: string;
}) {
  const width = Math.min(100, Math.max(0, value));

  return (
    <div className="space-y-2">
      <div
        className="h-2.5 overflow-hidden rounded-full bg-line"
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={Math.round(width)}
        aria-label={label}
      >
        <div
          className="h-full rounded-full bg-sage transition-[width] duration-300"
          style={{ width: `${width}%` }}
        />
      </div>
      <p className="text-sm text-muted">{Math.round(width)}% confirmed toward target</p>
    </div>
  );
}
