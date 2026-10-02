/**
 * Runs in <head> before first paint. On a normal page load it adds
 * `js-reveal` to <html>, so sections below the hero are hidden from the start
 * and animate in, including those already visible (no visible → hidden flash
 * at hydration). It is skipped when the page opens at a hash (/#works) or the
 * browser may restore a scroll position (reload, back/forward): useReveal then
 * shows the sections in view at once. Without JavaScript nothing is hidden.
 */
export const revealInitScript = `try{var n=performance.getEntriesByType('navigation')[0],t=n&&n.type;if(!location.hash&&t!=='reload'&&t!=='back_forward')document.documentElement.classList.add('js-reveal')}catch(e){}`;
