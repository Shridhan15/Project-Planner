import React, { useContext, useState } from "react";
import { ProjectContext } from "../../context/ProjectContext";
import axios from "axios";
import { toast } from "react-toastify";

const PostProject = () => {
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [skillsRequired, setSkillsRequired] = useState("");
  const [techStack, setTechStack] = useState("");
  const [image, setImage] = useState(false);
  const [enhancing, setEnhancing] = useState(false);

  const { backendUrl, token, navigate } = useContext(ProjectContext);

  const enhanceDescription = async () => {
    if (!desc.trim()) {
      toast.error("Please enter the description first!");
      return;
    }

    // 🔥 Minimum 40 characters check
    if (desc.trim().length < 40) {
      toast.error("Description should be at least 40 characters long!");
      return;
    }

    try {
      setEnhancing(true);

      const { data } = await axios.post(
        backendUrl + "/api/project/enhance-desc",
        { text: desc },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (data.enhancedText) {
        setDesc(data.enhancedText);
        toast.success("Description enhanced ✨");
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to enhance. Try again.");
    } finally {
      setEnhancing(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("description", desc);
      formData.append("skillsRequired", skillsRequired);
      formData.append("techStack", techStack);

      if (image) formData.append("image", image);

      const response = await axios.post(
        backendUrl + "/api/project/add",
        formData,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.data.success) {
        toast.success("Project submitted successfully!");
        setTitle("");
        setDesc("");
        setSkillsRequired("");
        setTechStack("");
        setImage(null);
        navigate("/");
      } else {
        toast.error(response.data.message || "Failed to submit project.");
      }
    } catch (error) {
      console.error("Error submitting project:", error);
      toast.error("Failed to submit project. Please try again later.");
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white shadow-lg rounded-lg mt-25">
      <h2 className="text-2xl font-bold mb-4 text-center">
        Post a New Project
      </h2>
      <form
        onSubmit={handleSubmit}
        className="space-y-6 bg-white/80 backdrop-blur-xl p-8 rounded-2xl shadow-xl border border-gray-200"
      >
        {/* Title */}
        <div className="flex flex-col gap-1">
          <label className="text-gray-700 font-medium">Project Title</label>
          <input
            type="text"
            name="title"
            placeholder="Enter a clear & short title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            className="w-full border px-3 py-2 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
          />
        </div>

        {/* Description + Enhance Button */}
        <div className="flex flex-col gap-1 relative">
          <label className="text-gray-700 font-medium">
            Project Description
          </label>

          <textarea
            name="description"
            placeholder="Describe your project goals, features, and expectations..."
            value={desc}
            onChange={(e) => setDesc(e.target.value)}
            required
            className="w-full h-40 border px-4 py-3 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none pr-32 resize-none"
          />

          {/* AI Enhance Button */}
          <button
            type="button"
            onClick={enhanceDescription}
            className="absolute cursor-pointer right-3 top-[52px] bg-purple-600 text-white px-4 py-1.5 rounded-full text-sm shadow hover:bg-purple-700 hover:scale-105 transition-all"
          >
            {enhancing ? "Enhancing..." : "✨ Enhance"}
          </button>
        </div>

        {/* Skills Required */}
        <div className="flex flex-col gap-1">
          <label className="text-gray-700 font-medium">Required Skills</label>
          <input
            type="text"
            name="skillsRequired"
            placeholder="e.g. React, Node.js, MongoDB"
            value={skillsRequired}
            onChange={(e) => setSkillsRequired(e.target.value)}
            className="w-full border px-3 py-2 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
          />
        </div>

        {/* Tech Stack */}
        <div className="flex flex-col gap-1">
          <label className="text-gray-700 font-medium">Tech Stack</label>
          <input
            type="text"
            name="techStack"
            placeholder="e.g. MERN, Django, Flutter"
            value={techStack}
            onChange={(e) => setTechStack(e.target.value)}
            className="w-full border px-3 py-2 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
          />
        </div>

        {/* Image Upload */}
        <div className="flex flex-col gap-1">
          <label className="text-gray-700 font-medium">Project Image</label>
          <input
            type="file"
            name="image"
            accept="image/*"
            onChange={(e) => setImage(e.target.files[0])}
            className="w-full border px-3 py-2 rounded-lg bg-gray-50 cursor-pointer focus:ring-2 focus:ring-blue-500 outline-none"
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full cursor-pointer bg-blue-600 text-white font-semibold py-3 rounded-xl shadow-lg hover:bg-blue-700 hover:scale-[1.02] transition-all"
        >
          🚀 Submit Project
        </button>
      </form>
    </div>
  );
};

export default PostProject;
