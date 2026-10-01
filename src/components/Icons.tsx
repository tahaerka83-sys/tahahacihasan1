type P = { className?: string };

const base = {
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.25,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  viewBox: "0 0 24 24",
};

export function ScissorsIcon({ className }: P) {
  return (
    <svg {...base} className={className}>
      <circle cx="6" cy="6" r="2.5" />
      <circle cx="6" cy="18" r="2.5" />
      <path d="M8.1 7.6L20 18M8.1 16.4L20 6M12 12l1.5 1.3" />
    </svg>
  );
}

export function RazorIcon({ className }: P) {
  return (
    <svg {...base} className={className}>
      <path d="M3 21l7-7" />
      <rect x="9.5" y="4.5" width="10" height="6" rx="1" transform="rotate(45 14.5 7.5)" />
      <path d="M12.5 9.5l2 2M14.5 7.5l2 2" />
    </svg>
  );
}

export function SpaIcon({ className }: P) {
  return (
    <svg {...base} className={className}>
      <path d="M12 21c-4.5-1.5-8-5-8-10 3 0 5.5 1.2 8 3.5C14.5 12.2 17 11 20 11c0 5-3.5 8.5-8 10z" />
      <path d="M12 14.5V21M12 3c1.3 1.4 2 3 2 4.5S13.3 10 12 10.5C10.7 10 10 9 10 7.5S10.7 4.4 12 3z" />
    </svg>
  );
}

export function CrownIcon({ className }: P) {
  return (
    <svg {...base} className={className}>
      <path d="M3 8l4.5 4L12 5l4.5 7L21 8l-2 10H5L3 8z" />
      <path d="M5 21h14" />
    </svg>
  );
}

export function ClockIcon({ className }: P) {
  return (
    <svg {...base} className={className}>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 2" />
    </svg>
  );
}

export function PinIcon({ className }: P) {
  return (
    <svg {...base} className={className}>
      <path d="M12 21s7-6.2 7-11a7 7 0 10-14 0c0 4.8 7 11 7 11z" />
      <circle cx="12" cy="10" r="2.5" />
    </svg>
  );
}

export function PhoneIcon({ className }: P) {
  return (
    <svg {...base} className={className}>
      <path d="M3 5a2 2 0 012-2h2l2 5-2.5 1.5a11 11 0 005 5L13 12l5 2v2a2 2 0 01-2 2A14 14 0 013 5z" />
    </svg>
  );
}

export function WhatsAppIcon({ className }: P) {
  return (
    <svg {...base} className={className}>
      <path d="M4 20l1.3-3.8A8.5 8.5 0 1112 20.5a8.4 8.4 0 01-4.2-1.1L4 20z" />
      <path d="M9 9.5c0 3 2.5 5.5 5.5 5.5l1-1.5-1.8-.8-.8.8a4 4 0 01-2.4-2.4l.8-.8-.8-1.8L9 9.5z" />
    </svg>
  );
}

export function CheckIcon({ className }: P) {
  return (
    <svg {...base} strokeWidth={1.5} className={className}>
      <path d="M5 12.5l4.5 4.5L19 7" />
    </svg>
  );
}

export function ServiceIcon({ name, className }: { name: string; className?: string }) {
  switch (name) {
    case "scissors":
      return <ScissorsIcon className={className} />;
    case "razor":
      return <RazorIcon className={className} />;
    case "spa":
      return <SpaIcon className={className} />;
    case "crown":
      return <CrownIcon className={className} />;
    default:
      return <ScissorsIcon className={className} />;
  }
}
