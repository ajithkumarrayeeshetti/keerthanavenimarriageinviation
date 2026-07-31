import { weddingConfig } from "../weddingConfig";
import { useLanguage, translations } from "../context/LanguageContext";
import Reveal from "../components/Reveal";

const milestones = [
  {
    en: {
      title: "First Meeting",
      text: "A mutual friend's dinner party in Hyderabad, a spilled cup of chai, and a conversation that went on far past dessert.",
    },
    te: {
      title: "మొదటి పరిచయం",
      text: "హైదరాబాద్‌లో ఒక ఉమ్మడి స్నేహితుడి డిన్నర్ పార్టీ, ఒలికిన చాయ్ కప్పు, మరియు డెజర్ట్ తర్వాత కూడా కొనసాగిన సంభాషణ.",
    },
  },
  {
    en: {
      title: "Falling in Love",
      text: "Late-night phone calls, weekend road trips, and the slow realisation that home was wherever the other person stood.",
    },
    te: {
      title: "ప్రేమలో పడటం",
      text: "అర్ధరాత్రి ఫోన్ కాల్స్, వారాంతపు రోడ్ ట్రిప్‌లు, మరియు ఇంటిగా అనిపించేది ఆ మనిషి ఉన్న చోటే అని నెమ్మదిగా తెలుసుకోవడం.",
    },
  },
  {
    en: {
      title: "The Proposal",
      text: "A rooftop at sunset, a ring hidden in a marigold garland, and a 'yes' before the question was even finished.",
    },
    te: {
      title: "ప్రపోజల్",
      text: "సూర్యాస్తమయం వేళ మిద్దెపై, బంతిపూల మాలలో దాచిన ఉంగరం, మరియు ప్రశ్న పూర్తవ్వకముందే వచ్చిన 'అవును'.",
    },
  },
  {
    en: {
      title: "Today",
      text: "Surrounded by family, friends, and every blessing they can gather — ready to begin their forever.",
    },
    te: {
      title: "ఈరోజు",
      text: "కుటుంబం, స్నేహితులు, మరియు అందరి ఆశీర్వాదాలతో — తమ శాశ్వత ప్రయాణాన్ని ప్రారంభించడానికి సిద్ధంగా.",
    },
  },
];

export default function Story() {
  const { lang } = useLanguage();
  const t = translations[lang].story;

  return (
    <div className="motif-bg py-14 sm:py-20 px-5 sm:px-6">
      <Reveal className="max-w-4xl mx-auto text-center mb-10 sm:mb-14">
        <h1 className="font-display text-4xl sm:text-5xl text-maroon">
          {t.title}
        </h1>
        <p className="text-maroon/60 mt-2">{t.subtitle}</p>
        <div className="gold-divider w-40 mx-auto mt-6"><span className="gold-divider-marker" /></div>
      </Reveal>

      <div className="max-w-4xl mx-auto flex flex-col gap-10 sm:gap-16">
        {milestones.map((m, i) => {
          const copy = m[lang];
          const reverse = i % 2 === 1;
          return (
            <Reveal key={m.en.title}>
              <div
                className={`flex flex-col ${
                  reverse ? "md:flex-row-reverse" : "md:flex-row"
                } items-center gap-6 sm:gap-8`}
              >
                <img
                  src={weddingConfig.storyPhotos[i]}
                  alt={copy.title}
                  className="w-full md:w-1/2 h-56 sm:h-64 object-cover rounded-2xl border-4 border-white shadow-lg hover:scale-[1.03] hover:shadow-2xl transition-all duration-500"
                />
                <div className="md:w-1/2 text-center md:text-left">
                  <span className="text-xs uppercase tracking-[0.3em] text-gold-dark">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <h3 className="font-display text-2xl sm:text-3xl text-maroon mt-1">
                    {copy.title}
                  </h3>
                  <p className="text-maroon/70 mt-3 leading-relaxed text-sm sm:text-base">
                    {copy.text}
                  </p>
                </div>
              </div>
            </Reveal>
          );
        })}
      </div>
    </div>
  );
}
