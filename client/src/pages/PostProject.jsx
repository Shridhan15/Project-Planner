import React, { useContext, useState } from "react";
import { ProjectContext } from "../../context/ProjectContext";
import axios from "axios";
import { toast } from "react-toastify";
import { Send } from "lucide-react";

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

    if (desc.trim().length < 40) {
      toast.error("Description should be at least 40 characters long!");
      return;
    }

    try {
      setEnhancing(true);

      const { data } = await axios.post(
        backendUrl + "/api/project/enhance-desc",
        { text: desc },
        { headers: { Authorization: `Bearer ${token}` } }
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

      const res = await axios.post(backendUrl + "/api/project/add", formData, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.data.success) {
        toast.success("Project submitted successfully!");
        setTitle("");
        setDesc("");
        setSkillsRequired("");
        setTechStack("");
        setImage(null);
        navigate("/");
      } else {
        toast.error(res.data.message || "Failed to submit project.");
      }
    } catch (error) {
      console.error("Error submitting project:", error);
      toast.error("Failed to submit project. Please try again later.");
    }
  };

  return (
    <div className="max-w-3xl mx-auto mt-28 px-4">
      <div
        className="bg-gradient-to-br from-slate-900/80 via-violet-900/40 to-black/70 
      backdrop-blur-xl shadow-2xl rounded-2xl border border-slate-700 p-8 text-gray-200"
      >
        <h2 className="text-3xl font-bold text-center mb-6 text-violet-300">
          Post a New Project 🚀
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Title */}
          <div>
            <label className="text-gray-300 font-medium">Project Title</label>
            <input
              type="text"
              placeholder="Enter project title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className="w-full mt-1 px-4 py-2 bg-slate-800 border border-slate-700 
              rounded-lg text-gray-200 focus:ring-2 focus:ring-violet-500 outline-none transition"
            />
          </div>
          {/* Description */}
          <div className="relative">
            <label className="text-gray-300 font-medium">
              Project Description
            </label>

            <textarea
              placeholder="Describe your project goals, features, expectations..."
              value={desc}
              onChange={(e) => setDesc(e.target.value)}
              required
              className="w-full mt-1 h-40 px-4 py-3 bg-slate-800 border border-slate-700 
              rounded-xl text-gray-200 resize-none focus:ring-2 focus:ring-violet-500 outline-none pr-32 transition"
            />

            <button
              type="button"
              onClick={enhanceDescription}
              className="absolute right-3 top-[52px] bg-violet-600 hover:bg-violet-700 
              text-white px-4 py-1.5 rounded-full text-sm shadow-md cursor-pointer hover:scale-105 transition"
            >
              {enhancing ? "Enhancing..." : " Enhance"}
            </button>
          </div>
          {/* Skills */}
          <div>
            <label className="text-gray-300 font-medium">Required Skills</label>
            <input
              type="text"
              placeholder="React, Node.js, MongoDB"
              value={skillsRequired}
              onChange={(e) => setSkillsRequired(e.target.value)}
              className="w-full mt-1 px-4 py-2 bg-slate-800 border border-slate-700 
              rounded-lg text-gray-200 focus:ring-2 focus:ring-violet-500 outline-none transition"
            />
          </div>
          {/* Tech Stack */}
          <div>
            <label className="text-gray-300 font-medium">Tech Stack</label>
            <input
              type="text"
              placeholder="MERN, Django, Flutter"
              value={techStack}
              onChange={(e) => setTechStack(e.target.value)}
              className="w-full mt-1 px-4 py-2 bg-slate-800 border border-slate-700 
              rounded-lg text-gray-200 focus:ring-2 focus:ring-violet-500 outline-none transition"
            />
          </div>
          {/* Image */}
          <div>
            <label className="text-gray-300 font-medium">Project Image</label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setImage(e.target.files[0])}
              className="w-full mt-1 px-3 py-2 bg-slate-900 border border-slate-700 
              rounded-lg text-gray-300 cursor-pointer focus:ring-2 focus:ring-violet-500 outline-none transition"
            />
          </div>
          {/* Submit Button */}

          <button
            type="submit"
            className="w-full bg-violet-600 hover:bg-violet-700 text-white 
  font-semibold py-3 rounded-xl shadow-lg hover:scale-[1.02] 
  transition cursor-pointer inline-flex items-center justify-center gap-2"
          >
            <Send className="w-5 h-5" />
            Submit Project
          </button>
        </form>
      </div>
    </div>
  );
};

export default PostProject;
