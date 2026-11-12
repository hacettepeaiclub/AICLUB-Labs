import { useEffect, useState, type RefObject } from "react";

/** Only consume frames while the experiment and tab are visible. */
export function useJepaActivity(ref: RefObject<HTMLElement>) {
  const [active, setActive] = useState(false);
  useEffect(() => {
    let visible = false;
    const sync = () => setActive(visible && !document.hidden);
    const observer = new IntersectionObserver(([entry]) => {
      visible = entry?.isIntersecting ?? false;
      sync();
    });
    if (ref.current) observer.observe(ref.current);
    document.addEventListener("visibilitychange", sync);
    return () => {
      observer.disconnect();
      document.removeEventListener("visibilitychange", sync);
    };
  }, [ref]);
  return active;
}
