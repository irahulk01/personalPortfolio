import { AiOutlineCloseCircle } from 'react-icons/ai';
import React, { useEffect, useRef } from 'react';
import { motion } from "framer-motion";

interface Project {
  name: string;
  description: string;
  image: string;
  link: string;
  tags: string[];
  organisationWorkedWith: string;
  organisationLogo: string;
}

interface WorkPopUpProps {
  selectedProject: Project | null;
  closeModal: () => void;
}


const WorkPopUp: React.FC<WorkPopUpProps> = ({ selectedProject, closeModal }) => {
  const modalRef = useRef<HTMLDivElement>(null);
  const modalVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: "easeOut" },
    },
  };
  const handleOutsideClick = (e: MouseEvent) => {
    if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
      closeModal();
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleOutsideClick);

    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
    };
  }, [closeModal]);

  if (!selectedProject) {
    return null;
  }

  return (
    <motion.div
      className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm flex items-center justify-center px-4"
      initial="hidden"
      animate="visible"
      variants={modalVariants}
      onClick={closeModal}
    >
      <motion.div
        ref={modalRef}
        className="bg-gradient-to-br from-white to-[#f6f7fb] w-full max-w-3xl rounded-2xl shadow-2xl flex flex-col max-h-[85vh]"
      >
        <div className="flex items-center justify-between px-6 py-4 border-b relative">
          <h2 className="text-2xl font-semibold text-textColor">
            {selectedProject.name}
          </h2>

          <button
            onClick={closeModal}
            className="text-gray-500 hover:text-textColor transition"
          >
            <AiOutlineCloseCircle size={24} />
          </button>
        </div>
        <div className="h-1 w-full bg-gradient-to-r from-textColor/60 via-textColor/30 to-transparent" />
        <div className="flex-1 overflow-y-auto px-6 py-6 space-y-6">
          <section>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-600 mb-2">
              Description
            </h3>
            <div className="h-px w-12 bg-gradient-to-r from-textColor/50 to-transparent mb-4" />
            <p className="text-gray-700 leading-relaxed">
              {selectedProject.description}
            </p>
          </section>
          <section>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-600 mb-2">
              Tech Stack
            </h3>
            <div className="h-px w-12 bg-gradient-to-r from-textColor/50 to-transparent mb-4" />
            <div className="flex flex-wrap">
              {selectedProject.tags.map((tag, tagIndex) => (
                <span
                  key={tagIndex}
                  className="bg-textColor/10 text-textColor px-3 py-1 rounded-full text-sm mr-2 mb-2 
                  hover:bg-textColor hover:text-white transition-colors"
                >
                  {tag}
                </span>
              ))}
            </div>
          </section>
          {selectedProject.link && (
            <section>
              <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-600 mb-2">
                Live Website
              </h3>
              <div className="h-px w-12 bg-gradient-to-r from-textColor/50 to-transparent mb-4" />
              <a
                href={selectedProject.link}
                target="_blank"
                rel="noopener noreferrer"
                className="text-textColor font-medium hover:underline break-all"
              >
                {selectedProject.link}
              </a>
            </section>
          )}
          <section>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-600 mb-2">
              Organisation
            </h3>
            <div className="h-px w-12 bg-gradient-to-r from-textColor/50 to-transparent mb-4" />
            <div className="flex items-center gap-4">
              {selectedProject.organisationLogo && (
                <div className="h-12 px-3 rounded-lg bg-white shadow flex items-center">
                  <img
                    src={selectedProject.organisationLogo}
                    alt="Company Logo"
                    className="h-8 w-auto object-contain"
                  />
                </div>
              )}
              <p className="text-gray-700 font-medium">
                {selectedProject.organisationWorkedWith}
              </p>
            </div>
          </section>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default WorkPopUp;
