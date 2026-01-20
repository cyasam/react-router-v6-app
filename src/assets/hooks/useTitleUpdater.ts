import { useEffect } from 'react';
import { useMatches } from 'react-router-dom';

export default function TitleUpdater() {
  const matches = useMatches();

  useEffect(() => {
    // Find the deepest route match with a title
    const matchesReversed = matches.slice().reverse();
    const match = matchesReversed.find(
      (m) => m.handle && typeof m.handle === 'object' && 'title' in m.handle,
    );

    if (!match?.handle) return;

    const titleHandle = (
      match.handle as { title?: string | ((data: unknown) => string) }
    ).title;

    if (!titleHandle) return;

    // Handle both string and function types
    let title: string | undefined;

    if (typeof titleHandle === 'function') {
      // Merge loader data from current and all parent routes
      let dataToPass: Record<string, unknown> = {};

      // Collect data from all routes (in forward order)
      const currentIndex = matchesReversed.indexOf(match);
      for (let i = matchesReversed.length - 1; i >= currentIndex; i--) {
        const routeMatch = matchesReversed[i];
        // Use the loader data from the route
        if (
          routeMatch.loaderData &&
          typeof routeMatch.loaderData === 'object'
        ) {
          dataToPass = { ...dataToPass, ...routeMatch.loaderData };
        }
      }

      title = titleHandle(dataToPass);
    } else {
      title = titleHandle;
    }

    if (title) {
      document.title = title;
    }
  }, [matches]);

  return null;
}
