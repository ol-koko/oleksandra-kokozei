/**
 * `/me` opened from the page: the intercepted route keeps the page mounted.
 * `OverlayHost` renders the overlay, so it can play its closing motion after
 * this route is gone. Next.js applies no metadata from this slot, so the
 * host also keeps the tab title in step.
 */
export default function MeModal() {
  return null;
}
