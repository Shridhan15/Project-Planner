import React from "react";

const ProjectCard = ({ project }) => {
  return (
    <div className="bg-white rounded-xl shadow-md p-4 hover:shadow-xl transition duration-300">
      <img
        className="w-full h-48 object-cover rounded-md mb-4"
        src={project.image}
        alt={project.title}
      />

      <h2 className="text-xl font-semibold text-gray-800 mb-2">{project.title}</h2>
      <p className="text-gray-600 mb-4">{project.description}</p>

      <div className="mb-2">
        <strong>Required Skills:</strong>{" "}
        <span className="text-blue-600">{project.skillsRequired.join(", ")}</span>
      </div>

      <div className="mb-2">
        <strong>Tech Stack:</strong>{" "}
        <span className="text-green-700">{project.techStack.join(", ")}</span>
      </div>

      <p className="text-sm text-gray-500 mb-4">Posted by: <span className="font-medium">{project.author}</span></p>

      <button
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition cursor-pointer"
        onClick={() => alert("Request sent (dummy for now)")}
      >
        Request to Join
      </button>
    </div>
  );
};

export default ProjectCard;
