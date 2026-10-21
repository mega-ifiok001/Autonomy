type IconProps = { className?: string };

export function LogoMark({ className }: IconProps) {
  return (
    <svg viewBox="0 0 34 30" className={className} aria-hidden="true">
      <path d="M2.6 30 L12.4 0.8 L18.2 0.8 L9.9 30 Z" fill="#122e63" />
      <path d="M21.4 30 L25.8 5.4 L31.6 5.4 L27.3 30 Z" fill="#2f66f2" />
    </svg>
  );
}

const stroke = {
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.8,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

export function PartnershipsIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true" {...stroke}>
      <circle cx="12" cy="12" r="2.5" />
      <circle cx="4.6" cy="4.6" r="1.9" />
      <circle cx="19.4" cy="4.6" r="1.9" />
      <circle cx="4.6" cy="19.4" r="1.9" />
      <circle cx="19.4" cy="19.4" r="1.9" />
      <path d="M6 6.1 10.2 10.2M18 6.1 13.8 10.2M6 17.9 10.2 13.8M18 17.9 13.8 13.8" />
    </svg>
  );
}

export function GrowthIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true" {...stroke}>
      <path d="M3.2 19.8h17.6" />
      <path d="M3.6 16.2 9.2 10.6l3.6 3.4L19.6 6.2" />
      <path d="M15.4 6h4.4v4.4" />
      <path d="M3.6 12.2l2.8 2.4" opacity="0.5" />
    </svg>
  );
}

export function ReticleIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true" {...stroke}>
      <circle cx="12" cy="12" r="6.8" />
      <circle cx="12" cy="12" r="2.6" />
      <path d="M12 2.4v3.2M12 18.4v3.2M2.4 12h3.2M18.4 12h3.2" />
    </svg>
  );
}

export function FlagIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true" {...stroke}>
      <path d="M5.5 21.6V3.4" />
      <path d="M5.5 4.4h12.6l-3.2 4 3.2 4H5.5" />
      <path d="M3.2 21.6h4.6" opacity="0.5" />
    </svg>
  );
}

export function AccessIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true" {...stroke}>
      <path d="M3.6 8.4 12 3.8l8.4 4.6v7.2L12 20.2l-8.4-4.6Z" />
      <path d="M3.6 8.4 12 13l8.4-4.6" />
      <path d="M12 13v7.2" />
      <path d="m7.8 6.1 8.4 4.6" opacity="0.5" />
    </svg>
  );
}

export function ExecutionIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true" {...stroke}>
      <path d="M8.4 4.6H6.6A2.1 2.1 0 0 0 4.5 6.7v12.2a2.1 2.1 0 0 0 2.1 2.1h10.8a2.1 2.1 0 0 0 2.1-2.1V6.7a2.1 2.1 0 0 0-2.1-2.1h-1.8" />
      <rect x="9.2" y="3" width="5.6" height="3.4" rx="1.1" />
      <path d="m8.6 13.6 2.4 2.4 4.6-4.9" />
    </svg>
  );
}

export function ArrowRight({ className }: IconProps) {
  return (
    <svg viewBox="0 0 20 20" className={className} aria-hidden="true" {...stroke}>
      <path d="M3 10h13M11.5 4.5 17 10l-5.5 5.5" />
    </svg>
  );
}

export function ArrowUpRight({ className }: IconProps) {
  return (
    <svg viewBox="0 0 20 20" className={className} aria-hidden="true" {...stroke}>
      <path d="M4.5 15.5 15.5 4.5M6.5 4.5h9v9" />
    </svg>
  );
}

export function MenuIcon({ className, open }: IconProps & { open?: boolean }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true" {...stroke}>
      {open ? (
        <path d="M6 6l12 12M18 6 6 18" />
      ) : (
        <path d="M4 7h16M4 12h16M4 17h10" />
      )}
    </svg>
  );
}

export function CheckIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true" {...stroke}>
      <path d="m4.5 12.5 5 5L19.5 7" />
    </svg>
  );
}

export function MailIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true" {...stroke}>
      <rect x="3.4" y="5.4" width="17.2" height="13.2" rx="2.4" />
      <path d="m4.4 7.4 7.6 6 7.6-6" />
    </svg>
  );
}

export function PhoneIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true" {...stroke}>
      <path d="M5.2 3.8h3.4l1.6 4-2.1 1.6a12.4 12.4 0 0 0 5.5 5.5l1.6-2.1 4 1.6v3.4a1.8 1.8 0 0 1-2 1.8C9.4 18.6 5.4 14.6 4.8 6.3a1.8 1.8 0 0 1 .4-2.5Z" />
    </svg>
  );
}

export function PinIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true" {...stroke}>
      <path d="M12 21s-6.6-5.4-6.6-10.4a6.6 6.6 0 1 1 13.2 0C18.6 15.6 12 21 12 21Z" />
      <circle cx="12" cy="10.4" r="2.4" />
    </svg>
  );
}

export function QuoteMark({ className }: IconProps) {
  return (
    <svg viewBox="0 0 48 36" className={className} aria-hidden="true" fill="currentColor">
      <path d="M0 36V22.6C0 15.9 1.6 10.6 4.8 6.6 8 2.7 12.4 0.5 18 0l2.4 5.2c-3.6 1.2-6.3 3-8.1 5.3-1.7 2.3-2.6 4.8-2.7 7.5h9V36H0Zm28 0V22.6c0-6.7 1.6-12 4.8-16C36 2.7 40.4 0.5 46 0l2.4 5.2c-3.6 1.2-6.3 3-8.1 5.3-1.7 2.3-2.6 4.8-2.7 7.5h9V36H28Z" transform="scale(0.98)" />
    </svg>
  );
}
