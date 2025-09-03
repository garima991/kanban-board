import React from "react";
import { motion } from "framer-motion";
import FeatureSection from "../components/FeatureSection";
import FeatureSteps from "../components/FeatureSteps";
import Footer from "../components/Footer";
import { Link } from "react-router-dom";
import dashboardPreview from "../assets/dashboard-preview.png";
import { tryDemo } from "../redux/features/authSlice";
import { useDispatch } from "react-redux";

const LandingPage = () => {
  const dispatch = useDispatch();

  const handleDemoLogin = async () => {
    try {
      await dispatch(tryDemo());
      window.location.href = "/member/dashboard"; 
    } catch (err) {
      console.error("Demo login failed:", err);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-200 to-blue-100 flex flex-col gap-4">
      {/* Header */}
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="w-full px-8 py-5 flex justify-between items-center bg-transparent"
      >
        <motion.h1
          transition={{ repeat: Infinity, repeatType: "mirror", duration: 3 }}
          className="text-3xl font-extrabold font-sans text-blue-950"
        >
          Task<span className="font-semibold">ora</span>
        </motion.h1>

        <div className="flex gap-4">
          <button className="px-6 py-2 text-white bg-blue-950 hover:bg-transparent hover:border-2 hover:border-blue-950 hover:text-blue-950 transition-all duration-200 rounded-xl shadow-md">
            <Link to="/auth">Log In</Link>
          </button>
          <button className="px-6 py-2 text-blue-950 border-2 border-blue-950 hover:bg-blue-950 hover:text-white transition-all duration-200 rounded-xl">
            <Link to="/auth">Sign Up</Link>
          </button>
        </div>
      </motion.header>

      {/* Main Section */}
      <main className="flex-1 flex flex-col items-center justify-center text-center mb-11 gap-4">
        <motion.div
          className="flex flex-col justify-center items-center py-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="text-4xl md:text-5xl font-extrabold text-blue-950 mb-6 leading-tight">
            Organize Your Work, <br className="hidden md:block" /> Visually
          </h2>
          <p className="text-lg md:text-xl text-gray-600 max-w-2xl mb-6">
            Simplify task tracking and supercharge your team's productivity with
            our powerful and intuitive Kanban board.
          </p>
          <div className="flex gap-4">
            <Link
              to="/auth"
              className="px-6 py-3 bg-blue-950 text-white font-semibold rounded-xl hover:bg-blue-200 hover:text-blue-950 hover:border-2 hover:border-blue-900 transition-all duration-200 shadow-lg"
            >
              Let’s Get Started!
            </Link>
            <button
              onClick={handleDemoLogin}
              className="px-6 py-3 border-2 border-blue-950 text-blue-950 font-semibold rounded-xl hover:bg-blue-950 hover:text-white transition-all duration-200 shadow-lg"
            >
              Try Demo
            </button>
          </div>
        </motion.div>

        {/* App Preview Image */}
        <motion.div
          className="w-full h-full max-w-4xl my-8 p-3 bg-slate-100 rounded-md"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.8 }}
          viewport={{ once: true }}
        >
          <img
            id="demo"
            className="w-full shadow-lg"
            src={dashboardPreview}
            alt="Taskora Dashboard Preview"
          />
        </motion.div>

        {/* Features */}
        <FeatureSection />

        {/* Feature Steps */}
        <FeatureSteps />
      </main>
      <Footer />
    </div>
  );
};

export default LandingPage;
