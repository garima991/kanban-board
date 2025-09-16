import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import {
  loginUser,
  registerUser,
  clearFieldErrors,
} from "../redux/features/authSlice";

export default function AuthPage() {
  const [isLoggedIn, setIsLoggedIn] = useState(true);
  const [formData, setFormData] = useState({
    name: "",
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "member",
  });

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { user, errorMessage, fieldErrors, authChecked } = useSelector(
    (state) => state.auth
  );

  // Redirect if already logged in once auth has been checked
  useEffect(() => {
    if (!authChecked) return;
    if (user) {
      const role = user.role === "admin" ? "admin" : "member";
      navigate(`/${role}/dashboard`, { replace: true });
    }
  }, [user, authChecked, navigate]);

  // Clear form & field errors on mode switch
  useEffect(() => {
    dispatch(clearFieldErrors());
    setFormData({
      name: "",
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
      role: "member",
    });
  }, [isLoggedIn, dispatch]);

  useEffect(() => {
    if (errorMessage) {
      toast.error(errorMessage);
    }
  }, [errorMessage]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    if (isLoggedIn) {
      const result = await dispatch(
        loginUser({
          email: formData.email,
          password: formData.password,
        })
      ).unwrap();

      const role = result.role === "admin" ? "admin" : "member";
      navigate(`/${role}/dashboard`, { replace: true });
    } else {
      const resultAction = await dispatch(
        registerUser({
          name: formData.name,
          username: formData.username,
          email: formData.email,
          password: formData.password,
          confirmPassword: formData.confirmPassword,
          role: formData.role,
        })
      );

      if (registerUser.fulfilled.match(resultAction)) {
        toast.success("Registration successful! Please log in.");
        setIsLoggedIn(true);
      }
    }
  };

  return (
    <div className="min-h-screen grid grid-cols-1 md:grid-cols-2 bg-gray-100 overflow-hidden">
      {/* Left Panel */}
      <motion.div
        key={isLoggedIn ? "login-sider" : "signup-sider"}
        variants={transitionVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
        className="relative hidden md:flex flex-col justify-center items-center px-10 py-20 bg-gradient-to-br from-blue-800 to-blue-950 text-white transition-all duration-500 m-2 rounded-lg"
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={isLoggedIn ? "login-content" : "signup-content"}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
            className="text-center"
          >
            <h1 className="text-4xl font-bold mb-4">
              {isLoggedIn ? "Welcome Back!" : "Get Started 🚀"}
            </h1>
            <p className="text-lg max-w-md">
              {isLoggedIn
                ? "Dive back into your boards and keep productivity flowing."
                : "Join Taskora and transform the way your team collaborates and tracks tasks."}
            </p>
          </motion.div>
        </AnimatePresence>
      </motion.div>

      {/* Right Panel */}
      <div className="flex justify-center items-center px-6 py-12">
        <motion.div
          initial={{ opacity: 0, scale: 0.97 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4 }}
          className="w-full max-w-md bg-white p-8 rounded-xl shadow-xl"
        >
          <h2 className="text-xl font-semibold text-center text-gray-800 mb-6">
            {isLoggedIn ? "Log in to Taskora" : "Create your Taskora account"}
          </h2>

          <AnimatePresence mode="wait">
            <motion.form
              key={isLoggedIn ? "login" : "signup"}
              variants={transitionVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="flex flex-col gap-5"
              onSubmit={handleFormSubmit}
            >
              {!isLoggedIn && (
                <>
                  <Input
                    label="Full Name"
                    name="name"
                    placeholder="Clay Jensen"
                    value={formData.name}
                    onChange={handleChange}
                    error={fieldErrors.name}
                  />
                  <Input
                    label="Username"
                    name="username"
                    placeholder="JensenClay123"
                    minLength={5}
                    value={formData.username}
                    onChange={handleChange}
                    error={fieldErrors.username}
                  />
                </>
              )}

              <Input
                label="Email"
                name="email"
                type="email"
                placeholder="you@example.com"
                value={formData.email}
                onChange={handleChange}
                error={fieldErrors.email}
              />
              <Input
                label="Password"
                name="password"
                type="password"
                placeholder={isLoggedIn ? "••••••••" : "At least 8 characters"}
                minLength={8}
                value={formData.password}
                onChange={handleChange}
                error={fieldErrors.password}
              />
              {!isLoggedIn && (
                <Input
                  label="Confirm Password"
                  name="confirmPassword"
                  type="password"
                  placeholder="Confirm password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  error={fieldErrors.confirmPassword}
                />
              )}

              <AuthButton text={isLoggedIn ? "Login" : "Sign Up"} />
              <SwitchLink isLogin={isLoggedIn} setIsLogin={setIsLoggedIn} />
            </motion.form>
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  );
}

function Input({ label,name, type = "text", placeholder, value, onChange, error, ...props }) {
  return (
    <div className="relative">
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        name={name}
        className="w-full px-4 py-3 text-sm text-gray-800 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-800"
      />
      <label className="absolute left-4 -top-2 text-xs bg-white px-1 text-gray-500">
        {label}
      </label>
      {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
    </div>
  );
}

function AuthButton({ text }) {
  const isOnline = useSelector((state) => state.app.isOnline);
  return (
    <button
      type="submit"
      className="w-full py-2.5 bg-blue-800 hover:bg-blue-900 disabled:bg-opacity-60 text-white rounded-md text-sm font-medium transition"
      disabled={!isOnline}
    >
      {text}
    </button>
  );
}

function SwitchLink({ isLogin, setIsLogin }) {
  return (
    <p className="text-sm text-center text-gray-600 mt-4">
      {isLogin ? "Don’t have an account?" : "Already have an account?"}{" "}
      <button
        type="button"
        onClick={() => setIsLogin(!isLogin)}
        className="text-blue-600 font-medium hover:underline"
      >
        {isLogin ? "Sign up" : "Login"}
      </button>
    </p>
  );
}

const transitionVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.6 } },
  exit: { opacity: 0, x: 20, transition: { duration: 0.3 } },
};