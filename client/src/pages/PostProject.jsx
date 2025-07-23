import React, { useState } from 'react';

const PostProject = () => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    skillsRequired: '',
    techStack: '',
    author: '',
    email: '',
    image: null,
  });

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'image') {
      setFormData({ ...formData, image: files[0] });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // For now, just log the data
    const dataToSubmit = {
      ...formData,
      skillsRequired: formData.skillsRequired.split(',').map(skill => skill.trim()),
      techStack: formData.techStack.split(',').map(stack => stack.trim()),
    };

    console.log('Submitted Project:', dataToSubmit);

    // TODO: Send to backend API
    alert('Project submitted successfully!');
  };

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white shadow-lg rounded-lg mt-10">
      <h2 className="text-2xl font-bold mb-4 text-center"> Post a New Project</h2>
      <form onSubmit={handleSubmit} className="space-y-4">

        <input
          type="text"
          name="title"
          placeholder="Project Title"
          value={formData.title}
          onChange={handleChange}
          required
          className="w-full border px-4 py-2 rounded"
        />

        <textarea
          name="description"
          placeholder="Project Description"
          value={formData.description}
          onChange={handleChange}
          required
          className="w-full border px-4 py-2 rounded"
        />

        <input
          type="text"
          name="skillsRequired"
          placeholder="Required Skills (comma separated)"
          value={formData.skillsRequired}
          onChange={handleChange}
          className="w-full border px-4 py-2 rounded"
        />

        <input
          type="text"
          name="techStack"
          placeholder="Tech Stack (comma separated)"
          value={formData.techStack}
          onChange={handleChange}
          className="w-full border px-4 py-2 rounded"
        />

        <input
          type="text"
          name="author"
          placeholder="Your Name"
          value={formData.author}
          onChange={handleChange}
          required
          className="w-full border px-4 py-2 rounded"
        />

        <input
          type="email"
          name="email"
          placeholder="Your Email"
          value={formData.email}
          onChange={handleChange}
          required
          className="w-full border px-4 py-2 rounded"
        />

        <input
          type="file"
          name="image"
          accept="image/*"
          onChange={handleChange}
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
