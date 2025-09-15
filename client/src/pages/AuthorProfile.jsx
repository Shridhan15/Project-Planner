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
    <div className="max-w-5xl mx-auto mt-20 px-4 py-8">
      {authorProfile ? (
        <>
          {/*   Header */}
          <div className="flex flex-col sm:flex-row items-center gap-6 p-6 bg-white shadow-md rounded-lg mb-10">
            {/* Profile Image */}
            <img
              src={authorProfile.profileImage || assets.profile_icon}
              alt={authorProfile.name}
              className="w-32 h-32 rounded-full object-cover border-2 border-gray-300"
            />

            {/* Profile Info */}
            <div className="flex-1 text-center sm:text-left">
              <h2 className="text-3xl font-bold mb-2">{authorProfile.name}</h2>
              <p className="text-gray-600">{authorProfile.email}</p>
              <p className="text-gray-600">
                <span className="font-semibold text-gray-800">Year:</span>{" "}
                {authorProfile.yearOfStudy}
              </p>
              <p className="text-gray-600">
                <span className="font-semibold text-gray-800">Skills:</span>{" "}
                {authorProfile.skills.join(", ")}
              </p>
              <p className="text-gray-600">
                <span className="font-semibold text-gray-800">
                  Technologies:
                </span>{" "}
                {authorProfile.technologiesKnown.join(", ")}
              </p>
            </div>
            {/* Send Message Button */}
            <div className="mt-4">
              <button
                onClick={handleSendMessage}
                className="cursor-pointer px-6 py-2 rounded-lg bg-violet-500 text-white font-semibold shadow-md hover:bg-violet-600 transition duration-200"
              >
                Send Message
              </button>
            </div>
          </div>

          {/*    ----------------Projects---------------- */}
          <div>
            <h3 className="text-2xl font-semibold mb-4">
              Projects by {authorProfile.name}
            </h3>
            {authorProjects && authorProjects.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {authorProjects.map((project) => (
                  <div
                    key={project._id}
                    className="bg-white hover:shadow-lg rounded-lg shadow-md overflow-hidden"
                  >
                    <img
                      src={project.image || assets.default_image}
                      alt={project.title}
                      className="w-full h-40 object-cover"
                    />
                    <div className="p-4">
                      <h4 className="text-lg font-semibold mb-2">
                        {project.title}
                      </h4>
                      <span
                        className={`inline-block text-sm px-3 py-1 rounded-full ${
                          project.status?.trim().toLowerCase() === "open"
                            ? "bg-green-200 text-green-800"
                            : "bg-red-200 text-red-800"
                        }`}
                      >
                        {project.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500">No projects found for this user.</p>
            )}
          </div>
        </>
      ) : (
        <p className="text-center text-gray-500">Loading user profile...</p>
      )}
    </div>
  );
};

export default AuthorProfile;
