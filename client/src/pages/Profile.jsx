import React, { useContext, useEffect, useState } from "react";
import { ProjectContext } from "../../context/ProjectContext";
import { assets } from "../assets/assets";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const Profile = () => {
  const {
    userProfile,
    setUserProfile,
    fetchUserProfile,
    token,
    setToken,
    backendUrl,
    navigate,
    projectsData,
    getAllProjects,
  } = useContext(ProjectContext);

  const [myProjects, setMyProjects] = useState([]);

  console.log(localStorage.getItem("token")); // user token
  console.log(localStorage.getItem("adminToken")); // admin token
  console.log(localStorage); // full localStorage object
  console.log("User Profile in Profile.jsx:", userProfile);

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

  const handleDelete = async () => {
    console.log("Sending delete request with token:", token);
    const confirmed = window.confirm(
      "Are you sure you want to delete your account? This action cannot be undone."
    );
    if (!confirmed) return;

    try {
      const response = await axios.delete(
        backendUrl + "/api/user/delete-account",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.success) {
        toast.success("Sorry to see you go 😔 Your account has been deleted.", {
          position: "top-center",
          autoClose: 3000,
        });
        setUserProfile(null);
        setToken(null);
        localStorage.removeItem("token");
      } else {
        toast.error("Error deleting account");
      }
    } catch (error) {
      console.error("Error deleting account:", error);
      toast.error(error.message);
    }
  };

  return (
    <div
      className="mt-24 max-w-4xl mx-auto px-6 sm:px-8 lg:px-10 py-10 
  bg-white/10 backdrop-blur-xl shadow-2xl rounded-2xl 
  border border-white/20"
    >
      {/* Header */}
      <h1
        className="text-3xl font-bold mb-6 pb-2 
    text-violet-200 border-b border-white/20"
      >
        Dashboard
      </h1>

      {userProfile ? (
        <div className="space-y-8">
          {/* Profile Section */}
          <div
            className="flex flex-col sm:flex-row justify-between gap-6 
        bg-white/10 backdrop-blur-xl p-6 rounded-xl shadow-lg 
        border border-white/10 hover:shadow-violet-600/20 
        transition duration-300"
          >
            <div className="flex items-center gap-6">
              <img
                src={userProfile.profileImage || assets.profile_icon}
                alt="Profile"
                className="w-24 h-24 rounded-full object-cover 
              border-2 border-violet-400/40 shadow-lg"
              />

              <div>
                <h2 className="text-2xl font-bold text-white">
                  {userProfile.name}
                </h2>
                <p className="text-gray-300 text-sm mt-1">
                  {userProfile.email}
                </p>

                <p className="text-gray-400 mt-1 text-xs">
                  Joined on{" "}
                  {new Date(userProfile.createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>

            {/* Buttons */}
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate("/edit-profile")}
                className="cursor-pointer px-4 py-2 rounded-lg
              bg-white/10 border border-white/20 
              text-gray-200 hover:bg-white/20 
              hover:border-violet-300 transition-all"
              >
                Edit
              </button>

              {/* <button
                onClick={handleDelete}
                className="cursor-pointer px-6 py-2 rounded-lg
  bg-gradient-to-r from-red-600 to-red-500
  text-white font-semibold shadow-md
  border border-red-400/30
  hover:from-red-500 hover:to-red-400
  hover:shadow-red-500/40
  active:scale-95 transition-all duration-200"
              >
                Delete Account
              </button> */}
            </div>
          </div>

          {/* Projects Section */}
          <div>
            <h3 className="text-2xl font-semibold text-violet-200 mb-4">
              My Projects
            </h3>

            {myProjects.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {myProjects.map((project) => (
                  <div
                    key={project._id}
                    className="p-4 rounded-xl bg-white/10 backdrop-blur-xl 
                shadow-md border border-white/10 
                hover:border-violet-300/30 
                hover:shadow-violet-500/20 
                transition duration-300 cursor-pointer"
                  >
                    <div className="w-full aspect-[4/3] rounded-lg overflow-hidden">
                      <img
                        src={project.image || assets.default_image}
                        alt="Project"
                        className="w-full h-full object-cover 
                      hover:scale-110 transition duration-500"
                      />
                    </div>

                    <h4 className="text-xl font-semibold text-white mt-3">
                      {project.title}
                    </h4>

                    <p className="text-sm mt-1 text-gray-300">
                      Status:{" "}
                      <span
                        className={`font-semibold ${
                          project.status === "open"
                            ? "text-green-400"
                            : "text-red-400"
                        }`}
                      >
                        {project.status}
                      </span>
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-400 text-sm">No projects found.</p>
            )}
          </div>
        </div>
      ) : (
        <p className="text-gray-300 text-center py-6">Loading profile...</p>
      )}
    </div>
  );
};

export default Profile;
