import { Link } from "react-router-dom";
import usePageTitle from "@/hooks/usePageTitle";

export default function NotFoundPage() {
  usePageTitle("Page Not Found — RS & IP Guide");

  return (
    <header className="page-hero">
      <div className="chapter-badge">404 · Route Not Found</div>
      <h1>
        Page <span>Not Found</span>
      </h1>
      <p className="hero-intro">
        This route does not match a chapter in the guide. Head back to the home
        page or jump into one of the two tracks.
      </p>
      <div className="chapter-cta">
        <div className="chapter-cta-copy">
          <div className="section-label">Continue Learning</div>
          <h2>Return to the guide</h2>
          <p>
            The course home page links to every chapter, the applications guide
            and the knowledge check.
          </p>
        </div>
        <Link className="chapter-cta-btn" to="/">
          Back to Home <span aria-hidden="true">→</span>
        </Link>
      </div>
    </header>
  );
}
