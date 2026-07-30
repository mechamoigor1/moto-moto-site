"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";

declare global {
  interface Window {
    fbq?: (...args: any[]) => void;
  }
}

export default function PixelRouteTracker() {
  const pathname = usePathname();
  const isFirstLoad = useRef(true);

  // PageView em cada troca de rota (a primeira já é disparada pelo script base)
  useEffect(() => {
    if (isFirstLoad.current) {
      isFirstLoad.current = false;
      return;
    }
    if (typeof window.fbq === "function") {
      window.fbq("track", "PageView");
    }
  }, [pathname]);

  // ViewContent automático quando o cliente abre a página de uma moto específica
  useEffect(() => {
    if (typeof window.fbq !== "function") return;
    if (pathname?.startsWith("/motos/") && pathname !== "/motos/") {
      const slug = pathname.split("/motos/")[1];
      window.fbq("track", "ViewContent", {
        content_name: slug,
        content_type: "product",
      });
    }
  }, [pathname]);

  // CONTACT — dispara em qualquer clique de link do WhatsApp, em qualquer página
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      const target = (e.target as HTMLElement)?.closest('a[href*="wa.me"]');
      if (target && typeof window.fbq === "function") {
        window.fbq("track", "Contact");
      }
    }
    document.addEventListener("click", handleClick);
    return () => document.removeEventListener("click", handleClick);
  }, []);

  return null;
}
