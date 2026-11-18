import { Suspense, useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import SiteNav from "./SiteNav";
import PageNav from "./PageNav";
import SiteFooter from "./SiteFooter";

function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
  }, [pathname]);

  return null;
}

export default function SiteLayout() {
  return (
    <>
      <ScrollToTop />
      <SiteNav />
      <main id="main-content">
        <Suspense
          fallback={
            <div className="route-loader" role="status">
              Loading…
            </div>
          }
        >
          <Outlet />
        </Suspense>
      </main>
      <PageNav />
      <SiteFooter />
    </>
  );
}
