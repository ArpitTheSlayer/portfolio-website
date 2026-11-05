interface SectionLabelProps {
  label: string;
  right?: React.ReactNode;
  className?: string;
}

export default function SectionLabel({
  label,
  right,
  className = "",
}: SectionLabelProps) {
  return (
    <div
      className={`flex items-baseline justify-between gap-4 font-mono text-label uppercase text-muted ${className}`}
    >
      <span>{label}</span>
      {right ? <span className="text-right">{right}</span> : null}
    </div>
  );
}
