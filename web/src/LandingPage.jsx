

import ShaderShowcase from "@/components/hero";

export default function LandingPage() {
  return (
    <div className="fixed inset-0 w-screen h-screen overflow-hidden">
      <ShaderShowcase />
      <footer className="absolute bottom-2 left-0 w-full text-center text-blue-300 text-xs z-50 pointer-events-none">
        &copy; {new Date().getFullYear()} FarmGrid. All rights reserved.
      </footer>
    </div>
  );
}
