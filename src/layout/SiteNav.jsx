import { useEffect, useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { IP_TRACK, RS_TRACK, getTrackForPath } from "@/data/course";

function TrackDropdown({ label, track, pages }) {
  const { pathname } = useLocation();
  const activeTrack = getTrackForPath(pathname)?.track;

  return (
    <div className={`nav-group ${activeTrack === track ? "has-current" : ""}`}>
      <span className="nav-group-label">{label}</span>
      <div className="nav-dropdown">
        {pages.map((page) => (
          <NavLink
            key={page.path}
            to={page.path}
            className={({ isActive }) => (isActive ? "current" : undefined)}
          >
            <span className="dn-num">{page.num}</span>
            {page.short}
          </NavLink>
        ))}
      </div>
    </div>
  );
}

export default function SiteNav() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav
      className={`site-nav ${scrolled ? "scrolled" : ""}`}
      id="siteNav"
      aria-label="Primary"
    >
      <Link className="nav-logo" to="/">
        RS·IP GUIDE
      </Link>
      <div className="nav-links">
        <NavLink
          to="/"
          end
          className={({ isActive }) => (isActive ? "current" : undefined)}
        >
          Home
        </NavLink>
        <TrackDropdown label="Remote Sensing" track="rs" pages={RS_TRACK} />
        <TrackDropdown label="Image Processing" track="ip" pages={IP_TRACK} />
        <NavLink
          to="/applications"
          className={({ isActive }) => (isActive ? "current" : undefined)}
        >
          Applications
        </NavLink>
        <NavLink
          to="/quiz"
          className={({ isActive }) => `nav-quiz${isActive ? " current" : ""}`}
        >
          Quiz
        </NavLink>
      </div>
    </nav>
  );
}
