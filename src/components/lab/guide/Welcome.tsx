import { useEffect, useRef } from "react";
import { Button } from "@/components/ui";
import { useT } from "@/i18n";

/**
 * The first visit's welcome: what the lab's first experiment is, and an offer
 * to be shown. Its own chunk, since a visitor sees it once per lab.
 */
export default function Welcome({
  title,
  intro,
  onStart,
  onClose,
}: {
  title: string;
  intro: string;
  onStart: () => void;
  onClose: () => void;
}) {
  const t = useT();
  const ref = useRef<HTMLDialogElement>(null);
  const startRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog || dialog.open) return;
    dialog.showModal();
    startRef.current?.focus();
  }, []);

  return (
    <dialog
      ref={ref}
      aria-labelledby="lab-guide-title"
      className="lab-palette lab-guide-welcome"
      onClose={onClose}
      // A click on the dialog itself, not on the panel, is on the backdrop.
      onClick={(event) => event.target === ref.current && ref.current?.close()}
    >
      <div className="lab-palette-panel max-w-md p-6">
        <p className="text-overline uppercase text-fg-faint">{t.guide.welcomeKicker}</p>
        <h2 id="lab-guide-title" className="mt-2 text-title text-fg">
          {title}
        </h2>
        <p className="mt-3 text-body text-fg-muted">{intro}</p>
        <div className="mt-6 flex flex-wrap gap-2">
          <Button ref={startRef} onClick={onStart}>
            {t.guide.show}
          </Button>
          <Button variant="ghost" onClick={() => ref.current?.close()}>
            {t.guide.explore}
          </Button>
        </div>
        <p className="mt-4 text-caption text-fg-faint">{t.guide.later}</p>
      </div>
    </dialog>
  );
}
