import React, { useContext, useEffect, useState } from "react";
import { ProjectContext } from "../../context/ProjectContext";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { assets } from "../assets/assets";

const AuthorProfile = () => {
  const { backendUrl, token, projectsData } = useContext(ProjectContext);
  const { authorId } = useParams();
  const [authorProfile, setAuthorProfile] = useState(null);
  const [authorProjects, setAuthorProjects] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (projectsData) {
      const filteredProjects = projectsData.filter(
        (project) => project.author._id === authorId
      );
      setAuthorProjects(filteredProjects);
    }
  }, [projectsData, authorId]);

  const getAuthorProfile = async () => {
    try {
      const response = await axios.get(
        `${backendUrl}/api/user/author/${authorId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.data.success) {
        setAuthorProfile(response.data.author);
      } else {
        console.error("Failed to fetch author profile:", response.data.message);
      }
    } catch (error) {
      console.error("Error fetching author profile:", error);
    }
  };

  useEffect(() => {
    getAuthorProfile();
  }, [authorId]);

  const handleSendMessage = () => {
    navigate("/messages", {
      state: { authorId: authorProfile._id, authorName: authorProfile.name },
    });
  };

  console.log("author profile in AuthorProfile:", authorProfile);
  console.log("author projects:", authorProjects);

  return (
    <div className="max-w-5xl mx-auto mt-24 px-4 py-10">
      {authorProfile ? (
        <>
          {/* HEADER */}
          <div
            className="
        flex flex-col sm:flex-row items-center gap-6 p-6 
        bg-white/10 backdrop-blur-xl rounded-2xl shadow-xl 
        border border-white/20 hover:shadow-violet-600/20 
        transition duration-300
      "
          >
            {/* Profile Image */}
            <img
              src={authorProfile.profileImage || assets.profile_icon}
              alt={authorProfile.name}
              className="w-32 h-32 rounded-full object-cover 
          border-2 border-violet-400/40 shadow-lg"
            />

            {/* Profile Info */}
            <div className="flex-1 text-center sm:text-left space-y-1">
              <h2 className="text-3xl font-bold text-white">
                {authorProfile.name}
              </h2>

              <p className="text-gray-300">{authorProfile.email}</p>

              <p className="text-gray-300">
                <span className="font-semibold text-violet-300">Year:</span>{" "}
                {authorProfile.yearOfStudy}
              </p>

              <p className="text-gray-300">
                <span className="font-semibold text-violet-300">Skills:</span>{" "}
                {authorProfile.skills.join(", ")}
              </p>

              <p className="text-gray-300">
                <span className="font-semibold text-violet-300">
                  Technologies:
                </span>{" "}
                {authorProfile.technologiesKnown.join(", ")}
              </p>
            </div>

            {/* Send Message Button */}
            <button
              onClick={handleSendMessage}
              className="cursor-pointer px-6 py-2 rounded-lg
  bg-gradient-to-r from-violet-600 to-indigo-600
  text-white font-semibold shadow-md
  hover:from-violet-500 hover:to-indigo-500
  hover:shadow-violet-500/40 
  border border-violet-400/20
  active:scale-95 transition-all duration-200"
            >
              Send Message
            </button>
          </div>

          {/* PROJECTS SECTION */}
          <div className="mt-10">
            <h3 className="text-2xl font-semibold text-violet-200 mb-5">
              Projects by {authorProfile.name}
            </h3>

            {authorProjects && authorProjects.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {authorProjects.map((project) => (
                  <div
                    key={project._id}
                    className="
                  bg-white/10 backdrop-blur-xl rounded-xl shadow-lg 
                  border border-white/10 overflow-hidden
                  hover:border-violet-300/30 hover:shadow-violet-500/30 
                  transition duration-300 cursor-pointer
                "
                  >
                    {/* Project Image */}
                    <img
                      src={project.image || assets.default_image}
                      alt={project.title}
                      className="w-full h-40 object-cover 
                  hover:scale-110 transition duration-500"
                    />

                    {/* Content */}
                    <div className="p-4">
                      <h4 className="text-lg font-semibold text-white">
                        {project.title}
                      </h4>

                      {/* Status badge */}
                      <span
                        className={`inline-block mt-2 px-3 py-1 rounded-full text-sm font-semibold
                      ${
                        project.status?.trim().toLowerCase() === "open"
                          ? "bg-green-500/20 text-green-300 border border-green-400/30"
                          : "bg-red-500/20 text-red-300 border border-red-400/30"
                      }
                    `}
                      >
                        {project.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-400">No projects found for this user.</p>
            )}
          </div>
        </>
      ) : (
        <p className="text-center text-gray-400">Loading user profile...</p>
      )}
    </div>
  );
};

export default AuthorProfile;
