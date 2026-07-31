import { Heart, Phone, Share2 } from "lucide-react";
import { weddingConfig } from "../weddingConfig";
import { useLanguage, translations } from "../context/LanguageContext";
import { shareInvite } from "../utils/share";

export default function Footer() {
  const { lang } = useLanguage();
  const t = translations[lang].footer;
  const hero = translations[lang].hero;

  return (
    <footer className="motif-bg border-t-2 border-gold/60 mt-16">
      <div className="max-w-6xl mx-auto px-6 py-10 text-center">
        <p className="font-display italic text-3xl text-maroon">
          {weddingConfig.partner1}{" "}
          <span className="text-gold-dark">&amp;</span>{" "}
          {weddingConfig.partner2}
        </p>
        <p className="font-body text-sm text-maroon/70 mt-1">
          {weddingConfig.weddingDateDisplay[lang]}
        </p>
        <div className="gold-divider max-w-xs mx-auto my-5" />
        <p className="font-body text-sm text-maroon/80 max-w-md mx-auto flex items-center justify-center gap-1">
          {t.blessing} <Heart size={14} className="text-maroon fill-maroon" />
        </p>

        <div className="flex items-center justify-center gap-2 mt-4 text-sm text-maroon/70">
          <Phone size={14} />
          {weddingConfig.hosts.contactPhones.join(" · ")}
        </div>

        <button
          onClick={shareInvite}
          className="mt-6 inline-flex items-center gap-2 rounded-full border border-gold px-5 py-2 text-sm text-maroon hover:bg-maroon hover:text-white hover:border-maroon transition-colors"
        >
          <Share2 size={16} />
          {hero.share}
        </button>

        <p className="mt-8 text-xs text-maroon/50">{t.allRightsReserved}</p>
      </div>
    </footer>
  );
}
