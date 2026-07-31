import { Component, ReactNode } from "react";

interface Props {
  children: ReactNode;
}
interface State {
  hasError: boolean;
}

export default class SceneErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: unknown) {
    // Decorative layer only — log and silently fall back to no 3D scene
    // rather than surfacing anything to the guest.
    console.warn("Ambient 3D scene disabled after an error:", error);
  }

  render() {
    if (this.state.hasError) return null;
    return this.props.children;
  }
}
