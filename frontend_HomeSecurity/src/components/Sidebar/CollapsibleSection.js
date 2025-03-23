import React, { useState } from 'react';
import { FaChevronDown, FaChevronUp } from 'react-icons/fa'; // Import chevron icons

const CollapsibleSection = ({ title, icon, children }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative block w-full">
      <div
        role="button"
        className="flex items-center w-full p-0 leading-tight transition-all rounded-lg outline-none text-start"
        onClick={() => setIsOpen(!isOpen)}
      >
        <button
          type="button"
          className={`flex items-center justify-between w-full p-3 font-sans text-xl antialiased font-semibold leading-snug text-left transition-colors border-b-0 `}
        >
          <div className="grid mr-4 place-items-center">
            {icon}
          </div>
          <p className="block mr-auto font-sans text-base antialiased font-normal leading-relaxed text-moon-dark">
            {title}
          </p>
          <span className="ml-4">
            {isOpen ? <FaChevronUp /> : <FaChevronDown />}
          </span>
        </button>
      </div>
      {isOpen && (
        <div className="overflow-hidden transition-all duration-300 ease-in-out">
          <div className="block w-full py-1 font-sans font-light leading-normal text-moon-dark  transition-colors">
            {children}
          </div>
        </div>
      )}
    </div>
  );
};

export default CollapsibleSection;
