import { FormEvent, ReactNode, useState } from "react";
import { useLanguage, translations } from "../context/LanguageContext";
import Reveal from "../components/Reveal";

interface FormState {
  name: string;
  email: string;
  phone: string;
  guests: number;
  attending: "yes" | "no";
  message: string;
}

const initialState: FormState = {
  name: "",
  email: "",
  phone: "",
  guests: 1,
  attending: "yes",
  message: "",
};

export default function RSVP() {
  const [form, setForm] = useState<FormState>(initialState);
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { lang } = useLanguage();
  const t = translations[lang].rsvp;

  // Dynamically imported so gsap/sceneInput never lands in the main bundle
  // just because RSVP.tsx references it — only loads at the moment of
  // submission (and is usually already cached by then anyway, since the
  // ambient 3D scene loads it in the background on first paint).
  const completeSubmit = () => {
    setSubmitted(true);
    import("../three/sceneInput")
      .then(({ triggerSubmitPulse }) => triggerSubmitPulse())
      .catch(() => {
        /* ambient scene unavailable/unsupported — the thank-you card still shows fine */
      });
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;
    setError(null);

    // Submit RSVP to the secure backend API.
    setIsSubmitting(true);
    try {
      const response = await fetch("/api/rsvp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(form),
      });

      if (!response.ok) {
        const payload = await response.json().catch(() => null);
        const errorMessage =
          payload && typeof payload === "object" && (payload as any).error
            ? (payload as any).error
            : "Unable to send your RSVP. Please try again.";
        setError(errorMessage);
        return;
      }

      completeSubmit();
      setForm(initialState);
    } catch {
      setError("Network error. Please check your connection and try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center px-6 motif-bg">
        <div className="arch-card max-w-md text-center animate-cardReveal relative">
          <div className="rsvp-seal-burst" aria-hidden="true">
            {Array.from({ length: 10 }).map((_, i) => (
              <span key={i} style={{ transform: `rotate(${i * 36}deg)` }} />
            ))}
          </div>
          <p className="font-display text-3xl text-maroon relative z-10">{t.thankYou}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="motif-bg py-20 px-6">
      <Reveal className="max-w-xl mx-auto text-center mb-10">
        <h1 className="font-display text-5xl text-maroon">
          {t.title}
        </h1>
        <p className="text-maroon/60 mt-2">{t.subtitle}</p>
        <div className="gold-divider w-40 mx-auto mt-6"><span className="gold-divider-marker" /></div>
      </Reveal>

      <form
        onSubmit={handleSubmit}
        className="max-w-xl mx-auto arch-card !rounded-2xl !py-8 flex flex-col gap-5 reveal reveal-in"
      >
        <Field label={t.name}>
          <input
            required
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="input"
          />
        </Field>

        <Field label={t.email}>
          <input
            type="email"
            required
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            className="input"
          />
        </Field>

        <Field label={t.phone}>
          <input
            type="tel"
            required
            value={form.phone}
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
            className="input"
          />
        </Field>

        <Field label={t.guests}>
          <input
            type="number"
            min={1}
            max={10}
            required
            value={form.guests}
            onChange={(e) =>
              setForm({ ...form, guests: Number(e.target.value) })
            }
            className="input"
          />
        </Field>

        <fieldset>
          <legend className="text-xs uppercase tracking-wider text-maroon/50 mb-2">
            {t.attending}
          </legend>
          <div className="flex gap-4">
            {(["yes", "no"] as const).map((val) => (
              <label
                key={val}
                className={`flex-1 text-center cursor-pointer rounded-full border py-2 text-sm transition-colors ${
                  form.attending === val
                    ? "bg-maroon text-ivory border-maroon"
                    : "border-gold/60 text-maroon hover:bg-gold/10"
                }`}
              >
                <input
                  type="radio"
                  name="attending"
                  value={val}
                  checked={form.attending === val}
                  onChange={() => setForm({ ...form, attending: val })}
                  className="sr-only"
                />
                {val === "yes" ? t.yes : t.no}
              </label>
            ))}
          </div>
        </fieldset>

        <Field label={t.message}>
          <textarea
            rows={3}
            value={form.message}
            onChange={(e) => setForm({ ...form, message: e.target.value })}
            className="input resize-none"
          />
        </Field>

        <button
          type="submit"
          disabled={isSubmitting}
          className="mt-2 rounded-full bg-gradient-to-r from-maroon to-maroon-light text-ivory py-3 font-semibold tracking-wide hover:shadow-lg hover:from-maroon-dark hover:to-maroon transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? `${t.submit}...` : t.submit}
        </button>
        {error ? (
          <p className="text-sm text-rose-600 mt-2" aria-live="polite">
            {error}
          </p>
        ) : null}
      </form>
    </div>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: ReactNode;
}) {
  return (
    <label className="block">
      <span className="text-xs uppercase tracking-wider text-maroon/50">
        {label}
      </span>
      {children}
    </label>
  );
}
