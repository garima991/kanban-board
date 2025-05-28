import { motion } from "framer-motion";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <motion.footer
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className="bg-gradient-to-tr from-[#0B1A33] to-[#13294B] text-white px-8 py-12"
    >
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
        
        <div className="text-center md:text-left">
          <h2 className="text-2xl font-bold mb-3">
            Supercharge your workflow with Taskora ⚡
          </h2>
          <p className="text-gray-300 mb-4">
            Drag. Drop. Done. Experience effortless Kanban productivity.
          </p>
          {/* <Link to="/signup"> */}
            <button className="bg-white text-[#0B1A33] font-semibold px-6 py-2 rounded-full shadow hover:bg-gray-200 transition duration-300">
              Try Taskora Now
            </button>
          {/* </Link> */}
        </div>

        
        <div className="text-center md:text-right text-sm text-gray-400">
          <p>&copy; {new Date().getFullYear()} Taskora. Built with 💙</p>
          <p className="mt-1">Made by Garima</p>
        </div>
      </div>
    </motion.footer>
  );
};

export default Footer;
