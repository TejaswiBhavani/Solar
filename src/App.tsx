import React, { useEffect, useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import Scene from './components/Scene';
import {
  SatelliteIcon,
  SparkleIcon,
  GithubIcon,
  RocketIcon,
  SunIcon,
  OrbitIcon,
} from './components/icons';

// Hero Section
const HeroSection = () => {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    // Anime.js SVG stroke animation
    if (svgRef.current) {
      const path = svgRef.current.querySelector('circle');
      if (path) {
        // Simple CSS animation instead of anime.js for now
        path.style.animation = 'rotate 4s linear infinite';
      }
    }
  }, []);

  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center text-center px-6">
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, ease: "easeOut" }}
        className="z-10"
      >
        <motion.h1
          className="text-5xl md:text-8xl font-black uppercase tracking-tighter text-glow mb-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.5, delay: 0.5 }}
        >
          Cosmic Journey
        </motion.h1>
        
        <motion.p
          className="text-lg md:text-2xl text-mist mt-4 max-w-2xl mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 1 }}
        >
          Explore the wonders of our solar system through interactive 3D space
        </motion.p>

        <motion.div
          className="flex gap-4 justify-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 1.5 }}
        >
          <button className="btn-primary flex items-center gap-2">
            <RocketIcon className="icon-sm" />
            Start Exploration
          </button>
          <button className="btn-secondary flex items-center gap-2">
            <SatelliteIcon className="icon-sm" />
            Free Roam
          </button>
        </motion.div>

        {/* Animated SVG visualization */}
        <motion.div
          className="flex justify-center"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 2 }}
        >
          <svg
            ref={svgRef}
            width="200"
            height="200"
            viewBox="0 0 200 200"
            className="text-iris"
          >
            <circle
              cx="100"
              cy="100"
              r="80"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeDasharray="100"
              className="opacity-60"
            />
            <circle
              cx="100"
              cy="100"
              r="8"
              fill="currentColor"
              className="text-sun"
            />
          </svg>
        </motion.div>
      </motion.div>
    </section>
  );
};

// Features Section
const FeaturesSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const features = [
    {
      icon: SunIcon,
      title: "Interactive 3D Solar System",
      description: "Explore planets in stunning 3D with realistic orbits and rotations"
    },
    {
      icon: SatelliteIcon,
      title: "Free Roam Mode",
      description: "Navigate freely through space with intuitive orbit controls"
    },
    {
      icon: SparkleIcon,
      title: "Rich Animations",
      description: "Smooth transitions and micro-interactions powered by Framer Motion"
    }
  ];

  return (
    <section ref={ref} className="relative py-24 px-6">
      <div className="max-w-6xl mx-auto">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="text-4xl md:text-6xl font-bold mb-4">
            Features
          </h2>
          <p className="text-xl text-mist max-w-2xl mx-auto">
            Discover the capabilities of our modern solar system explorer
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              className="glass-card text-center"
              initial={{ opacity: 0, y: 50 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
              transition={{ duration: 0.8, delay: index * 0.2 }}
            >
              <div className="flex justify-center mb-4">
                <feature.icon className="icon-lg text-iris" />
              </div>
              <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
              <p className="text-mist">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

// Explore Section
const ExploreSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section ref={ref} className="relative py-24 px-6">
      <div className="max-w-4xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="text-4xl md:text-6xl font-bold mb-6">
            Ready to Explore?
          </h2>
          <p className="text-xl text-mist mb-8 max-w-2xl mx-auto">
            Use your mouse to orbit around the solar system, zoom in to see planets up close, 
            and discover the beauty of space
          </p>
          
          <motion.div
            className="glass-card max-w-lg mx-auto"
            whileHover={{ scale: 1.02 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <div className="flex items-center justify-center mb-4">
              <OrbitIcon className="icon-lg text-neon" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Interactive Controls</h3>
            <p className="text-mist text-sm">
              Click and drag to rotate • Scroll to zoom • Right-click and drag to pan
            </p>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

// Footer
const Footer = () => {
  return (
    <footer className="relative py-12 px-6 border-t border-white/10">
      <div className="max-w-4xl mx-auto text-center">
        <div className="flex flex-wrap justify-center items-center gap-6 mb-6">
          <span className="text-mist">Built with</span>
          <div className="flex items-center gap-2 text-iris">
            <SparkleIcon className="icon-sm" />
            <span>React</span>
          </div>
          <div className="flex items-center gap-2 text-iris">
            <SparkleIcon className="icon-sm" />
            <span>Three.js</span>
          </div>
          <div className="flex items-center gap-2 text-iris">
            <SparkleIcon className="icon-sm" />
            <span>Framer Motion</span>
          </div>
          <div className="flex items-center gap-2 text-iris">
            <SparkleIcon className="icon-sm" />
            <span>Anime.js</span>
          </div>
        </div>
        
        <div className="flex justify-center gap-4">
          <a
            href="https://github.com"
            className="p-3 rounded-full bg-white/5 hover:bg-white/10 transition-colors"
            aria-label="View on GitHub"
          >
            <GithubIcon className="icon" />
          </a>
        </div>
        
        <p className="text-mist mt-6 text-sm">
          © 2025 Interactive Solar System. Built with modern React and Three.js.
        </p>
      </div>
    </footer>
  );
};

// Main App Component
const App: React.FC = () => {
  return (
    <div className="bg-space-gradient min-h-screen">
      {/* 3D Background Scene */}
      <Scene />
      
      {/* Main Content */}
      <main className="relative z-10">
        <HeroSection />
        <FeaturesSection />
        <ExploreSection />
      </main>
      
      <Footer />
    </div>
  );
};

export default App;