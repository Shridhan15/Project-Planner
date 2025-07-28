import React, { useContext, useEffect } from "react"; 
import { toast } from "react-toastify";
import { MdDelete } from "react-icons/md";
import { AdminContext } from "../context/AdminContext";
import { assets } from "../assets/assets";

const Projects = () => {
  const { backendUrl, token, projects, getAllProjects } =
    useContext(AdminContext);

  useEffect(() => {
    getAllProjects();
  }, []);

  const handleDelete = async (projectId) => {
    try {
      const res = await fetch(`${backendUrl}/api/project/delete/${projectId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();
      if (data.success) {
        toast.success("Project deleted successfully");
        getAllProjects(); // refresh list
      } else {
        toast.error(data.message || "Failed to delete project");
      }
    } catch (err) {
      toast.error("Error deleting project");
    }
  };

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
              <th className="px-4 py-3">Author</th>
              <th className="px-4 py-3">Action</th>
            </tr>
          </thead>
          <tbody>
            {projects && projects.length > 0 ? (
              projects.map((project, index) => (
                <tr key={project._id} className="border-t text-sm">
                  <td className="px-4 py-2">{index + 1}</td>
                  <td className="px-4 py-2">
                    <img
                      src={project.image ? project.image : assets.default_img}
                      alt="Project"
                      className="w-16 h-16 object-cover rounded"
                    />
                  </td>
                  <td className="px-4 py-2 font-medium">{project.title}</td>
                  <td className="px-4 py-2">
                    {project.author?.name || "Unknown"}
                  </td>
                  <td className="px-4 py-2">
                    <button
                      onClick={() => handleDelete(project._id)}
                      className="text-red-600 hover:text-red-800"
                    >
                      <MdDelete size={22} />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="px-4 py-6 text-center text-gray-500">
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
