import React, { useContext, useEffect } from "react";
import ProjectCard from "../components/ProjectCard";
import { ProjectContext } from "../../context/ProjectContext";
import { toast } from "react-toastify";

const Home = () => {
  const {
    projectsData,
    filteredProjects,
    getAllProjects,
    navigate,
    isAuthenticated,
    recommendedProjects,
    searchTerm,
    userProfile
  } = useContext(ProjectContext);

  useEffect(() => {
    getAllProjects();
  }, []);

  const handleClick = (e) => {
    e.preventDefault();
    if (isAuthenticated) {
      navigate("/postproject");
    } else {
      toast.info("Please create account or login to post a project");
      navigate("/login");
    }
  };

  return (
    <div className="bg-gray-50 mt-19 min-h-screen ">
      {/* ---------- Hero Section ---------- */}
      <section className="text-center py-16 bg-gradient-to-r from-blue-100 to-blue-200 px-4 shadow-md">
        <h1 className="text-4xl md:text-5xl font-extrabold text-blue-800 mb-4">
          Explore Live Projects
        </h1>
        <p className="text-gray-700 text-lg md:text-xl max-w-2xl mx-auto">
          Find and join real student-led tech projects!
        </p>

        <button
          onClick={handleClick}
          className="mt-6 cursor-pointer bg-blue-600 text-white font-semibold px-8 py-3 rounded-xl shadow hover:bg-blue-700 hover:scale-105 transform transition-all duration-300"
        >
          🚀 List Your Project
        </button>
      </section>

      {/* ---------- Recommended Projects ---------- */}
      {!searchTerm && userProfile?.skills!="" && (
        <section className="bg-white py-12 px-4 shadow-inner border-t border-gray-200">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-3xl font-bold text-blue-800 mb-2 text-center">
              Recommended Projects
            </h2>
            <p className="text-gray-600 text-center mb-8">
              Handpicked based on your skills & interests
            </p>

            {recommendedProjects.length > 0 ? (
              <div className="grid gap-8 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                {recommendedProjects.map((project) => (
                  <div
                    key={project._id}
                    className="hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
                  >
                    <ProjectCard project={project} />
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center text-gray-500 py-8">
                <p className="text-lg">
                  No recommendations available right now.
                </p>
                <p className="text-sm mt-2">
                  Try adding more skills to your profile for better matches.
                </p>
              </div>
            )}
          </div>
        </section>
      )}

      {/* ---------- All Projects ---------- */}
      <section className="bg-gray-50 py-14 px-4 border-t border-gray-300">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-blue-800 mb-6 border-b-4 border-blue-600 inline-block pb-1">
            All Projects
          </h2>

          {filteredProjects.length > 0 ? (
            <div className="grid gap-8 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
              {filteredProjects
                .filter((project) => project && project._id)
                .map((project) => (
                  <div
                    key={project._id}
                    className="hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
                  >
                    <ProjectCard project={project} />
                  </div>
                ))}
            </div>
          ) : projectsData.length > 0 ? (
            <div className="text-center text-gray-600 text-lg mt-10">
              No matching projects found.
            </div>
          ) : (
            <div className="grid gap-8 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
              {[...Array(6)].map((_, index) => (
                <div
                  key={index}
                  className="animate-pulse bg-white p-6 rounded-xl shadow-md flex flex-col gap-4"
                >
                  <div className="h-6 bg-gray-300 rounded w-3/4"></div>
                  <div className="h-4 bg-gray-300 rounded w-full"></div>
                  <div className="h-4 bg-gray-300 rounded w-5/6"></div>
                  <div className="mt-4 h-10 bg-gray-300 rounded w-1/2"></div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default Home;
