"use client";

import styles from "./Onboarding.module.css";

interface OnboardingProps {
  step: number;
  onNext: () => void;
  onSkip: () => void;
}

const STEPS = [
  {
    id: 1,
    title: "Vote",
    body: "Tap an artwork to vote for it. THIS and THAT mark each side.",
    arrow: "top" as const,
    vars: {
      "--tip-top": "55%",
      "--tip-left": "calc(50% - 280px)",
      "--tip-right": "auto",
      "--tip-top-m": "calc(42vh + 72px)",
      "--tip-left-m": "50%",
      "--tip-right-m": "auto",
      "--tip-center-m": "translateX(-50%)",
    },
  },
  {
    id: 2,
    title: "Star to collect",
    body: "Tap the ☆ in the top-right corner of any artwork to save it to your collection.",
    arrow: "top-right" as const,
    vars: {
      "--tip-top": "140px",
      "--tip-left": "auto",
      "--tip-right": "calc(50% + 20px)",
      "--tip-top-m": "132px",
      "--tip-left-m": "50%",
      "--tip-right-m": "auto",
      "--tip-center-m": "translateX(-50%)",
    },
  },
  {
    id: 3,
    title: "Votes & collection",
    body: 'Tap "Collection" in the header anytime to review your vote history and starred artworks.',
    arrow: "top-right" as const,
    vars: {
      "--tip-top": "72px",
      "--tip-left": "auto",
      "--tip-right": "1.75rem",
      "--tip-top-m": "64px",
      "--tip-left-m": "auto",
      "--tip-right-m": "1rem",
      "--tip-center-m": "none",
    },
  },
];

export function Onboarding({ step, onNext, onSkip }: OnboardingProps) {
  const data = STEPS[step - 1];
  if (!data) return null;

  return (
    <>
      <div className={styles.backdrop} onClick={onSkip} aria-hidden="true" />
      <div
        role="dialog"
        aria-label={`Tip ${step} of 3: ${data.title}`}
        className={`${styles.tooltip} ${data.arrow === "top" ? styles.arrowTop : styles.arrowTopRight}`}
        style={data.vars as React.CSSProperties}
        onClick={(e) => e.stopPropagation()}
      >
        <div className={styles.dots} aria-hidden="true">
          {STEPS.map((s) => (
            <span
              key={s.id}
              className={`${styles.dot}${s.id === step ? " " + styles.dotActive : ""}`}
            />
          ))}
        </div>

        <h3 className={styles.title}>{data.title}</h3>
        <p className={styles.body}>{data.body}</p>

        <div className={styles.actions}>
          <button className={styles.skipBtn} onClick={onSkip}>
            Skip
          </button>
          <button className={styles.nextBtn} onClick={onNext}>
            {step === 3 ? "Got it" : "Next"}
          </button>
        </div>
      </div>
    </>
  );
}
