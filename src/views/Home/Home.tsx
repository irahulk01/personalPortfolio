"use client";

import Image from "next/image";
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
      className="w-full min-h-[calc(100vh-120px)] lg:h-[calc(100vh-120px)] flex flex-col justify-between py-2 lg:py-4 relative overflow-hidden"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Top Hero Section */}
      <div className="flex flex-col-reverse md:flex-row items-center justify-between gap-8 lg:gap-12 my-auto w-full">
        <motion.div
          className="md:w-1/2 text-center md:text-left"
          variants={textVariants}
        >
          <div className="text-lg font-bold mb-3 flex items-center justify-center md:justify-start">
            <div className="flex items-center -space-x-1.5">
              <span><HiOutlineMinus /></span>
              <span><HiOutlineMinus /></span>
            </div>
            <span className="ml-3">Hello</span>
          </div>
          <div>
            <p className="text-gray-700 text-lg sm:text-xl leading-relaxed">
              <span className="block text-3xl sm:text-4xl lg:text-5xl font-extrabold mb-3 text-darkHeadingColor">
                I'm <span className="text-highLighter">Rahul</span> Kumar
              </span>
              Web Developer with specialization in React, based in Kolkata, West Bengal, India. I'm a passionate engineer eager to contribute my skills and collaborate with teams around the world.
            </p>
            <div className="mt-4">
              <Resume />
            </div>
          </div>
        </motion.div>

        {/* Profile Image */}
        <motion.div
          variants={imgVariants}
          className="relative flex items-center justify-center shrink-0"
        >
          {/* Background Shape (Commented out to work on later)
          <div className="absolute w-[116%] h-[116%] rounded-[60%_40%_30%_70%/60%_30%_70%_40%] bg-gradient-to-tr from-[#9bb1f5]/45 via-[#c8d4fa]/65 to-[#ff033e]/20 blur-[5px] -z-10" />
          */}

          {/* Profile Cutout Image Container */}
          <div className="relative w-56 h-56 sm:w-72 sm:h-72 md:w-80 md:h-80 lg:w-[24rem] lg:h-[24rem] rounded-b-full overflow-hidden shadow-2xl">
            <Image
              src={profileImg}
              alt="Rahul Kumar"
              placeholder="blur"
              layout="fill"
              objectFit="cover"
              priority
            />
          </div>
        </motion.div>
      </div>

      {/* Bottom Footer Section */}
      <motion.div
        className="w-full mt-auto pt-2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 0.5 }}
      >
        <SocialMediaIcons />
        <div className="mt-2 text-sm text-textColor/90 font-medium">
          {viewCount !== null ? (
            <div className="transition-opacity duration-500 opacity-100">
              <span className="font-semibold">Visit Count:</span> {viewCount}
            </div>
          ) : (
            <div className="transition-opacity duration-500 opacity-0">
              <span className="font-semibold">Visit Count:</span> Loading...
            </div>
          )}
        </div>
      </motion.div>
    </motion.main>
  );
};

export default Home;