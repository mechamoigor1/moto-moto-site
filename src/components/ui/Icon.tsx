import type { JSX, ReactNode } from "react";

export type IconName =
  | "menu"
  | "whatsapp"
  | "map-pin"
  | "search"
  | "motorcycle"
  | "shield-check"
  | "landmark"
  | "repeat"
  | "wrench"
  | "bolt"
  | "wallet"
  | "clock"
  | "palette"
  | "gauge"
  | "settings"
  | "chart"
  | "tag"
  | "folder"
  | "mail"
  | "chevron-left"
  | "chevron-right"
  | "trash"
  | "calculator"
  | "star"
  | "close"
  | "check";

type IconProps = {
  name: IconName;
  className?: string;
  title?: string;
};

const iconPaths: Record<IconName, ReactNode> = {
  menu: <path d="M4 6h16M4 12h16M4 18h16" />,
  whatsapp: <>
    <path fill="currentColor" stroke="none" d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
    <path fill="currentColor" stroke="none" d="M12 0C5.373 0 0 5.373 0 12c0 2.127.555 4.126 1.526 5.859L.057 23.428a.5.5 0 0 0 .619.61l5.737-1.504A11.948 11.948 0 0 0 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.9a9.9 9.9 0 0 1-5.031-1.371l-.361-.214-3.742.981.998-3.648-.235-.374A9.861 9.861 0 0 1 2.1 12C2.1 6.534 6.534 2.1 12 2.1c5.465 0 9.9 4.434 9.9 9.9 0 5.465-4.435 9.9-9.9 9.9z" />
  </>,
  "map-pin": <><path d="M20 10c0 5-8 12-8 12S4 15 4 10a8 8 0 1 1 16 0Z" /><circle cx="12" cy="10" r="2.5" /></>,
  search: <><circle cx="11" cy="11" r="6" /><path d="m20 20-4.2-4.2" /></>,
  motorcycle: <><circle cx="6" cy="17" r="3" /><circle cx="18" cy="17" r="3" /><path d="M6 17h4l3-7h3l2 3h2M10 17l3-7-3-3H7M13 10h4l-2-3" /></>,
  "shield-check": <><path d="M12 3 4.5 6v5c0 4.8 3.2 8.7 7.5 10 4.3-1.3 7.5-5.2 7.5-10V6L12 3Z" /><path d="m8.5 12 2.2 2.2 4.8-4.8" /></>,
  landmark: <><path d="m3 21 9-17 9 17M5 17h14M3 21h18M7 17v4m5-4v4m5-4v4" /></>,
  repeat: <><path d="m17 2 4 4-4 4M3 11V9a3 3 0 0 1 3-3h15M7 22l-4-4 4-4M21 13v2a3 3 0 0 1-3 3H3" /></>,
  wrench: <path d="M21 6.5a5 5 0 0 1-6.7 4.7L7.5 18a3 3 0 1 1-4.2-4.2l6.8-6.8A5 5 0 0 1 14.8 0l-3.1 3.1 2.2 2.2L17 2.2A5 5 0 0 1 21 6.5Z" />,
  bolt: <path d="m13 2-8 12h6l-1 8 9-13h-6l0-7Z" />,
  wallet: <><path d="M4 6a3 3 0 0 1 3-3h11v18H6a2 2 0 0 1-2-2V6Z" /><path d="M18 8h2v8h-5a2 2 0 0 1 0-4h5" /><circle cx="15" cy="12" r=".5" fill="currentColor" /></>,
  clock: <><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></>,
  palette: <path d="M12 3a9 9 0 0 0 0 18h1.5a1.5 1.5 0 0 0 0-3H12a2 2 0 0 1 0-4h4a5 5 0 0 0 0-10h-4Zm-4 8h.01M7 7h.01m5-1h.01" />,
  gauge: <><path d="M4 18a8 8 0 1 1 16 0" /><path d="m12 12 4-3M4 18h16" /></>,
  settings: <><circle cx="12" cy="12" r="3" /><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.9l.1.1-2.1 2.1-.1-.1a1.7 1.7 0 0 0-1.9-.3 1.7 1.7 0 0 0-1 1.5v.2h-3v-.2a1.7 1.7 0 0 0-1-1.5 1.7 1.7 0 0 0-1.9.3l-.1.1-2.1-2.1.1-.1a1.7 1.7 0 0 0 .3-1.9 1.7 1.7 0 0 0-1.5-1H5v-3h.2a1.7 1.7 0 0 0 1.5-1 1.7 1.7 0 0 0-.3-1.9l-.1-.1 2.1-2.1.1.1a1.7 1.7 0 0 0 1.9.3 1.7 1.7 0 0 0 1-1.5V4h3v.2a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.9-.3l.1-.1 2.1 2.1-.1.1a1.7 1.7 0 0 0-.3 1.9 1.7 1.7 0 0 0 1.5 1h.2v3h-.2a1.7 1.7 0 0 0-1.5 1Z" /></>,
  chart: <><path d="M4 19V5M4 19h16" /><path d="m7 15 4-4 3 2 5-6" /></>,
  tag: <path d="M20 13 13 20l-9-9V4h7l9 9ZM8 8h.01" />,
  folder: <path d="M3 6h6l2 2h10v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6Z" />,
  mail: <><rect x="3" y="5" width="18" height="14" rx="2" /><path d="m3 7 9 6 9-6" /></>,
  "chevron-left": <path d="m15 18-6-6 6-6" />,
  "chevron-right": <path d="m9 18 6-6-6-6" />,
  trash: <path d="M4 7h16M10 11v6m4-6v6M6 7l1 14h10l1-14M9 7V4h6v3" />,
  calculator: <><rect x="4" y="2" width="16" height="20" rx="2" /><path d="M8 6h8" /><path d="M8 10h.01M12 10h.01M16 10h.01M8 14h.01M12 14h.01M16 14h.01M8 18h.01M12 18h.01" /></>,
  star: <path fill="currentColor" stroke="none" d="m12 2 3.09 6.26L22 9.27l-5 4.87L18.18 21 12 17.77 5.82 21 7 14.14l-5-4.87 6.91-1.01L12 2Z" />,
  close: <path d="M18 6 6 18M6 6l12 12" />,
  check: <path d="m5 13 4 4L19 7" />,
};

export function Icon({ name, className, title }: IconProps): JSX.Element {
  return (
    <svg
      viewBox="0 0 24 24"
      width="24"
      height="24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      role={title ? "img" : undefined}
      aria-hidden={title ? undefined : true}
    >
      {title && <title>{title}</title>}
      {iconPaths[name]}
    </svg>
  );
}
