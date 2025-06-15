import { motion } from "framer-motion";
import login from "../assets/login.png";
import createBoard from "../assets/create-board.png";
import addTask from "../assets/add-task.png";
import manageTask from "../assets/manage-task.png";


const steps = [
  {
    step: 1,
    title: "Sign Up or Login",
    desc: "Create an account or log in to access your Kanban boards.",
    image: login,
    spanClass: "", // regular
  },
  {
    step: 2,
    title: "Create a Board",
    desc: "Start organizing your workflow by creating your first Kanban board.",
    image: createBoard,
    spanClass: "", // taller
  },
  {
    step: 3,
    title: "Add Tasks",
    desc: "Categorize tasks into To-Do, In Progress, and Done.",
    image: addTask,
    spanClass: "", // regular
  },
  {
    step: 4,
    title: "Assign & Organize",
    desc: "Assign tasks and set priorities with your team.",
    image: manageTask,
    spanClass: "", // taller
  },
];

function FeatureCard({ step, title, desc, image, delay, spanClass }) {
  return (
    <motion.div
      className={`bg-white rounded-2xl border shadow-md p-6 flex flex-col justify-between items-center ${spanClass} max-h-fit`}
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay, duration: 0.6 }}
    >
      <div>
        <p className="text-sm text-blue-800 font-semibold mb-1">0{step}</p>
        <h3 className="text-lg font-bold text-gray-800 mb-2">{title}</h3>
        <p className="text-sm text-gray-500 mb-4">{desc}</p>
      </div>
      <div className="border-2 rounded-2xl overflow-hidden">
        <img src={image} alt={title} className="w-full h-52 object-contain " />
      </div>
    </motion.div>
  );
}

const FeatureSteps = () => {
  return (
    <motion.section className="py-24">
      <div className="max-w-6xl mx-auto px-4">
        <motion.h3
              initial={{ opacity: 0, y: -20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="text-3xl md:text-4xl font-bold text-blue-950 mb-12 text-center"
            >
              How <span className="font-extrabold">Taskora </span> works . . .
            </motion.h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          {steps.map((step, index) => (
            <FeatureCard key={index} {...step} delay={index * 0.2} />
          ))}
        </div>
      </div>
    </motion.section>
  );
};

export default FeatureSteps;
