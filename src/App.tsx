import { Suspense, lazy, useState } from "react";
import { HashRouter, Routes, Route, useLocation } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import DoorIntro from "./components/DoorIntro";
import Home from "./pages/Home";
import Story from "./pages/Story";
import Events from "./pages/Events";
import Gallery from "./pages/Gallery";
import RSVP from "./pages/RSVP";
import Wishes from "./pages/Wishes";
import { LanguageProvider } from "./context/LanguageContext";

// Code-split: three.js + @react-three/fiber are heavy, and this layer is
// purely decorative, so it loads asynchronously in the background instead
// of delaying the initial page render (fonts, hero content, nav all render
// immediately regardless of when — or whether — this finishes loading).
const SceneBackground = lazy(() => import("./three/SceneBackground"));

function AnimatedRoutes() {
  const location = useLocation();
  return (
    <div className="page-turn-stage">
      <div key={location.pathname} className="page-fade-enter">
        <Routes location={location}>
          <Route path="/" element={<Home />} />
          <Route path="/story" element={<Story />} />
          <Route path="/events" element={<Events />} />
          <Route path="/gallery" element={<Gallery />} />
          <Route path="/wishes" element={<Wishes />} />
          <Route path="/rsvp" element={<RSVP />} />
        </Routes>
      </div>
    </div>
  );
}

export default function App() {
  // Plain component state (not persisted storage) so the intro plays once
  // per visit/session but doesn't replay on route navigation.
  const [introDone, setIntroDone] = useState(false);

  return (
    <LanguageProvider>
      <HashRouter>
        {!introDone && <DoorIntro onComplete={() => setIntroDone(true)} />}

        {/* Cinematic 3D ambient backdrop — camera rig driven by scroll/route/mouse.
            Purely decorative: pointer-events disabled, WebGL-detected, code-split,
            and fully skipped for prefers-reduced-motion / unsupported devices. */}
        <Suspense fallback={null}>
          <SceneBackground />
        </Suspense>

        {/* Ambient drifting gold/maroon blobs — subtle, sits behind everything */}
        <div className="ambient-blobs" aria-hidden="true">
          <span />
          <span />
          <span />
        </div>

        <div className={introDone ? "animate-fadeIn" : "opacity-0"}>
          <Navbar />
          <AnimatedRoutes />
          <Footer />
        </div>
      </HashRouter>
    </LanguageProvider>
  );
}
