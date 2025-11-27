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
      className={`bg-white/10 backdrop-blur-xl rounded-2xl shadow-lg 
  border border-white/20 p-5 transition-all duration-300 h-[650px]
  hover:shadow-violet-500/30 hover:border-violet-400/30
  ${
    project?.status === "closed"
      ? "opacity-40 pointer-events-none grayscale"
      : ""
  }`}
    >
      {/* Image */}
      <div className="overflow-hidden rounded-xl mb-4">
        <img
          className="w-full h-50  object-contain hover:scale-110 transition-all duration-500"
          src={project?.image || assets.default_image}
          alt={project?.title}
        />
      </div>

      {/* Title */}
      <h2 className="text-2xl font-semibold text-white mb-2 tracking-wide">
        {project?.title}
      </h2>

      {/* Description */}
      <p className="text-gray-300 mb-4 leading-relaxed">
        {project?.description}
      </p>

      {/* Skills */}
      <div className="mb-3 flex flex-wrap items-center gap-2">
        <strong className="text-gray-400 mr-2 whitespace-nowrap">
          Required Skills:
        </strong>

        {project?.skillsRequired.map((skill, i) => (
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

      {/* Tech Stack */}
      <div className="mb-4 flex flex-wrap items-center gap-2">
        <strong className="text-gray-400 mr-2 whitespace-nowrap">
          Tech Stack:
        </strong>

        {project?.techStack.map((tech, i) => (
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

      {/* Author */}
      {/* Author + Request Button (side by side) */}
      <div className="flex justify-between items-center mb-4">
        {/* LEFT SIDE — Show author info ONLY IF not your project */}
        {project?.author?._id !== userProfile?._id && (
          <p className="text-sm text-gray-400">
            Posted by:{" "}
            <Link
              to={`/author/${project.author._id}`}
              className="text-violet-400 hover:text-violet-300 hover:underline font-medium transition"
            >
              {project.author.name}
            </Link>
          </p>
        )}

        {/* RIGHT SIDE — Joining or Status (only for non-author) */}
        {project?.status === "open" &&
          project?.author?._id !== userProfile?._id &&
          (status ? (
            <span
              className={`px-3 py-1 rounded-lg text-sm font-medium 
        backdrop-blur-md border shadow-md transition-all duration-300
        ${
          status === "Sent"
            ? "text-yellow-300 border-yellow-400/30 bg-yellow-500/10 shadow-yellow-500/20"
            : status === "Accepted"
            ? "text-green-300 border-green-400/30 bg-green-500/10 shadow-green-500/20"
            : "text-red-300 border-red-400/30 bg-red-500/10 shadow-red-500/20"
        }`}
            >
              {status}
            </span>
          ) : (
            <button
              onClick={handleRequestJoin}
              className="cursor-pointer px-4 py-1.5 text-sm font-medium
          rounded-lg shadow-lg 
          bg-gradient-to-r from-blue-600 to-violet-600 
          text-white border border-white/10 
          backdrop-blur-md
          hover:from-blue-500 hover:to-violet-500
          hover:shadow-blue-500/30 active:scale-95
          transition-all duration-300"
            >
              Request to Join
            </button>
          ))}
      </div>

      {/* Close Project Button — ONLY for author */}
      {project?.author?._id === userProfile?._id &&
        project?.status === "open" && (
          <button
            type="button"
            onClick={() => handleCloseProject(project._id)}
            className="cursor-pointer relative px-5 py-2 rounded-xl font-medium 
      text-red-300 border border-red-500/40 bg-red-500/10 backdrop-blur-md 
      shadow-lg transition-all duration-300 hover:bg-red-600/20 
      hover:border-red-500 hover:text-red-200 hover:shadow-red-600/40
      active:scale-95"
          >
            Close Project
          </button>
        )}
    </form>
  );
};

export default ProjectCard;
