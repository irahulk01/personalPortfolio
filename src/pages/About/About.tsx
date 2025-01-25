import { motion } from "framer-motion";
import profile from "../../assets/Profile/profile2.jpg";
import { HiOutlineMinus } from "react-icons/hi";
import { skills } from "./skillData";
import { Link } from "react-router-dom";
import "./About.css";

const About = () => {
  // Animations
  const textVariants = {
    hidden: { opacity: 0, x: -100 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 1,
        ease: "easeInOut",
      },
    },
  };

  const imageVariants = {
    hidden: { opacity: 0, scale: 0.5 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 1,
        delay: 0.5,
      },
    },
  };

  return (
    <div className="mt-[4rem] relative">
      <div className="flex flex-col sm:flex-row items-center">
        <motion.div
          className="w-full sm:w-1/2 flex justify-center animate-bounce-left"
          variants={imageVariants}
          initial="hidden"
          animate="visible"
        >
          <img
            loading="lazy"
            src={profile}
            alt="Your Photo"
            className="max-w-full h-auto rounded-full w-[23rem]"
          />
        </motion.div>
        <motion.div
          className="w-full sm:w-1/2 mt-4 sm:mt-0 flex justify-center lg:justify-start animate-right-appear"
          variants={textVariants}
          initial="hidden"
          animate="visible"
        >
          <div>
            <div className="flex gap-x-2 text-4xl font-bold">
              <span className="flex -space-x-3">
                <span>
                  <HiOutlineMinus />
                </span>
                <span>
                  <HiOutlineMinus />
                </span>
              </span>
              <h1 className="text-darkHeadingColor mb-4">About Me</h1>
            </div>
            <p className="text-gray-700 text-2xl font-semibold font-caviateFont">
              With 2.6 years of immersive experience across diverse technology stacks, I'm dedicated to infusing creativity and expertise into every project. From conception to execution, I strive to push boundaries, crafting compelling solutions that resonate and drive tangible results. My passion for innovation fuels my commitment to delivering excellence, ensuring each endeavor leaves a lasting impact.
            </p>
            <div className="mt-5">
              <Link
                to="/Contact"
                className="bg-highLighter hover:bg-[#ff577f] text-white font-bold py-2 px-4 rounded-md shadow-lg"
              >
                Hire me
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
      <div className="flex justify-start lg:justfy-center lg:justify-start mt-8 ">
        <div className="font-bold text-2xl flex items-center lg:transform lg:-rotate-90 lg:-ml-9">
          <div className="flex gap-x-2 justify-start">
            <span className="flex items-center -space-x-1.5">
              <span>
                <HiOutlineMinus />
              </span>
              <span>
                <HiOutlineMinus />
              </span>
            </span>
            <p className="ml-2 ">My Skills</p>
          </div>
        </div>
      </div>
      <div className="mt-[1rem] lg:px-20 grid sm:grid-cols-2 gap-x-20">
        {skills.map((skill, index) => (
          <div key={index} className="mb-4">
            <div className="text-left font-semibold flex items-center gap-2 p-2">
              <span className="text-[2rem] flex">{skill.icon}</span>
              <span>{skill.name}</span>
            </div>
            <div className="h-2 bg-gray-300 rounded-full">
              <motion.div
                className="h-full bg-[#3e4455] rounded-full"
                style={{
                  width: `${(skill.percentage / 100) * 100}%`,
                  animation: "fillAnimation 1s ease-in-out forwards",
                }}
                initial={{ width: 0 }}
                animate={{ width: `${(skill.percentage / 100) * 100}%` }}
              ></motion.div>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-5 flex justify-end">
        <Link
          to="/Work"
          className="lg:hidden bg-darkHeadingColor text-white font-bold py-2 px-4 rounded-sm shadow-lg "
        >
          Projects
        </Link>
      </div>
    </div>
  );
};

export default About;
