import { motion } from "framer-motion";
import { Link } from "react-router-dom"; // Assuming you use React Router for navigation
import { MeshGradient } from "@paper-design/shaders-react";
import { useContext } from "react";
import { AuthContext } from "@/contexts/AuthContext";
import { getDashboardRoute } from "@/services/authService";

export default function LandingPage() {
  const { isAuthenticated, user } = useContext(AuthContext);
  const dashboardRoute = user ? getDashboardRoute(user.role) : "/login";
  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden font-sans">
      {/* SVG Filters remain to power the visual effects */}
      <svg className="absolute inset-0 w-0 h-0">
        <defs>
          <filter id="glass-effect" x="-50%" y="-50%" width="200%" height="200%">
            <feTurbulence baseFrequency="0.005" numOctaves="1" result="noise" />
            <feDisplacementMap in="SourceGraphic" in2="noise" scale="0.3" />
          </filter>
          <filter id="text-glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="1.5" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
      </svg>

      {/* Animated Gradient Backgrounds */}
      <MeshGradient
        className="absolute inset-0 w-full h-full"
        colors={["#000000", "#06b6d4", "#0891b2", "#164e63", "#f97316"]}
        speed={0.3}
        backgroundColor="#000000"
      />
      <MeshGradient
        className="absolute inset-0 w-full h-full opacity-60"
        colors={["#000000", "#ffffff", "#06b6d4", "#f97316"]}
        speed={0.2}
        wireframe={true}
        backgroundColor="transparent"
      />

      {/* Professional Navigation Bar */}
      <header className="fixed top-0 left-0 right-0 z-30">
        <div className="mx-auto max-w-7xl px-6 py-4">
          <div className="relative flex items-center justify-between rounded-2xl bg-black/30 backdrop-blur-md border border-white/10 px-6 py-3 shadow-lg">
            {/* FarmGrid Logo */}
            <Link to="/" className="text-2xl font-bold tracking-wider">
              Farm<span className="text-cyan-400">Grid</span>
            </Link>

            {/* Navigation Links - Text is now fully white */}
            <nav className="hidden md:flex items-center space-x-8">
              <Link to="/solutions" className="text-white hover:text-cyan-300 transition-colors">
                Solution
              </Link>
              <Link to="/about" className="text-white hover:text-cyan-300 transition-colors">
                About Us
              </Link>
              <a href="#contact" className="text-white hover:text-cyan-300 transition-colors">
                Contact
              </a>
            </nav>

            {/* Login Button */}
            <Link
              to={isAuthenticated ? dashboardRoute : "/login"}
              className="px-6 py-2 rounded-full bg-white text-black font-semibold text-sm transition-transform duration-300 hover:scale-105 hover:bg-gray-200"
            >
              Dashboard Login
            </Link>
          </div>
        </div>
      </header>
      
      {/* Main Content Area */}
      <main className="relative z-10 flex items-center justify-center min-h-screen text-center">
        <div className="max-w-4xl px-4">
          <motion.div
            className="inline-flex items-center px-4 py-2 rounded-full bg-white/5 backdrop-blur-sm mb-6 border border-white/10"
            style={{ filter: "url(#glass-effect)" }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <span className="text-white/90 text-sm font-medium tracking-wide">
              🌱 The Future of Agricultural Supply Chains
            </span>
          </motion.div>

          <motion.h1
            className="text-5xl md:text-7xl font-extrabold text-white mb-6 leading-tight tracking-tight"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <span className="block font-light text-white/90 text-3xl md:text-5xl mb-2 tracking-wider drop-shadow-lg">
              The Digital Backbone
            </span>
            <span 
              className="block font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-white to-orange-300" 
              style={{ filter: "url(#text-glow)" }}
            >
              for Modern Agriculture
            </span>
          </motion.h1>

          <motion.p
            className="text-lg font-light text-white/70 mb-10 leading-relaxed max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
          >
            FarmGrid connects farmers, cooperatives, and buyers with a seamless digital platform. We bring efficiency, transparency, and trust to the entire supply chain, from remote field collections to final payment.
          </motion.p>

          {/* --- UPDATED CALL TO ACTION --- */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1.0 }}
          >
            <motion.a
              href="https://farmgrid.robotech.co.ke/api-docs" // Link to your documentation page
              className="inline-block px-8 py-3 rounded-full bg-white/10 border-2 border-white/30 text-white font-medium text-sm transition-all duration-300 hover:bg-white/20 hover:border-cyan-400/50 backdrop-blur-sm"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              View Docs
            </motion.a>
          </motion.div>
          
        </div>
      </main>
    </div>
  );
}
