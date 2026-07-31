import { lazy, Suspense, useEffect, useState } from "react";
import { weddingConfig } from "../weddingConfig";
import { useLanguage, translations } from "../context/LanguageContext";
import { isWebGLAvailable } from "../hooks/useDeviceCapability";
import { usePrefersReducedMotion } from "../hooks/usePrefersReducedMotion";

const CountdownDigits3D = lazy(() => import("../three/CountdownDigits3D"));

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  done: boolean;
}

function getTimeLeft(): TimeLeft {
  const target = new Date(weddingConfig.weddingDateISO).getTime();
  const diff = target - Date.now();
  if (diff <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0, done: true };
  return {
    days: Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((diff / (1000 * 60)) % 60),
    seconds: Math.floor((diff / 1000) % 60),
    done: false,
  };
}

export default function Countdown() {
  const [time, setTime] = useState<TimeLeft>(getTimeLeft());
  const { lang } = useLanguage();
  const t = translations[lang].countdown;
  const [supports3D] = useState(isWebGLAvailable);
  const reducedMotion = usePrefersReducedMotion();
  const use3D = supports3D && !reducedMotion;

  useEffect(() => {
    const interval = setInterval(() => setTime(getTimeLeft()), 1000);
    return () => clearInterval(interval);
  }, []);

  if (time.done) {
    return (
      <div className="animate-fadeIn text-center bg-white/80 border-2 border-gold rounded-2xl px-8 py-6 mt-6">
        <p className="font-display text-3xl text-maroon">{t.married}</p>
        <p className="font-body text-sm text-maroon/70 mt-1">{t.celebrate}</p>
      </div>
    );
  }

  const boxes: { value: number; label: string }[] = [
    { value: time.days, label: t.days },
    { value: time.hours, label: t.hours },
    { value: time.minutes, label: t.minutes },
    { value: time.seconds, label: t.seconds },
  ];

  return (
    <div className="mt-6">
      {/* 3D flip-clock digits — real geometry hinge-flip on value change,
          wrapped in a thin gold ring accent. Falls back to plain HTML
          boxes below on unsupported devices or prefers-reduced-motion. */}
      {use3D ? (
        <>
          <div className="countdown-3d-wrap">
            <Suspense fallback={null}>
              <CountdownDigits3D
                days={time.days}
                hours={time.hours}
                minutes={time.minutes}
                seconds={time.seconds}
              />
            </Suspense>
          </div>
          {/* Same info, for screen readers / anyone with the 3D layer disabled by their browser. */}
          <p className="sr-only">
            {time.days} {t.days}, {time.hours} {t.hours}, {time.minutes} {t.minutes}, {time.seconds} {t.seconds}
          </p>
        </>
      ) : (
        <div className="flex gap-3 sm:gap-5 justify-center">
          {boxes.map((b, i) => (
            <div
              key={b.label}
              className="countdown-box bg-maroon text-ivory rounded-xl border border-gold px-4 py-3 sm:px-6 sm:py-4 text-center min-w-[64px] sm:min-w-[80px] shadow-md"
              style={{ animationDelay: `${i * 0.4}s` }}
            >
              <div className="font-display text-2xl sm:text-3xl text-gold-light tabular-nums">
                {String(b.value).padStart(2, "0")}
              </div>
              <div className="text-[10px] sm:text-xs uppercase tracking-wider mt-1 text-ivory/80">
                {b.label}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
