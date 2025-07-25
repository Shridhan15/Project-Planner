import React, { useContext, useState } from "react";
import { assets } from "../assets/assets";
import { ProjectContext } from "../../context/ProjectContext";
import axios from "axios";
import { toast } from "react-toastify";

const ProjectCard = ({ project }) => {
  const { token, navigate, backendUrl, userProfile, fetchUserProfile } =
    useContext(ProjectContext);
  const [isClosed, setIsClosed] = useState(false);
  // fetchUserProfile(); // Ensure user profile is fetched before rendering
  console.log("User profile in ProjectCard:", userProfile);
  console.log("Project in ProjectCard:", project);

  const handleRequestJoin = async (e) => {
    e.preventDefault();
    if (!token) {
      toast.error("Create account or Login first");
      navigate("/login");
      return;
    }

    try {
      const response = await axios.post(
        backendUrl + "/api/project/send-request",
        { projectId: project._id },
        { headers: { token } }
      );
      // console.log("Response:", response.data);
      if (response.data.success) {
        toast.success("Request sent to author via Email");
      }
    } catch (error) {
      console.error("Error sending join request:", error);
    }
  };

  const handleCloseProject = async (projectId) => {
    try {
      const response = await axios.put(
        `${backendUrl}/api/project/close-project/${projectId}`,
        {},
        { headers: { token } }
      );
      if (response.data.success) {
        toast.success("Project closed successfully");
        fetchUserProfile();
      }
    } catch (error) {
      console.error("Error closing project:", error);
    }
  };

  return (
    <form
      className={`bg-white rounded-xl shadow-md p-4 hover:shadow-xl hover:scale-105 transition duration-300 ${
        project.status === "closed"
          ? "backdrop-blur-sm opacity-50 pointer-events-none"
          : ""
      }`}
    >
      <img
        className="w-full h-48 object-cover rounded-md mb-4"
        src={project.image || assets.default_image}
        alt={project.title}
      />

      <h2 className="text-xl font-semibold text-gray-800 mb-2">
        {project.title}
      </h2>
      <p className="text-gray-600 mb-4">{project.description}</p>

      <div className="mb-2">
        <strong>Required Skills:</strong>{" "}
        <span className="text-blue-600">
          {project.skillsRequired.join(", ")}
        </span>
      </div>

      <div className="mb-2">
        <strong>Tech Stack:</strong>{" "}
        <span className="text-green-700">{project.techStack.join(", ")}</span>
      </div>

      <p className="text-sm text-gray-500 mb-4">
        Posted by: <span className="font-medium">{project.author.name}</span>
      </p>

      {project.status === "open" &&
        project?.author?._id &&
        userProfile?._id &&
        project.author._id != userProfile._id && (
            <button
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition cursor-pointer"
              onClick={handleRequestJoin}
            >
              Request to Join
            </button>
          )}

      {project?.author?._id &&
        userProfile?._id &&
        project.author._id === userProfile._id &&
        project.status === "open" && (
          <button
            className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition cursor-pointer ml-2"
            onClick={() => handleCloseProject(project._id)}
          >
            Close Project
          </button>
        )}
    </form>
  );
};

export default ProjectCard;
