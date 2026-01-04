import React from "react";
import {
  education,
  experience,
  certifications,
} from "../../data/resumeExpData";
import { motion } from "framer-motion";
import { BsBriefcaseFill } from "react-icons/bs";
import { FaUserGraduate } from "react-icons/fa";

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.08, duration: 0.5 },
  }),
};

export default function Resume() {
  const [hoveredEdu, setHoveredEdu] = React.useState<number | null>(null);
  const [hoveredExp, setHoveredExp] = React.useState<number | null>(null);
  const [previewImage, setPreviewImage] = React.useState<string | null>(null);

  React.useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") setPreviewImage(null);
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, []);

  return (
    <section className="container mx-auto px-4 py-14">
      {/* Heading */}
      <h1 className="text-4xl font-semibold text-center text-darkHeadingColor mb-16">
        Resume
      </h1>

      {/* Education + Experience */}
      <div className="relative grid grid-cols-1 lg:grid-cols-2 gap-10 max-w-5xl mx-auto">
        {/* Education */}
        <div>
          <div className="flex items-center gap-3 mb-8 min-h-[40px]">
            <FaUserGraduate className="text-2xl text-textColor" />
            <h2 className="text-2xl font-semibold text-darkHeadingColor">
              Education
            </h2>
          </div>

          <div className="relative pl-8 pt-1 space-y-12 before:absolute before:left-[1px] before:top-0 before:bottom-0 before:w-[2px] before:bg-gradient-to-b before:from-textColor/60 before:via-textColor/30 before:to-transparent">
            {education.map((edu, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                custom={index}
                className="relative group"
                onHoverStart={() => setHoveredEdu(index)}
                onHoverEnd={() => setHoveredEdu(null)}
              >
                <motion.span
                  animate={{
                    scale: hoveredEdu === index ? 1.25 : 1,
                    backgroundColor:
                      hoveredEdu === index ? "var(--textColor)" : "#D1D5DB",
                  }}
                  transition={{ type: "spring", stiffness: 400 }}
                  className="absolute -left-[14px] top-2 h-4 w-4 rounded-full shadow ring-4 ring-white"
                />
                <div className="pl-8">
                  <motion.div
                    whileHover={{ y: -6 }}
                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                    className="rounded-xl backdrop-blur border border-gray-200 px-5 py-4 shadow-sm transition-shadow duration-300 group-hover:shadow-lg group-hover:border-textColor/40"
                  >
                    <div className="min-h-[32px] flex items-center mb-2">
                      <span className="inline-block text-xs font-medium px-3 py-1 rounded-full 
                        bg-textColor/10 text-textColor tracking-wide">
                        {edu.duration}
                      </span>
                    </div>
                    <div className="flex items-start gap-4">
                      <div className="h-12 w-12" /> {/* placeholder to match experience logo */}
                      <div>
                        <p className="text-lg font-semibold text-textColor">
                          {edu.degree}
                        </p>
                        <p className="text-sm">{edu.college}</p>
                        {edu.university && (
                          <p className="text-sm text-gray-500">{edu.university}</p>
                        )}
                      </div>
                    </div>
                  </motion.div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Experience */}
        <div>
          <div className="flex items-center gap-3 mb-8 min-h-[40px]">
            <BsBriefcaseFill className="text-2xl text-textColor" />
            <h2 className="text-2xl font-semibold text-darkHeadingColor">
              Experience
            </h2>
          </div>

          <div className="relative pl-8 pt-1 space-y-12 before:absolute before:left-[1px] before:top-0 before:bottom-0 before:w-[2px] before:bg-gradient-to-b before:from-textColor/60 before:via-textColor/30 before:to-transparent">
            {experience.map((exp, index) => {
              const isCurrent = exp.duration.toLowerCase().includes("present");
              return (
                <motion.div
                  key={index}
                  variants={itemVariants}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  custom={index}
                  className="relative group"
                  onHoverStart={() => setHoveredExp(index)}
                  onHoverEnd={() => setHoveredExp(null)}
                >
                  <motion.span
                    animate={{
                      scale:
                        hoveredExp === index || isCurrent ? 1.25 : 1,
                      backgroundColor:
                        hoveredExp === index
                          ? "var(--textColor)"
                          : isCurrent
                          ? "var(--textColor)"
                          : "#D1D5DB",
                    }}
                    transition={{ type: "spring", stiffness: 400 }}
                    className="absolute -left-[14px] top-2 h-4 w-4 rounded-full shadow ring-4 ring-white"
                  />
                  <div className="pl-8">
                    <motion.div
                      whileHover={{ y: -6, scale: 1.01 }}
                      transition={{ type: "spring", stiffness: 300, damping: 20 }}
                      className={`rounded-xl px-5 py-4 border backdrop-blur transition-shadow duration-300 group-hover:border-textColor/40`}
                    >
                      <div className="min-h-[32px] flex items-center mb-2">
                        <span
                          className={`inline-block text-xs font-medium px-3 py-1 rounded-full tracking-wide
                          ${isCurrent
                              ? "bg-textColor text-white"
                              : "bg-textColor/10 text-textColor"
                            }`}
                        >
                          {exp.duration}
                        </span>
                      </div>

                      <div className="flex items-start gap-4">
                        <motion.div
                          whileHover={{ scale: 1.08 }}
                          transition={{ type: "spring", stiffness: 300, damping: 20 }}
                          className="h-12 w-12 rounded-lg bg-white border border-gray-200 
                          shadow flex items-center justify-center"
                        >
                          <img
                            src={exp.logo}
                            alt={exp.company}
                            className="h-8 w-auto object-contain"
                          />
                        </motion.div>
                        <div>
                          <p className="text-lg font-semibold text-textColor">
                            {exp.company}
                          </p>
                          <p className="text-sm">{exp.role}</p>
                        </div>
                      </div>
                    </motion.div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Certifications */}
      <div className="mt-16 max-w-6xl mx-auto">
        <h2 className="text-2xl font-semibold text-center text-darkHeadingColor mb-10">
          Certifications
        </h2>
        <p className="text-center text-gray-500 mb-12">
          Industry-recognized programs and professional upskilling
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
          {certifications.map((cert, index) => (
            <motion.div
              key={index}
              whileHover={{ y: -6 }}
              onClick={() => setPreviewImage(cert.image)}
              className="group cursor-pointer block rounded-xl overflow-hidden bg-white shadow-[0_10px_25px_rgba(0,0,0,0.08)]"
            >
              <div className="h-44 overflow-hidden">
                <img
                  src={cert.image}
                  alt={cert.title}
                  loading="lazy"
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
              </div>
              <div className="p-4">
                <p className="text-sm font-medium text-center text-textColor">
                  {cert.title}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {previewImage && (
        <motion.div
          className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center px-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setPreviewImage(null)}
        >
          <button
            onClick={() => setPreviewImage(null)}
            className="absolute top-6 left-6 z-50 
                       bg-white/90 hover:bg-white 
                       text-gray-800 
                       rounded-full w-10 h-10 
                       flex items-center justify-center 
                       shadow-lg transition"
            aria-label="Close preview"
          >
            ✕
          </button>
          <motion.img
            src={previewImage}
            alt="Certificate Preview"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 25 }}
            className="max-h-[90vh] max-w-full rounded-xl shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          />
        </motion.div>
      )}
    </section>
  );
}