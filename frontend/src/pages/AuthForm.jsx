import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import { loginUser, registerUser } from "../redux/features/authSlice";

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

  const [formErrors, setFormErrors] = useState({
    name: "",
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const user = useSelector((state) => state.auth.user);

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    try {
      setFormErrors({}); // Reset errors before making the request

      if (isLoggedIn) {
        // Login flow

        dispatch(
          loginUser({
            email: formData.email,
            password: formData.password,
          })
        );

        const role = user.role;
        console.log(role);
        if (role === "admin") {
          navigate("/admin/dashboard");
        } else {
          navigate("/member/dashboard");
        }

        // navigate('/'); // Redirect after successful login
      } else {
        // Signup flow
        // if (formData.password !== formData.confirmPassword) {
        //   toast.error('Passwords do not match !');
        //   return;
        // }

        dispatch(
          registerUser({
            name: formData.name,
            username: formData.username,
            email: formData.email,
            password: formData.password,
            confirmPassword: formData.confirmPassword,
            role: formData.role,
          })
        );

        toast.success("Account Created Successfully !");

        // login after registering
        setIsLoggedIn(true);
      }
    } catch (error) {
      const { response } = error;
      const err = response?.data;

      if (err?.errors) {
        // Backend validation errors (from validateSignUpData)
        const errorMessage = err.errors;
        setFormErrors({
          name: errorMessage.name,
          email: errorMessage.email,
          username: errorMessage.username,
          password: errorMessage.password,
          confirmPassword: errorMessage.confirmPassword,
        });
        console.log(formErrors);
      } else if (err?.error) {
        toast.error(err.error);
      } else {
        console.log("");
      }
    }
  };

  return (
    <div className="min-h-screen grid grid-cols-1 md:grid-cols-2 bg-gray-100 overflow-hidden">
      {/* Animated Left Panel */}
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
              {isLoggedIn ? "Welcome Back !" : "Get Started 🚀"}
            </h1>
            <p className="text-lg max-w-md">
              {isLoggedIn
                ? "Dive back into your boards and keep productivity flowing."
                : "Join Taskora and transform the way your team collaborates and tracks tasks."}
            </p>
          </motion.div>
        </AnimatePresence>
      </motion.div>

      {/* Form Section */}
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
            {!isLoggedIn ? (
              <motion.form
                key="signup"
                variants={transitionVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                className="flex flex-col gap-5"
                onSubmit={handleFormSubmit}
              >
                <Input
                  label="Full Name"
                  name="name"
                  placeholder="Clay Jensen"
                  onChange={handleChange}
                  error={formErrors.name}
                />
                <Input
                  label="Username"
                  name="username"
                  placeholder="JensenClay123"
                  minLength={5}
                  onChange={handleChange}
                  error={formErrors.username}
                />
                <Input
                  label="Email"
                  name="email"
                  type="email"
                  placeholder="you@example.com"
                  onChange={handleChange}
                  error={formErrors.email}
                />
                <Input
                  label="Password"
                  name="password"
                  type="password"
                  placeholder="At least 8 characters"
                  minLength={8}
                  onChange={handleChange}
                  error={formErrors.password}
                />
                <Input
                  label="Confirm Password"
                  name="confirmPassword"
                  type="password"
                  placeholder="Confirm password"
                  onChange={handleChange}
                  error={formErrors.confirmPassword}
                />

                <AuthButton text="Sign Up" />
                <SwitchLink isLogin={isLoggedIn} setIsLogin={setIsLoggedIn} />
              </motion.form>
            ) : (
              <motion.form
                key="login"
                variants={transitionVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                className="flex flex-col gap-5"
                onSubmit={handleFormSubmit}
              >
                <Input
                  label="Email"
                  name="email"
                  type="email"
                  placeholder="you@example.com"
                  onChange={handleChange}
                  error={formErrors.email}
                />
                <Input
                  label="Password"
                  name="password"
                  type="password"
                  placeholder="••••••••"
                  onChange={handleChange}
                  error={formErrors.password}
                />

                <AuthButton text="Login" />
                <SwitchLink isLogin={isLoggedIn} setIsLogin={setIsLoggedIn} />
              </motion.form>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  );
}

function Input({
  label,
  type = "text",
  placeholder,
  onChange,
  error,
  ...props
}) {
  return (
    <div className="relative">
      <input
        type={type}
        placeholder={placeholder}
        onChange={onChange}
        {...props}
        error={error}
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
