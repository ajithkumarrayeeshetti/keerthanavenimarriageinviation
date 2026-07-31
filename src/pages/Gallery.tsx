import { lazy, Suspense, useState } from "react";
import { X, Sparkles, Move3d } from "lucide-react";
import { weddingConfig } from "../weddingConfig";
import { useLanguage, translations } from "../context/LanguageContext";
import ScratchCard from "../components/ScratchCard";
import Reveal from "../components/Reveal";
import { isWebGLAvailable } from "../hooks/useDeviceCapability";
import { usePrefersReducedMotion } from "../hooks/usePrefersReducedMotion";
import SceneErrorBoundary from "../three/SceneErrorBoundary";

const GalleryCarousel3D = lazy(() => import("../three/GalleryCarousel3D"));

export default function Gallery() {
  const [selected, setSelected] = useState<string | null>(null);
  const [revealedCount, setRevealedCount] = useState(0);
  const { lang } = useLanguage();
  const t = translations[lang].gallery;
  const total = weddingConfig.gallery.length;
  const [supports3D] = useState(isWebGLAvailable);
  const reducedMotion = usePrefersReducedMotion();
  const use3D = supports3D && !reducedMotion;

  return (
    <div className="motif-bg py-14 sm:py-20 px-5 sm:px-6">
      <Reveal className="max-w-3xl mx-auto text-center mb-4">
        <h1 className="font-display text-4xl sm:text-5xl text-maroon">
          {t.title}
        </h1>
        <p className="text-maroon/60 mt-2">{t.subtitle}</p>
        <div className="gold-divider w-40 mx-auto mt-6"><span className="gold-divider-marker" /></div>
      </Reveal>

      <Reveal className="max-w-md mx-auto text-center mb-10 sm:mb-14" delayMs={100}>
        <p className="inline-flex items-center gap-2 text-xs sm:text-sm text-maroon/70 bg-white/70 border border-gold/40 rounded-full px-4 py-2">
          <Sparkles size={14} className="text-gold-dark" />
          {lang === "en"
            ? `Scratch each frame to reveal it — ${revealedCount}/${total} uncovered`
            : `ప్రతి ఫోటోను చూడటానికి గీకండి — ${revealedCount}/${total} బయటపడ్డాయి`}
        </p>
      </Reveal>

      <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-3 gap-4 sm:gap-5">
        {weddingConfig.gallery.map((src, i) => (
          <Reveal key={src} delayMs={i * 70}>
            <div className="relative rounded-xl overflow-hidden border-2 border-white shadow-md hover:shadow-xl transition-shadow duration-300 h-40 sm:h-48 md:h-56">
              <ScratchCard
                promptText={lang === "en" ? "Scratch here" : "ఇక్కడ గీకండి"}
                revealThreshold={0.45}
                fill
                onRevealed={() => setRevealedCount((c) => c + 1)}
              >
                <button
                  onClick={() => setSelected(src)}
                  className="w-full h-full group"
                  aria-label={`View wedding memory ${i + 1}`}
                >
                  <img
                    src={src}
                    alt={`Wedding memory ${i + 1}`}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                </button>
              </ScratchCard>
            </div>
          </Reveal>
        ))}
      </div>

      {/* Optional 3D carousel — same photos, drag to spin around them. */}
      {use3D && (
        <Reveal className="max-w-3xl mx-auto mt-14 sm:mt-20 text-center">
          <p className="inline-flex items-center gap-2 text-xs sm:text-sm text-maroon/70 bg-white/70 border border-gold/40 rounded-full px-4 py-2 mb-5">
            <Move3d size={14} className="text-gold-dark" />
            {lang === "en" ? "Drag to spin through the memories" : "జ్ఞాపకాల చుట్టూ తిప్పడానికి లాగండి"}
          </p>
          <div className="gallery-carousel-3d-wrap rounded-2xl overflow-hidden border-2 border-gold/40 bg-gradient-to-b from-white/40 to-transparent">
            <SceneErrorBoundary>
              <Suspense fallback={null}>
                <GalleryCarousel3D images={weddingConfig.gallery} />
              </Suspense>
            </SceneErrorBoundary>
          </div>
        </Reveal>
      )}

      {selected && (
        <div
          className="fixed inset-0 z-[200] bg-ink/90 flex items-center justify-center p-6 animate-fadeIn"
          onClick={() => setSelected(null)}
        >
          <button
            className="absolute top-6 right-6 text-ivory hover:text-gold"
            onClick={() => setSelected(null)}
            aria-label="Close"
          >
            <X size={32} />
          </button>
          <img
            src={selected}
            alt="Enlarged wedding memory"
            className="max-h-[85vh] max-w-full rounded-lg border-2 border-gold animate-cardReveal"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </div>
  );
}
