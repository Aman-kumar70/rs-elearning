import { useEffect } from "react";
import { installPageCleanup } from "./pageCleanup";

/**
 * Mounts one of the existing imperative lab controllers for the lifetime of a
 * React page. The controller may return an extra cleanup callback (for
 * example, destroying Chart.js instances).
 */
export function useLegacyPage(mount) {
  useEffect(() => {
    const page = installPageCleanup();
    let extraCleanup;

    try {
      extraCleanup = mount();
    } catch (error) {
      console.error("[legacy page controller]", error);
    } finally {
      page.finishSetup();
    }

    return () => {
      try {
        extraCleanup?.();
      } finally {
        page.dispose();
      }
    };
  }, [mount]);
}
