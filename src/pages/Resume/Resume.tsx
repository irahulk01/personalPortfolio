import { certifications } from "./ResumeData";
import { motion } from "framer-motion";
import pisc from "../../assets/CompanyLogo/pandoLogo.png";
import nmsGames from "../../assets/CompanyLogo/nmsGames.jpeg";
import fyndImg from "../../assets/CompanyLogo/fynd.png";
import AiLogo from "../../assets/CompanyLogo/aiLogo.png";
import { BsBriefcaseFill } from "react-icons/bs";
import { FaUserGraduate, FaSchool } from "react-icons/fa";
import { FcGraduationCap } from "react-icons/fc";

export default function Resume() {
  const experienceVariants = {
    hidden: { opacity: 0, x: -50 },
    visible: { opacity: 1, x: 0 },
  };

  const educationVariants = {
    hidden: { opacity: 0, x: 50 },
    visible: { opacity: 1, x: 0 },
  };
  return (
    <div>
      <section className="mt-10 flex justify-center">
        <h1 className="text-darkHeadingColor text-3xl">
          Resume
        </h1>
      </section>
      <section className="flex-row-reverse lg:flex lg:justify-center gap-[8rem]">
        <motion.div
          className="lg:w-[29rem] space-y-7"
          initial="hidden"
          animate="visible"
          variants={experienceVariants}
        >
          <div className="">
            <p className="text-darkHeadingColor text-2xl font-bold p-5 flex items-center justify-center">
              <span className="mr-3">
                <BsBriefcaseFill />
              </span>
              Experience
            </p>
            <div className="mb-7 px-5 py-3 text-textColor bg-[#e5e8f3] rounded-lg transition-transform duration-300 ease-in-out hover:bg-[#dee1ec] hover:shadow-xl
            hover:transform hover:translate-x-2">
              <p className="text-sm font-medium flex items-center">
                <span className="hover:cursor-pointer">
                  <a href="https://www.fynd.com/" target="_blank">
                    <img loading="lazy" className="w-16 h-auto py-3 mr-4" src={AiLogo} alt="fyndImg" />
                  </a>
                </span>
                Jun 2024 to Present
              </p>
              <p className="text-xl font-semibold">
              Aggregate Intelligence
              </p>
              <p>React Developer</p>
            </div>
            <div className="px-5 py-3 text-textColor bg-[#e5e8f3] rounded-lg transition-transform duration-300 ease-in-out hover:bg-[#dee1ec] hover:shadow-xl
            hover:transform hover:translate-x-2">
              <p className="text-sm font-medium flex items-center">
                <span className="hover:cursor-pointer">
                  <a href="https://pandoconsultants.com/" target="_blank">
                    <img loading="lazy" src={pisc} alt="pisc" className="w-16 h-auto py-3 mr-4" />
                  </a>
                </span>Sep 2022 to June 2024</p>
              <p className="text-xl font-semibold">
                Pando India Software Consultants
              </p>
              <p>Frontend Developer</p>
            </div>
          </div>
          <div className="">
            <div className="px-5 py-3 text-textColor bg-[#e5e8f3] rounded-lg transition-transform duration-300 ease-in-out hover:bg-[#dee1ec] hover:shadow-xl
            hover:transform hover:translate-x-2">
              <p className="text-sm font-medium flex items-center ">
                <span className="hover:cursor-pointer">
                  <a href="https://nmsgames.com/" target="_blank">
                    <img loading="lazy" src={nmsGames} alt="nmsGames" className="w-10 h-auto py-3 mr-4" />
                  </a>
                </span>Nov 2021 to Jul 2022</p>
              <p className="text-xl font-semibold">
                NMS Games Private Ltd
              </p>
              <p>Backend Developer</p>
            </div>
          </div>
          <div className="">
            <div className="px-5 py-3 text-textColor bg-[#e5e8f3] rounded-lg transition-transform duration-300 ease-in-out hover:bg-[#dee1ec] hover:shadow-xl
            hover:transform hover:translate-x-2">
              <p className="text-sm font-medium flex items-center">
                <span className="hover:cursor-pointer">
                  <a href="https://www.fynd.com/" target="_blank">
                    <img loading="lazy" className="w-16 h-auto py-3 mr-4" src={fyndImg} alt="fyndImg" />
                  </a>
                </span>
                Aug 2021 to Oct 2021
              </p>
              <p className="text-xl font-semibold">
                Fynd Shopsence Private Limited a (Reliance backed Company)
              </p>
              <p>Full Stack Developer Trainee</p>
            </div>
          </div>
        </motion.div>
        <motion.div
          className="lg:w-[29rem] space-y-7"
          initial="hidden"
          animate="visible"
          variants={educationVariants}
        >
          <div className="">
            <p className="text-darkHeadingColor text-2xl font-bold p-5 flex items-center justify-center">
              <span className="mr-3">
                <FaUserGraduate />
              </span>Education </p>
            <div className="px-5 py-3 text-textColor bg-[#e5e8f3] rounded-lg transition-transform duration-300 ease-in-out hover:bg-[#dee1ec] hover:shadow-xl
            hover:transform hover:translate-x-2">
              <p className="text-sm font-medium flex items-center">
                <span className="hover:cursor-pointer">
                  <FcGraduationCap className="w-8 h-auto py-3 mr-4" />
                </span>Aug 2016 to July 2020</p>
              <p className="text-xl font-semibold">
                Bachelor's of Technology
              </p>
              <p>Bengal College of Engineering and Technology</p>
              <p>Maulana Abul Kalam Azaad University of Technology</p>
            </div>
          </div>
          <div className="">
            <div className="px-5 py-3 text-textColor bg-[#e5e8f3] rounded-lg transition-transform duration-300 ease-in-out hover:bg-[#dee1ec] hover:shadow-xl
            hover:transform hover:translate-x-2">
              <p className="text-sm font-medium flex items-center">
                <span className="hover:cursor-pointer">
                  <FaSchool className="w-8 h-auto py-3 mr-4" />
                </span>Nov 2021 to July 2022</p>
              <p className="text-xl font-semibold">
                Higher Secondary School Certificate
              </p>
              <p>Badri Narayan Saha Dayanand Anglo Vedic Public School</p>
            </div>
          </div>
        </motion.div>
      </section>
      <section>
        <p className="text-darkHeadingColor text-center text-2xl font-bold p-5">
          Certifications
        </p>
        <div className="flex flex-wrap justify-between flex-grow">
          {certifications.map((certification, index) => (
            <div
              key={index}
              className="w-[24rem] py-4"
            >
              <motion.div
                className="rounded-lg"
                whileHover={{
                  scale: 1.05,
                  boxShadow: "0px 0px 8px 2px rgba(0,0,0,0.1)",
                }}
              >
                <a href={certification.link} target="_blank" rel="noopener noreferrer">
                  <img loading="lazy"
                    src={certification.image}
                    alt={certification.title}
                    className="max-w-full"
                  />
                  <p className="p-2 text-darkHeadingColor font-medium text-center">
                    {certification.title}
                  </p>
                </a>
              </motion.div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
