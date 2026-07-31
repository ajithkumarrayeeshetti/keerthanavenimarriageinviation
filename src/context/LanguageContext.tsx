import React, { createContext, useContext, useState, ReactNode } from "react";

export type Lang = "en" | "te";

interface LanguageContextValue {
  lang: Lang;
  toggleLang: () => void;
}

const LanguageContext = createContext<LanguageContextValue | undefined>(
  undefined
);

// In-memory only (per app spec — no localStorage/sessionStorage use).
// Default language is English; toggle switches to Telugu.
export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [lang, setLang] = useState<Lang>("en");
  const toggleLang = () => setLang((prev) => (prev === "en" ? "te" : "en"));
  return (
    <LanguageContext.Provider value={{ lang, toggleLang }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = (): LanguageContextValue => {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error("useLanguage must be used within LanguageProvider");
  return ctx;
};

// Shared translation dictionary. Each page pulls its own subset by key.
// Add another language by adding a new top-level key here (and to Lang above).
export const translations = {
  en: {
    nav: { home: "Home", story: "Our Story", events: "Events", gallery: "Gallery", rsvp: "RSVP", wishes: "Wishes" },
    hero: {
      invite1: "Together with their families,",
      invite2: "request the honour of your presence",
      saveTheDate: "Save the Date",
      shubhVivah: "Shubh Vivah",
      share: "Share the Invite",
      scratchPrompt: "Scratch to reveal your invitation",
    },
    details: {
      title: "Wedding Details",
      dateTime: "Date & Time",
      venue: "Venue",
      hostedBy: "Hosted By",
      getDirections: "Get Directions",
    },
    countdown: { days: "Days", hours: "Hours", minutes: "Minutes", seconds: "Seconds", married: "We're Married!", celebrate: "Thank you for being part of our journey 💛" },
    story: { title: "Our Story", subtitle: "A journey of two hearts becoming one" },
    events: { title: "Wedding Events", subtitle: "Join us in celebrating every ceremony" },
    gallery: { title: "Gallery", subtitle: "Moments we've collected along the way" },
    rsvp: {
      title: "RSVP",
      subtitle: "Kindly let us know if you'll be joining us",
      name: "Full Name",
      email: "Email Address",
      phone: "Phone Number",
      guests: "Number of Guests",
      attending: "Will you be attending?",
      yes: "Joyfully Accepts",
      no: "Regretfully Declines",
      message: "Message for the Couple",
      submit: "Send RSVP",
      thankYou: "Thank you! Your RSVP has been received with love.",
    },
    wishes: {
      title: "Wishes & Blessings",
      subtitle: "Leave a note of love for the couple",
      name: "Your Name",
      message: "Your Blessing",
      submit: "Send Blessing",
      empty: "Be the first to leave a blessing!",
    },
    footer: { blessing: "With gratitude, we welcome you to celebrate our new beginning.", allRightsReserved: "Made with love for our wedding day" },
  },
  te: {
    nav: { home: "హోమ్", story: "మా కథ", events: "వేడుకలు", gallery: "గ్యాలరీ", rsvp: "ఆర్.ఎస్.వి.పి.", wishes: "శుభాకాంక్షలు" },
    hero: {
      invite1: "తమ కుటుంబాలతో కలిసి,",
      invite2: "మీ సముఖ సన్నిధిని కోరుకుంటున్నారు",
      saveTheDate: "తేదీని గుర్తుంచుకోండి",
      shubhVivah: "శుభ వివాహం",
      share: "ఆహ్వానం పంపండి",
      scratchPrompt: "మీ ఆహ్వానాన్ని చూడటానికి గీకండి",
    },
    details: {
      title: "వివాహ వివరాలు",
      dateTime: "తేదీ & సమయం",
      venue: "వేదిక",
      hostedBy: "నిర్వాహకులు",
      getDirections: "దారి చూపండి",
    },
    countdown: { days: "రోజులు", hours: "గంటలు", minutes: "నిమిషాలు", seconds: "సెకన్లు", married: "మేము వివాహం చేసుకున్నాము!", celebrate: "మా ప్రయాణంలో భాగమైనందుకు ధన్యవాదాలు 💛" },
    story: { title: "మా కథ", subtitle: "రెండు హృదయాలు ఒక్కటిగా మారిన ప్రయాణం" },
    events: { title: "వివాహ వేడుకలు", subtitle: "ప్రతి వేడుకను మాతో కలిసి జరుపుకోండి" },
    gallery: { title: "గ్యాలరీ", subtitle: "మా ప్రయాణంలో సేకరించిన క్షణాలు" },
    rsvp: {
      title: "ఆర్.ఎస్.వి.పి.",
      subtitle: "మీరు హాజరవుతారో లేదో దయచేసి తెలియజేయండి",
      name: "పూర్తి పేరు",
      email: "ఇమెయిల్ చిరునామా",
      phone: "ఫోన్ నంబర్",
      guests: "అతిథుల సంఖ్య",
      attending: "మీరు హాజరవుతారా?",
      yes: "సంతోషంగా అంగీకరిస్తున్నాను",
      no: "క్షమించండి, రాలేను",
      message: "జంటకు సందేశం",
      submit: "ఆర్.ఎస్.వి.పి. పంపండి",
      thankYou: "ధన్యవాదాలు! మీ ఆర్.ఎస్.వి.పి. ప్రేమతో స్వీకరించబడింది.",
    },
    wishes: {
      title: "శుభాకాంక్షలు",
      subtitle: "జంట కోసం ప్రేమతో కూడిన సందేశం ఇవ్వండి",
      name: "మీ పేరు",
      message: "మీ ఆశీర్వాదం",
      submit: "ఆశీర్వాదం పంపండి",
      empty: "మొదటి ఆశీర్వాదం మీరే ఇవ్వండి!",
    },
    footer: { blessing: "కృతజ్ఞతతో, మా కొత్త జీవితాన్ని జరుపుకోవడానికి మిమ్మల్ని ఆహ్వానిస్తున్నాము.", allRightsReserved: "మా వివాహ దినోత్సవం కోసం ప్రేమతో రూపొందించబడింది" },
  },
};
