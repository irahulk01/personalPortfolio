import React, { useState, useEffect } from "react";
import { motion, Variants } from "framer-motion";
import { projects } from "./workData";
import WorkPopUp from "./WorkPopUp";
import { GiRead } from "react-icons/gi";

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
  const [showGrid, setShowGrid] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowGrid(true);
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  const openModal = (project: Project) => {
    setSelectedProject(project);
  };

  const closeModal = () => {
    setSelectedProject(null);
  };

  const gridVariants: Variants = {
    initial: {},
    animate: {
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const projectVariants: Variants = {
    initial: { opacity: 0, y: -20 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.6 } },
    exit: { opacity: 0, y: 20, transition: { duration: 0.6 } },
  };

  return (
    <div className="container mx-auto pt-10">
      <h1 className="text-4xl font-semibold text-center mb-8 text-textColor">
        Explore My Portfolio
      </h1>
      {showGrid && (
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-7"
          initial="initial"
          animate="animate"
          variants={gridVariants}
        >
          {projects.map((project, index) => (
            <motion.div
              key={index}
              className="project-card block rounded-lg overflow-hidden shadow-md hover:shadow-lg transition duration-300 relative"
              variants={projectVariants}
              whileHover={{ scale: 1.05 }}
              onClick={() => openModal(project)}
            >
              <div className="relative">
                <img
                  loading="lazy"
                  src={project.image}
                  alt={project.name}
                  className="w-full h-56 object-cover object-center cursor-pointer"
                />
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-r from-[#FDF7E4] via-[#EBE3D5] to-transparent text-[#3e4355] p-2">
                  <h2 className="text-lg font-semibold">{project.name}</h2>
                </div>
              </div>
              <div className="p-4">
                <p className="text-gray-600 mb-4">
                  {`${project.description.slice(0, 150)}`}
                  {project.description.length > 150 ? (
                    <button
                      className="text-blue-500"
                      onClick={() => openModal(project)}
                    >
                      <span className=" text-[#3e4355] mr-2">...</span>
                      See More
                    </button>
                  ) : (
                    ""
                  )}
                </p>
                <div className="flex flex-wrap">
                  {project.tags.map((tag, tagIndex) => (
                    <span
                      key={tagIndex}
                      className="bg-gray-300 text-[#3e4355] px-2 py-1 rounded-full text-sm mr-2 mb-2"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
                {project.features &&
                  project.features.length > 0 &&
                  project.features.some(
                    (feature) => feature !== null && feature.trim() !== ""
                  ) && (
                    <div className="relative">
                      <p className="text-xl font-semibold mb-2">Features</p>
                      <div className="flex flex-wrap">
                        {project.features.map((feature, tagIndex) => {
                          if (feature !== null && feature.trim() !== "") {
                            return (
                              <span
                                className="bg-gray-300 text-[#3e4355] px-2 py-1 rounded-full text-sm mr-2 mb-2"
                                key={tagIndex}
                              >
                                {feature}
                              </span>
                            );
                          }
                          return null;
                        })}
                      </div>
                    </div>
                  )}
              </div>
              <div
                className="pt-4 pb-2 px-3 absolute bottom-0 right-0"
                onClick={() => openModal(project)}
              >
                <GiRead className="text-3xl hover:scale-110 transform transition-transform duration-300 ease-in-out" />
              </div>
            </motion.div>
          ))}
        </motion.div>
      )}
      {selectedProject && (
        <WorkPopUp selectedProject={selectedProject} closeModal={closeModal} />
      )}
    </div>
  );
};

export default Work;
