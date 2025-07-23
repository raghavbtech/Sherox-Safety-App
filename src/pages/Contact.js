import React, { useState, useEffect, useRef, useCallback } from "react";
import { Mail, Instagram, Phone, MapPin, Send, MessageCircle, Clock, Globe, Shield, Heart, Star, CheckCircle, ArrowRight, Sparkles, TrendingUp } from "lucide-react";

const Contact = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [visibleSections, setVisibleSections] = useState(new Set());
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [focusedInput, setFocusedInput] = useState(null);
  const [hoveredCard, setHoveredCard] = useState(null);
  const observerRef = useRef();
  const sectionRefs = useRef({});
  const animationFrameRef = useRef();

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
  }, []);

  // Enhanced intersection observer
  useEffect(() => {
    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisibleSections(prev => new Set([...prev, entry.target.id]));
          }
        });
      },
      { 
        threshold: [0.1, 0.3, 0.5], 
        rootMargin: '50px',
      }
    );

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []);

  useEffect(() => {
    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    
    // Staggered load animation
    const timer = setTimeout(() => setIsLoaded(true), 150);
    
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      clearTimeout(timer);
    };
  }, [handleMouseMove]);

  // Register sections for observation
  const registerSection = (id) => (element) => {
    if (element && observerRef.current) {
      element.id = id;
      sectionRefs.current[id] = element;
      observerRef.current.observe(element);
    }
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Enhanced loading simulation with progress
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setIsSubmitting(false);
    setFormData({ name: '', email: '', subject: '', message: '' });
    
    // Success animation trigger
    alert('Message sent successfully!');
  };

  // Enhanced color palette with more depth
  const primaryBrandGradient = "from-blue-600 via-purple-600 to-pink-600";
  const lightBgGradient = "from-blue-50 via-indigo-50 to-purple-50";
  const darkBgGradient = "from-slate-900 via-purple-900 to-indigo-900";
  const accentBlue = "from-blue-500 to-cyan-500";
  const accentGreen = "from-emerald-500 to-teal-500";
  const accentPink = "from-rose-500 to-pink-500";

  const contactMethods = [
    {
      icon: React.createElement(Mail, { className: "w-8 h-8 text-white" }),
      title: "Email Support",
      value: "support@sherox.com",
      description: "Get help within 24 hours",
      gradient: accentBlue,
      link: "mailto:support@sherox.com",
      delay: 0
    },
    {
      icon: React.createElement(Instagram, { className: "w-8 h-8 text-white" }),
      title: "Instagram",
      value: "@sherox.safe",
      description: "Follow us for updates",
      gradient: accentPink,
      link: "https://instagram.com/sherox.safe",
      delay: 0.1
    },
    {
      icon: React.createElement(Phone, { className: "w-8 h-8 text-white" }),
      title: "Emergency Line",
      value: "+1 (555) 911-SAFE",
      description: "24/7 emergency support",
      gradient: accentGreen,
      link: "tel:+15559117233",
      delay: 0.2
    }
  ];

  const supportHours = [
    { day: "Monday - Friday", hours: "9:00 AM - 6:00 PM EST" },
    { day: "Saturday", hours: "10:00 AM - 4:00 PM EST" },
    { day: "Sunday", hours: "Emergency support only" },
    { day: "Holidays", hours: "Emergency support only" }
  ];

  const quickLinks = [
    { title: "Help Center", description: "Find answers to common questions", icon: MessageCircle },
    { title: "Safety Tips", description: "Learn how to stay safe", icon: Shield },
    { title: "App Tutorial", description: "Get started with SheRox", icon: Star },
    { title: "Community", description: "Join our safety community", icon: Heart }
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
        style: { 
          perspective: '1200px',
          transformStyle: 'preserve-3d'
        }
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
            willChange: 'transform'
          }
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
            willChange: 'transform'
          }
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
            willChange: 'transform'
          }
        }
      ),

      React.createElement(
        "div",
        { className: "relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full z-10" },
        React.createElement(
          "div",
          { className: "text-center py-20" },
          
          // Enhanced Trust Badge with Magnetic Effect
          React.createElement(
            "div",
            { 
              className: `inline-flex items-center gap-3 bg-white/80 backdrop-blur-md px-6 py-3 rounded-full border border-white/50 shadow-xl hover:shadow-2xl transition-all duration-700 mb-8 ${isLoaded ? 'animate-slide-up' : 'opacity-0 translate-y-10'}`,
              style: { 
                animationDelay: '0.2s',
                transform: `perspective(1000px) rotateX(${mousePosition.y * 3}deg) rotateY(${mousePosition.x * 3}deg) translateZ(${Math.abs(mousePosition.x + mousePosition.y) * 10}px)`,
                transition: 'transform 0.4s cubic-bezier(0.23, 1, 0.32, 1), box-shadow 0.7s ease',
                willChange: 'transform'
              }
            },
            React.createElement(
              "div",
              { 
                className: `w-8 h-8 bg-gradient-to-r ${primaryBrandGradient} rounded-full flex items-center justify-center shadow-lg relative overflow-hidden`,
                style: {
                  transform: `rotateY(${mousePosition.x * 8}deg) rotateX(${mousePosition.y * 8}deg)`,
                  transition: 'transform 0.4s cubic-bezier(0.23, 1, 0.32, 1)',
                  animation: 'pulse-glow 3s ease-in-out infinite'
                }
              },
              React.createElement(Shield, { className: "w-5 h-5 text-white relative z-10" }),
              React.createElement("div", { 
                className: "absolute inset-0 bg-white/20 rounded-full",
                style: { animation: 'shimmer 2s ease-in-out infinite' }
              })
            ),
            React.createElement("span", { className: "text-gray-700 font-semibold text-sm md:text-base" }, "24/7 Support Available")
          ),

          // Enhanced Main Heading with Liquid Animation
          React.createElement(
            "div",
            { 
              className: `space-y-6 mb-12 ${isLoaded ? 'animate-slide-up' : 'opacity-0 translate-y-10'}`,
              style: { animationDelay: '0.4s' }
            },
            React.createElement(
              "h1",
              { 
                className: "text-5xl md:text-6xl lg:text-7xl font-extrabold text-gray-900 mb-6 relative",
                style: {
                  transform: `perspective(1000px) rotateX(${mousePosition.y * 2}deg) rotateY(${mousePosition.x * 2}deg)`,
                  transition: 'transform 0.5s cubic-bezier(0.23, 1, 0.32, 1)',
                  willChange: 'transform'
                }
              },
              "Get in ",
              React.createElement(
                "span",
                { 
                  className: `inline-block bg-clip-text text-transparent bg-gradient-to-r ${primaryBrandGradient} relative`,
                  style: {
                    backgroundSize: '300% 300%',
                    animation: 'gradient-flow 6s ease-in-out infinite',
                    transform: `rotateY(${mousePosition.x * 5}deg) translateZ(${Math.abs(mousePosition.x) * 20}px)`,
                    transition: 'transform 0.5s cubic-bezier(0.23, 1, 0.32, 1)'
                  }
                },
                "Touch",
                React.createElement("div", {
                  className: "absolute -inset-1 bg-gradient-to-r from-blue-600/20 to-purple-600/20 rounded-lg blur-lg",
                  style: { animation: 'glow-pulse 4s ease-in-out infinite' }
                })
              )
            ),
            React.createElement(
              "p",
              { 
                className: "text-lg md:text-xl text-gray-700 leading-relaxed max-w-3xl mx-auto",
                style: {
                  transform: `perspective(1000px) rotateX(${mousePosition.y * 1}deg)`,
                  transition: 'transform 0.5s cubic-bezier(0.23, 1, 0.32, 1)'
                }
              },
              "We're here to help you stay safe. Reach out to our dedicated support team for assistance, questions, or emergency support."
            )
          ),

          // Enhanced Contact Methods with Magnetic Hover
          React.createElement(
            "div",
            { 
              className: `grid md:grid-cols-3 gap-8 ${isLoaded ? 'animate-slide-up' : 'opacity-0 translate-y-10'}`,
              style: { animationDelay: '0.6s' }
            },
            contactMethods.map((method, index) =>
              React.createElement(
                "a",
                {
                  key: index,
                  href: method.link,
                  className: `group bg-white/80 backdrop-blur-md p-8 rounded-3xl border border-white/50 shadow-xl hover:shadow-2xl transition-all duration-700 block text-center transform-gpu relative overflow-hidden`,
                  style: {
                    animationDelay: `${0.8 + method.delay}s`,
                    animation: isLoaded ? 'bounce-in-elastic 1s ease-out forwards' : 'none',
                    transform: `perspective(1000px) rotateX(${mousePosition.y * 3}deg) rotateY(${mousePosition.x * 3}deg) translateZ(${hoveredCard === index ? 30 : 0}px)`,
                    transition: 'transform 0.4s cubic-bezier(0.23, 1, 0.32, 1), box-shadow 0.7s ease',
                    willChange: 'transform'
                  },
                  onMouseEnter: () => setHoveredCard(index),
                  onMouseLeave: () => setHoveredCard(null)
                },
                // Shimmer effect
                React.createElement(
                  "div",
                  { 
                    className: "absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000",
                    style: { animation: hoveredCard === index ? 'shimmer-wave 1s ease-out' : 'none' }
                  }
                ),
                React.createElement(
                  "div",
                  { 
                    className: `w-20 h-20 bg-gradient-to-br ${method.gradient} rounded-3xl flex items-center justify-center mb-6 shadow-xl mx-auto transform-gpu relative overflow-hidden`,
                    style: {
                      transform: `rotateY(${mousePosition.x * 12}deg) rotateX(${mousePosition.y * 12}deg) translateZ(${hoveredCard === index ? 20 : 0}px)`,
                      transition: 'transform 0.4s cubic-bezier(0.23, 1, 0.32, 1)',
                      animation: hoveredCard === index ? 'icon-bounce 0.6s ease-out' : 'none'
                    }
                  },
                  method.icon,
                  React.createElement("div", {
                    className: "absolute inset-0 bg-white/20 rounded-3xl",
                    style: { animation: hoveredCard === index ? 'ripple 0.6s ease-out' : 'none' }
                  })
                ),
                React.createElement(
                  "h3",
                  { 
                    className: "text-2xl font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-all duration-500",
                    style: { transform: hoveredCard === index ? 'translateY(-2px)' : 'translateY(0)' }
                  },
                  method.title
                ),
                React.createElement(
                  "p",
                  { 
                    className: "text-lg font-semibold text-blue-600 mb-2 transition-all duration-500",
                    style: { transform: hoveredCard === index ? 'scale(1.05)' : 'scale(1)' }
                  },
                  method.value
                ),
                React.createElement(
                  "p",
                  { className: "text-gray-600 text-sm" },
                  method.description
                )
              )
            )
          )
        )
      )
    ),

    // Enhanced Contact Form Section
    React.createElement(
      "section",
      { 
        className: "py-24 bg-gradient-to-b from-white to-gray-50 relative overflow-hidden",
        ref: registerSection('form'),
        style: { perspective: '1200px' }
      },
      React.createElement(
        "div",
        { className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10" },
        React.createElement(
          "div",
          { className: "grid lg:grid-cols-2 gap-16 items-start" },
          
          // Enhanced Contact Form with Micro-interactions
          React.createElement(
            "div",
            { 
              className: `${visibleSections.has('form') ? 'animate-slide-up' : 'opacity-0 translate-y-10'}`,
              style: { 
                animationDelay: '0.2s',
                transform: `perspective(1000px) rotateY(${mousePosition.x * 2}deg) rotateX(${mousePosition.y * 2}deg)`,
                transition: 'transform 0.5s cubic-bezier(0.23, 1, 0.32, 1)'
              }
            },
            React.createElement(
              "div",
              { className: "bg-white/90 backdrop-blur-md p-8 rounded-3xl shadow-2xl border border-white/50 transform-gpu hover:shadow-3xl transition-all duration-700" },
              React.createElement(
                "h2",
                { className: "text-3xl font-bold text-gray-900 mb-6" },
                "Send us a Message"
              ),
              React.createElement(
                "form",
                { onSubmit: handleSubmit, className: "space-y-6" },
                React.createElement(
                  "div",
                  { className: "grid md:grid-cols-2 gap-6" },
                  React.createElement(
                    "div",
                    { className: "relative" },
                    React.createElement(
                      "label",
                      { className: "block text-sm font-semibold text-gray-700 mb-2" },
                      "Full Name"
                    ),
                    React.createElement("input", {
                      type: "text",
                      name: "name",
                      value: formData.name,
                      onChange: handleInputChange,
                      onFocus: () => setFocusedInput('name'),
                      onBlur: () => setFocusedInput(null),
                      required: true,
                      className: "w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-500 bg-white/70 backdrop-blur-sm transform-gpu",
                      style: {
                        transform: focusedInput === 'name' ? 'translateY(-2px) scale(1.02)' : 'translateY(0) scale(1)',
                        boxShadow: focusedInput === 'name' ? '0 10px 25px rgba(59, 130, 246, 0.15)' : '0 4px 6px rgba(0, 0, 0, 0.05)',
                        transition: 'all 0.5s cubic-bezier(0.23, 1, 0.32, 1)'
                      }
                    }),
                    React.createElement("div", {
                      className: "absolute bottom-0 left-0 h-0.5 bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-500",
                      style: { width: focusedInput === 'name' ? '100%' : '0%' }
                    })
                  ),
                  React.createElement(
                    "div",
                    { className: "relative" },
                    React.createElement(
                      "label",
                      { className: "block text-sm font-semibold text-gray-700 mb-2" },
                      "Email Address"
                    ),
                    React.createElement("input", {
                      type: "email",
                      name: "email",
                      value: formData.email,
                      onChange: handleInputChange,
                      onFocus: () => setFocusedInput('email'),
                      onBlur: () => setFocusedInput(null),
                      required: true,
                      className: "w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-500 bg-white/70 backdrop-blur-sm transform-gpu",
                      style: {
                        transform: focusedInput === 'email' ? 'translateY(-2px) scale(1.02)' : 'translateY(0) scale(1)',
                        boxShadow: focusedInput === 'email' ? '0 10px 25px rgba(59, 130, 246, 0.15)' : '0 4px 6px rgba(0, 0, 0, 0.05)',
                        transition: 'all 0.5s cubic-bezier(0.23, 1, 0.32, 1)'
                      }
                    }),
                    React.createElement("div", {
                      className: "absolute bottom-0 left-0 h-0.5 bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-500",
                      style: { width: focusedInput === 'email' ? '100%' : '0%' }
                    })
                  )
                ),
                React.createElement(
                  "div",
                  { className: "relative" },
                  React.createElement(
                    "label",
                    { className: "block text-sm font-semibold text-gray-700 mb-2" },
                    "Subject"
                  ),
                  React.createElement("input", {
                    type: "text",
                    name: "subject",
                    value: formData.subject,
                    onChange: handleInputChange,
                    onFocus: () => setFocusedInput('subject'),
                    onBlur: () => setFocusedInput(null),
                    required: true,
                    className: "w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-500 bg-white/70 backdrop-blur-sm transform-gpu",
                    style: {
                      transform: focusedInput === 'subject' ? 'translateY(-2px) scale(1.02)' : 'translateY(0) scale(1)',
                      boxShadow: focusedInput === 'subject' ? '0 10px 25px rgba(59, 130, 246, 0.15)' : '0 4px 6px rgba(0, 0, 0, 0.05)',
                      transition: 'all 0.5s cubic-bezier(0.23, 1, 0.32, 1)'
                    }
                  }),
                  React.createElement("div", {
                    className: "absolute bottom-0 left-0 h-0.5 bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-500",
                    style: { width: focusedInput === 'subject' ? '100%' : '0%' }
                  })
                ),
                React.createElement(
                  "div",
                  { className: "relative" },
                  React.createElement(
                    "label",
                    { className: "block text-sm font-semibold text-gray-700 mb-2" },
                    "Message"
                  ),
                  React.createElement("textarea", {
                    name: "message",
                    value: formData.message,
                    onChange: handleInputChange,
                    onFocus: () => setFocusedInput('message'),
                    onBlur: () => setFocusedInput(null),
                    required: true,
                    rows: 5,
                    className: "w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-500 bg-white/70 backdrop-blur-sm resize-none transform-gpu",
                    style: {
                      transform: focusedInput === 'message' ? 'translateY(-2px) scale(1.02)' : 'translateY(0) scale(1)',
                      boxShadow: focusedInput === 'message' ? '0 10px 25px rgba(59, 130, 246, 0.15)' : '0 4px 6px rgba(0, 0, 0, 0.05)',
                      transition: 'all 0.5s cubic-bezier(0.23, 1, 0.32, 1)'
                    }
                  }),
                  React.createElement("div", {
                    className: "absolute bottom-0 left-0 h-0.5 bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-500",
                    style: { width: focusedInput === 'message' ? '100%' : '0%' }
                  })
                ),
                React.createElement(
                  "button",
                  {
                    type: "submit",
                    disabled: isSubmitting,
                    className: `w-full bg-gradient-to-r ${primaryBrandGradient} text-white px-8 py-4 rounded-xl text-lg font-bold hover:shadow-2xl transition-all duration-500 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed transform-gpu relative overflow-hidden group`,
                    style: {
                      transform: `perspective(1000px) rotateX(${mousePosition.y * 2}deg) translateZ(${isSubmitting ? 0 : 10}px)`,
                      transition: 'transform 0.5s cubic-bezier(0.23, 1, 0.32, 1)',
                      backgroundSize: '200% 200%',
                      animation: isSubmitting ? 'gradient-flow 2s ease-in-out infinite' : 'none'
                    }
                  },
                  React.createElement("div", {
                    className: "absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"
                  }),
                  isSubmitting ? [
                    React.createElement(
                      "div",
                      { 
                        key: "spinner", 
                        className: "w-5 h-5 border-2 border-white/30 border-t-white rounded-full mr-3",
                        style: { animation: 'spin-smooth 1s linear infinite' }
                      }
                    ),
                    "Sending..."
                  ] : [
                    React.createElement(Send, { key: "icon", className: "mr-3 w-5 h-5 group-hover:scale-110 transition-transform duration-300" }),
                    "Send Message",
                    React.createElement(ArrowRight, { key: "arrow", className: "ml-3 w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" })
                  ]
                )
              )
            )
          ),

          // Enhanced Support Information
          React.createElement(
            "div",
            { 
              className: `space-y-8 ${visibleSections.has('form') ? 'animate-slide-up' : 'opacity-0 translate-y-10'}`,
              style: { 
                animationDelay: '0.4s',
                transform: `perspective(1000px) rotateY(${mousePosition.x * -2}deg) rotateX(${mousePosition.y * 2}deg)`,
                transition: 'transform 0.5s cubic-bezier(0.23, 1, 0.32, 1)'
              }
            },
            
            // Enhanced Support Hours
            React.createElement(
              "div",
              { className: "bg-white/90 backdrop-blur-md p-8 rounded-3xl shadow-xl border border-white/50 transform-gpu hover:shadow-2xl hover:scale-105 transition-all duration-700" },
              React.createElement(
                "div",
                { className: "flex items-center gap-4 mb-6" },
                React.createElement(
                  "div",
                  { 
                    className: `w-12 h-12 bg-gradient-to-br ${accentGreen} rounded-xl flex items-center justify-center shadow-lg relative overflow-hidden`,
                    style: {
                      transform: `rotateY(${mousePosition.x * 15}deg) rotateX(${mousePosition.y * 15}deg)`,
                      transition: 'transform 0.4s cubic-bezier(0.23, 1, 0.32, 1)',
                      animation: 'pulse-glow 3s ease-in-out infinite'
                    }
                  },
                  React.createElement(Clock, { className: "w-6 h-6 text-white relative z-10" }),
                  React.createElement("div", {
                    className: "absolute inset-0 bg-white/20 rounded-xl",
                    style: { animation: 'shimmer 2s ease-in-out infinite' }
                  })
                ),
                React.createElement(
                  "h3",
                  { className: "text-2xl font-bold text-gray-900" },
                  "Support Hours"
                )
              ),
              React.createElement(
                "div",
                { className: "space-y-4" },
                supportHours.map((schedule, index) =>
                  React.createElement(
                    "div",
                    {
                      key: index,
                      className: "flex justify-between items-center py-3 border-b border-gray-100 last:border-b-0 transform-gpu hover:scale-105 hover:bg-gray-50/50 rounded-lg px-2 transition-all duration-400",
                      style: {
                        transform: `perspective(1000px) rotateX(${mousePosition.y * 1}deg)`,
                        transition: 'transform 0.4s cubic-bezier(0.23, 1, 0.32, 1)',
                        animationDelay: `${index * 0.1}s`
                      }
                    },
                    React.createElement(
                      "span",
                      { className: "font-semibold text-gray-700" },
                      schedule.day
                    ),
                    React.createElement(
                      "span",
                      { className: "text-gray-600" },
                      schedule.hours
                    )
                  )
                )
              )
            ),

            // Enhanced Quick Links
            React.createElement(
              "div",
              { className: "bg-white/90 backdrop-blur-md p-8 rounded-3xl shadow-xl border border-white/50 transform-gpu hover:shadow-2xl hover:scale-105 transition-all duration-700" },
              React.createElement(
                "div",
                { className: "flex items-center gap-4 mb-6" },
                React.createElement(
                  "div",
                  { 
                    className: `w-12 h-12 bg-gradient-to-br ${accentBlue} rounded-xl flex items-center justify-center shadow-lg relative overflow-hidden`,
                    style: {
                      transform: `rotateY(${mousePosition.x * 15}deg) rotateX(${mousePosition.y * 15}deg)`,
                      transition: 'transform 0.4s cubic-bezier(0.23, 1, 0.32, 1)',
                      animation: 'pulse-glow 3s ease-in-out infinite'
                    }
                  },
                  React.createElement(MessageCircle, { className: "w-6 h-6 text-white relative z-10" }),
                  React.createElement("div", {
                    className: "absolute inset-0 bg-white/20 rounded-xl",
                    style: { animation: 'shimmer 2s ease-in-out infinite' }
                  })
                ),
                React.createElement(
                  "h3",
                  { className: "text-2xl font-bold text-gray-900" },
                  "Quick Help"
                )
              ),
              React.createElement(
                "div",
                { className: "space-y-4" },
                quickLinks.map((link, index) =>
                  React.createElement(
                    "button",
                    {
                      key: index,
                      className: "w-full text-left p-4 rounded-xl border border-gray-200 hover:border-blue-300 hover:bg-blue-50/50 transition-all duration-500 group transform-gpu hover:scale-105 hover:-translate-y-1 relative overflow-hidden",
                      style: {
                        transform: `perspective(1000px) rotateX(${mousePosition.y * 1}deg) rotateY(${mousePosition.x * 1}deg)`,
                        transition: 'transform 0.4s cubic-bezier(0.23, 1, 0.32, 1)',
                        animationDelay: `${index * 0.1}s`
                      }
                    },
                    React.createElement("div", {
                      className: "absolute inset-0 bg-gradient-to-r from-transparent via-blue-100/50 to-transparent transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"
                    }),
                    React.createElement(
                      "div",
                      { className: "flex items-center justify-between relative z-10" },
                      React.createElement(
                        "div",
                        { className: "flex items-center gap-3" },
                        React.createElement(
                          "div",
                          { 
                            className: "w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center group-hover:bg-blue-200 transition-colors duration-300",
                            style: {
                              transform: 'rotateY(0deg)',
                              transition: 'transform 0.3s ease-out'
                            }
                          },
                          React.createElement(link.icon, { className: "w-4 h-4 text-blue-600" })
                        ),
                        React.createElement(
                          "div",
                          null,
                          React.createElement(
                            "h4",
                            { className: "font-semibold text-gray-900 group-hover:text-blue-600 transition-colors duration-300" },
                            link.title
                          ),
                          React.createElement(
                            "p",
                            { className: "text-sm text-gray-600 mt-1" },
                            link.description
                          )
                        )
                      ),
                      React.createElement(ArrowRight, { className: "w-5 h-5 text-gray-400 group-hover:text-blue-600 group-hover:translate-x-1 transition-all duration-300" })
                    )
                  )
                )
              )
            )
          )
        )
      )
    ),

    // Enhanced Emergency Contact Section
    React.createElement(
      "section",
      { 
        className: `py-24 bg-gradient-to-r ${darkBgGradient} relative overflow-hidden`,
        ref: registerSection('emergency'),
        style: { perspective: '1200px' }
      },
      React.createElement("div", { className: "absolute inset-0 bg-black/20" }),
      React.createElement(
        "div",
        { className: "max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10" },
        React.createElement(
          "div",
          { 
            className: `${visibleSections.has('emergency') ? 'animate-slide-up' : 'opacity-0 translate-y-10'}`,
            style: { 
              animationDelay: '0.2s',
              transform: `perspective(1000px) rotateX(${mousePosition.y * 2}deg)`,
              transition: 'transform 0.5s cubic-bezier(0.23, 1, 0.32, 1)'
            }
          },
          React.createElement(
            "div",
            { 
              className: "inline-flex items-center gap-3 bg-white/10 backdrop-blur-md px-6 py-3 rounded-full border border-white/20 shadow-lg mb-8 transform-gpu",
              style: {
                transform: `perspective(1000px) rotateY(${mousePosition.x * 5}deg) rotateX(${mousePosition.y * 5}deg)`,
                transition: 'transform 0.4s cubic-bezier(0.23, 1, 0.32, 1)'
              }
            },
            React.createElement(
              "div",
              { 
                className: "w-8 h-8 bg-red-500 rounded-full flex items-center justify-center shadow-lg relative overflow-hidden",
                style: {
                  transform: `rotateY(${mousePosition.x * 15}deg) rotateX(${mousePosition.y * 15}deg)`,
                  transition: 'transform 0.4s cubic-bezier(0.23, 1, 0.32, 1)',
                  animation: 'emergency-pulse 2s ease-in-out infinite'
                }
              },
              React.createElement(Shield, { className: "w-5 h-5 text-white relative z-10" }),
              React.createElement("div", {
                className: "absolute inset-0 bg-white/30 rounded-full",
                style: { animation: 'ripple-emergency 2s ease-out infinite' }
              })
            ),
            React.createElement("span", { className: "text-white font-semibold" }, "Emergency Support")
          ),
          React.createElement(
            "h2",
            { className: "text-4xl md:text-5xl font-extrabold text-white mb-6" },
            "Need Immediate Help?"
          ),
          React.createElement(
            "p",
            { className: "text-lg md:text-xl text-blue-100 mb-12 leading-relaxed" },
            "In case of emergency, contact us immediately. Our 24/7 emergency response team is always ready to help."
          ),
          React.createElement(
            "div",
            { className: "flex flex-col sm:flex-row gap-6 justify-center" },
            React.createElement(
              "a",
              {
                href: "tel:+15559117233",
                className: "group bg-red-500 hover:bg-red-600 text-white px-8 py-4 rounded-full text-lg font-bold hover:shadow-2xl transition-all duration-500 flex items-center justify-center transform-gpu relative overflow-hidden",
                style: {
                  transform: `perspective(1000px) rotateX(${mousePosition.y * 3}deg) rotateY(${mousePosition.x * 3}deg) translateZ(20px)`,
                  transition: 'transform 0.4s cubic-bezier(0.23, 1, 0.32, 1)',
                  animation: 'button-glow 3s ease-in-out infinite'
                }
              },
              React.createElement("div", {
                className: "absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"
              }),
              React.createElement(Phone, { className: "mr-3 w-5 h-5 group-hover:scale-110 transition-transform duration-300 relative z-10" }),
              React.createElement("span", { className: "relative z-10" }, "Emergency Call"),
              React.createElement("div", { 
                className: "ml-3 w-2 h-2 bg-white rounded-full relative z-10",
                style: { animation: 'emergency-pulse 1.5s ease-in-out infinite' }
              })
            ),
            React.createElement(
              "a",
              {
                href: "mailto:emergency@sherox.com",
                className: "group bg-white/10 backdrop-blur-md text-white border-2 border-white/30 px-8 py-4 rounded-full text-lg font-bold hover:bg-white hover:text-gray-900 transition-all duration-500 flex items-center justify-center transform-gpu relative overflow-hidden",
                style: {
                  transform: `perspective(1000px) rotateX(${mousePosition.y * 3}deg) rotateY(${mousePosition.x * -3}deg) translateZ(20px)`,
                  transition: 'transform 0.4s cubic-bezier(0.23, 1, 0.32, 1)'
                }
              },
              React.createElement("div", {
                className: "absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"
              }),
              React.createElement(Mail, { className: "mr-3 w-5 h-5 group-hover:scale-110 transition-transform duration-300 relative z-10" }),
              React.createElement("span", { className: "relative z-10" }, "Emergency Email")
            )
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

        @keyframes spin-smooth {
          from { 
            transform: rotate(0deg) rotateY(0deg); 
          }
          to { 
            transform: rotate(360deg) rotateY(180deg); 
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

        @keyframes emergency-pulse {
          0%, 100% { 
            transform: scale(1) rotateX(0deg) rotateY(0deg); 
            box-shadow: 0 0 0 0 rgba(239, 68, 68, 0.7); 
          }
          50% { 
            transform: scale(1.15) rotateX(10deg) rotateY(10deg); 
            box-shadow: 0 0 0 15px rgba(239, 68, 68, 0); 
          }
        }

        @keyframes ripple-emergency {
          0% { transform: scale(0); opacity: 1; }
          100% { transform: scale(4); opacity: 0; }
        }

        @keyframes button-glow {
          0%, 100% { 
            box-shadow: 0 0 20px rgba(239, 68, 68, 0.5); 
          }
          50% { 
            box-shadow: 0 0 40px rgba(239, 68, 68, 0.8), 0 0 60px rgba(239, 68, 68, 0.3); 
          }
        }

        @keyframes glow-pulse {
          0%, 100% { opacity: 0.5; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.05); }
        }

        .animate-slide-up {
          animation: slide-up 0.8s cubic-bezier(0.23, 1, 0.32, 1) forwards;
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

        .backdrop-blur-sm {
          backdrop-filter: blur(4px);
          -webkit-backdrop-filter: blur(4px);
        }
      `
    )
  );
};

export default Contact;