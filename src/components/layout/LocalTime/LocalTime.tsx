'use client';

import { useSyncExternalStore } from 'react';
import { homeTimeZone } from '@/content/site';
import styles from './LocalTime.module.css';

const MINUTE = 60_000;

/** Reserves the width of "HH:mm" before the client knows the time. Never announced. */
const PLACEHOLDER = '00:00';

const formatter = new Intl.DateTimeFormat('en-GB', {
  timeZone: homeTimeZone,
  hour: '2-digit',
  minute: '2-digit',
  hourCycle: 'h23',
});

/** Notifies on every minute boundary. */
function subscribe(onChange: () => void) {
  let intervalId: number | undefined;
  const timeoutId = window.setTimeout(
    () => {
      onChange();
      intervalId = window.setInterval(onChange, MINUTE);
    },
    MINUTE - (Date.now() % MINUTE),
  );

  return () => {
    window.clearTimeout(timeoutId);
    window.clearInterval(intervalId);
  };
}

const getSnapshot = () => formatter.format(new Date());

// The server (and hydration) render no time, so server and client HTML always match.
const getServerSnapshot = () => null;

/** Current time in Stuttgart, 24-hour, updated every minute. */
export function LocalTime() {
  const time = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  if (time === null) {
    return (
      <time className={`${styles.time} ${styles.pending}`} aria-hidden="true">
        {PLACEHOLDER}
      </time>
    );
  }

  return (
    <time className={styles.time} dateTime={time}>
      {time}
    </time>
  );
}
