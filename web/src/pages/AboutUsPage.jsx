import { Card } from "../components/ui/card";
import { Separator } from "../components/ui/separator";
import { motion } from "framer-motion";
import { MeshGradient } from "@paper-design/shaders-react";
import { Link } from "react-router-dom";

export default function AboutUsPage() {
  return (
    <div className="min-h-screen w-full bg-black text-white relative font-sans" style={{overflow: 'hidden'}}>
      {/* SVG Filters */}
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
        className="fixed inset-0"
        style={{ width: '100vw', height: '100vh' }}
        colors={["#000000", "#06b6d4", "#0891b2", "#164e63", "#f97316"]}
        speed={0.3}
        backgroundColor="#000000"
      />
      <MeshGradient
        className="fixed inset-0 opacity-60"
        style={{ width: '100vw', height: '100vh' }}
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
            {/* Navigation Links */}
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
              to="/login"
              className="px-6 py-2 rounded-full bg-white text-black font-semibold text-sm transition-transform duration-300 hover:scale-105 hover:bg-gray-200"
            >
              Dashboard Login
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="relative z-10 min-h-screen flex items-center justify-center px-4 pt-24 pb-12 text-center w-full">
        <div className="w-full max-w-6xl mx-auto">
          <motion.div
            className="inline-flex items-center px-4 py-2 rounded-full bg-white/5 backdrop-blur-sm mb-6 border border-white/10"
            style={{ filter: "url(#glass-effect)" }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <span className="text-white/90 text-sm font-medium tracking-wide">
              🌾 Our Story & Vision
            </span>
          </motion.div>

          <motion.h1
            className="text-4xl md:text-6xl font-extrabold text-white mb-6 leading-tight tracking-tight"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <span className="block font-light text-white/90 text-2xl md:text-4xl mb-2 tracking-wider drop-shadow-lg">
              About Us
            </span>
            <span 
              className="block font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-white to-orange-300" 
              style={{ filter: "url(#text-glow)" }}
            >
              Bridging the Digital Divide
            </span>
          </motion.h1>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.8 }}
            className="mb-12"
          >
            <div className="bg-white/5 backdrop-blur-sm p-8 rounded-xl border border-white/10 hover:bg-white/10 transition-all duration-300 max-w-5xl mx-auto text-left">
              <h2 className="text-2xl md:text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 to-white mb-6 text-center">
                Our Story: Bridging the Digital Divide in Agriculture
              </h2>
              <p className="text-lg font-light text-white/70 mb-6 leading-relaxed">
                FarmGrid was born from a simple but powerful observation: the backbone of our economy—the hardworking farmer—is often the most disconnected from the digital tools that could transform their livelihood.
              </p>
              <p className="text-lg font-light text-white/70 leading-relaxed">
                In many of our communities, especially in rural and marginalized areas, the agricultural supply chain runs on paper, phone calls, and trust earned over generations. While this has its strengths, it also creates significant barriers. We saw firsthand the challenges: delayed payments for farmers due to slow paperwork, cooperatives struggling with manual inventory, and buyers facing uncertainty in their supply chains. This "digital divide" isn't just an inconvenience; it's a bottleneck that stifles growth, limits transparency, and prevents investment where it's needed most.
              </p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 1.0 }}
            className="mb-12"
          >
            <div className="bg-cyan-500/10 backdrop-blur-sm p-8 rounded-xl border border-cyan-500/20 hover:bg-cyan-500/20 transition-all duration-300 max-w-5xl mx-auto text-left">
              <h2 className="text-2xl md:text-3xl font-bold text-cyan-300 mb-6 text-center">
                Our Motivation: Technology as a Tool for Empowerment
              </h2>
              <p className="text-lg font-light text-white/70 mb-6 leading-relaxed">
                We are a team of technologists, developers, and problem-solvers who are deeply passionate about leveraging technology for social and economic good. We asked ourselves: what if we could build a system that respects the existing relationships in agriculture but enhances them with the power of modern technology? What if a lack of reliable internet no longer meant a lack of opportunity?
              </p>
              <p className="text-lg font-light text-white/70 mb-6 leading-relaxed">
                This question became our mission. We were motivated by the belief that a simple, reliable, and accessible digital platform could empower every stakeholder. We envisioned a system where a farmer's hard work is recorded instantly and accurately, where a cooperative can manage its business with real-time data, and where a buyer can source produce with confidence and clarity.
              </p>
              <p className="text-lg font-light text-white/70 leading-relaxed">
                The core challenge, and our key motivation, was to solve the connectivity problem. We knew that any solution requiring constant internet would fail the very people it was meant to serve. This led to our innovative hybrid approach: building a robust platform that could guarantee data flow even from the most remote locations using the simple power of SMS.
              </p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 1.2 }}
          >
            <div className="bg-orange-500/10 backdrop-blur-sm p-8 rounded-xl border border-orange-500/20 hover:bg-orange-500/20 transition-all duration-300 max-w-5xl mx-auto text-left">
              <h2 className="text-2xl md:text-3xl font-bold text-orange-300 mb-6 text-center">
                Our Vision: A Transparent and Prosperous Agricultural Future
              </h2>
              <p className="text-lg font-light text-white/70 mb-6 leading-relaxed">
                FarmGrid is more than just an app; it's a commitment to building a more transparent, efficient, and equitable agricultural ecosystem. We believe that by providing clear and instant communication, we can foster greater trust between farmers, cooperatives, and buyers.
              </p>
              <p className="text-lg font-light text-white/70 mb-6 leading-relaxed">
                Our vision is a future where every farmer, regardless of their location, is paid fairly and promptly for their produce. A future where cooperatives can operate at peak efficiency, and where agribusinesses can invest with confidence, knowing they are connected to a reliable and transparent supply chain.
              </p>
              <p className="text-lg font-light text-orange-300 leading-relaxed font-medium">
                We are just getting started, and we invite you to join us on this journey to connect and empower the heart of our economy.
              </p>
            </div>
          </motion.div>
        </div>
      </main>
    </div>
  );
}