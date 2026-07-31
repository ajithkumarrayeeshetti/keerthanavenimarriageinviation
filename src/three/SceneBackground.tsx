import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { isWebGLAvailable, isLowPowerDevice } from "../hooks/useDeviceCapability";
import { usePrefersReducedMotion } from "../hooks/usePrefersReducedMotion";
import { initScrollTracking, initMouseTracking, refreshScrollTracking } from "./sceneInput";
import SceneErrorBoundary from "./SceneErrorBoundary";
import AmbientScene from "./AmbientScene";

export default function SceneBackground() {
  const [supported] = useState(isWebGLAvailable);
  const [lowPower, setLowPower] = useState(isLowPowerDevice);
  const reducedMotion = usePrefersReducedMotion();
  const location = useLocation();

  useEffect(() => {
    if (!supported) return;
    initScrollTracking();
    initMouseTracking();
    const onResize = () => setLowPower(isLowPowerDevice());
    window.addEventListener("resize", onResize, { passive: true });
    return () => window.removeEventListener("resize", onResize);
  }, [supported]);

  // Recompute scroll bounds whenever the route (and therefore page height) changes.
  useEffect(() => {
    if (!supported) return;
    refreshScrollTracking();
  }, [location.pathname, supported]);

  if (!supported) return null;

  return (
    <div className="ambient-3d-layer" aria-hidden="true">
      <SceneErrorBoundary>
        <AmbientScene reducedMotion={reducedMotion} lowPower={lowPower} />
      </SceneErrorBoundary>
    </div>
  );
}
