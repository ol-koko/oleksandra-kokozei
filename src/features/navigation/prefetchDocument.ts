/**
 * Asks the browser to fetch a page ahead of a full document navigation to it,
 * so the navigation itself is instant. Speculation rules where supported (the
 * prefetch is reused even while in flight), a `<link rel="prefetch">` otherwise.
 * Call it after any cookie change the page depends on: browsers drop a prefetch
 * when cookies change before the navigation.
 */
export function prefetchDocument(href: string) {
  const url = new URL(href, window.location.href);
  url.hash = '';

  if (HTMLScriptElement.supports?.('speculationrules')) {
    const rules = document.createElement('script');
    rules.type = 'speculationrules';
    rules.textContent = JSON.stringify({ prefetch: [{ source: 'list', urls: [url.href] }] });
    document.head.append(rules);
    return;
  }
  const link = document.createElement('link');
  link.rel = 'prefetch';
  link.href = url.href;
  document.head.append(link);
}
