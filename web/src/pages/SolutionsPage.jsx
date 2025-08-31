import { Card } from "../components/ui/card";
import { Separator } from "../components/ui/separator";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { MeshGradient } from "@paper-design/shaders-react";

export default function SolutionsPage() {
  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden font-sans">
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
      <main className="relative z-10 min-h-screen flex items-center justify-center px-4 pt-24 pb-12 text-center">
        <div className="w-full max-w-6xl mx-auto">
          <motion.div
            className="inline-flex items-center px-4 py-2 rounded-full bg-white/5 backdrop-blur-sm mb-6 border border-white/10"
            style={{ filter: "url(#glass-effect)" }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <span className="text-white/90 text-sm font-medium tracking-wide">
              🚀 Comprehensive Digital Platform
            </span>
          </motion.div>

          <motion.h1
            className="text-4xl md:text-6xl font-extrabold text-white mb-6 leading-tight tracking-tight"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <span className="block font-light text-white/90 text-2xl md:text-4xl mb-2 tracking-wider drop-shadow-lg">
              Our Solution
            </span>
            <span 
              className="block font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-white to-orange-300" 
              style={{ filter: "url(#text-glow)" }}
            >
              The Digital Backbone for Modern Agriculture
            </span>
          </motion.h1>

          <motion.p
            className="text-lg font-light text-white/70 mb-10 leading-relaxed max-w-4xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
          >
            FarmGrid is a comprehensive, end-to-end digital platform that replaces ambiguity with clarity and inefficiency with real-time data. We provide a single, unified ecosystem that connects every link in the agricultural supply chain, from the most remote rural farm to the final processor.
          </motion.p>

          <motion.p
            className="text-lg font-light text-white/70 mb-12 leading-relaxed max-w-4xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1.0 }}
          >
            Our solution is built on a modern, decoupled architecture—a powerful backend API, an intuitive web dashboard for managers, and a robust offline-first mobile app for field agents. We don't just digitize old processes; we re-imagine them to create a supply chain that is transparent, trustworthy, and radically more efficient for everyone involved.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 1.2 }}
            className="mb-16"
          >
            <h2 className="text-2xl md:text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 to-white mb-8">
              Core Features of the FarmGrid Platform
            </h2>
            <div className="grid gap-6 md:gap-8 max-w-5xl mx-auto text-left">
              <div className="bg-white/5 backdrop-blur-sm p-6 rounded-xl border border-white/10 hover:bg-white/10 transition-all duration-300">
                <h3 className="font-bold text-cyan-300 text-lg mb-3">Offline-First Mobile App with SMS Sync</h3>
                <p className="text-white/70 leading-relaxed">Our Flutter mobile app for Field Operators is built to work anywhere, with or without an internet connection. Farmer registrations and produce collections are saved securely on the device and can be synced instantly to the central database via a structured SMS message. This guarantees 100% data capture, eliminating the connectivity barrier that holds rural agriculture back.</p>
              </div>
              
              <div className="bg-white/5 backdrop-blur-sm p-6 rounded-xl border border-white/10 hover:bg-white/10 transition-all duration-300">
                <h3 className="font-bold text-cyan-300 text-lg mb-3">Hierarchical, Role-Based Dashboards</h3>
                <p className="text-white/70 leading-relaxed">Our React web application provides a secure, tailored experience for each administrative role. System Admins onboard trusted organizations, Cooperative Admins manage their staff and inventory, and Buyer Admins place orders and verify deliveries. This ensures every user has exactly the tools they need, and nothing they don't.</p>
              </div>
              
              <div className="bg-white/5 backdrop-blur-sm p-6 rounded-xl border border-white/10 hover:bg-white/10 transition-all duration-300">
                <h3 className="font-bold text-cyan-300 text-lg mb-3">Real-Time Inventory and Supply Chain Visibility</h3>
                <p className="text-white/70 leading-relaxed">As Field Operators sync data from the ground, a Cooperative Admin's inventory dashboard updates in real-time. This provides an accurate, live view of available stock, allowing for better sales planning and giving Buyers confidence in the supply they see.</p>
              </div>
              
              <div className="bg-white/5 backdrop-blur-sm p-6 rounded-xl border border-white/10 hover:bg-white/10 transition-all duration-300">
                <h3 className="font-bold text-cyan-300 text-lg mb-3">Automated Payout Calculation & Farmer SMS Alerts</h3>
                <p className="text-white/70 leading-relaxed">We eliminate the most time-consuming and error-prone task for cooperatives. After a buyer pays for a bulk delivery, our system instantly calculates the precise amount owed to each individual farmer based on their contribution. This transparency is passed directly to the farmer via an automated SMS notification confirming their payment, building immense trust and financial security.</p>
              </div>
              
              <div className="bg-white/5 backdrop-blur-sm p-6 rounded-xl border border-white/10 hover:bg-white/10 transition-all duration-300">
                <h3 className="font-bold text-cyan-300 text-lg mb-3">End-to-End Order and Delivery Management</h3>
                <p className="text-white/70 leading-relaxed">Buyers can seamlessly place orders, and Cooperatives can accept and manage the fulfillment process. The crucial "Delivery Verification" step by the Buyer acts as a digital handshake, confirming receipt of goods and triggering the payment cycle, creating a clear and auditable transaction history.</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 1.4 }}
          >
            <h2 className="text-2xl md:text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-orange-300 to-white mb-8">
              The Future of FarmGrid: Innovations on the Horizon
            </h2>
            <div className="grid gap-6 md:gap-8 max-w-5xl mx-auto text-left">
              <div className="bg-orange-500/10 backdrop-blur-sm p-6 rounded-xl border border-orange-500/20 hover:bg-orange-500/20 transition-all duration-300">
                <h3 className="font-bold text-orange-300 text-lg mb-3">AI-Powered Yield Prediction & Analytics</h3>
                <p className="text-white/70 leading-relaxed">We are building machine learning models that will analyze historical collection data, weather patterns, and geographical information to provide cooperatives with valuable insights and predictive analytics on future crop yields. This will empower them with better financial planning and negotiating power.</p>
              </div>
              
              <div className="bg-orange-500/10 backdrop-blur-sm p-6 rounded-xl border border-orange-500/20 hover:bg-orange-500/20 transition-all duration-300">
                <h3 className="font-bold text-orange-300 text-lg mb-3">Integrated IoT Sensor Data</h3>
                <p className="text-white/70 leading-relaxed">The next evolution of our platform will include integrations with low-cost IoT (Internet of Things) sensors for farms and warehouses. This will allow for the automated monitoring of soil moisture, temperature, and storage conditions, providing data that can improve crop quality and reduce post-harvest losses.</p>
              </div>
              
              <div className="bg-orange-500/10 backdrop-blur-sm p-6 rounded-xl border border-orange-500/20 hover:bg-orange-500/20 transition-all duration-300">
                <h3 className="font-bold text-orange-300 text-lg mb-3">Blockchain for Enhanced Traceability and Smart Contracts</h3>
                <p className="text-white/70 leading-relaxed">To provide the ultimate level of transparency and trust, we are exploring the integration of blockchain technology. This will create an immutable, auditable record of a product's journey from farm to consumer. Furthermore, smart contracts could be used to automatically trigger payments between stakeholders the moment delivery conditions are met, further reducing delays and building trust.</p>
              </div>
              
              <div className="bg-orange-500/10 backdrop-blur-sm p-6 rounded-xl border border-orange-500/20 hover:bg-orange-500/20 transition-all duration-300">
                <h3 className="font-bold text-orange-300 text-lg mb-3">Microlending and Financial Services Integration</h3>
                <p className="text-white/70 leading-relaxed">By creating a reliable, digital history of a farmer's productivity and income, FarmGrid will serve as a platform to connect them with financial institutions. This will open up opportunities for fair microlending, crop insurance, and other financial services that are often inaccessible to rural farmers.</p>
              </div>
            </div>
          </motion.div>
        </div>
      </main>
    </div>
  );
}