import {  education,  experience,  certifications,} from "../../data/resumeExpData";
import { motion } from "framer-motion";
import { BsBriefcaseFill } from "react-icons/bs";
import { FaUserGraduate } from "react-icons/fa";
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
      <section className="mt-10 flex flex-col lg:flex-row items-start justify-center gap-10">
        <div className="flex flex-col lg:flex-row gap-10 w-full justify-center">
          <motion.div
            className="w-full lg:w-[45%] space-y-7"
            initial="hidden"
            animate="visible"
            variants={educationVariants}
          >
            <p className="text-darkHeadingColor text-2xl font-bold p-5 flex items-center justify-center lg:justify-start">
              <span className="mr-3">
                <FaUserGraduate />
              </span>
              Education
            </p>
            {education.map((edu, index) => (
              <div key={index} className="px-5 py-3 text-textColor bg-[#e5e8f3] rounded-lg transition-transform duration-300 ease-in-out hover:bg-[#dee1ec] hover:shadow-xl hover:translate-x-2">
                <p className="text-sm font-medium flex items-center">
                  <FcGraduationCap className="w-8 h-auto py-3 mr-4" />
                  {edu.duration}
                </p>
                <p className="text-xl font-semibold">{edu.degree}</p>
                <p>{edu.college}</p>
                {edu.university && <p>{edu.university}</p>}
              </div>
            ))}
          </motion.div>

          <motion.div
            className="w-full lg:w-[55%] space-y-7"
            initial="hidden"
            animate="visible"
            variants={experienceVariants}
          >
            <p className="text-darkHeadingColor text-2xl font-bold p-5 flex items-center justify-center lg:justify-start">
              <span className="mr-3">
                <BsBriefcaseFill />
              </span>
              Experience
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {experience.map((exp, index) => (
                <div
                  key={index}
                  className="px-5 py-3 text-textColor bg-[#e5e8f3] rounded-lg transition-transform duration-300 ease-in-out hover:bg-[#dee1ec] hover:shadow-xl hover:translate-x-2"
                >
                  <p className="text-sm font-medium flex items-center">
                    <a href={exp.link} target="_blank" rel="noopener noreferrer">
                      <img
                        loading="lazy"
                        src={exp.logo}
                        alt={exp.company}
                        className="w-16 h-auto py-3 mr-4"
                      />
                    </a>
                    {exp.duration}
                  </p>
                  <p className="text-xl font-semibold">{exp.company}</p>
                  <p>{exp.role}</p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>
      <section>
        <p className="text-darkHeadingColor text-center text-2xl font-bold p-5">
          Certifications
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 justify-items-center">
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
