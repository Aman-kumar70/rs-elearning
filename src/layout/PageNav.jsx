import { Link, useLocation } from "react-router-dom";
import { getPrevNext } from "@/data/course";

export default function PageNav() {
  const { pathname } = useLocation();
  const { prev, next } = getPrevNext(pathname);

  if (!prev && !next) return null;

  return (
    <nav className="page-nav" aria-label="Chapter navigation">
      {prev ? (
        <Link className="prev" to={prev.path}>
          <span className="pn-label">Previous</span>
          <span className="pn-title">{prev.title}</span>
        </Link>
      ) : (
        <span />
      )}
      {next ? (
        <Link className="next" to={next.path}>
          <span className="pn-label">Next</span>
          <span className="pn-title">{next.title}</span>
        </Link>
      ) : (
        <span />
      )}
    </nav>
  );
}
