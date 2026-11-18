import { Link } from "react-router-dom";
import { LEGACY_ROUTES } from "@/data/course";

const EXTERNAL = /^(https?:|mailto:|tel:)/i;

function resolveTarget(to) {
  if (!to || to.startsWith("#") || EXTERNAL.test(to)) return null;

  const [pathname, hash] = to.split("#");
  const mapped = LEGACY_ROUTES[pathname] ?? pathname;
  const withLeadingSlash = mapped.startsWith("/") ? mapped : `/${mapped}`;
  return hash ? `${withLeadingSlash}#${hash}` : withLeadingSlash;
}

/**
 * Content links keep external links as normal anchors and turn every legacy
 * page link into a React Router Link. This keeps the migrated article bodies
 * router-aware without rewriting their copy.
 */
export default function ContentLink({ to, children, ...props }) {
  const target = resolveTarget(to);

  if (!target) {
    return (
      <a href={to} {...props}>
        {children}
      </a>
    );
  }

  return (
    <Link to={target} {...props}>
      {children}
    </Link>
  );
}
