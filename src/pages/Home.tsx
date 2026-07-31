import type { ReactNode } from "react";
import { Calendar, Clock, MapPin, Phone, Share2 } from "lucide-react";
import { weddingConfig } from "../weddingConfig";
import { useLanguage, translations } from "../context/LanguageContext";
import Countdown from "../components/Countdown";
import ScratchCard from "../components/ScratchCard";
import Reveal from "../components/Reveal";
import { shareInvite } from "../utils/share";

export default function Home() {
  const { lang } = useLanguage();
  const t = translations[lang];
  const mapQuery = encodeURIComponent(weddingConfig.venue.addressEn);

  return (
    <div>
      {/* HERO */}
      <section
        className="relative min-h-[92vh] flex flex-col items-center justify-center text-center px-5 sm:px-6 py-16 overflow-hidden"
        style={{
          backgroundImage: `linear-gradient(rgba(251,247,239,0.88), rgba(251,247,239,0.93)), url(${weddingConfig.heroImage})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        {/* Floating petal accents — decorative, ignored by screen readers */}
        <div className="floating-petals" aria-hidden="true">
          <span>🌸</span>
          <span>🌼</span>
          <span>🪔</span>
          <span>🌸</span>
          <span>✦</span>
        </div>

        <div className="relative z-10 flex flex-col items-center">
        <p className="font-deva text-maroon/80 text-base sm:text-lg animate-fadeIn">
          {weddingConfig.invocation}
        </p>

        <p className="font-body text-xs sm:text-base text-maroon/70 mt-6 sm:mt-8 animate-fadeSlideDown">
          {t.hero.invite1}
        </p>
        <p className="font-body text-xs sm:text-base text-maroon/70 animate-fadeSlideDown">
          {t.hero.invite2}
        </p>

        <h1 className="epic-title font-display text-4xl sm:text-6xl md:text-7xl text-maroon mt-5 sm:mt-6 leading-tight">
          <span className="royal-rays" aria-hidden="true" />
          {weddingConfig.partner1}{" "}
          <span className="text-gold-dark italic">&amp;</span>{" "}
          {weddingConfig.partner2}
        </h1>

        <div className="gold-divider w-32 sm:w-40 my-5 sm:my-6"><span className="gold-divider-marker" /></div>

        <p className="uppercase tracking-[0.3em] sm:tracking-[0.35em] text-[11px] sm:text-xs text-maroon/60">
          {t.hero.saveTheDate}
        </p>
        <p className="font-display text-xl sm:text-3xl text-maroon-dark mt-1">
          {weddingConfig.weddingDateDisplay[lang]}
        </p>

        <Countdown />

        <button
          onClick={shareInvite}
          className="mt-7 sm:mt-8 inline-flex items-center gap-2 rounded-full bg-maroon text-ivory px-5 sm:px-6 py-2.5 text-sm hover:bg-maroon-dark transition-colors shadow-md"
        >
          <Share2 size={16} />
          {t.hero.share}
        </button>
        </div>

        <div className="absolute bottom-5 sm:bottom-6 animate-bounceDot text-gold text-2xl">
          ⌄
        </div>
      </section>

      {/* SCRATCH-TO-REVEAL INVITATION CARD */}
      <section className="bg-maroon-dark py-14 sm:py-20 px-5 sm:px-6 relative overflow-hidden">
        <Reveal className="max-w-lg mx-auto text-center relative z-10">
          <p className="uppercase tracking-[0.3em] text-[11px] sm:text-xs text-gold mb-6">
            {t.hero.scratchPrompt}
          </p>
          <ScratchCard promptText={t.hero.scratchPrompt} height={220}>
            <div>
              <p className="font-deva text-maroon/70 text-sm">
                {weddingConfig.invocation}
              </p>
              <p className="font-display italic text-2xl sm:text-3xl text-maroon mt-2">
                {weddingConfig.partner1} &amp; {weddingConfig.partner2}
              </p>
              <p className="text-maroon/70 text-sm mt-2">
                {weddingConfig.weddingDateDisplay[lang]} · {weddingConfig.venue.name}
              </p>
            </div>
          </ScratchCard>
        </Reveal>
      </section>

      {/* WEDDING DETAILS */}
      <section className="motif-bg py-14 sm:py-20 px-5 sm:px-6">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-8 sm:gap-10 items-start">
          <Reveal className="arch-card !px-5 sm:!px-8">
            <h2 className="font-display text-2xl sm:text-3xl text-maroon text-center mb-6">
              {t.details.title}
            </h2>

            <DetailRow icon={<Calendar size={18} />} label={t.details.dateTime}>
              {weddingConfig.weddingDateDisplay[lang]}
            </DetailRow>
            <DetailRow icon={<Clock size={18} />} label={t.details.dateTime}>
              10:00 AM onwards
            </DetailRow>
            <DetailRow icon={<MapPin size={18} />} label={t.details.venue}>
              <span className="font-semibold">{weddingConfig.venue.name}</span>
              <br />
              {lang === "en"
                ? weddingConfig.venue.addressEn
                : weddingConfig.venue.addressTe}
            </DetailRow>
            <DetailRow icon={<Phone size={18} />} label={t.details.hostedBy}>
              {weddingConfig.hosts.names}
              <br />
              {weddingConfig.hosts.contactPhones.join(" · ")}
            </DetailRow>

            {/* Google Maps embed — no API key required */}
            <div className="mt-6 rounded-xl overflow-hidden border-2 border-gold/50">
              <iframe
                title="Venue location"
                src={`https://maps.google.com/maps?q=${mapQuery}&output=embed`}
                width="100%"
                height="200"
                loading="lazy"
                style={{ border: 0 }}
              />
            </div>
            <a
              href={`https://www.google.com/maps/search/?api=1&query=${mapQuery}`}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 inline-block w-full text-center rounded-full border border-gold text-maroon py-2 text-sm hover:bg-gold hover:text-white transition-colors"
            >
              {t.details.getDirections}
            </a>
          </Reveal>

          <Reveal className="relative flex justify-center" delayMs={150}>
            <div className="relative w-full max-w-sm">
              <img
                src={weddingConfig.heroImage}
                alt={`${weddingConfig.partner1} and ${weddingConfig.partner2}`}
                className="w-full h-[320px] sm:h-[420px] object-cover rounded-2xl border-4 border-white shadow-xl"
              />
              <span className="absolute -bottom-5 left-1/2 -translate-x-1/2 bg-maroon text-gold-light font-display italic text-base sm:text-lg px-5 sm:px-6 py-2 rounded-full shadow-lg border border-gold whitespace-nowrap">
                {t.hero.shubhVivah}
              </span>
            </div>
          </Reveal>
        </div>
      </section>
    </div>
  );
}

function DetailRow({
  icon,
  label,
  children,
}: {
  icon: ReactNode;
  label: string;
  children: ReactNode;
}) {
  return (
    <div className="flex gap-3 items-start mb-4">
      <span className="text-gold-dark mt-0.5">{icon}</span>
      <div>
        <p className="text-xs uppercase tracking-wider text-maroon/50">
          {label}
        </p>
        <p className="text-maroon text-sm leading-relaxed">{children}</p>
      </div>
    </div>
  );
}
