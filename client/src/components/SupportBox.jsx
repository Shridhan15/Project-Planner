import React, { useContext, useState } from "react";
import { toast } from "react-toastify";
import axios from "axios";
import { ProjectContext } from "../../context/ProjectContext";

const SupportBox = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });
  const {backendUrl}=useContext(ProjectContext)

  const toggleBox = () => {
    setIsOpen(!isOpen);
    if (isOpen) {
      setFormData({ name: "", email: "", phone: "", message: "" });
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(backendUrl + "/api/user/send-support", formData);
      toast.success("Message sent to admin!");
      setFormData({ name: "", email: "", phone: "", message: "" });
      setIsOpen(false);
    } catch (err) {
      console.log("Error sending support message:", err);
      toast.error("Failed to send message");
    }
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {isOpen ? (
        <div className="w-80 p-4 bg-white rounded-2xl shadow-xl border border-gray-200">
          <div className="flex justify-between items-center mb-2">
            <h3 className="font-bold text-lg">Need Help?</h3>
            <button
              onClick={toggleBox}
              className="text-gray-500 cursor-pointer"
            >
              ✖️
            </button>
          </div>
          <form onSubmit={handleSubmit} className="space-y-2">
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Your Name"
              className="w-full p-2 border rounded"
              required
            />
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Your Email"
              className="w-full p-2 border rounded"
              required
            />
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="Phone Number"
              className="w-full p-2 border rounded"
              required
            />
            <textarea
              name="message"
              value={formData.message}
              onChange={handleChange}
              placeholder="What's your issue?"
              className="w-full p-2 border rounded"
              rows="3"
              required
            />
            <button
              type="submit"
              className="w-full cursor-pointer bg-blue-600 text-white p-2 rounded hover:bg-blue-700"
            >
              Submit
            </button>
          </form>
        </div>
      ) : (
        <button
          onClick={toggleBox}
          className="bg-blue-600 cursor-pointer text-white rounded-full p-4 shadow-xl hover:bg-blue-700"
        >
          💬
        </button>
      )}
    </div>
  );
};

export default SupportBox;
