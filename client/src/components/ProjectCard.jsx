import React, { useContext, useState } from "react";
import { assets } from "../assets/assets";
import { ProjectContext } from "../../context/ProjectContext";
import axios from "axios";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";

const ProjectCard = ({ project }) => {
  const {
    token,
    navigate,
    backendUrl,
    userProfile,
    fetchUserProfile,
    requestStatusByProject,
    setRequestStatusByProject,
    getAllProjects,
  } = useContext(ProjectContext);
  const [isClosed, setIsClosed] = useState(false);
  // fetchUserProfile(); // Ensure user profile is fetched before rendering
  // console.log("User profile in ProjectCard:", userProfile);
  // console.log("Project in ProjectCard:", project);

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
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      // console.log("Response:", response.data);
      if (response.data.success) {
        toast.success("Request sent to author via Email");
        setRequestStatusByProject((prev) => ({
          ...prev,
          [project._id]: "Sent",
        }));
      }
    } catch (error) {
      toast.error(error.message);
      console.error("Error sending join request:", error);
    }
  };

  const handleCloseProject = async (projectId) => {
    try {
      console.log("Closing project...", projectId);

      const response = await axios.put(
        `${backendUrl}/api/project/close-project/${projectId}`,
        { action: "close" },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      console.log("Response received:", response.data);

      if (response.data.success) {
        toast.success("Project closed successfully");
        await getAllProjects();
        fetchUserProfile();
      }
    } catch (error) {
      console.error("Error closing project:", error.response?.data || error);
      toast.error("Failed to close project");
    }
  };

  console.log("Project ID:", project._id);
  console.log("requestStatusByProject:", requestStatusByProject);
  const status = requestStatusByProject?.[project._id];

  return (
    <form
      className={`bg-[#0f0f10]/80 backdrop-blur-xl rounded-2xl shadow-lg 
  border border-white/10 p-5 transition-all duration-300  h-[650px]
  hover:scale-[1.03] hover:shadow-xl ${
    project.status === "closed"
      ? "opacity-40 pointer-events-none grayscale"
      : ""
  }`}
    >
      {/* Image */}
      <div className="overflow-hidden rounded-xl mb-4">
        <img
          className="w-full h-50  object-contain hover:scale-110 transition-all duration-500"
          src={project.image || assets.default_image}
          alt={project.title}
        />
      </div>

      {/* Title */}
      <h2 className="text-2xl font-semibold text-white mb-2 tracking-wide">
        {project.title}
      </h2>

      {/* Description */}
      <p className="text-gray-300 mb-4 leading-relaxed">
        {project.description}
      </p>

      {/* Skills */}
      <div className="mb-3">
        <strong className="text-gray-400">Required Skills:</strong>
        <div className="flex flex-wrap gap-2 mt-2">
          {project.skillsRequired.map((skill, i) => (
            <span
              key={i}
              className="
          bg-blue-600/20 text-blue-300 
          px-2 py-1 
          text-xs font-medium
          rounded-md 
          border border-blue-500/30 
          transition-all duration-300
          hover:bg-blue-600/30 
          hover:border-blue-400 
          hover:text-blue-200
          hover:shadow-blue-500/40 
          hover:shadow-md
          hover:scale-105
        "
            >
              {skill}
            </span>
          ))}
        </div>
      </div>

      {/* Tech Stack */}
      <div className="mb-4">
        <strong className="text-gray-400">Tech Stack:</strong>
        <div className="flex flex-wrap gap-2 mt-2">
          {project.techStack.map((tech, i) => (
            <span
              key={i}
              className="
          bg-green-600/20 text-green-300 
          px-2 py-1 
          text-xs font-medium
          rounded-md 
          border border-green-500/30 
          transition-all duration-300
          hover:bg-green-600/30 
          hover:border-green-400 
          hover:text-green-200
          hover:shadow-green-500/40 
          hover:shadow-md
          hover:scale-105
        "
            >
              {tech}
            </span>
          ))}
        </div>
      </div>

      {/* Author */}
      <p className="text-sm text-gray-400 mb-4">
        Posted by:{" "}
        {project?.author?._id && userProfile?._id ? (
          project.author._id === userProfile._id ? (
            <span className="font-medium text-white">You</span>
          ) : (
            <Link
              to={`/author/${project.author._id}`}
              className="text-purple-400 hover:underline font-medium"
            >
              {project.author.name}
            </Link>
          )
        ) : (
          <span className="italic text-gray-500">Unknown</span>
        )}
      </p>

      {/* Buttons */}
      {project.status === "open" &&
        project?.author?._id &&
        userProfile?._id &&
        project.author._id !== userProfile._id && (
          <div className="flex flex-col sm:flex-row gap-2">
            {status ? (
              <p className="text-sm font-medium text-gray-300">
                Status:{" "}
                <span
                  className={`${
                    status === "Sent"
                      ? "text-yellow-400"
                      : status === "Accepted"
                      ? "text-green-400"
                      : "text-red-400"
                  }`}
                >
                  {status}
                </span>
              </p>
            ) : (
              <button
                className="bg-blue-600 hover:bg-blue-700 text-white 
            px-4 py-2 rounded-lg transition-all shadow-md "
                onClick={handleRequestJoin}
              >
                Request to Join
              </button>
            )}
          </div>
        )}

      {/* Close Project Button */}
      {project?.author?._id &&
        userProfile?._id &&
        project.author._id === userProfile._id &&
        project.status === "open" && (
          <button
            type="button"
            onClick={() => handleCloseProject(project._id)}
            className=" curpo
        relative 
        px-5 py-2 
        rounded-xl 
        font-medium 
        text-red-300 
        border border-red-500/40 
        bg-red-500/10 
        backdrop-blur-md 
        shadow-lg 
        transition-all 
        duration-300
        hover:bg-red-600/20 
        hover:border-red-500 
        hover:text-red-200
        hover:shadow-red-600/40
        active:scale-95
      "
          >
            Close Project
          </button>
        )}
    </form>
  );
};

export default ProjectCard;
