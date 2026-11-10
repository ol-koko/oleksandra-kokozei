type Tick = (time: number) => void;

const ticks = new Set<Tick>();
let frame: number | null = null;

function run(time: number) {
  frame = ticks.size > 0 ? requestAnimationFrame(run) : null;
  for (const tick of ticks) tick(time);
}

/**
 * One requestAnimationFrame for every running scene. It stops by itself when
 * no scene is running. Returns the function that removes `tick` again.
 */
export function addTick(tick: Tick) {
  ticks.add(tick);
  frame ??= requestAnimationFrame(run);
  return () => {
    ticks.delete(tick);
    if (ticks.size === 0 && frame !== null) {
      cancelAnimationFrame(frame);
      frame = null;
    }
  };
}
