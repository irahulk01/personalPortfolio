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
      className="fixed inset-0 z-30 bg-black bg-opacity-50 flex justify-center items-center"
      initial="hidden"
      animate="visible"
      variants={modalVariants}
      onClick={closeModal}
    >
      <motion.div
        ref={modalRef}
        className="bg-white p-6 rounded-lg w-full max-w-screen-md relative transform transition-transform duration-300 ease-in-out overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 20 }}
      >
        <button className="absolute top-4 right-4 text-gray-500" onClick={closeModal}>
          <AiOutlineCloseCircle size={24} />
        </button>
        <h2 className="text-3xl font-bold mb-4">{selectedProject?.name}</h2>
        <div className="mb-4">
          <h3 className="text-xl font-semibold mb-2">Description</h3>
          <p className="text-gray-600">{selectedProject.description}</p>
        </div>
        <div className="mb-4">
          <h3 className="text-xl font-semibold mb-2">Skills</h3>
          <div className="flex flex-wrap">
            {selectedProject.tags.map((tag, tagIndex) => (
              <span key={tagIndex} className="bg-gray-300 text-[#3e4355] px-3 py-1 rounded-full text-sm mr-2 mb-2">
                {tag}
              </span>
            ))}
          </div>
        </div>
        <div className="mb-4">
          {selectedProject.link ?
            (<><h3 className="text-xl font-semibold mb-2">Website Link</h3><p className="text-gray-600">
              <a href={selectedProject.link} className="text-blue-500">{selectedProject.link}</a>
            </p></>) : null}
        </div>
        <div className="mb-4">
          <h3 className="text-xl font-semibold mb-2">Organisation</h3>
          {selectedProject.organisationLogo && (
            <img loading="lazy" src={selectedProject.organisationLogo} alt="Company Logo" className="mt-2 h-10" />
          )}
          <p className="text-gray-600 text-lg font-semibold">{selectedProject.organisationWorkedWith}</p>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default WorkPopUp;
