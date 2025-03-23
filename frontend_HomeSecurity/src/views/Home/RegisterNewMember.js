import React, { useState } from "react";
import LiveFeed from "components/CameraPlace/LiveFeed";
import Stepper from "./Stepper"; // Import your Stepper component
import TmpFaces from "./TmpFaces";

const API_URL = "http://192.168.1.13:8080";

const RegisterNewMember = () => {
  const [formData, setFormData] = useState({
    name: "",
    role: "Editor",
    status: "Active",
    dateAdded: new Date().toISOString().split("T")[0],
    capturedImage: null,
    tmpFolderName: null,
    imageCount: 0,
  });
  const [currentStep, setCurrentStep] = useState(0);
  const [error, setError] = useState("");

  const steps = ["Personal Info", "Capture Photo", "Confirmation", "Training"];

  const apiRequest = async (url, options) => {
    try {
      const response = await fetch(`${API_URL}${url}`, options);
      const result = await response.json();
      if (!response.ok) throw new Error(result.message || "An error occurred");
      return result;
    } catch (error) {
      setError(error.message);
      throw error;
    }
  };

  const createTemporaryFile = async () => {
    try {
      const result = await apiRequest("/create_tmp_file", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: formData.name }),
      });
      setFormData((prev) => ({ ...prev, tmpFolderName: result.tmpFolderName }));
      nextStep();
    } catch (error) {
      console.error("Error creating temporary file:", error);
    }
  };

  const handleCapturePhoto = async () => {
    if (!formData.name || !formData.tmpFolderName) {
      setError("Please complete the previous steps before capturing a photo.");
      return;
    }
    try {
      const result = await apiRequest("/capture_face", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tmpFolderName: formData.tmpFolderName }),
      });
      setFormData((prev) => ({
        ...prev,
        capturedImage: result.capturedImage,
        imageCount: prev.imageCount + 1,
      }));
      setError("");
    } catch (error) {
      console.error("Error capturing photo:", error);
    }
  };

  const handleSubmit = async () => {
    if (!formData.tmpFolderName || !formData.capturedImage) {
      setError("Please complete all steps before submitting.");
      return;
    }
    try {
      const result = await apiRequest("/create_face_folder", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          role: formData.role,
          status: formData.status,
          dateAdded: formData.dateAdded,
        }),
      });
      setCurrentStep(3); // Move to the training step
    } catch (error) {
      console.error("Error registering member:", error);
    }
  };

  const handleTrain = async () => {
    try {
      await apiRequest("/train_facerecognizer", {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });
      alert("Member added to face recognition training successfully.");
      setFormData({
        name: "",
        role: "Editor",
        status: "Active",
        dateAdded: new Date().toISOString().split("T")[0],
        capturedImage: null,
        tmpFolderName: null,
        imageCount: 0,
      });
      setCurrentStep(0); // Reset stepper to the beginning
    } catch (error) {
      console.error("Error training face recognizer:", error);
    }
  };

  const nextStep = () => setCurrentStep((prev) => prev + 1);
  const prevStep = () => setCurrentStep((prev) => prev - 1);

  return (
    <>
      <div className="flex items-center justify-between pb-6">
        <h2 className="font-semibold text-gray-700">Register New Member</h2>
      </div>

      <Stepper steps={steps} currentStep={currentStep} />

      <div className="flex flex-col items-center lg:flex-row justify-between">
        {currentStep === 0 && (
          <div className="mx-auto w-full max-w-screen-lg px-4 sm:px-8">
            <div className="overflow-hidden rounded-lg border bg-white shadow">
              <form
                className="p-6"
                onSubmit={(e) => {
                  e.preventDefault();
                  createTemporaryFile();
                }}
              >
                <InputField
                  id="name"
                  label="Name"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  required
                />
                <SelectField
                  id="role"
                  label="Role"
                  value={formData.role}
                  onChange={(e) =>
                    setFormData({ ...formData, role: e.target.value })
                  }
                  options={["Administrator", "Author", "Editor"]}
                  required
                />
                <SelectField
                  id="status"
                  label="Status"
                  value={formData.status}
                  onChange={(e) =>
                    setFormData({ ...formData, status: e.target.value })
                  }
                  options={["Active", "Suspended", "Inactive"]}
                  required
                />
                {error && <ErrorMessage message={error} />}
                <div className="flex justify-end">
                  <button
                    type="submit"
                    className="inline-flex items-center px-4 py-2 bg-gray-600 text-white font-medium text-sm rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    Next
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {currentStep === 1 && (
          <div className="flex flex-col items-center w-full lg:w-1/2">
            <LiveFeed streamUrl="http://192.168.1.13:8080/video_feed_face_register" />
            <button
              type="button"
              onClick={handleCapturePhoto}
              className="mt-4 inline-flex items-center px-4 py-2 bg-gray-600 text-white font-medium text-sm rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Capture Photo
            </button>
            <div>Captured face is saved in {formData.tmpFolderName}</div>
            {error && <ErrorMessage message={error} />}
            <div className="flex justify-between w-full mt-4">
              <button
                type="button"
                onClick={prevStep}
                className="inline-flex items-center px-4 py-2 bg-gray-600 text-white font-medium text-sm rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Back
              </button>
              <button
                type="button"
                onClick={nextStep}
                className="inline-flex items-center px-4 py-2 bg-gray-600 text-white font-medium text-sm rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Next
              </button>
            </div>
            <TmpFaces
              url={API_URL}
              memberName={formData.name}
              imageCount={formData.imageCount}
            />
          </div>
        )}

        {currentStep === 2 && (
          <div className="mx-auto w-full max-w-screen-lg px-4 sm:px-8">
            <div className="overflow-hidden rounded-lg border bg-white shadow">
              <div className="p-6">
                <div className="text-center">
                  <h3 className="text-lg font-medium text-gray-900">
                    Review Information
                  </h3>
                  <p className="mt-1 text-sm text-gray-500">
                    Please review and confirm the information below.
                  </p>
                </div>
                <ReviewField label="Name" value={formData.name} />
                <ReviewField label="Role" value={formData.role} />
                <ReviewField label="Status" value={formData.status} />
                <ReviewField label="Date Added" value={formData.dateAdded} />
                {formData.capturedImage && (
                  <div className="mt-4">
                    <h4 className="text-sm font-medium text-gray-700">
                      Captured Photo:
                    </h4>
                    <TmpFaces
                      url={API_URL}
                      memberName={formData.name}
                      imageCount={formData.imageCount}
                    />
                  </div>
                )}
                {error && <ErrorMessage message={error} />}
                <div className="flex justify-between mt-6">
                  <button
                    type="button"
                    onClick={prevStep}
                    className="inline-flex items-center px-4 py-2 bg-gray-600 text-white font-medium text-sm rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    Back
                  </button>
                  <button
                    type="button"
                    onClick={handleSubmit}
                    className="inline-flex items-center px-4 py-2 bg-gray-600 text-white font-medium text-sm rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    Submit
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {currentStep === 3 && (
          <div className="mx-auto w-full max-w-screen-lg px-4 sm:px-8">
            <div className="overflow-hidden rounded-lg border bg-white shadow">
              <div className="p-6">
                <h3 className="text-lg font-medium text-gray-900">Training</h3>
                <p className="mt-1 text-sm text-gray-500">
                  Training the face recognition system with the new member's
                  data.
                </p>
                <button
                  type="button"
                  onClick={handleTrain}
                  className="mt-4 inline-flex items-center px-4 py-2 bg-gray-600 text-white font-medium text-sm rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Train System
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

const InputField = ({ id, label, value, onChange, required, errorMessage }) => (
  <div className="w-full mb-4">
    <label
      htmlFor={id}
      className="block text-sm font-medium text-moon-light-blue"
    >
      {label}
    </label>
    <div className="mt-1 relative rounded-md shadow-sm">
      <input
        id={id}
        type="text"
        value={value}
        onChange={onChange}
        required={required}
        aria-required={required}
        aria-label={label}
        className={`block w-full px-4 py-2 border ${
          errorMessage ? "border-red-500" : "border-moon-grey"
        } rounded-md shadow-sm focus:ring-moon-blue focus:border-moon-blue sm:text-sm transition duration-150 ease-in-out bg-moon-light text-moon-dark`}
        placeholder={`Enter ${label.toLowerCase()}`}
      />
      {errorMessage && (
        <p className="mt-1 text-sm text-red-600">{errorMessage}</p>
      )}
    </div>
  </div>
);

const SelectField = ({ id, label, value, onChange, options, required }) => (
  <div className="mb-4">
    <label htmlFor={id} className="block text-sm font-medium text-gray-700">
      {label}
    </label>
    <select
      id={id}
      value={value}
      onChange={onChange}
      required={required}
      className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
    >
      {options.map((option) => (
        <option key={option} value={option}>
          {option}
        </option>
      ))}
    </select>
  </div>
);

const ErrorMessage = ({ message }) => (
  <div className="mt-4 text-red-600 text-sm">{message}</div>
);

const ReviewField = ({ label, value }) => (
  <div className="mb-4">
    <label className="block text-sm font-medium text-gray-700">{label}</label>
    <p className="mt-1 text-sm text-gray-900">{value}</p>
  </div>
);

export default RegisterNewMember;
