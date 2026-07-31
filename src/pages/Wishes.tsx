import { FormEvent, useState } from "react";
import { Heart } from "lucide-react";
import { useLanguage, translations } from "../context/LanguageContext";
import Reveal from "../components/Reveal";

interface Wish {
  id: number;
  name: string;
  message: string;
}

// ── Persistence note ──────────────────────────────────────────────────────
// This page is intentionally backend-free: wishes live in React state only
// and reset on page refresh. To persist them for real guests, replace the
// setWishes() call in handleSubmit with a write to a real datastore, e.g.:
//   - Firebase: addDoc(collection(db, "wishes"), newWish)
//   - Supabase: supabase.from("wishes").insert(newWish)
//   - A simple form-backend (Formspree, Basin, etc.) posting to a webhook
// and load initial wishes with a corresponding read/subscribe call in a
// useEffect on mount.
// ───────────────────────────────────────────────────────────────────────────

const seedWishes: Wish[] = [
  { id: 1, name: "Priya & Rohan", message: "Wishing you a lifetime of love and laughter! 🎉" },
  { id: 2, name: "Aunt Meera", message: "So happy for you both. May your union be blessed. 🙏" },
];

export default function Wishes() {
  const [wishes, setWishes] = useState<Wish[]>(seedWishes);
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const { lang } = useLanguage();
  const t = translations[lang].wishes;

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !message.trim()) return;
    setWishes((prev) => [
      { id: Date.now(), name: name.trim(), message: message.trim() },
      ...prev,
    ]);
    setName("");
    setMessage("");
  };

  return (
    <div className="motif-bg py-20 px-6">
      <Reveal className="max-w-2xl mx-auto text-center mb-10">
        <h1 className="font-display text-5xl text-maroon">
          {t.title}
        </h1>
        <p className="text-maroon/60 mt-2">{t.subtitle}</p>
        <div className="gold-divider w-40 mx-auto mt-6"><span className="gold-divider-marker" /></div>
      </Reveal>

      <form
        onSubmit={handleSubmit}
        className="max-w-xl mx-auto arch-card !rounded-2xl !py-8 flex flex-col gap-4 mb-14 animate-cardReveal"
      >
        <label className="block">
          <span className="text-xs uppercase tracking-wider text-maroon/50">
            {t.name}
          </span>
          <input
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="input"
          />
        </label>
        <label className="block">
          <span className="text-xs uppercase tracking-wider text-maroon/50">
            {t.message}
          </span>
          <textarea
            required
            rows={3}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="input resize-none"
          />
        </label>
        <button
          type="submit"
          className="mt-1 rounded-full bg-gradient-to-r from-maroon to-maroon-light text-ivory py-3 font-semibold tracking-wide hover:shadow-lg transition-all"
        >
          {t.submit}
        </button>
      </form>

      <div className="max-w-4xl mx-auto grid sm:grid-cols-2 gap-4 max-h-[520px] overflow-y-auto pr-1">
        {wishes.length === 0 && (
          <p className="col-span-2 text-center text-maroon/50">{t.empty}</p>
        )}
        {wishes.map((w, i) => (
          <div
            key={w.id}
            className="bg-white/90 border border-gold/40 rounded-xl p-5 shadow-sm hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 animate-fadeIn"
            style={{ animationDelay: `${i * 60}ms` }}
          >
            <p className="text-maroon/80 text-sm leading-relaxed">
              {w.message}
            </p>
            <p className="mt-3 font-display text-lg text-maroon flex items-center gap-1.5">
              <Heart size={14} className="text-gold-dark fill-gold" />
              {w.name}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
