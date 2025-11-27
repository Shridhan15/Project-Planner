import React, { useContext, useEffect } from "react";
import ProjectCard from "../components/ProjectCard";
import { ProjectContext } from "../../context/ProjectContext";
import { toast } from "react-toastify";
import { Rocket } from "lucide-react";

const Home = () => {
  const {
    projectsData,
    filteredProjects,
    getAllProjects,
    navigate,
    isAuthenticated,
    recommendedProjects,
    searchTerm,
    userProfile,
  } = useContext(ProjectContext);

  useEffect(() => {
    getAllProjects();
  }, []);

  const handleClick = () => {
    const token = localStorage.getItem("token");

    if (token) {
      navigate("/postproject");
    } else {
      toast.info("Please create account or login to post a project");
      navigate("/login");
    }
  };

  return (
    <div className="min-h-screen pt-20 bg-gradient-to-br from-slate-900 via-gray-900 to-black text-gray-100 antialiased">
      {/* decorative gradient blobs */}
      <div className="pointer-events-none fixed -z-10 inset-0 overflow-hidden">
        <div className="absolute -left-32 top-10 w-96 h-96 rounded-full bg-gradient-to-tr from-violet-700/30 via-indigo-600/20 to-transparent blur-3xl animate-blob"></div>
        <div className="absolute right-[-120px] bottom-10 w-80 h-80 rounded-full bg-gradient-to-tr from-rose-600/20 via-pink-500/10 to-transparent blur-2xl animate-blob animation-delay-2000"></div>
      </div>

      {/* ---------- Hero Section ---------- */}
      <section
        className="relative text-center py-20 px-6 mx-auto max-w-7xl
      bg-gradient-to-br from-transparent via-white/2 to-transparent
      rounded-2xl border border-white/5 shadow-2xl backdrop-blur-lg"
      >
        <h1 className="text-4xl md:text-6xl font-extrabold mb-4 tracking-tight">
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-violet-300 via-white to-blue-200">
            Explore Live Projects
          </span>
        </h1>

        <p className="text-gray-300 text-lg md:text-xl max-w-3xl mx-auto leading-relaxed">
          Find and join real student-led tech projects. Collaborate, learn and
          build something meaningful — together.
        </p>

        <div className="mt-8 flex items-center justify-center gap-4">
          <button
            onClick={handleClick}
            className="cursor-pointer inline-flex items-center gap-3 px-6 py-3 rounded-full
  bg-gradient-to-r from-violet-600 to-indigo-600 text-white font-semibold
  shadow-lg hover:scale-105 transform transition"
          >
            <Rocket className="w-5 h-5 text-white" />
            List Your Project
          </button>
        </div>
      </section>

      {/* ---------- Recommended Projects ---------- */}
      {!searchTerm && userProfile && userProfile?.skills != "" && (
        <section className="py-12 px-4 mt-10">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-3xl font-bold text-white mb-8 text-center">
              Recommended Projects
            </h2>

            {recommendedProjects.length > 0 ? (
              <div className="grid gap-8 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                {recommendedProjects.map((project) => (
                  <div
                    key={project._id}
                    className="transform hover:-translate-y-3 hover:scale-105 transition-all duration-300"
                  >
                    <div className="rounded-xl border border-white/8 shadow-xl overflow-hidden bg-gradient-to-br from-[#0b1020]/60 to-[#071029]/40">
                      <ProjectCard project={project} />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center text-gray-400 py-12">
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
      <section className="py-14 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold text-white border-b-4 border-indigo-500 w-fit pb-1">
              All Projects
            </h2>
            <div className="text-sm text-gray-400">Showing results</div>
          </div>

          {filteredProjects.length > 0 ? (
            <div className="grid gap-8 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
              {filteredProjects
                .filter((project) => project && project._id)
                .map((project) => (
                  <div
                    key={project._id}
                    className="rounded-xl overflow-hidden border border-white/8 bg-gradient-to-br from-[#071026]/60 to-[#0b1023]/40 shadow-2xl transform hover:-translate-y-2 hover:scale-102 transition"
                  >
                    <ProjectCard project={project} />
                  </div>
                ))}
            </div>
          ) : projectsData.length > 0 ? (
            <div className="text-center text-gray-400 text-lg mt-10">
              No matching projects found.
            </div>
          ) : (
            <div className="grid gap-8 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
              {[...Array(6)].map((_, index) => (
                <div
                  key={index}
                  className="animate-pulse p-6 rounded-xl shadow-xl border border-white/8 bg-gradient-to-br from-[#0b101a]/60 to-[#071026]/40"
                >
                  <div className="h-6 bg-gray-800/40 rounded w-3/4"></div>
                  <div className="h-4 bg-gray-800/40 rounded w-full mt-4"></div>
                  <div className="h-4 bg-gray-800/40 rounded w-5/6 mt-3"></div>
                  <div className="mt-6 h-10 bg-gray-800/40 rounded w-1/2"></div>
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
