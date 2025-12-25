import { Link, useMatches } from 'react-router-dom';

interface BreadcrumbHandle {
  breadcrumb?: string | ((data: unknown) => string);
}

export default function Breadcrumbs() {
  const matches = useMatches();

  const crumbs = matches
    .filter((match) => (match.handle as BreadcrumbHandle)?.breadcrumb)
    .map((match) => {
      const breadcrumb = (match.handle as BreadcrumbHandle).breadcrumb;

      const label =
        typeof breadcrumb === 'function'
          ? breadcrumb(match.loaderData)
          : breadcrumb;

      return {
        id: 'id-' + match.id,
        label,
        path: match.pathname,
      };
    });

  return (
    <nav className="mb-8 text-sm">
      <ol className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
        {crumbs.map((crumb, i) => (
          <li key={crumb.id} className="flex items-center gap-2">
            {i > 0 && <span>/</span>}
            {i === crumbs.length - 1 ? (
              <span className="font-medium text-slate-900 dark:text-white">
                {crumb.label}
              </span>
            ) : (
              <Link to={crumb.path} className="hover:underline">
                {crumb.label}
              </Link>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
