import { lazy, Suspense, useState } from "react";
import { Calendar, Clock } from "lucide-react";
import { weddingConfig } from "../weddingConfig";
import { useLanguage, translations } from "../context/LanguageContext";
import Reveal from "../components/Reveal";
import { isWebGLAvailable } from "../hooks/useDeviceCapability";
import { usePrefersReducedMotion } from "../hooks/usePrefersReducedMotion";
import { shapeForEventName } from "../three/eventShapes";

const EventIcon3D = lazy(() => import("../three/EventIcon3D"));
const EventsPathScene = lazy(() => import("../three/EventsPathScene"));

export default function Events() {
  const { lang } = useLanguage();
  const t = translations[lang].events;
  const [supports3D] = useState(isWebGLAvailable);
  const reducedMotion = usePrefersReducedMotion();
  const use3D = supports3D && !reducedMotion;

  return (
    <div className="py-14 sm:py-20 px-5 sm:px-6 bg-ivory relative">
      <Reveal className="max-w-3xl mx-auto text-center mb-10 sm:mb-14">
        <h1 className="font-display text-4xl sm:text-5xl text-maroon">
          {t.title}
        </h1>
        <p className="text-maroon/60 mt-2">{t.subtitle}</p>
        <div className="gold-divider w-40 mx-auto mt-6"><span className="gold-divider-marker" /></div>
      </Reveal>

      <div className="max-w-4xl mx-auto relative flex items-start justify-center">
        {/* Decorative winding "thread" connecting the ceremonies — desktop only, purely decorative */}
        {use3D && (
          <div className="events-path-3d-wrap hidden lg:block" aria-hidden="true">
            <Suspense fallback={null}>
              <EventsPathScene />
            </Suspense>
          </div>
        )}

        <div className="max-w-3xl w-full flex flex-col gap-4 sm:gap-5">
          {weddingConfig.events.map((ev, i) => {
            const shape = shapeForEventName(ev.nameEn);
            return (
              <Reveal key={ev.nameEn} delayMs={i * 90}>
                <div
                  className={`sparkle-hover arch-card !rounded-2xl !py-5 sm:!py-6 !px-4 sm:!px-6 border-2 ${ev.tint} flex items-center gap-4 sm:gap-5 hover:shadow-xl hover:-translate-y-1 hover:scale-[1.015] transition-all duration-300`}
                >
                  <div className="w-12 h-12 sm:w-14 sm:h-14 shrink-0 relative">
                    {use3D ? (
                      <Suspense
                        fallback={<span className="text-3xl sm:text-4xl">{ev.emoji}</span>}
                      >
                        <EventIcon3D shape={shape} />
                      </Suspense>
                    ) : (
                      <span className="text-3xl sm:text-4xl">{ev.emoji}</span>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-display text-xl sm:text-2xl text-maroon">
                      {lang === "en" ? ev.nameEn : ev.nameTe}
                    </h3>
                    {lang === "en" && (
                      <p className="font-deva text-sm text-maroon/50">{ev.nameTe}</p>
                    )}
                    <div className="flex flex-wrap gap-4 mt-2 text-sm text-maroon/70">
                      <span className="flex items-center gap-1.5">
                        <Calendar size={14} /> {ev.date}
                      </span>
                      <span className="flex items-center gap-1.5">
                        <Clock size={14} /> {ev.time}
                      </span>
                    </div>
                  </div>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </div>
  );
}
