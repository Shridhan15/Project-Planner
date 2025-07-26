import React, { useContext, useEffect, useState } from "react";
import { ProjectContext } from "../../context/ProjectContext";
import { assets } from "../assets/assets";
import axios from "axios";

const Profile = () => {
  const {
    userProfile,
    fetchUserProfile,
    token,
    backendUrl,
    navigate,
    projectsData,
    getAllProjects,
  } = useContext(ProjectContext);

  const [myProjects, setMyProjects] = useState([]);

  //  Only fetch projects once on mount
  useEffect(() => {
    getAllProjects();
  }, []); //  run once on component mount

  //  Filter my projects when either projectsData or userProfile changes
  useEffect(() => {
    if (projectsData.length && userProfile?._id) {
      const myOwnedProjects = projectsData.filter(
        (project) => project?.author?._id === userProfile._id
      );
      setMyProjects(myOwnedProjects);
    }
  }, [projectsData, userProfile?._id]);

  useEffect(() => {
    console.log("User Profile:", userProfile);
  }, [userProfile]);

  useEffect(() => {
    console.log("My Projects:", myProjects);
  }, [myProjects]);

  return (
    <div className="mt-10 max-w-4xl mx-auto px-6 sm:px-8 lg:px-10 py-8 bg-white shadow-xl rounded-xl">
      <h1 className="text-3xl font-bold text-gray-800 mb-6 border-b pb-2">
        Dashboard
      </h1>

      {userProfile ? (
        <div className="space-y-6">
          {/* Profile Section */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-6 bg-gray-50 p-6 rounded-lg shadow-md">
            <img
              src={userProfile.profileImage || assets.profile_icon}
              alt="Profile"
              className="w-24 h-24 rounded-full border-2 border-gray-300 shadow-sm object-cover"
            />
            <div>
              <h2 className="text-2xl font-bold text-gray-700">
                {userProfile.name}
              </h2>
              <p className="text-gray-600 text-lg">{userProfile.email}</p>
              <p className="text-gray-500 mt-1 text-sm">
                Joined on {new Date(userProfile.createdAt).toLocaleDateString()}
              </p>
            </div>

            <button
            onClick={()=>navigate('/edit-profile')}
             className=" ml-[250px] ring-1 cursor-pointer ring-gray-300 hover:ring-gray-400 focus:ring-gray-500 rounded-md px-4 py-2">
              Edit
            </button>
          </div>

          {/* Projects Section */}
          <div className="mt-6">
            <h3 className="text-2xl font-semibold text-gray-800 mb-4">
              My Projects
            </h3>

            {myProjects.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {myProjects.map((project) => (
                  <div
                    key={project._id}
                    className="bg-gray-100 p-4 rounded-lg shadow hover:shadow-lg transition duration-300"
                  >
                    <img
                      src={project.image || assets.default_image}
                      alt="Project"
                      className="w-full h-40 object-cover rounded-md mb-3"
                    />
                    <h4 className="text-xl font-semibold text-gray-700">
                      {project.title}
                    </h4>
                    <p className="text-sm text-gray-500 mt-1">
                      Status:{" "}
                      <span
                        className={`font-medium ${
                          project.status === "open"
                            ? "text-green-600"
                            : "text-red-600"
                        }`}
                      >
                        {project.status}
                      </span>
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-sm">No projects found.</p>
            )}
          </div>
        </div>
      ) : (
        <p className="text-gray-500 text-center py-6">Loading profile...</p>
      )}
    </div>
  );
};

export default Profile;
