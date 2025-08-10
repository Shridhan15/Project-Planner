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
  } = useContext(ProjectContext);

  useEffect(() => {
    getAllProjects();
  }, []);

  const handleClick = (e) => {
    e.preventDefault();
    if (isAuthenticated) {
      navigate("/postproject");
      return;
    } else {
      toast.info("Please create account or login to post a project");
      navigate("/login");
    }

    // navigate(isAuthenticated ? "/postproject" : "/login");
  };

  return (
    <div className="bg-gray-50 mt-19 min-h-screen">
      {/* Hero Section */}
      <section className="text-center py-16 bg-blue-100 px-4">
        <h1 className="text-4xl md:text-5xl font-extrabold text-blue-800 mb-4">
          Explore Live Projects
        </h1>
        <p className="text-gray-700 text-lg md:text-xl">
          Find and join real student-led tech projects!
        </p>

        <button
          onClick={handleClick}
          className="cursor-pointer mt-6 bg-blue-600 text-white font-semibold px-8 py-3 rounded-xl shadow hover:bg-blue-700 transition-all duration-300"
        >
          🚀 List Your Project
        </button>
      </section>

      {/*---------- Projects Grid---------- */}
      <div className="max-w-7xl mx-auto px-4 py-10">
        {filteredProjects.length > 0 ? (
          <div className="grid gap-8 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            {filteredProjects
              .filter((project) => project && project._id)
              .map((project) => (
                <ProjectCard key={project._id} project={project} />
              ))}
          </div>
        ) : projectsData.length > 0 ? (
          // Shown when search has no matches
          <div className="text-center text-gray-600 text-lg mt-10">
            No matching projects found.
          </div>
        ) : (
          //Shown  when projects are still loading
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
    </div>
  );
};

export default Home;
