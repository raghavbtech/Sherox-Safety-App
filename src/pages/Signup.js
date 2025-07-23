import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion, useScroll, useTransform } from "framer-motion";
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  Shield,
  Users,
  Phone,
  CheckCircle,
  ArrowRight,
  Mic,
  User,
  Star,
  Globe,
  Heart,
  Zap,
  Award
} from "lucide-react";
import API_BASE_URL from "../apiConfig";

const Signup = () => {
  // Mock navigate function for demonstration
  const navigate = (path) => {
    console.log(`Navigating to: ${path}`);
    alert(`Would navigate to: ${path}`);
  };
  
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [agreeToTerms, setAgreeToTerms] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const { scrollYProgress } = useScroll();

  // Parallax effect for background elements
  const yTransform = useTransform(scrollYProgress, [0, 1], [0, -50]);

  // Mouse tracking for subtle background elements
  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({
        x: (e.clientX / window.innerWidth - 0.5) * 2,
        y: (e.clientY / window.innerHeight - 0.5) * 2,
      });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Color palette matching home page
  const primaryBrandGradient = "from-blue-600 via-purple-600 to-pink-600";
  const lightBgGradient = "from-blue-50 to-indigo-100";
  const accentBlue = "from-blue-500 to-indigo-500";
  const accentGreen = "from-emerald-500 to-teal-500";
  const accentPink = "from-rose-500 to-orange-500";

  const handleSubmit = async (e) => {
    if (e && e.preventDefault) {
      e.preventDefault();
    }
    setError("");
    
    if (!agreeToTerms) {
      setError("Please agree to Terms of Service and Privacy Policy");
      return;
    }

    const res = await fetch(`${API_BASE_URL}/api/signup`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    const data = await res.json();
    if (res.ok) {
      alert("Signup successful! Please log in.");
      navigate("/login");
    } else {
      setError(data.message);
    }
  };

  const getPasswordStrength = (password) => {
    if (password.length < 4) return "Weak";
    if (password.length < 8) return "Medium";
    return "Strong";
  };

  const features = [
    {
      icon: <Shield className="w-6 h-6 text-white" />,
      title: "24/7 Protection",
      gradient: accentBlue,
    },
    {
      icon: <Phone className="w-6 h-6 text-white" />,
      title: "Emergency SOS",
      gradient: accentPink,
    },
    {
      icon: <Users className="w-6 h-6 text-white" />,
      title: "Community Support",
      gradient: accentGreen,
    }
  ];

  const stats = [
    { number: "500K+", label: "Women Protected", icon: <Users className="w-5 h-5 text-white" /> },
    { number: "99.9%", label: "Response Rate", icon: <Zap className="w-5 h-5 text-white" /> },
    { number: "150+", label: "Cities Covered", icon: <Globe className="w-5 h-5 text-white" /> }
  ];

  return (
    <div className={`min-h-screen bg-gradient-to-br ${lightBgGradient} font-sans overflow-hidden relative`}>
      {/* Abstract Background Shapes */}
      <motion.div
        className="absolute -top-40 -left-40 w-96 h-96 bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 pointer-events-none"
        animate={{ x: mousePosition.x * 30, y: mousePosition.y * 30 }}
        transition={{ type: "spring", stiffness: 50, damping: 20 }}
      />
      <motion.div
        className="absolute top-1/2 -right-40 w-80 h-80 bg-pink-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 pointer-events-none"
        animate={{ x: mousePosition.x * -20, y: mousePosition.y * 20 }}
        transition={{ type: "spring", stiffness: 50, damping: 20 }}
      />
      <motion.div
        className="absolute bottom-0 left-1/4 w-72 h-72 bg-blue-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 pointer-events-none"
        animate={{ x: mousePosition.x * 25, y: mousePosition.y * -25 }}
        transition={{ type: "spring", stiffness: 50, damping: 20 }}
      />

      <div className="flex items-center justify-center min-h-screen px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-7xl w-full grid lg:grid-cols-2 gap-16 items-center">
          
          {/* Left Side - Branding & Features */}
          <motion.div
            className="space-y-8 text-center lg:text-left"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            style={{ y: yTransform }}
          >
            {/* Brand Header */}
            <div className="space-y-6">
              <motion.div
                className="inline-flex items-center gap-3 bg-white px-6 py-3 rounded-full border border-blue-200 shadow-sm"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.6 }}
                whileHover={{ scale: 1.02 }}
              >
                <div className={`w-8 h-8 bg-gradient-to-r ${primaryBrandGradient} rounded-full flex items-center justify-center`}>
                  <Award className="w-5 h-5 text-white" />
                </div>
                <span className="text-gray-700 font-semibold">Join 500,000+ Women Worldwide</span>
              </motion.div>

              <motion.h1
                className="text-5xl md:text-6xl lg:text-7xl font-extrabold text-gray-900"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.8 }}
              >
                <motion.span
                  className={`bg-clip-text text-transparent bg-gradient-to-r ${primaryBrandGradient}`}
                  animate={{
                    backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
                  }}
                  transition={{ duration: 5, repeat: Infinity, ease: "linear" }}
                >
                  SHEROX
                </motion.span>
              </motion.h1>

              <motion.p
                className="text-xl md:text-2xl text-gray-700 font-semibold"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.6 }}
              >
                Your Safety, Your Strength
              </motion.p>

              <motion.p
                className="text-lg text-gray-600 leading-relaxed max-w-2xl mx-auto lg:mx-0"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.6 }}
              >
                Create your account and join thousands of women who trust SHEROX for their daily security. Get started with <strong>advanced safety features</strong> and real-time protection.
              </motion.p>
            </div>

            {/* Feature Cards */}
            <motion.div
              className="grid grid-cols-1 sm:grid-cols-3 gap-6"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.8 }}
            >
              {features.map((feature, index) => (
                <motion.div
                  key={index}
                  className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100 group"
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.7 + index * 0.1, duration: 0.6 }}
                  whileHover={{ 
                    scale: 1.02, 
                    y: -5,
                    boxShadow: "0 15px 30px rgba(0,0,0,0.1)"
                  }}
                >
                  <div className={`w-12 h-12 bg-gradient-to-br ${feature.gradient} rounded-xl flex items-center justify-center mb-4 mx-auto shadow-lg group-hover:scale-105 transition-transform`}>
                    {feature.icon}
                  </div>
                  <h3 className="font-bold text-gray-900 text-center">{feature.title}</h3>
                </motion.div>
              ))}
            </motion.div>

            {/* Stats */}
            <motion.div
              className="flex flex-wrap justify-center lg:justify-start gap-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8, duration: 0.6 }}
            >
              {stats.map((stat, index) => (
                <motion.div
                  key={index}
                  className="text-center"
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.2 }}
                >
                  <div className={`w-10 h-10 bg-gradient-to-r ${accentBlue} rounded-full flex items-center justify-center mx-auto mb-2`}>
                    {stat.icon}
                  </div>
                  <div className="text-2xl font-bold text-gray-900">{stat.number}</div>
                  <div className="text-sm text-gray-600">{stat.label}</div>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>

          {/* Right Side - Signup Form */}
          <motion.div
            className="w-full max-w-md mx-auto"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            <div className="bg-white rounded-3xl shadow-2xl p-8 border border-gray-100 relative overflow-hidden">
              {/* Subtle gradient overlay */}
              <div className={`absolute inset-0 bg-gradient-to-br ${primaryBrandGradient} opacity-[0.02] rounded-3xl`}></div>
              
              <div className="relative z-10">
                {/* Header */}
                <motion.div
                  className="text-center mb-8"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4, duration: 0.6 }}
                >
                  <h2 className="text-3xl font-bold text-gray-900 mb-2">Create Account</h2>
                  <p className="text-gray-600">Join the SHEROX community today</p>
                </motion.div>

                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Full Name Input */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5, duration: 0.6 }}
                  >
                    <label className="block text-gray-700 font-semibold mb-3">Full Name</label>
                    <div className="relative group">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <User className="w-5 h-5 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
                      </div>
                      <input
                        type="text"
                        placeholder="Enter your full name"
                        value={form.name}
                        onChange={(e) => setForm({ ...form, name: e.target.value })}
                        className="w-full pl-12 pr-4 py-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-300 bg-gray-50 focus:bg-white"
                        required
                      />
                    </div>
                  </motion.div>

                  {/* Email Input */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6, duration: 0.6 }}
                  >
                    <label className="block text-gray-700 font-semibold mb-3">Email Address</label>
                    <div className="relative group">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <Mail className="w-5 h-5 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
                      </div>
                      <input
                        type="email"
                        placeholder="Enter your email"
                        value={form.email}
                        onChange={(e) => setForm({ ...form, email: e.target.value })}
                        className="w-full pl-12 pr-4 py-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-300 bg-gray-50 focus:bg-white"
                        required
                      />
                    </div>
                  </motion.div>

                  {/* Password Input */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.7, duration: 0.6 }}
                  >
                    <label className="block text-gray-700 font-semibold mb-3">Create Password</label>
                    <div className="relative group">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <Lock className="w-5 h-5 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
                      </div>
                      <input
                        type={showPassword ? "text" : "password"}
                        placeholder="Create a strong password"
                        value={form.password}
                        onChange={(e) => setForm({ ...form, password: e.target.value })}
                        className="w-full pl-12 pr-12 py-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-300 bg-gray-50 focus:bg-white"
                        required
                      />
                      <motion.button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                      >
                        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </motion.button>
                    </div>
                    {form.password && (
                      <motion.p
                        className="text-sm mt-2"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.3 }}
                      >
                        Password strength: <span className={`font-medium ${
                          getPasswordStrength(form.password) === "Strong" ? "text-green-600" :
                          getPasswordStrength(form.password) === "Medium" ? "text-yellow-600" : "text-red-600"
                        }`}>
                          {getPasswordStrength(form.password)}
                        </span>
                      </motion.p>
                    )}
                  </motion.div>

                  {/* Terms Agreement */}
                  <motion.div
                    className="space-y-4"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.8, duration: 0.6 }}
                  >
                    <label className="flex items-start cursor-pointer group">
                      <input
                        type="checkbox"
                        checked={agreeToTerms}
                        onChange={(e) => setAgreeToTerms(e.target.checked)}
                        className="w-4 h-4 text-blue-600 border-2 border-gray-300 rounded focus:ring-blue-500 transition-colors mt-1"
                      />
                      <span className="ml-3 text-gray-700 group-hover:text-gray-900 transition-colors text-sm">
                        I agree to the{" "}
                        <Link to="/terms" className={`text-transparent bg-clip-text bg-gradient-to-r ${accentBlue} hover:from-blue-700 hover:to-purple-700 font-semibold transition-all`}>
                          Terms of Service
                        </Link>{" "}
                        and{" "}
                        <Link to="/privacy" className={`text-transparent bg-clip-text bg-gradient-to-r ${accentBlue} hover:from-blue-700 hover:to-purple-700 font-semibold transition-all`}>
                          Privacy Policy
                        </Link>
                      </span>
                    </label>
                  </motion.div>

                  {/* Submit Button */}
                  <motion.button
                    type="submit"
                    className={`w-full bg-gradient-to-r ${primaryBrandGradient} text-white py-4 px-6 rounded-xl font-bold text-lg hover:shadow-xl hover:shadow-blue-500/30 transition-all duration-300 flex items-center justify-center gap-3 relative overflow-hidden group`}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.9, duration: 0.6 }}
                    whileHover={{ scale: 1.02, y: -2 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-purple-700 to-pink-700"
                      initial={{ x: "-100%" }}
                      whileHover={{ x: "0%" }}
                      transition={{ duration: 0.3 }}
                    />
                    <span className="relative z-10 flex items-center">
                      <User className="w-5 h-5" />
                      Create Secure Account
                      <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </span>
                  </motion.button>

                  {error && (
                    <motion.div
                      className="bg-red-50 border border-red-200 rounded-lg p-3"
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.3 }}
                    >
                      <p className="text-red-600 text-sm">{error}</p>
                    </motion.div>
                  )}

                  {/* Divider */}
                  <motion.div
                    className="flex items-center my-8"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1, duration: 0.6 }}
                  >
                    <div className="flex-1 border-t border-gray-200"></div>
                    <span className="px-4 text-gray-500 text-sm font-medium">or continue with</span>
                    <div className="flex-1 border-t border-gray-200"></div>
                  </motion.div>

                  {/* Social Login */}
                  <motion.div
                    className="grid grid-cols-3 gap-4"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1.1, duration: 0.6 }}
                  >
                    {[
                      { name: "Google", color: "text-red-500", path: "M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" },
                      { name: "Facebook", color: "text-blue-600", path: "M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" },
                      { name: "Apple", color: "text-gray-800", path: "M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" }
                    ].map((social, index) => (
                      <motion.button
                        key={social.name}
                        type="button"
                        className="bg-gray-50 hover:bg-gray-100 border-2 border-gray-200 hover:border-gray-300 rounded-xl py-3 px-4 flex items-center justify-center transition-all duration-300 group"
                        whileHover={{ scale: 1.02, y: -2 }}
                        whileTap={{ scale: 0.98 }}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 1.2 + index * 0.1, duration: 0.4 }}
                      >
                        <svg className={`w-5 h-5 ${social.color} group-hover:scale-110 transition-transform`} fill="currentColor" viewBox="0 0 24 24">
                          <path d={social.path} />
                        </svg>
                      </motion.button>
                    ))}
                  </motion.div>

                  {/* Login Link */}
                  <motion.div
                    className="text-center mt-6"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1.3, duration: 0.6 }}
                  >
                    <p className="text-gray-600">
                      Already have an account?{" "}
                      <Link 
                        to="/login" 
                        className={`text-transparent bg-clip-text bg-gradient-to-r ${accentBlue} hover:from-blue-700 hover:to-purple-700 font-semibold transition-all`}
                      >
                        Sign in here
                      </Link>
                    </p>
                  </motion.div>

                  {/* Security Info */}
                  <motion.div
                    className="flex items-center justify-center gap-6 mt-8 text-xs text-gray-500"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1.4, duration: 0.6 }}
                  >
                    {[
                      { icon: <Lock className="w-3 h-3" />, text: "256-bit SSL" },
                      { icon: <Shield className="w-3 h-3" />, text: "Encrypted" },
                      { icon: <CheckCircle className="w-3 h-3" />, text: "Verified" }
                    ].map((item, index) => (
                      <motion.div
                        key={index}
                        className="flex items-center gap-1"
                        whileHover={{ scale: 1.05 }}
                        transition={{ duration: 0.2 }}
                      >
                        {item.icon}
                        {item.text}
                      </motion.div>
                    ))}
                  </motion.div>
                </form>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Floating SOS Button (matching home page) */}
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

export default Signup;