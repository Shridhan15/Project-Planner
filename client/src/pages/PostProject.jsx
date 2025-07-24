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

  const { backendUrl, token } = useContext(ProjectContext);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("description", desc);
      formData.append("skillsRequired", skillsRequired);
      formData.append("techStack", techStack);
      
      if (image) {
        formData.append("image", image);
      } else {
        formData.append("image", ""); // Handle case where no image is uploaded
      }

      for (let pair of formData.entries()) {
        console.log(pair[0] + ": " + pair[1]);
      }

      const response = await axios.post(backendUrl+'/api/project/add', formData, {headers:{token}})
      console.log("response", response.data);

       


    } catch (error) {
      console.error("Error submitting project:", error);
      toast.error("Failed to submit project. Please try again later.");
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white shadow-lg rounded-lg mt-10">
      <h2 className="text-2xl font-bold mb-4 text-center">
        {" "}
        Post a New Project
      </h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          name="title"
          placeholder="Project Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          className="w-full border px-4 py-2 rounded"
        />

        <textarea
          name="description"
          placeholder="Project Description"
          value={desc}
          onChange={(e) => setDesc(e.target.value)}
          required
          className="w-full border px-4 py-2 rounded"
        />

        <input
          type="text"
          name="skillsRequired"
          placeholder="Required Skills (comma separated)"
          value={skillsRequired}
          onChange={(e) => setSkillsRequired(e.target.value)}
          className="w-full border px-4 py-2 rounded"
        />

        <input
          type="text"
          name="techStack"
          placeholder="Tech Stack (comma separated)"
          value={techStack}
          onChange={(e) => setTechStack(e.target.value)}
          className="w-full border px-4 py-2 rounded"
        />

        

         

        <input
          type="file"
          name="image"
          accept="image/*"
          onChange={(e) => setImage(e.target.files[0])}
          className="w-full border px-4 py-2 rounded"
        />

        <button
          type="submit"
          className="w-full cursor-pointer bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
        >
          Submit Project
        </button>
      </form>
    </div>
  );
};

export default PostProject;
