import React, { useState, useEffect, useRef, useCallback } from "react";
import { Shield, Zap, Users, Globe, Award, CheckCircle, Star, Heart, Clock, MapPin, ArrowRight, Sparkles, TrendingUp } from "lucide-react";

const About = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [scrollY, setScrollY] = useState(0);
  const [visibleSections, setVisibleSections] = useState(new Set());
  const [counters, setCounters] = useState({});
  const [isLoaded, setIsLoaded] = useState(false);
  const [hoveredCard, setHoveredCard] = useState(null);
  const [focusedElement, setFocusedElement] = useState(null); // State for accessibility focus
  const observerRef = useRef();
  const sectionRefs = useRef({});
  const animationFrameRef = useRef();
  const counterAnimationsRef = useRef({});
  const statsAnimatedRef = useRef(false); // To ensure stats animate only once

  // Optimized mouse tracking with throttling
  const handleMouseMove = useCallback((e) => {
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }

    animationFrameRef.current = requestAnimationFrame(() => {
      setMousePosition({
        x: (e.clientX / window.innerWidth - 0.5) * 2,
        y: (e.clientY / window.innerHeight - 0.5) * 2,
      });
    });
  }, []); // No dependencies needed as it doesn't rely on state/props

  // Enhanced intersection observer with multiple thresholds
  useEffect(() => {
    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisibleSections((prev) => new Set([...prev, entry.target.id]));
          } else {
            // Optional: Remove from visible sections if not intersecting
            setVisibleSections((prev) => {
              const newSet = new Set(prev);
              newSet.delete(entry.target.id);
              return newSet;
            });
          }
        });
      },
      {
        threshold: [0.1, 0.3, 0.5],
        rootMargin: '50px',
      }
    );

    // Initial observation setup
    for (const id in sectionRefs.current) {
      if (sectionRefs.current[id]) {
        observerRef.current.observe(sectionRefs.current[id]);
      }
    }

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      // Clean up counter animations
      Object.values(counterAnimationsRef.current).forEach((id) => {
        if (id) cancelAnimationFrame(id);
      });
    };
  }, []); // Empty dependency array for observer setup

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('scroll', handleScroll, { passive: true });

    // Staggered load animation
    const timer = setTimeout(() => setIsLoaded(true), 150);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('scroll', handleScroll);
      clearTimeout(timer);
    };
  }, [handleMouseMove]); // handleMouseMove is a useCallback, so it's stable

  // Register sections for observation
  const registerSection = useCallback((id) => (element) => {
    if (element && observerRef.current) {
      element.id = id;
      sectionRefs.current[id] = element;
      observerRef.current.observe(element);
    }
  }, []); // Empty dependency array, as observerRef.current is stable after initial useEffect

  // Enhanced counter animation with easing
  const animateCounter = useCallback((target, duration = 2500) => {
    const start = performance.now();
    const startValue = 0;
    const targetValue = parseInt(target.replace(/[^0-9]/g, ''));

    const easeOutCubic = (t) => 1 - Math.pow(1 - t, 3);

    const animate = (currentTime) => {
      const elapsed = currentTime - start;
      const progress = Math.min(elapsed / duration, 1);
      const easedProgress = easeOutCubic(progress);
      const current = Math.floor(startValue + (targetValue - startValue) * easedProgress);

      setCounters((prev) => ({
        ...prev,
        [target]: current,
      }));

      if (progress < 1) {
        counterAnimationsRef.current[target] = requestAnimationFrame(animate);
      } else {
        // Ensure the final target value is set accurately
        setCounters((prev) => ({
          ...prev,
          [target]: targetValue,
        }));
      }
    };

    counterAnimationsRef.current[target] = requestAnimationFrame(animate);
  }, []); // Empty dependency array, as this function doesn't rely on state/props

  // Start counter animations when stats section is visible
  useEffect(() => {
    if (visibleSections.has('stats') && !statsAnimatedRef.current) {
      ['500K+', '99.9%', '24/7', '85+'].forEach((stat, index) => {
        setTimeout(() => animateCounter(stat), index * 150);
      });
      statsAnimatedRef.current = true; // Set flag to prevent re-animation
    }
  }, [visibleSections, animateCounter]); // Depends on visibleSections and animateCounter

  // Enhanced color palette with more depth
  const primaryBrandGradient = "from-blue-600 via-purple-600 to-pink-600";
  const lightBgGradient = "from-blue-50 via-indigo-50 to-purple-50";
  const darkBgGradient = "from-slate-900 via-purple-900 to-indigo-900";
  const accentBlue = "from-blue-500 to-cyan-500";
  const accentGreen = "from-emerald-500 to-teal-500";
  const accentPink = "from-rose-500 to-pink-500";

  const features = [
    {
      icon: React.createElement(Shield, { className: "w-8 h-8 text-white" }),
      title: "AI-Powered Protection",
      description: "Advanced artificial intelligence continuously monitors your environment and detects potential threats in real-time.",
      gradient: accentBlue,
      delay: 0,
    },
    {
      icon: React.createElement(Zap, { className: "w-8 h-8 text-white" }),
      title: "Instant Response",
      description: "Lightning-fast emergency response system that connects you to help within seconds of activation.",
      gradient: accentGreen,
      delay: 0.1,
    },
    {
      icon: React.createElement(Globe, { className: "w-8 h-8 text-white" }),
      title: "Global Coverage",
      description: "Comprehensive safety network spanning across 85+ countries with local emergency service integration.",
      gradient: accentPink,
      delay: 0.2,
    },
  ];

  const stats = [
    { number: "500K+", label: "Women Protected", icon: React.createElement(Users, { className: "w-6 h-6 text-blue-600" }) },
    { number: "99.9%", label: "Uptime", icon: React.createElement(Clock, { className: "w-6 h-6 text-blue-600" }) },
    { number: "24/7", label: "Monitoring", icon: React.createElement(Shield, { className: "w-6 h-6 text-blue-600" }) },
    { number: "85+", label: "Countries", icon: React.createElement(Globe, { className: "w-6 h-6 text-blue-600" }) },
  ];

  const milestones = [
    {
      year: "2023",
      title: "Hackathon Genesis",
      description: "SheRox was born from a passionate team's vision during a 48-hour hackathon focused on women's safety technology.",
      icon: React.createElement(Award, { className: "w-6 h-6 text-white" }),
      gradient: accentBlue,
    },
    {
      year: "2024",
      title: "AI Integration",
      description: "Revolutionary AI and OCR technology integration, making SheRox the most advanced safety platform available.",
      icon: React.createElement(Zap, { className: "w-6 h-6 text-white" }),
      gradient: accentGreen,
    },
    {
      year: "2025",
      title: "Global Impact",
      description: "Expanding worldwide with 500,000+ users protected and partnerships with emergency services globally.",
      icon: React.createElement(Globe, { className: "w-6 h-6 text-white" }),
      gradient: accentPink,
    },
  ];

  const values = [
    {
      title: "Safety First",
      description: "Every feature is designed with user safety as the absolute priority.",
      icon: React.createElement(Shield, { className: "w-8 h-8 text-white" }),
      gradient: accentBlue,
    },
    {
      title: "Innovation",
      description: "Cutting-edge technology meets intuitive design for seamless protection.",
      icon: React.createElement(Zap, { className: "w-8 h-8 text-white" }),
      gradient: accentGreen,
    },
    {
      title: "Empowerment",
      description: "Giving women confidence and control over their personal safety.",
      icon: React.createElement(Heart, { className: "w-8 h-8 text-white" }),
      gradient: accentPink,
    },
  ];

  return React.createElement(
    "div",
    { className: "bg-white text-gray-900 font-sans overflow-hidden" },

    // Enhanced Hero Section with Fluid 3D Effects
    React.createElement(
      "section",
      {
        className: `relative min-h-screen flex items-center bg-gradient-to-br ${lightBgGradient} overflow-hidden`,
        ref: registerSection('hero'),
        style: { perspective: '1200px', transformStyle: 'preserve-3d' },
      },

      // Enhanced Floating Elements with Physics-based Animation
      React.createElement(
        "div",
        {
          className: "absolute -top-40 -left-40 w-96 h-96 bg-gradient-to-r from-purple-400/30 to-pink-400/30 rounded-full mix-blend-multiply filter blur-3xl pointer-events-none",
          style: {
            transform: `translate3d(${mousePosition.x * 20}px, ${mousePosition.y * 15}px, ${Math.sin(Date.now() * 0.001) * 30}px) rotateX(${mousePosition.y * 15}deg) rotateY(${mousePosition.x * 15}deg)`,
            transition: "transform 0.6s cubic-bezier(0.23, 1, 0.32, 1)",
            animation: "float-complex 15s ease-in-out infinite",
            willChange: 'transform',
          },
        }
      ),
      React.createElement(
        "div",
        {
          className: "absolute top-1/2 -right-40 w-80 h-80 bg-gradient-to-r from-blue-400/30 to-cyan-400/30 rounded-full mix-blend-multiply filter blur-3xl pointer-events-none",
          style: {
            transform: `translate3d(${mousePosition.x * -15}px, ${mousePosition.y * 20}px, ${Math.cos(Date.now() * 0.0015) * 40}px) rotateX(${mousePosition.y * -12}deg) rotateY(${mousePosition.x * -12}deg)`,
            transition: "transform 0.6s cubic-bezier(0.23, 1, 0.32, 1)",
            animation: "float-complex 12s ease-in-out infinite reverse",
            willChange: 'transform',
          },
        }
      ),
      React.createElement(
        "div",
        {
          className: "absolute bottom-0 left-1/4 w-72 h-72 bg-gradient-to-r from-indigo-400/30 to-purple-400/30 rounded-full mix-blend-multiply filter blur-3xl pointer-events-none",
          style: {
            transform: `translate3d(${mousePosition.x * 18}px, ${mousePosition.y * -18}px, ${Math.sin(Date.now() * 0.0012) * 35}px) rotateX(${mousePosition.y * 18}deg) rotateY(${mousePosition.x * 18}deg)`,
            transition: "transform 0.6s cubic-bezier(0.23, 1, 0.32, 1)",
            animation: "float-complex 18s ease-in-out infinite",
            willChange: 'transform',
          },
        }
      ),

      React.createElement(
        "div",
        { className: "relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full z-10" },
        React.createElement(
          "div",
          { className: "grid lg:grid-cols-2 gap-16 items-center py-20" },

          // Enhanced Left content with Magnetic Effects
          React.createElement(
            "div",
            {
              className: `space-y-8 ${isLoaded ? 'animate-slide-up' : 'opacity-0 translate-y-10'}`,
              style: {
                animationDelay: '0.2s',
                transform: `perspective(1000px) rotateY(${mousePosition.x * 2}deg) rotateX(${mousePosition.y * 2}deg)`,
                transition: 'transform 0.5s cubic-bezier(0.23, 1, 0.32, 1)',
                willChange: 'transform',
              },
            },

            // Enhanced Trust Badge with Magnetic Effect
            React.createElement(
              "div",
              {
                className: `inline-flex items-center gap-3 bg-white/80 backdrop-blur-md px-6 py-3 rounded-full border border-white/50 shadow-xl hover:shadow-2xl transition-all duration-700 ${isLoaded ? 'animate-slide-up' : 'opacity-0 translate-y-10'}`,
                style: {
                  animationDelay: '0.4s',
                  transform: `perspective(1000px) rotateX(${mousePosition.y * 3}deg) rotateY(${mousePosition.x * 3}deg) translateZ(${Math.abs(mousePosition.x + mousePosition.y) * 10}px)`,
                  transition: 'transform 0.4s cubic-bezier(0.23, 1, 0.32, 1), box-shadow 0.7s ease',
                  willChange: 'transform',
                },
              },
              React.createElement(
                "div",
                {
                  className: `w-8 h-8 bg-gradient-to-r ${primaryBrandGradient} rounded-full flex items-center justify-center shadow-lg relative overflow-hidden`,
                  style: {
                    transform: `rotateY(${mousePosition.x * 8}deg) rotateX(${mousePosition.y * 8}deg)`,
                    transition: 'transform 0.4s cubic-bezier(0.23, 1, 0.32, 1)',
                    animation: 'pulse-glow 3s ease-in-out infinite',
                  },
                },
                React.createElement(Award, { className: "w-5 h-5 text-white relative z-10" }),
                React.createElement("div", {
                  className: "absolute inset-0 bg-white/20 rounded-full",
                  style: { animation: 'shimmer 2s ease-in-out infinite' },
                })
              ),
              React.createElement("span", { className: "text-gray-700 font-semibold text-sm md:text-base" }, "Born from Innovation")
            ),

            // Enhanced Main Heading with Liquid Animation
            React.createElement(
              "div",
              {
                className: `space-y-6 ${isLoaded ? 'animate-slide-up' : 'opacity-0 translate-y-10'}`,
                style: { animationDelay: '0.6s' },
              },
              React.createElement(
                "h1",
                {
                  className: "text-5xl md:text-6xl lg:text-7xl font-extrabold text-gray-900 mb-6 relative",
                  style: {
                    transform: `perspective(1000px) rotateX(${mousePosition.y * 2}deg) rotateY(${mousePosition.x * 2}deg)`,
                    transition: 'transform 0.5s cubic-bezier(0.23, 1, 0.32, 1)',
                    willChange: 'transform',
                  },
                },
                "About ",
                React.createElement(
                  "span",
                  {
                    className: `inline-block bg-clip-text text-transparent bg-gradient-to-r ${primaryBrandGradient} relative`,
                    style: {
                      backgroundSize: '300% 300%',
                      animation: 'gradient-flow 6s ease-in-out infinite',
                      transform: `rotateY(${mousePosition.x * 5}deg) translateZ(${Math.abs(mousePosition.x) * 20}px)`,
                      transition: 'transform 0.5s cubic-bezier(0.23, 1, 0.32, 1)',
                    },
                  },
                  "SheRox",
                  React.createElement("div", {
                    className: "absolute -inset-1 bg-gradient-to-r from-blue-600/20 to-purple-600/20 rounded-lg blur-lg",
                    style: { animation: 'glow-pulse 4s ease-in-out infinite' },
                  })
                )
              ),
              React.createElement(
                "p",
                {
                  className: "text-lg md:text-xl text-gray-700 leading-relaxed max-w-2xl",
                  style: {
                    transform: `perspective(1000px) rotateX(${mousePosition.y * 1}deg)`,
                    transition: 'transform 0.5s cubic-bezier(0.23, 1, 0.32, 1)',
                  },
                },
                "Born from a hackathon with a powerful mission: to create the world's most advanced safety platform using ",
                React.createElement("strong", { className: "text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600" }, "AI, OCR, and GPS technology"),
                " to protect and empower women everywhere."
              )
            ),

            // Enhanced Stats with Magnetic Hover
            React.createElement(
              "div",
              {
                className: `grid grid-cols-2 gap-6 pt-4 ${isLoaded ? 'animate-slide-up' : 'opacity-0 translate-y-10'}`,
                style: { animationDelay: '0.8s' },
                ref: registerSection('stats'),
              },
              stats.slice(0, 4).map((stat, index) =>
                React.createElement(
                  "div",
                  {
                    key: index,
                    className: `bg-white/80 backdrop-blur-md p-6 rounded-2xl border border-white/50 shadow-xl hover:shadow-2xl transition-all duration-700 text-center group transform-gpu relative overflow-hidden`,
                    style: {
                      animationDelay: `${1 + index * 0.1}s`,
                      animation: visibleSections.has('stats') ? 'bounce-in-elastic 0.8s ease-out forwards' : 'none',
                      transform: `perspective(1000px) rotateX(${mousePosition.y * 2}deg) rotateY(${mousePosition.x * 2}deg) translateZ(${hoveredCard === `stat-${index}` ? 20 : 0}px)`,
                      transition: 'transform 0.4s cubic-bezier(0.23, 1, 0.32, 1), box-shadow 0.7s ease',
                      willChange: 'transform',
                    },
                    onMouseEnter: () => setHoveredCard(`stat-${index}`),
                    onMouseLeave: () => setHoveredCard(null),
                  },
                  // Shimmer effect
                  React.createElement(
                    "div",
                    {
                      className: "absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000",
                      style: { animation: hoveredCard === `stat-${index}` ? 'shimmer-wave 1s ease-out' : 'none' },
                    }
                  ),
                  React.createElement(
                    "div",
                    {
                      className: "flex items-center justify-center mb-3 group-hover:scale-110 transition-transform duration-300 relative z-10",
                      style: {
                        transform: `rotateY(${mousePosition.x * 8}deg) rotateX(${mousePosition.y * 8}deg)`,
                        transition: 'transform 0.4s cubic-bezier(0.23, 1, 0.32, 1)',
                      },
                    },
                    stat.icon
                  ),
                  React.createElement(
                    "div",
                    {
                      className: "text-3xl font-bold text-gray-900 tabular-nums mb-1 relative z-10",
                      style: { transform: hoveredCard === `stat-${index}` ? 'scale(1.1)' : 'scale(1)' },
                    },
                    visibleSections.has('stats') ? (
                      stat.number.includes('K') ? `${counters[stat.number] || 0}K+` :
                      stat.number.includes('%') ? `${counters[stat.number] || 0}.9%` :
                      stat.number.includes('/') ? stat.number :
                      `${counters[stat.number] || 0}+`
                    ) : "0"
                  ),
                  React.createElement(
                    "div",
                    { className: "text-sm text-gray-600 font-medium relative z-10" },
                    stat.label
                  )
                )
              )
            )
          ),

          // Enhanced Right Visual with Magnetic Cards
          React.createElement(
            "div",
            {
              className: `relative hidden lg:block ${isLoaded ? 'animate-slide-left' : 'opacity-0 translate-x-10'}`,
              style: {
                animationDelay: '1s',
                transform: `perspective(1000px) rotateY(${mousePosition.x * -2}deg) rotateX(${mousePosition.y * 2}deg)`,
                transition: 'transform 0.5s cubic-bezier(0.23, 1, 0.32, 1)',
                willChange: 'transform',
              },
            },
            React.createElement(
              "div",
              { className: "grid grid-cols-1 gap-6" },
              features.map((feature, index) =>
                React.createElement(
                  "div",
                  {
                    key: index,
                    className: `bg-white/80 backdrop-blur-md p-6 rounded-2xl border border-white/50 shadow-xl hover:shadow-2xl transition-all duration-700 group relative overflow-hidden transform-gpu`,
                    style: {
                      animationDelay: `${1.2 + feature.delay}s`,
                      animation: isLoaded ? 'slide-in-right 0.8s ease-out forwards' : 'none',
                      transform: `perspective(1000px) rotateX(${mousePosition.y * 2}deg) rotateY(${mousePosition.x * 2}deg) translateZ(${hoveredCard === `feature-${index}` ? 30 : 0}px)`,
                      transition: 'transform 0.4s cubic-bezier(0.23, 1, 0.32, 1), box-shadow 0.7s ease',
                      willChange: 'transform',
                    },
                    onMouseEnter: () => setHoveredCard(`feature-${index}`),
                    onMouseLeave: () => setHoveredCard(null),
                  },
                  React.createElement(
                    "div",
                    {
                      className: "absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000",
                      style: { animation: hoveredCard === `feature-${index}` ? 'shimmer-wave 1s ease-out' : 'none' },
                    }
                  ),
                  React.createElement(
                    "div",
                    {
                      className: `w-16 h-16 bg-gradient-to-br ${feature.gradient} rounded-xl flex items-center justify-center mb-4 shadow-lg relative overflow-hidden`,
                      style: {
                        transform: `rotateY(${mousePosition.x * 12}deg) rotateX(${mousePosition.y * 12}deg) translateZ(${hoveredCard === `feature-${index}` ? 20 : 0}px)`,
                        transition: 'transform 0.4s cubic-bezier(0.23, 1, 0.32, 1)',
                        animation: hoveredCard === `feature-${index}` ? 'icon-bounce 0.6s ease-out' : 'none',
                      },
                    },
                    feature.icon,
                    React.createElement("div", {
                      className: "absolute inset-0 bg-white/20 rounded-xl",
                      style: { animation: hoveredCard === `feature-${index}` ? 'ripple 0.6s ease-out' : 'none' },
                    })
                  ),
                  React.createElement(
                    "h3",
                    {
                      className: "font-bold text-gray-900 mb-2 text-lg group-hover:text-blue-600 transition-colors duration-300",
                      style: { transform: hoveredCard === `feature-${index}` ? 'translateY(-2px)' : 'translateY(0)' },
                    },
                    feature.title
                  ),
                  React.createElement(
                    "p",
                    { className: "text-gray-600 text-sm leading-relaxed" },
                    feature.description
                  )
                )
              )
            )
          )
        )
      )
    ),

    // Enhanced Mission Section with Parallax
    React.createElement(
      "section",
      {
        className: "py-24 bg-gradient-to-b from-white to-gray-50 relative overflow-hidden",
        ref: registerSection('mission'),
        style: {
          perspective: '1200px',
          transform: `translateY(${scrollY * 0.1}px)`,
          transition: 'transform 0.1s ease-out',
        },
      },
      React.createElement(
        "div",
        { className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10" },
        React.createElement(
          "div",
          {
            className: `text-center mb-16 ${visibleSections.has('mission') ? 'animate-slide-up' : 'opacity-0 translate-y-10'}`,
            style: {
              animationDelay: '0.2s',
              transform: `perspective(1000px) rotateX(${mousePosition.y * 1}deg)`,
              transition: 'transform 0.5s cubic-bezier(0.23, 1, 0.32, 1)',
            },
          },
          React.createElement(
            "h2",
            { className: "text-4xl md:text-5xl font-extrabold text-gray-900 mb-6" },
            "Our Mission"
          ),
          React.createElement(
            "p",
            { className: "text-lg md:text-xl text-gray-700 max-w-4xl mx-auto leading-relaxed" },
            "To create a world where every woman feels safe, confident, and empowered through innovative technology that provides instant protection and peace of mind in any situation."
          )
        ),

        React.createElement(
          "div",
          { className: "grid md:grid-cols-3 gap-8 mb-6" },
          values.map((value, index) =>
            React.createElement(
              "div",
              {
                key: index,
                className: `group bg-white/80 backdrop-blur-md p-8 rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-700 border border-white/50 hover:border-blue-300/50 transform-gpu relative overflow-hidden ${visibleSections.has('mission') ? 'animate-slide-up' : 'opacity-0 translate-y-10'}`,
                style: {
                  animationDelay: `${0.4 + index * 0.2}s`,
                  transform: `perspective(1000px) rotateX(${mousePosition.y * 2}deg) rotateY(${mousePosition.x * 2}deg) translateZ(${hoveredCard === `value-${index}` ? 30 : 0}px)`,
                  transition: 'transform 0.4s cubic-bezier(0.23, 1, 0.32, 1), box-shadow 0.7s ease',
                  willChange: 'transform',
                },
                onMouseEnter: () => setHoveredCard(`value-${index}`),
                onMouseLeave: () => setHoveredCard(null),
              },
              React.createElement(
                "div",
                {
                  className: "absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000",
                  style: { animation: hoveredCard === `value-${index}` ? 'shimmer-wave 1s ease-out' : 'none' },
                }
              ),
              React.createElement(
                "div",
                {
                  className: `w-20 h-20 bg-gradient-to-br ${value.gradient} rounded-3xl flex items-center justify-center mb-6 shadow-lg relative overflow-hidden`,
                  style: {
                    transform: `rotateY(${mousePosition.x * 12}deg) rotateX(${mousePosition.y * 12}deg) translateZ(${hoveredCard === `value-${index}` ? 20 : 0}px)`,
                    transition: 'transform 0.4s cubic-bezier(0.23, 1, 0.32, 1)',
                    animation: hoveredCard === `value-${index}` ? 'icon-bounce 0.6s ease-out' : 'none',
                  },
                },
                value.icon,
                React.createElement("div", {
                  className: "absolute inset-0 bg-white/20 rounded-3xl",
                  style: { animation: hoveredCard === `value-${index}` ? 'ripple 0.6s ease-out' : 'none' },
                })
              ),
              React.createElement(
                "h3",
                {
                  className: "text-2xl font-bold text-gray-900 mb-4 group-hover:text-blue-600 transition-colors duration-300",
                  style: { transform: hoveredCard === `value-${index}` ? 'translateY(-2px)' : 'translateY(0)' },
                },
                value.title
              ),
              React.createElement(
                "p",
                { className: "text-gray-600 leading-relaxed" },
                value.description
              )
            )
          )
        )
      )
    ),

    // Enhanced Journey Section with Timeline Animation
    React.createElement(
      "section",
      {
        className: `py-24 bg-gradient-to-br ${darkBgGradient} relative overflow-hidden`,
        ref: registerSection('journey'),
        style: { perspective: '1200px' },
      },
      React.createElement("div", { className: "absolute inset-0 bg-black/20" }),
      React.createElement(
        "div",
        { className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10" },
        React.createElement(
          "div",
          {
            className: `text-center mb-16 ${visibleSections.has('journey') ? 'animate-slide-up' : 'opacity-0 translate-y-10'}`,
            style: {
              animationDelay: '0.2s',
              transform: `perspective(1000px) rotateX(${mousePosition.y * 1}deg)`,
              transition: 'transform 0.5s cubic-bezier(0.23, 1, 0.32, 1)',
            },
          },
          React.createElement(
            "h2",
            { className: "text-4xl md:text-5xl font-extrabold text-white mb-6" },
            "Our Journey"
          ),
          React.createElement(
            "p",
            { className: "text-lg md:text-xl text-blue-100 max-w-3xl mx-auto leading-relaxed" },
            "From hackathon idea to global safety platform - the story of innovation and impact."
          )
        ),

        React.createElement(
          "div",
          { className: "space-y-8" },
          milestones.map((milestone, index) =>
            React.createElement(
              "div",
              {
                key: index,
                className: `bg-white/10 backdrop-blur-lg p-8 rounded-3xl border border-white/20 shadow-xl hover:shadow-2xl transition-all duration-700 transform-gpu relative overflow-hidden ${visibleSections.has('journey') ? 'animate-slide-in' : 'opacity-0 translate-x-10'}`,
                style: {
                  animationDelay: `${0.4 + index * 0.3}s`,
                  transform: `perspective(1000px) rotateX(${mousePosition.y * 2}deg) rotateY(${mousePosition.x * 2}deg) translateZ(${hoveredCard === `milestone-${index}` ? 30 : 0}px)`,
                  transition: 'transform 0.4s cubic-bezier(0.23, 1, 0.32, 1), box-shadow 0.7s ease',
                  willChange: 'transform',
                },
                onMouseEnter: () => setHoveredCard(`milestone-${index}`),
                onMouseLeave: () => setHoveredCard(null),
              },
              React.createElement(
                "div",
                {
                  className: "absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000",
                  style: { animation: hoveredCard === `milestone-${index}` ? 'shimmer-wave 1s ease-out' : 'none' },
                }
              ),
              React.createElement(
                "div",
                { className: "flex items-center gap-6" },
                React.createElement(
                  "div",
                  {
                    className: `w-16 h-16 bg-gradient-to-br ${milestone.gradient} rounded-full flex items-center justify-center shadow-lg relative overflow-hidden`,
                    style: {
                      transform: `rotateY(${mousePosition.x * 15}deg) rotateX(${mousePosition.y * 15}deg) translateZ(${hoveredCard === `milestone-${index}` ? 20 : 0}px)`,
                      transition: 'transform 0.4s cubic-bezier(0.23, 1, 0.32, 1)',
                      animation: hoveredCard === `milestone-${index}` ? 'icon-bounce 0.6s ease-out' : 'none',
                    },
                  },
                  milestone.icon,
                  React.createElement("div", {
                    className: "absolute inset-0 bg-white/20 rounded-full",
                    style: { animation: hoveredCard === `milestone-${index}` ? 'ripple 0.6s ease-out' : 'none' },
                  })
                ),
                React.createElement(
                  "div",
                  { className: "flex-1" },
                  React.createElement(
                    "div",
                    { className: "flex items-center gap-4 mb-2" },
                    React.createElement(
                      "span",
                      {
                        className: "text-2xl font-bold text-white tabular-nums",
                        style: { transform: hoveredCard === `milestone-${index}` ? 'scale(1.1)' : 'scale(1)' },
                      },
                      milestone.year
                    ),
                    React.createElement(
                      "h3",
                      {
                        className: "text-xl font-bold text-white",
                        style: { transform: hoveredCard === `milestone-${index}` ? 'translateY(-2px)' : 'translateY(0)' },
                      },
                      milestone.title
                    )
                  ),
                  React.createElement(
                    "p",
                    { className: "text-blue-100 leading-relaxed" },
                    milestone.description
                  )
                )
              )
            )
          )
        )
      )
    ),

    // Enhanced Technology Section
    React.createElement(
      "section",
      {
        className: "py-24 bg-gradient-to-b from-gray-50 to-white relative overflow-hidden",
        ref: registerSection('technology'),
        style: { perspective: '1200px' },
      },
      React.createElement(
        "div",
        { className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10" },
        React.createElement(
          "div",
          {
            className: `text-center mb-16 ${visibleSections.has('technology') ? 'animate-slide-up' : 'opacity-0 translate-y-10'}`,
            style: {
              animationDelay: '0.2s',
              transform: `perspective(1000px) rotateX(${mousePosition.y * 1}deg)`,
              transition: 'transform 0.5s cubic-bezier(0.23, 1, 0.32, 1)',
            },
          },
          React.createElement(
            "h2",
            { className: "text-4xl md:text-5xl font-extrabold text-gray-900 mb-6" },
            "Powered by Innovation"
          ),
          React.createElement(
            "p",
            { className: "text-lg md:text-xl text-gray-700 max-w-3xl mx-auto leading-relaxed" },
            "Cutting-edge technology stack designed for reliability, speed, and user safety."
          )
        ),

        React.createElement(
          "div",
          { className: "grid md:grid-cols-3 gap-8" },
          [
            {
              title: "Artificial Intelligence",
              description: "Advanced machine learning algorithms analyze patterns, detect threats, and provide predictive safety insights in real-time.",
              icon: React.createElement(Zap, { className: "w-8 h-8 text-white" }),
              gradient: accentBlue,
            },
            {
              title: "OCR Technology",
              description: "Optical Character Recognition enables instant document verification, license plate scanning, and identity confirmation.",
              icon: React.createElement(Shield, { className: "w-8 h-8 text-white" }),
              gradient: accentGreen,
            },
            {
              title: "GPS Integration",
              description: "Precision location tracking with real-time monitoring for immediate emergency response and route optimization.",
              icon: React.createElement(MapPin, { className: "w-8 h-8 text-white" }),
              gradient: accentPink,
            },
          ].map((tech, index) =>
            React.createElement(
              "div",
              {
                key: index,
                className: `group bg-white/80 backdrop-blur-md p-10 rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-700 border border-white/50 hover:border-blue-300/50 transform-gpu relative overflow-hidden ${visibleSections.has('technology') ? 'animate-slide-up' : 'opacity-0 translate-y-10'}`,
                style: {
                  animationDelay: `${0.4 + index * 0.2}s`,
                  transform: `perspective(1000px) rotateX(${mousePosition.y * 2}deg) rotateY(${mousePosition.x * 2}deg) translateZ(${hoveredCard === `tech-${index}` ? 30 : 0}px)`,
                  transition: 'transform 0.4s cubic-bezier(0.23, 1, 0.32, 1), box-shadow 0.7s ease',
                  willChange: 'transform',
                },
                onMouseEnter: () => setHoveredCard(`tech-${index}`),
                onMouseLeave: () => setHoveredCard(null),
              },
              React.createElement(
                "div",
                {
                  className: "absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000",
                  style: { animation: hoveredCard === `tech-${index}` ? 'shimmer-wave 1s ease-out' : 'none' },
                }
              ),
              React.createElement(
                "div",
                {
                  className: `w-20 h-20 bg-gradient-to-br ${tech.gradient} rounded-3xl flex items-center justify-center mb-6 shadow-lg relative overflow-hidden`,
                  style: {
                    transform: `rotateY(${mousePosition.x * 12}deg) rotateX(${mousePosition.y * 12}deg) translateZ(${hoveredCard === `tech-${index}` ? 20 : 0}px)`,
                    transition: 'transform 0.4s cubic-bezier(0.23, 1, 0.32, 1)',
                    animation: hoveredCard === `tech-${index}` ? 'icon-bounce 0.6s ease-out' : 'none',
                  },
                },
                tech.icon,
                React.createElement("div", {
                  className: "absolute inset-0 bg-white/20 rounded-3xl",
                  style: { animation: hoveredCard === `tech-${index}` ? 'ripple 0.6s ease-out' : 'none' },
                })
              ),
              React.createElement(
                "h3",
                {
                  className: "text-2xl font-bold text-gray-900 mb-4 group-hover:text-blue-600 transition-colors duration-300",
                  style: { transform: hoveredCard === `tech-${index}` ? 'translateY(-2px)' : 'translateY(0)' },
                },
                tech.title
              ),
              React.createElement(
                "p",
                { className: "text-gray-600 leading-relaxed" },
                tech.description
              )
            )
          )
        )
      )
    ),

    // Enhanced Impact Section with Animated Stats
    React.createElement(
      "section",
      {
        className: "py-24 bg-white relative overflow-hidden",
        ref: registerSection('impact'),
        style: { perspective: '1200px' },
      },
      React.createElement(
        "div",
        { className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10" },
        React.createElement(
          "div",
          {
            className: `text-center mb-16 ${visibleSections.has('impact') ? 'animate-slide-up' : 'opacity-0 translate-y-10'}`,
            style: {
              animationDelay: '0.2s',
              transform: `perspective(1000px) rotateX(${mousePosition.y * 1}deg)`,
              transition: 'transform 0.5s cubic-bezier(0.23, 1, 0.32, 1)',
            },
          },
          React.createElement(
            "h2",
            { className: "text-4xl md:text-5xl font-extrabold text-gray-900 mb-6" },
            "Global Impact"
          ),
          React.createElement(
            "p",
            { className: "text-lg md:text-xl text-gray-700 max-w-3xl mx-auto leading-relaxed" },
            "Making a real difference in women's safety across the globe."
          )
        ),

        React.createElement(
          "div",
          { className: "grid grid-cols-2 md:grid-cols-4 gap-8" },
          [
            { number: "500K+", label: "Women Protected", icon: React.createElement(Users, { className: "w-8 h-8 text-white" }), gradient: accentBlue },
            { number: "99.9%", label: "Response Rate", icon: React.createElement(Zap, { className: "w-8 h-8 text-white" }), gradient: accentGreen },
            { number: "24/7", label: "Monitoring", icon: React.createElement(Clock, { className: "w-8 h-8 text-white" }), gradient: accentPink },
            { number: "85+", label: "Countries", icon: React.createElement(Globe, { className: "w-8 h-8 text-white" }), gradient: accentBlue },
          ].map((stat, index) =>
            React.createElement(
              "div",
              {
                key: index,
                className: `bg-gradient-to-br ${stat.gradient} p-8 rounded-3xl text-white shadow-xl hover:shadow-2xl text-center transition-all duration-700 group transform-gpu relative overflow-hidden ${visibleSections.has('impact') ? 'animate-bounce-in-elastic' : 'opacity-0 scale-95'}`,
                style: {
                  animationDelay: `${0.4 + index * 0.1}s`,
                  transform: `perspective(1000px) rotateX(${mousePosition.y * 2}deg) rotateY(${mousePosition.x * 2}deg) translateZ(${hoveredCard === `impact-${index}` ? 30 : 0}px)`,
                  transition: 'transform 0.4s cubic-bezier(0.23, 1, 0.32, 1), box-shadow 0.7s ease',
                  willChange: 'transform',
                },
                onMouseEnter: () => setHoveredCard(`impact-${index}`),
                onMouseLeave: () => setHoveredCard(null),
              },
              React.createElement(
                "div",
                {
                  className: "absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000",
                  style: { animation: hoveredCard === `impact-${index}` ? 'shimmer-wave 1s ease-out' : 'none' },
                }
              ),
              React.createElement(
                "div",
                {
                  className: "flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300 relative z-10",
                  style: {
                    transform: `rotateY(${mousePosition.x * 12}deg) rotateX(${mousePosition.y * 12}deg)`,
                    transition: 'transform 0.4s cubic-bezier(0.23, 1, 0.32, 1)',
                    animation: hoveredCard === `impact-${index}` ? 'icon-bounce 0.6s ease-out' : 'none',
                  },
                },
                stat.icon
              ),
              React.createElement(
                "div",
                {
                  className: "text-3xl md:text-4xl font-extrabold mb-2 text-center tabular-nums relative z-10",
                  style: { transform: hoveredCard === `impact-${index}` ? 'scale(1.1)' : 'scale(1)' },
                },
                stat.number
              ),
              React.createElement(
                "div",
                { className: "text-white/90 font-medium text-center relative z-10" },
                stat.label
              )
            )
          )
        )
      )
    ),

    // Enhanced CTA Section with Magnetic Buttons
    React.createElement(
      "section",
      {
        className: `py-24 bg-gradient-to-r ${darkBgGradient} relative overflow-hidden`,
        ref: registerSection('cta'),
        style: { perspective: '1200px' },
      },
      React.createElement("div", { className: "absolute inset-0 bg-black/20" }),
      React.createElement(
        "div",
        { className: "max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10" },
        React.createElement(
          "h2",
          {
            className: `text-4xl md:text-5xl font-extrabold text-white mb-6 ${visibleSections.has('cta') ? 'animate-slide-up' : 'opacity-0 translate-y-10'}`,
            style: {
              animationDelay: '0.2s',
              transform: `perspective(1000px) rotateX(${mousePosition.y * 1}deg)`,
              transition: 'transform 0.5s cubic-bezier(0.23, 1, 0.32, 1)',
            },
          },
          "Join Our Mission"
        ),
        React.createElement(
          "p",
          {
            className: `text-lg md:text-xl text-blue-100 mb-12 leading-relaxed ${visibleSections.has('cta') ? 'animate-slide-up' : 'opacity-0 translate-y-10'}`,
            style: {
              animationDelay: '0.4s',
              transform: `perspective(1000px) rotateX(${mousePosition.y * 0.5}deg)`,
              transition: 'transform 0.5s cubic-bezier(0.23, 1, 0.32, 1)',
            },
          },
          "Be part of the movement that's making the world safer for women everywhere."
        ),
        React.createElement(
          "div",
          {
            className: `flex flex-col sm:flex-row gap-6 justify-center ${visibleSections.has('cta') ? 'animate-slide-up' : 'opacity-0 translate-y-10'}`,
            style: { animationDelay: '0.6s' },
          },
          React.createElement(
            "button",
            {
              className: "group bg-white text-gray-900 px-8 py-4 rounded-full text-lg font-bold hover:shadow-2xl transition-all duration-500 flex items-center justify-center transform-gpu relative overflow-hidden",
              style: {
                transform: `perspective(1000px) rotateX(${mousePosition.y * 3}deg) rotateY(${mousePosition.x * 3}deg) translateZ(${hoveredCard === 'cta-primary' ? 30 : 0}px)`,
                transition: 'transform 0.4s cubic-bezier(0.23, 1, 0.32, 1)',
                animation: 'button-glow 3s ease-in-out infinite',
              },
              onMouseEnter: () => setHoveredCard('cta-primary'),
              onMouseLeave: () => setHoveredCard(null),
              onFocus: () => setFocusedElement('cta-primary'),
              onBlur: () => setFocusedElement(null),
            },
            React.createElement("div", {
              className: "absolute inset-0 bg-gradient-to-r from-transparent via-gray-200/30 to-transparent transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000",
            }),
            React.createElement(Shield, { className: "mr-3 w-5 h-5 group-hover:scale-110 transition-transform duration-300 relative z-10" }),
            React.createElement("span", { className: "relative z-10" }, "Download SheRox"),
            React.createElement(ArrowRight, { className: "ml-3 w-5 h-5 group-hover:translate-x-1 transition-transform duration-300 relative z-10" })
          ),
          React.createElement(
            "button",
            {
              className: "group bg-white/10 backdrop-blur-md text-white border-2 border-white/30 px-8 py-4 rounded-full text-lg font-bold hover:bg-white hover:text-gray-900 transition-all duration-500 flex items-center justify-center transform-gpu relative overflow-hidden",
              style: {
                transform: `perspective(1000px) rotateX(${mousePosition.y * 3}deg) rotateY(${mousePosition.x * -3}deg) translateZ(${hoveredCard === 'cta-secondary' ? 30 : 0}px)`,
                transition: 'transform 0.4s cubic-bezier(0.23, 1, 0.32, 1)',
              },
              onMouseEnter: () => setHoveredCard('cta-secondary'),
              onMouseLeave: () => setHoveredCard(null),
              onFocus: () => setFocusedElement('cta-secondary'),
              onBlur: () => setFocusedElement(null),
            },
            React.createElement("div", {
              className: "absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000",
            }),
            React.createElement(Heart, { className: "mr-3 w-5 h-5 group-hover:scale-110 transition-transform duration-300 relative z-10" }),
            React.createElement("span", { className: "relative z-10" }, "Learn More")
          )
        )
      )
    ),

    // Enhanced CSS animations with fluid physics
    React.createElement(
      "style",
      null,
      `
        @keyframes float-complex {
          0%, 100% {
            transform: translateY(0px) translateZ(0px) rotateX(0deg) rotateY(0deg) scale(1);
          }
          25% {
            transform: translateY(-20px) translateZ(15px) rotateX(8deg) rotateY(8deg) scale(1.05);
          }
          50% {
            transform: translateY(-10px) translateZ(-10px) rotateX(-5deg) rotateY(-5deg) scale(0.95);
          }
          75% {
            transform: translateY(-25px) translateZ(20px) rotateX(10deg) rotateY(-10deg) scale(1.02);
          }
        }

        @keyframes gradient-flow {
          0% { background-position: 0% 50%; }
          25% { background-position: 100% 50%; }
          50% { background-position: 100% 100%; }
          75% { background-position: 0% 100%; }
          100% { background-position: 0% 50%; }
        }

        @keyframes slide-up {
          from {
            opacity: 0;
            transform: translateY(30px) translateZ(-20px) rotateX(15deg) scale(0.95);
          }
          to {
            opacity: 1;
            transform: translateY(0) translateZ(0px) rotateX(0deg) scale(1);
          }
        }

        @keyframes slide-left {
          from {
            opacity: 0;
            transform: translateX(30px) translateZ(-20px) rotateY(15deg) scale(0.95);
          }
          to {
            opacity: 1;
            transform: translateX(0) translateZ(0px) rotateY(0deg) scale(1);
          }
        }

        @keyframes slide-in-right {
          from {
            opacity: 0;
            transform: translateX(40px) translateZ(-30px) rotateY(20deg) scale(0.9);
          }
          to {
            opacity: 1;
            transform: translateX(0) translateZ(0px) rotateY(0deg) scale(1);
          }
        }

        @keyframes slide-in {
          from {
            opacity: 0;
            transform: translateX(-40px) translateZ(-30px) rotateY(-20deg) scale(0.9);
          }
          to {
            opacity: 1;
            transform: translateX(0) translateZ(0px) rotateY(0deg) scale(1);
          }
        }

        @keyframes bounce-in-elastic {
          0% {
            opacity: 0;
            transform: scale(0.8) translateY(20px) translateZ(-30px) rotateX(20deg);
          }
          50% {
            transform: scale(1.05) translateY(-5px) translateZ(10px) rotateX(-5deg);
          }
          70% {
            transform: scale(0.98) translateY(2px) translateZ(-5px) rotateX(2deg);
          }
          100% {
            opacity: 1;
            transform: scale(1) translateY(0) translateZ(0px) rotateX(0deg);
          }
        }

        @keyframes pulse-glow {
          0%, 100% {
            box-shadow: 0 0 0 0 rgba(59, 130, 246, 0.4), 0 0 20px rgba(59, 130, 246, 0.2);
          }
          50% {
            box-shadow: 0 0 0 10px rgba(59, 130, 246, 0), 0 0 30px rgba(59, 130, 246, 0.4);
          }
        }

        @keyframes shimmer {
          0% { transform: translateX(-100%) skewX(-15deg); opacity: 0; }
          50% { opacity: 1; }
          100% { transform: translateX(100%) skewX(-15deg); opacity: 0; }
        }

        @keyframes shimmer-wave {
          0% { transform: translateX(-100%) skewX(-15deg); }
          100% { transform: translateX(200%) skewX(-15deg); }
        }

        @keyframes icon-bounce {
          0%, 100% { transform: scale(1) rotateY(0deg); }
          50% { transform: scale(1.1) rotateY(180deg); }
        }

        @keyframes ripple {
          0% { transform: scale(0.8); opacity: 1; }
          100% { transform: scale(2); opacity: 0; }
        }

        @keyframes button-glow {
          0%, 100% {
            box-shadow: 0 0 20px rgba(255, 255, 255, 0.3);
          }
          50% {
            box-shadow: 0 0 40px rgba(255, 255, 255, 0.6), 0 0 60px rgba(255, 255, 255, 0.2);
          }
        }

        @keyframes glow-pulse {
          0%, 100% { opacity: 0.5; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.05); }
        }

        .animate-slide-up {
          animation: slide-up 0.8s cubic-bezier(0.23, 1, 0.32, 1) forwards;
        }

        .animate-slide-left {
          animation: slide-left 0.8s cubic-bezier(0.23, 1, 0.32, 1) forwards;
        }

        .animate-slide-in-right {
          animation: slide-in-right 0.8s cubic-bezier(0.23, 1, 0.32, 1) forwards;
        }

        .animate-slide-in {
          animation: slide-in 0.8s cubic-bezier(0.23, 1, 0.32, 1) forwards;
        }

        .animate-bounce-in-elastic {
          animation: bounce-in-elastic 1s cubic-bezier(0.23, 1, 0.32, 1) forwards;
        }

        .transform-gpu {
          transform-style: preserve-3d;
          backface-visibility: hidden;
          will-change: transform;
        }

        /* Performance optimizations */
        * {
          -webkit-font-smoothing: antialiased;
          -moz-osx-font-smoothing: grayscale;
        }

        .backdrop-blur-md {
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
        }

        .backdrop-blur-lg {
          backdrop-filter: blur(16px);
          -webkit-backdrop-filter: blur(16px);
        }
      `
    )
  );
};

export default About;