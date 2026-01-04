import React, { useState } from "react";
import { motion, Variants } from "framer-motion";
import { projects } from "./workData";
import WorkPopUp from "./WorkPopUp";
import { FiArrowUpRight } from "react-icons/fi";

interface Project {
  name: string;
  description: string;
  image: string;
  link: string;
  tags: string[];
  features: string[];
  organisationWorkedWith: string;
  organisationLogo: string;
}

const Work: React.FC = () => {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  const gridVariants: Variants = {
    animate: {
      transition: { staggerChildren: 0.12 },
    },
  };

  const cardVariants: Variants = {
    initial: { opacity: 0, y: 30 },
    animate: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" },
    },
  };

  return (
    <section className="container mx-auto px-4 py-16">
      <h1 className="text-4xl font-semibold text-center mb-14 text-textColor">
        Selected Works
      </h1>

      <motion.div
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10"
        variants={gridVariants}
        initial="initial"
        animate="animate"
      >
        {projects.map((project, index) => (
          <motion.div
            key={index}
            variants={cardVariants}
            whileHover={{ y: -8 }}
            className="group relative rounded-2xl overflow-hidden bg-white shadow-[0_10px_30px_rgba(0,0,0,0.08)] cursor-pointer"
            onClick={() => setSelectedProject(project)}
          >
            {/* Image */}
            <div className="relative h-56 overflow-hidden">
              <img
                src={project.image}
                alt={project.name}
                loading="lazy"
                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
              />

              {/* Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

              {/* CTA */}
              <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-4 group-hover:translate-y-0">
                <span className="text-white text-sm font-medium">
                  View case study
                </span>
                <FiArrowUpRight className="text-white text-xl" />
              </div>
            </div>

            {/* Content */}
            <div className="p-6">
              <h2 className="text-xl font-semibold text-[#3e4355] mb-2">
                {project.name}
              </h2>

              <p className="text-sm text-gray-600 line-clamp-3 mb-4">
                {project.description}
              </p>

              {/* Tags */}
              <div className="flex flex-wrap gap-2">
                {project.tags.slice(0, 4).map((tag, i) => (
                  <span
                    key={i}
                    className="text-xs px-3 py-1 rounded-full bg-[#f2f3f7] text-[#3e4355]"
                  >
                    {tag}
                  </span>
                ))}
                {project.tags.length > 4 && (
                  <span className="text-xs text-gray-400">
                    +{project.tags.length - 4}
                  </span>
                )}
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {selectedProject && (
        <WorkPopUp
          selectedProject={selectedProject}
          closeModal={() => setSelectedProject(null)}
        />
      )}
    </section>
  );
};

export default Work;