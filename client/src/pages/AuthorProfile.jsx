import React, { useContext, useEffect, useState } from "react";
import { ProjectContext } from "../../context/ProjectContext";
import { useParams } from "react-router-dom";
import axios from "axios";
import { assets } from "../assets/assets";

const AuthorProfile = () => {
  const { backendUrl, token, projectsData } = useContext(ProjectContext);
  const { authorId } = useParams();
  const [authorProfile, setAuthorProfile] = useState(null);
  const [authorProjects, setAuthorProjects] = useState([]);

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
  console.log("projectsData in AuthorProfile:", projectsData);
  console.log("author projects:", authorProjects);

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      {authorProfile ? (
        <>
          {/*   Header */}
          <div className="flex flex-col sm:flex-row items-center gap-6 p-6 bg-white shadow-md rounded-lg mb-10">
            <img
              src={authorProfile.profileImage || assets.profile_icon}
              alt={authorProfile.name}
              className="w-32 h-32 rounded-full object-cover border-2 border-gray-300"
            />
            <div className="text-center sm:text-left">
              <h2 className="text-3xl font-bold mb-2">{authorProfile.name}</h2>
              <p className="text-gray-600">{authorProfile.email}</p>
              <p className="text-gray-600">Year: {authorProfile.yearOfStudy}</p>
              <p className="text-gray-600">
                Skills: {authorProfile.skills.join(", ")}
              </p>
              <p className="text-gray-600">
                Technologies: {authorProfile.technologiesKnown.join(", ")}
              </p>
            </div>
          </div>

          {/*   Projects */}
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
              <p className="text-gray-500">
                No projects found for this user.
              </p>
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
