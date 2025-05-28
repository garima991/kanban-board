import React from "react";
import { motion } from "framer-motion";
import {
  FaTasks,
  FaShieldAlt,
  FaRocket,
  FaUserShield,
  FaListUl,
  FaColumns,
  FaUserLock,
  FaClipboardList,
  FaUserPlus
} from "react-icons/fa";

const features = [
    {
      title: "Effortless Task Management",
      description: "Easily create, assign, and track tasks as they move through different workflow stages.",
      icon: <FaTasks className=" text-2xl" />,
      // color: "bg-blue-500"
    },
    {
      title: "Secure & Controlled Access",
      description: "Protect your data with role-based permissions and enterprise-grade security protocols.",
      icon: <FaShieldAlt className=" text-2xl" />,
      // color: "bg-red-500"
    },
    {
      title: "Accelerated Project Launch",
      description: "Speed up your workflow with a streamlined interface designed for fast project kick-offs.",
      icon: <FaRocket className=" text-2xl" />,
      // color: "bg-pink-500"
    },
    {
      title: "Powerful Admin Controls",
      description: "Admins can manage users, boards, and permissions with advanced administrative tools.",
      icon: <FaUserShield className=" text-2xl" />,
      color: "bg-indigo-500"
    },
    {
      title: "List-Based Task View",
      description: "Switch to a clean, structured list view for detailed task tracking and organization.",
      icon: <FaListUl className=" text-2xl" />,
      color: "bg-teal-500"
    },
    {
      title: "Multiple Work Views",
      description: "Choose from Kanban, List, or Timeline views to match your team's preferred workflow style.",
      icon: <FaColumns className=" text-2xl" />,
      // color: "bg-orange-500"
    },
    {
      title: "In-Depth Task Details",
      description: "Drill down into tasks with subtasks, comments, and activity logs. Edit access is limited to task members; board control stays with board members.",
      icon: <FaClipboardList className=" text-2xl" />,
      // color: "bg-lime-500"
    },
    {
      title: "Role-Based User Access",
      description: "Implement secure login and access levels to ensure the right users manage the right boards and tasks.",
      icon: <FaUserLock className=" text-2xl" />,
      // color: "bg-gray-700"
    },
    {
      title: "Smart Member Invitations",
      description: "Admins can invite members to specific boards and tasks, ensuring targeted collaboration and access.",
      icon: <FaUserPlus className=" text-2xl" />,
      // color: "bg-yellow-500"
    }
  ];
  

const cardVariants = {
  hidden: { opacity: 0, y: 40, scale: 0.95 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      delay: i * 0.12,
      duration: 0.6,
      type: "spring",
      stiffness: 120
    }
  })
};

const FeatureCard = ({ feature, index }) => (
  <motion.div
    custom={index}
    variants={cardVariants}
    initial="hidden"
    whileInView="visible"
    viewport={{ once: true, amount: 0.2 }}
    className="bg-blue-50 flex flex-col justify-center items-center p-6 rounded-2xl shadow-xl hover:shadow-2xl transform transition-transform duration-300 border-t-4"
  >
    <motion.div
      whileHover={{ rotate: 8 }}
      className={`w-12 h-12 flex items-center justify-center rounded-full mb-4`}
    >
      {feature.icon}
    </motion.div>
    <h4 className="text-xl font-bold text-blue-950 mb-2">{feature.title}</h4>
    <p className="text-gray-600 leading-relaxed">{feature.description}</p>
  </motion.div>
);

const FeatureSection = () => (
  <motion.section
    id="features"
    initial={{ opacity: 0, y: 40 }}
    whileInView={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.8, ease: "easeOut" }}
    viewport={{ once: true }}
    className="w-full max-w-6xl mt-20 px-4"
  >
    <motion.h3
      initial={{ opacity: 0, y: -20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2, duration: 0.6 }}
      className="text-3xl md:text-4xl font-bold text-blue-950 mb-12 text-center"
    >
      What can you do with <span className="font-extrabold">Taskora </span>?
    </motion.h3>

    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
      {features.map((feature, index) => (
        <FeatureCard key={index} feature={feature} index={index} />
      ))}
    </div>
  </motion.section>
);

export default FeatureSection;
