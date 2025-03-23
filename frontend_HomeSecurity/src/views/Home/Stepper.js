import React from "react";

const Stepper = ({ steps, currentStep }) => {
  return (
    <div className="flex items-center justify-center py-4">
      {steps.map((step, index) => (
        <div key={index} className="flex items-center">
          <div
            className={`${
              currentStep === index
                ? "bg-gray-600 text-white"
                : "bg-white text-gray-600 border border-gray-600"
            } rounded-full h-8 w-8 flex items-center justify-center font-bold`}
          >
            {index + 1}
          </div>
          {index !== steps.length - 1 && (
            <div
              className={`flex-auto border-t-2 transition duration-500 ease-in-out ${
                currentStep > index ? "border-gray-600" : "border-gray-300"
              }`}
            ></div>
          )}
        </div>
      ))}
    </div>
  );
};


export default Stepper;
