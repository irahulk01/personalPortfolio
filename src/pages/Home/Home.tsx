import { motion } from "framer-motion";
import { containerVariants, textVariants, imgVariants } from './homeStyleEffect';
import profileImg from "../../assets/Profile/profile.png";
import SocialMediaIcons from "../../component/SocialMediaIcons/SocialMediaIcons";
import { HiOutlineMinus } from "react-icons/hi";
import { Resume } from "../../component/ResumeButton/ResumeButton";
import useVisitCount from "../../hooks/useVisitCount"; 

const Home = () => {
  const viewCount = useVisitCount();

  return (
    <motion.main
      className="relative"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <section className="flex flex-col-reverse md:flex-row items-center justify-center h-screen gap-20 -mt-20">
        <motion.div
          className="md:w-1/2 lg:w-[30rem] text-center"
          variants={textVariants}
        >
          <div className="text-lg font-bold text-left mb-4 flex">
            <div className="flex items-center -space-x-1.5">
              <span><HiOutlineMinus /></span>
              <span><HiOutlineMinus /></span>
            </div>
            <span className="ml-3">Hello</span>
          </div>
          <div className="text-left">
            <p>
              <span className="block text-4xl font-bold">
                I'm <span className="text-highLighter">Rahul</span> Kumar
              </span>
              Web Developer with specialization in React, based in
              Kolkata, West Bengal, India. I'm a passionate engineer eager to contribute my skills
              and collaborate with teams around the world.
            </p>
            <div>
              <Resume />
            </div>
          </div>
        </motion.div>
        <motion.img
          src={profileImg}
          alt="Rahul Kumar"
          loading="lazy"
          className="md:w-1/2 w-[20rem] lg:w-[36rem] lg:h-[36rem] rounded-b-full mt-4"
          variants={imgVariants}
        />
      </section>

      <section className="absolute bottom-[-4rem] flex flex-col lg:flex-row justify-center lg:justify-between w-full items-center">
        <motion.div
          className="text-xl mb-[1rem] m-[2rem] lg:mb-[6rem]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 0.5 }}
        >
          <SocialMediaIcons />
          <div className="mt-4">
            {viewCount !== null ? (
              <div className="transition-opacity duration-500 opacity-100">
                <span>Visit Count:</span> {viewCount}
              </div>
            ) : (
              <div className="transition-opacity duration-500 opacity-0">
                <span>Visit Count:</span> Loading...
              </div>
            )}
          </div>
        </motion.div>
      </section>
    </motion.main>
  );
};

export default Home;