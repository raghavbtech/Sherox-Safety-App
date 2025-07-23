import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { motion, useScroll, useTransform, useInView } from "framer-motion";
import {
  Mic,
  Scan,
  MapPin,
  Users,
  ArrowRight,
  Star,
  CheckCircle,
  Play,
  Download,
  Smartphone,
  Clock,
  Award,
  Heart,
  Zap,
  Globe,
  Shield,
  Timer,
  UserCheck,
  Bell,
  ChevronDown,
} from "lucide-react";

// IMPORTANT: Ensure 'Inter' font is linked in public/index.html and configured in tailwind.config.js
// public/index.html <head> section:
// <link rel="preconnect" href="https://fonts.googleapis.com">
// <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
// <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;800&display=swap" rel="stylesheet">

// tailwind.config.js:
// module.exports = {
//   theme: {
//     extend: {
//       fontFamily: {
//         sans: ['Inter', 'sans-serif'],
//       },
//     },
//   },
//   plugins: [],
// }

// Animated Counter Component (Remains unchanged - it's already well-implemented)
const AnimatedCounter = ({ end, duration = 2, suffix = "" }) => {
  const [count, setCount] = useState(0);
  const ref = useRef();
  const isInView = useInView(ref, { once: true, amount: 0.5 });

  useEffect(() => {
    if (isInView) {
      let startTime;
      const animate = (timestamp) => {
        if (!startTime) startTime = timestamp;
        const progress = Math.min((timestamp - startTime) / (duration * 1000), 1);
        const currentCount = Math.floor(progress * end);
        setCount(currentCount);
        if (progress < 1) {
          requestAnimationFrame(animate);
        }
      };
      requestAnimationFrame(animate);
    } else {
      // Optional: reset count if it goes out of view and comes back, or keep the final count
      // setCount(0); 
    }
  }, [isInView, end, duration]);

  return <span ref={ref}>{count}{suffix}</span>;
};

// --- START: HOME COMPONENT (Completely Revised) ---
const Home = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const { scrollYProgress } = useScroll();
  // Parallax for the main header (subtle scroll effect)
  const yHeaderTransform = useTransform(scrollYProgress, [0, 1], [0, -100]);
  const opacityHeaderTransform = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  // Mouse tracking for subtle background elements
  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({
        x: (e.clientX / window.innerWidth - 0.5) * 2, // Normalize to -1 to 1
        y: (e.clientY / window.innerHeight - 0.5) * 2, // Normalize to -1 to 1
      });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // --- REFINED & HARMONIZED COLOR PALETTE ---
  const primaryBrandGradient = "from-blue-600 via-purple-600 to-pink-600"; // Main brand identity
  const darkBgGradient = "from-blue-700 via-purple-700 to-pink-700"; // Deeper version for dark sections
  const lightBgGradient = "from-blue-50 to-indigo-100"; // Soft background for hero/light sections

  // Consistent accents for icons/buttons
  const accentBlue = "from-blue-500 to-indigo-500";
  const accentGreen = "from-emerald-500 to-teal-500";
  const accentPink = "from-rose-500 to-orange-500";

  // Re-defined data with consistent accent gradients
  const features = [
    {
      icon: <Mic className="w-8 h-8 text-white" />,
      title: "Voice SOS",
      description: "Simply say 'Help' to instantly trigger emergency protocols, sending your location and situation details to authorities and trusted contacts.",
      gradient: accentBlue,
    },
    {
      icon: <Scan className="w-8 h-8 text-white" />,
      title: "Number Plate Scanner",
      description: "Advanced AI technology instantly captures and verifies vehicle license plates, creating a digital trail for enhanced security and evidence collection.",
      gradient: accentGreen,
    },
    {
      icon: <MapPin className="w-8 h-8 text-white" />,
      title: "Safe Score Mapping",
      description: "Navigate confidently with AI-powered route optimization that prioritizes well-lit streets, populated areas, and avoids high-risk zones.",
      gradient: accentPink,
    },
    {
      icon: <Users className="w-8 h-8 text-white" />,
      title: "Trusted Contacts",
      description: "Build your personal safety network with real-time location sharing, emergency notifications, and seamless communication with your trusted contacts.",
      gradient: accentBlue,
    }
  ];

  const stats = [
    { number: 500, suffix: "K+", label: "Women Protected", icon: <Users className="w-8 h-8 text-white" />, gradient: accentBlue },
    { number: 99.9, suffix: "%", label: "Response Rate", icon: <Zap className="w-8 h-8 text-white" />, gradient: accentGreen },
    { number: 24, suffix: "/7", label: "Monitoring", icon: <Clock className="w-8 h-8 text-white" />, gradient: accentPink },
    { number: 150, suffix: "+", label: "Cities Covered", icon: <Globe className="w-8 h-8 text-white" />, gradient: accentBlue }
  ];

  const steps = [
    {
      number: "1",
      icon: <Download className="w-8 h-8 text-white" />,
      title: "Download & Setup",
      description: "Download the app, create your profile, and add trusted emergency contacts in minutes.",
      gradient: accentBlue
    },
    {
      number: "2",
      icon: <Shield className="w-8 h-8 text-white" />,
      title: "Stay Protected",
      description: "AI monitors your safety in real-time, providing alerts and recommendations based on your location.",
      gradient: accentGreen
    },
    {
      number: "3",
      icon: <Bell className="w-8 h-8 text-white" />,
      title: "Get Help Fast",
      description: "One-tap SOS alerts instantly notify your contacts and emergency services with your exact location.",
      gradient: accentPink
    }
  ];

  const safetyStats = [
    { number: 2.5, suffix: " min", label: "Avg. Response Time", icon: <Timer className="w-8 h-8 text-white" />, gradient: accentBlue },
    { number: 98, suffix: "%", label: "User Satisfaction", icon: <Heart className="w-8 h-8 text-white" />, gradient: accentPink },
    { number: 85, suffix: "+", label: "Countries Connected", icon: <Globe className="w-8 h-8 text-white" />, gradient: accentGreen },
    { number: 1, suffix: "M+", label: "Emergency Alerts Handled", icon: <Shield className="w-8 h-8 text-white" />, gradient: accentBlue }
  ];

  const testimonials = [
    {
      name: "Sarah Mitchell",
      role: "University Student",
      content: "The voice SOS feature saved me during a scary situation on campus. Just saying 'Help' immediately alerted my friends and campus security.",
      rating: 5,
      image: "https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop",
      verified: true,
      location: "New York, USA"
    },
    {
      name: "Emily Rodriguez",
      role: "Healthcare Professional",
      content: "The number plate scanner gives me peace of mind when using ride-sharing services. I always know exactly which vehicle I'm getting into.",
      rating: 5,
      image: "https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop",
      verified: true,
      location: "Los Angeles, USA"
    },
    {
      name: "Lisa Thompson",
      role: "Business Traveler",
      content: "The safe score mapping feature helps me navigate new cities confidently. I always know which routes are safest, especially at night.",
      rating: 5,
      image: "https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop",
      verified: true,
      location: "Chicago, USA"
    }
  ];

  // Testimonial state (no auto-scroll for better control)
  const [currentTestimonial, setCurrentTestimonial] = useState(0);

  // Variants for staggered animations
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1, // Stagger effect for children
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30, scale: 0.95 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        type: "spring",
        damping: 10,
        stiffness: 100,
        duration: 0.6,
      },
    },
  };


  return (
    <div className="bg-white text-gray-900 font-sans overflow-hidden">

      {/* --- Hero Section: Bold Heading, Clean Visuals, Clear Cards --- */}
      <section className={`relative min-h-screen flex items-center bg-gradient-to-br ${lightBgGradient} overflow-hidden`}>

        {/* Abstract Background Shapes (Dynamic with mouse, subtle, non-distracting) */}
        <motion.div
          className="absolute -top-40 -left-40 w-96 h-96 bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 pointer-events-none"
          animate={{ x: mousePosition.x * 30, y: mousePosition.y * 30 }}
          transition={{ type: "spring", stiffness: 50, damping: 20 }}
        />
        <motion.div
          className="absolute top-1/2 -right-40 w-80 h-80 bg-pink-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 pointer-events-none"
          animate={{ x: mousePosition.x * -20, y: mousePosition.y * 20 }}
          transition={{ type: "spring", stiffness: 50, damping: 20 }}
        />
        <motion.div
          className="absolute bottom-0 left-1/4 w-72 h-72 bg-blue-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 pointer-events-none"
          animate={{ x: mousePosition.x * 25, y: mousePosition.y * -25 }}
          transition={{ type: "spring", stiffness: 50, damping: 20 }}
        />

        <motion.div
          className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full z-10"
          style={{ y: yHeaderTransform, opacity: opacityHeaderTransform }}
        >
          <div className="grid lg:grid-cols-2 gap-16 items-center py-20">
            <motion.div
              className="space-y-8"
              initial="hidden"
              animate="visible"
              variants={containerVariants}
            >
              {/* Trust Badge Card */}
              <motion.div
                variants={itemVariants}
                className="inline-flex items-center gap-3 bg-white px-6 py-3 rounded-full border border-blue-200 shadow-sm"
                whileHover={{ scale: 1.02, boxShadow: "0 8px 16px rgba(59, 130, 246, 0.05)" }}
              >
                <div className={`w-8 h-8 bg-gradient-to-r ${primaryBrandGradient} rounded-full flex items-center justify-center`}>
                  <Award className="w-5 h-5 text-white" />
                </div>
                <span className="text-gray-700 font-semibold text-sm md:text-base">Trusted by 500,000+ Women Worldwide</span>
              </motion.div>
{/* Main Heading */}
<div className="space-y-6">
  <motion.h1
    variants={itemVariants}
    className="text-5xl md:text-6xl lg:text-7xl font-extrabold text-gray-900 mb-6" // Removed leading-tight, increased mb-6
  >
    Your Smart Safety Companion —{" "}
    <motion.span
      className={`inline-block bg-clip-text text-transparent bg-gradient-to-r  ${primaryBrandGradient}`}
      animate={{
        backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
        filter: ["drop-shadow(0 2px 4px rgba(0,0,0,0.1))", "drop-shadow(0 4px 8px rgba(0,0,0,0.2))", "drop-shadow(0 2px 4px rgba(0,0,0,0.1))"]
      }}
      transition={{ duration: 5, repeat: Infinity, ease: "linear" }}
      // Potentially add explicit line-height here if needed, e.g., style={{ lineHeight: '1.1' }}
    >
      Anytime, Anywhere
    </motion.span>
  </motion.h1>
  <motion.p
    variants={itemVariants}
    className="text-lg md:text-xl text-gray-700 leading-relaxed max-w-2xl"
  >
    Empowering women with <strong>AI-powered safety features</strong>, instant voice SOS alerts, number plate scanning, and smart protection tools. Stay confident, stay safe, stay connected.
  </motion.p>
</div>

              {/* CTA Buttons */}
              <motion.div
                variants={itemVariants}
                className="flex flex-col sm:flex-row gap-4 pt-4"
              >
                <motion.div whileHover={{ scale: 1.03, y: -2 }} whileTap={{ scale: 0.95 }}>
                  <Link
                    to="/get-started"
                    className={`group bg-gradient-to-r ${primaryBrandGradient} text-white px-8 py-4 rounded-full text-lg font-bold hover:shadow-xl hover:shadow-blue-500/30 transition-all duration-300 flex items-center justify-center relative overflow-hidden`}
                  >
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-purple-700 to-pink-700"
                      initial={{ x: "-100%" }}
                      whileHover={{ x: "0%" }}
                      transition={{ duration: 0.3 }}
                    />
                    <span className="relative z-10 flex items-center">
                      <Download className="mr-2 w-5 h-5" />
                      Get Started Free
                      <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </span>
                  </Link>
                </motion.div>
                <motion.div whileHover={{ scale: 1.03, y: -2 }} whileTap={{ scale: 0.95 }}>
                  <Link
                    to="/demo"
                    className="group bg-white text-gray-800 px-8 py-4 rounded-full text-lg font-bold border-2 border-gray-200 hover:border-blue-400 hover:shadow-lg transition-all duration-300 flex items-center justify-center"
                  >
                    <Play className="mr-2 w-5 h-5" />
                    Watch Demo
                  </Link>
                </motion.div>
              </motion.div>
            </motion.div>

            {/* Hero Visual with Feature Cards (Solid background for clarity) */}
            <motion.div
              className="relative hidden lg:block"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 1, ease: "easeOut", delay: 0.3 }}
            >
              <div className="grid grid-cols-2 gap-6">
                {features.slice(0, 4).map((feature, index) => (
                  <motion.div
                    key={index}
                    className="bg-white p-6 rounded-2xl border border-gray-100 shadow-md group relative overflow-hidden"
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7, delay: 0.5 + index * 0.1 }}
                    whileHover={{
                      scale: 1.02,
                      y: -5,
                      boxShadow: "0 15px 30px rgba(0,0,0,0.1)",
                    }}
                  >
                    <motion.div
                      className={`w-16 h-16 bg-gradient-to-br ${feature.gradient} rounded-xl flex items-center justify-center mb-4 shadow-lg`}
                      whileHover={{ scale: 1.05 }}
                      transition={{ duration: 0.3 }}
                    >
                      {feature.icon}
                    </motion.div>
                    <h3 className="font-bold text-gray-900 mb-2 text-lg">{feature.title}</h3>
                    <p className="text-gray-600 text-sm leading-relaxed">{feature.description.substring(0, 80)}...</p>
                  </motion.div>
                ))}
              </div>

              {/* Floating Status Cards (Solid white, clear icons) */}
              <motion.div
                className="absolute -top-6 -right-6 bg-white p-4 rounded-2xl shadow-lg text-gray-800 border border-gray-100"
                animate={{ y: [0, -8, 0], rotate: [0, 1, -1, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                whileHover={{ scale: 1.05 }}
              >
                <div className="flex items-center space-x-2">
                  <Shield className="w-6 h-6 text-emerald-500" />
                  <span className="font-semibold text-base">Active</span>
                </div>
              </motion.div>
              <motion.div
                className="absolute -bottom-4 -left-4 bg-white p-3 rounded-xl shadow-lg text-gray-800 border border-gray-100"
                animate={{ x: [0, 2, -2, 0], rotate: [0, -1, 1, 0] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                whileHover={{ scale: 1.05 }}
              >
                <CheckCircle className="w-6 h-6 text-rose-500" />
              </motion.div>
            </motion.div>
          </div>
        </motion.div>

        {/* Scroll Indicator */}
        <motion.div
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        >
          <div className="flex flex-col items-center text-gray-600">
            <span className="text-sm mb-2">Scroll to explore</span>
            <ChevronDown className="w-6 h-6" />
          </div>
        </motion.div>
      </section>

      {/* --- Trust Indicators Section --- */}
      <section className="py-20 bg-white border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                className={`bg-gradient-to-br ${stat.gradient} p-8 rounded-3xl text-white shadow-xl group relative overflow-hidden`}
                initial={{ opacity: 0, y: 50, scale: 0.9 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ delay: index * 0.1, duration: 0.7 }}
                viewport={{ once: true, amount: 0.4 }}
                whileHover={{
                  scale: 1.03,
                  y: -5,
                  boxShadow: "0 20px 40px rgba(0,0,0,0.2)"
                }}
              >
                <motion.div
                  className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-3xl"
                  initial={{ scale: 0.8 }}
                  whileHover={{ scale: 1 }}
                  transition={{ duration: 0.3 }}
                />
                <div className="text-center relative z-10">
                  <motion.div
                    className="flex justify-center mb-4"
                    whileHover={{ scale: 1.05 }}
                    transition={{ duration: 0.2 }}
                  >
                    <div className="text-white/90">
                      {stat.icon}
                    </div>
                  </motion.div>
                  <motion.div
                    className="text-3xl md:text-4xl font-extrabold mb-2"
                    whileInView={{ scale: [0.9, 1.1, 1] }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                    viewport={{ once: true }}
                  >
                    <AnimatedCounter end={stat.number} suffix={stat.suffix} />
                  </motion.div>
                  <div className="text-white/80 font-medium">{stat.label}</div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* --- Enhanced Features Section --- */}
      <section id="features" className="py-24 bg-gradient-to-b from-gray-50 to-white relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <motion.div
            className="text-center mb-20"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <motion.h2
              className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-6"
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              viewport={{ once: true }}
            >
              Powerful Safety Features
            </motion.h2>
            <motion.p
              className="text-lg md:text-xl text-gray-700 max-w-3xl mx-auto leading-relaxed"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              viewport={{ once: true }}
            >
              Advanced technology meets intuitive design to keep you safe and confident in any situation.
            </motion.p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-2 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                className="group bg-white p-10 rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-300 relative overflow-hidden border border-gray-100 hover:border-blue-300"
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.15, duration: 0.7 }}
                viewport={{ once: true, amount: 0.4 }}
                whileHover={{
                  y: -8,
                  scale: 1.01,
                  boxShadow: "0 25px 50px rgba(0,0,0,0.15)"
                }}
              >
                <motion.div
                  className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-300 rounded-3xl`}
                  initial={{ scale: 0.9 }}
                  whileHover={{ scale: 1 }}
                  transition={{ duration: 0.3 }}
                />
                <div className="relative z-10">
                  <motion.div
                    className={`w-20 h-20 bg-gradient-to-br ${feature.gradient} rounded-3xl flex items-center justify-center mb-6 shadow-lg`}
                    whileHover={{ scale: 1.05 }}
                    transition={{ duration: 0.3 }}
                  >
                    {feature.icon}
                  </motion.div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-4 group-hover:text-gray-800 transition-colors">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed mb-6 group-hover:text-gray-700 transition-colors">
                    {feature.description}
                  </p>
                  <motion.div whileHover={{ x: 5 }} transition={{ duration: 0.2 }}>
                    <Link
                      to={`/feature/${index + 1}`}
                      className={`inline-flex items-center font-bold text-transparent bg-clip-text bg-gradient-to-r ${accentBlue} hover:from-blue-700 hover:to-purple-700 transition-all group/link`}
                    >
                      Learn More
                      <ArrowRight className="ml-2 w-4 h-4 group-hover/link:translate-x-1 transition-transform" />
                    </Link>
                  </motion.div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* --- Enhanced How It Works Section --- */}
      <section id="how-it-works" className="py-24 bg-white relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="text-center mb-20"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-6">How SheRox Works</h2>
            <p className="text-lg md:text-xl text-gray-700 max-w-3xl mx-auto leading-relaxed">
              Simple, intuitive, and always ready when you need it most.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {steps.map((step, index) => (
              <motion.div
                key={index}
                className={`text-center group relative bg-gradient-to-br ${step.gradient} p-8 rounded-3xl text-white shadow-xl`}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.15, duration: 0.7 }}
                viewport={{ once: true, amount: 0.4 }}
                whileHover={{
                  scale: 1.03,
                  y: -8,
                  boxShadow: "0 20px 40px rgba(0,0,0,0.2)"
                }}
              >
                <motion.div
                  className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-3xl"
                  initial={{ scale: 0.8 }}
                  whileHover={{ scale: 1 }}
                  transition={{ duration: 0.3 }}
                />
                <div className="relative z-10">
                  <motion.div
                    className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-6 shadow-md"
                    whileHover={{ scale: 1.1, boxShadow: "0 10px 20px rgba(255,255,255,0.1)" }}
                    transition={{ duration: 0.3 }}
                  >
                    {step.number}
                  </motion.div>
                  <motion.div
                    className="w-20 h-20 flex items-center justify-center bg-white/10 backdrop-blur-sm rounded-full mx-auto mb-6 group-hover:bg-white/15 transition-colors duration-300 shadow-lg"
                    whileHover={{ scale: 1.05, rotate: -2, boxShadow: "0 15px 30px rgba(255,255,255,0.1)" }}
                    transition={{ duration: 0.3 }}
                  >
                    {step.icon}
                  </motion.div>
                  <motion.h3
                    className="text-xl font-bold mb-4"
                    whileHover={{ scale: 1.02 }}
                    transition={{ duration: 0.2 }}
                  >
                    {step.title}
                  </motion.h3>
                  <p className="text-white/90 leading-relaxed">{step.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* --- Enhanced Safety Statistics Section --- */}
      <section className={`py-24 bg-gradient-to-br ${darkBgGradient} relative overflow-hidden`}>
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-6">Making a Real Difference</h2>
            <p className="text-lg md:text-xl text-blue-100 max-w-3xl mx-auto leading-relaxed">
              Real stories, real impact, real safety for women everywhere.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {safetyStats.map((stat, index) => (
              <motion.div
                key={index}
                className="bg-white/10 backdrop-blur-lg p-8 rounded-3xl text-center group border border-white/20 shadow-xl relative overflow-hidden"
                initial={{ opacity: 0, y: 50, scale: 0.9 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ delay: index * 0.1, duration: 0.7 }}
                viewport={{ once: true, amount: 0.4 }}
                whileHover={{
                  scale: 1.03,
                  y: -5,
                  boxShadow: "0 20px 40px rgba(255,255,255,0.15)"
                }}
              >
                <motion.div
                  className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-3xl"
                  initial={{ scale: 0.8 }}
                  whileHover={{ scale: 1 }}
                  transition={{ duration: 0.3 }}
                />
                <motion.div
                  className={`w-16 h-16 bg-gradient-to-br ${stat.gradient} rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg relative z-10`}
                  whileHover={{ scale: 1.1, rotate: 10 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="text-white">{stat.icon}</div>
                </motion.div>
                <motion.div
                  className="text-3xl md:text-4xl font-extrabold text-white mb-2 relative z-10"
                  whileInView={{ scale: [0.9, 1.1, 1] }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <AnimatedCounter end={stat.number} suffix={stat.suffix} />
                </motion.div>
                <div className="text-blue-100 relative z-10 font-medium">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* --- Enhanced Success Stories Section --- */}
      <section className="py-24 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="text-center mb-20"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-6">Success Stories</h2>
            <p className="text-lg md:text-xl text-gray-700 max-w-3xl mx-auto leading-relaxed">
              Real experiences from our users who found safety and confidence with SheRox.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                className="bg-white p-8 rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-300 group border border-gray-100 relative overflow-hidden hover:border-blue-300"
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.7 }}
                viewport={{ once: true, amount: 0.4 }}
                whileHover={{
                  y: -8,
                  boxShadow: "0 25px 50px rgba(0,0,0,0.1)",
                  scale: 1.01
                }}
              >
                <motion.div
                  className={`absolute inset-0 bg-gradient-to-br ${accentBlue} opacity-0 group-hover:opacity-5 transition-opacity duration-300 rounded-3xl`}
                  initial={{ scale: 0.9 }}
                  whileHover={{ scale: 1 }}
                  transition={{ duration: 0.3 }}
                />
                <div className="relative z-10">
                  <div className="flex items-center mb-6">
                    <motion.div
                      className="w-16 h-16 rounded-full overflow-hidden shadow-lg border-2 border-white"
                      whileHover={{ scale: 1.05 }}
                      transition={{ duration: 0.3 }}
                    >
                      <img
                        src={testimonial.image}
                        alt={testimonial.name}
                        className="w-full h-full object-cover"
                      />
                    </motion.div>
                    <div className="ml-4 flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-bold text-gray-900">{testimonial.name}</h4>
                        {testimonial.verified && (
                          <motion.div
                            whileHover={{ scale: 1.1 }}
                            transition={{ duration: 0.3 }}
                          >
                            <CheckCircle className="w-5 h-5 text-blue-500" />
                          </motion.div>
                        )}
                      </div>
                      <p className="text-gray-600 text-sm font-medium">{testimonial.role}</p>
                      <div className="flex items-center gap-1 mt-1">
                        <MapPin className="w-3 h-3 text-gray-400" />
                        <span className="text-xs text-gray-500">{testimonial.location}</span>
                      </div>
                    </div>
                  </div>

                  <motion.p
                    className="text-gray-700 leading-relaxed mb-6"
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    transition={{ delay: 0.3, duration: 0.6 }}
                    viewport={{ once: true }}
                  >
                    "{testimonial.content}"
                  </motion.p>

                  <div className="flex items-center justify-between">
                    <div className="flex">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <motion.div
                          key={i}
                          initial={{ opacity: 0, scale: 0 }}
                          whileInView={{ opacity: 1, scale: 1 }}
                          transition={{ delay: 0.3 + i * 0.05, duration: 0.3 }}
                          viewport={{ once: true }}
                          whileHover={{ scale: 1.1 }}
                        >
                          <Star className="w-5 h-5 text-yellow-400 fill-current" />
                        </motion.div>
                      ))}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                      <UserCheck className="w-4 h-4" />
                      <span>Verified</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* --- Enhanced CTA Section --- */}
      <section className={`py-24 bg-gradient-to-r ${darkBgGradient} relative overflow-hidden`}>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <motion.h2
            className="text-4xl md:text-5xl font-extrabold text-white mb-6"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            Ready to Feel Safer?
          </motion.h2>
          <motion.p
            className="text-lg md:text-xl text-blue-100 mb-12 leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
          >
            Join hundreds of thousands of women who trust SheRox for their daily safety and peace of mind.
          </motion.p>

          <motion.div
            className="flex flex-col sm:flex-row gap-6 justify-center mb-8"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            viewport={{ once: true }}
          >
            <motion.div whileHover={{ scale: 1.05, y: -2 }} whileTap={{ scale: 0.95 }}>
              <Link
                to="/download/ios"
                className="group bg-white text-gray-900 px-8 py-4 rounded-full text-lg font-bold hover:shadow-2xl transition-all duration-300 flex items-center justify-center relative overflow-hidden"
              >
                <motion.div
                  className={`absolute inset-0 bg-gradient-to-r ${accentBlue}`}
                  initial={{ x: "-100%" }}
                  whileHover={{ x: "0%" }}
                  transition={{ duration: 0.3 }}
                />
                <span className="relative z-10 flex items-center">
                  <Smartphone className="mr-3 w-5 h-5" />
                  Download for iOS
                  <ArrowRight className="ml-3 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </span>
              </Link>
            </motion.div>
            <motion.div whileHover={{ scale: 1.05, y: -2 }} whileTap={{ scale: 0.95 }}>
              <Link
                to="/download/android"
                className="group bg-white/10 backdrop-blur-sm text-white border-2 border-white/30 px-8 py-4 rounded-full text-lg font-bold hover:bg-white hover:text-gray-900 transition-all duration-300 flex items-center justify-center"
              >
                <Smartphone className="mr-3 w-5 h-5" />
                Download for Android
                <ArrowRight className="ml-3 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </motion.div>
          </motion.div>

          <motion.p
            className="text-sm text-blue-200"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            viewport={{ once: true }}
          >
            Free download • No credit card required • Available worldwide
          </motion.p>
        </div>
      </section>

      {/* --- Enhanced Floating SOS Button --- */}
      <motion.button
        className="fixed bottom-8 right-8 bg-gradient-to-r from-red-500 to-rose-600 text-white w-16 h-16 rounded-full shadow-2xl hover:shadow-red-500/35 transition-all duration-300 z-50 group flex items-center justify-center"
        onClick={() => alert('Emergency SOS activated! This would trigger real emergency protocols in the actual app.')}
        whileHover={{
          scale: 1.1,
          boxShadow: "0 20px 40px rgba(239, 68, 68, 0.5)"
        }}
        whileTap={{ scale: 0.9 }}
        animate={{
          boxShadow: [
            "0 0 0 0 rgba(239, 68, 68, 0.7)",
            "0 0 0 15px rgba(239, 68, 68, 0)",
            "0 0 0 30px rgba(239, 68, 68, 0)"
          ]
        }}
        transition={{
          boxShadow: {
            duration: 2,
            repeat: Infinity,
            ease: "easeOut"
          }
        }}
      >
        <motion.div
          animate={{ scale: [1, 1.05, 1] }}
          transition={{ duration: 1.2, repeat: Infinity, ease: "easeInOut" }}
        >
          <Mic className="w-6 h-6" />
        </motion.div>
      </motion.button>
    </div>
  );
};

export default Home;