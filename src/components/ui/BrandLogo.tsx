import Image from "next/image";
import type { JSX } from "react";

type BrandLogoProps = {
  className?: string;
  priority?: boolean;
};

export function BrandLogo({ className, priority = false }: BrandLogoProps): JSX.Element {
  return (
    <Image
      src="/brand/moto-moto-logo.svg"
      alt="Moto Moto"
      width={93}
      height={97}
      priority={priority}
      className={className}
    />
  );
}
