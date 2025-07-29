import React, { useContext, useEffect } from "react";
import { toast } from "react-toastify";
import { MdDelete } from "react-icons/md";
import { AdminContext } from "../context/AdminContext";
import { assets } from "../assets/assets";
import axios from "axios";

const Projects = () => {
  const { backendUrl, atoken, projects, getAllProjects } =
    useContext(AdminContext);

  useEffect(() => {
    getAllProjects();
  }, []);

  useEffect(() => {
    console.log(projects);
  }, [projects]);

  const handleDelete = async (projectId) => {
    try {
      const res = await axios.delete(
        `${backendUrl}/api/admin/project/delete/${projectId}`,{headers: { atoken  } }
      );
      const data = res.data;
      if (data.success) {
        toast.success("Project deleted successfully");
        getAllProjects();  
      } else {
        toast.error(data.message || "Failed to delete project");
      }
    } catch (err) {
      console.error("Error deleting project: ", err);
      toast.error("Error deleting project");
    }
  };
 
  const sortedProjects = [...(projects || [])].sort((a, b) => {
    if (a.status === b.status) return 0;
    return a.status === "open" ? -1 : 1;
  });

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">All Projects</h2>
      <div className="overflow-x-auto rounded-lg shadow">
        <table className="min-w-full bg-white">
          <thead>
            <tr className="bg-gray-100 text-left text-sm font-semibold text-gray-700">
              <th className="px-4 py-3">S. No</th>
              <th className="px-4 py-3">Image</th>
              <th className="px-4 py-3">Project Name</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Author</th>
              <th className="px-4 py-3">Action</th>
            </tr>
          </thead>
          <tbody>
            {sortedProjects.length > 0 ? (
              sortedProjects.map((project, index) => (
                <tr key={project._id} className="border-t text-sm">
                  <td className="px-4 py-2">{index + 1}</td>
                  <td className="px-4 py-2">
                    <img
                      src={project.image || assets.default_img}
                      alt="Project"
                      className="w-16 h-16 object-cover rounded"
                    />
                  </td>
                  <td className="px-4 py-2 font-medium">{project.title}</td>
                  <td className="px-4 py-2">
                    <span
                      className={`px-2 py-1 rounded text-xs font-semibold ${
                        project.status === "open"
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {project.status}
                    </span>
                  </td>
                  <td className="px-4 py-2">
                    {project.author?.name || "Unknown"}
                  </td>
                  <td className="px-4 py-2">
                    <button
                      onClick={() => handleDelete(project._id)}
                      className="text-red-600 cursor-pointer hover:text-red-800"
                    >
                      <MdDelete size={22} />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="px-4 py-6 text-center text-gray-500">
                  No projects found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Projects;
