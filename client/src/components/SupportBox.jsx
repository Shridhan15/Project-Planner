import React, { useContext, useState, useEffect, useRef } from "react";
import { toast } from "react-toastify";
import axios from "axios";
import { ProjectContext } from "../../context/ProjectContext";

const SupportBox = () => {
  const [isOpen, setIsOpen] = useState(false);
  const boxRef = useRef(null);
  const { backendUrl } = useContext(ProjectContext);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });

  const toggleBox = () => {
    setIsOpen((prev) => !prev);

    if (isOpen) {
      // Reset when closing
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
      setIsOpen(false);
      setFormData({ name: "", email: "", phone: "", message: "" });
    } catch (err) {
      toast.error("Failed to send message");
    }
  };

  // ⭐ CLOSE IF CLICKED OUTSIDE
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (isOpen && boxRef.current && !boxRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);

    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  return (
    <div className="fixed bottom-5 right-5 z-[9999] pointer-events-none">
      <div className="relative pointer-events-auto" ref={boxRef}>
        {/* SUPPORT BOX */}
        <div
          className={`
            absolute bottom-14 right-0 w-80 p-4
            bg-[#1d142a]/90 backdrop-blur-xl rounded-2xl 
            border border-violet-400/20 shadow-xl shadow-violet-900/30

            transition-all duration-300 ease-[cubic-bezier(0.4,0.0,0.2,1)]
            transform origin-bottom-right 

            ${
              isOpen
                ? "opacity-100 scale-100 translate-y-0 pointer-events-auto"
                : "opacity-0 scale-95 translate-y-2 pointer-events-none"
            }
          `}
        >
          <div className="flex justify-between items-center mb-3">
            <h3 className="font-bold text-lg text-violet-200">Need Help?</h3>
            <button
              onClick={toggleBox}
              className="text-gray-300 hover:text-white transition cursor-pointer"
            >
              ✖
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-3">
            <input
              name="name"
              placeholder="Your Name"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full p-2 rounded-lg bg-white/10 border border-white/20 
              text-gray-200 placeholder-gray-400 
              focus:ring-2 focus:ring-violet-500 outline-none"
            />

            <input
              type="email"
              name="email"
              placeholder="Your Email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full p-2 rounded-lg bg-white/10 border border-white/20 
              text-gray-200 placeholder-gray-400 
              focus:ring-2 focus:ring-violet-500 outline-none"
            />

            <input
              name="phone"
              placeholder="Phone Number"
              value={formData.phone}
              onChange={handleChange}
              required
              className="w-full p-2 rounded-lg bg-white/10 border border-white/20 
              text-gray-200 placeholder-gray-400 
              focus:ring-2 focus:ring-violet-500 outline-none"
            />

            <textarea
              name="message"
              placeholder="What's your issue?"
              value={formData.message}
              onChange={handleChange}
              required
              rows="3"
              className="w-full p-2 rounded-lg bg-white/10 border border-white/20 
              text-gray-200 placeholder-gray-400 
              focus:ring-2 focus:ring-violet-500 outline-none resize-none"
            />

            <button
              type="submit"
              className="w-full bg-violet-600 hover:bg-violet-700 text-white 
              py-2 rounded-lg shadow-md cursor-pointer transition active:scale-95"
            >
              Submit
            </button>
          </form>
        </div>

        {/* FLOATING BUTTON */}
        <button
          onClick={toggleBox}
          className="
            bg-violet-600 hover:bg-violet-700 text-white shadow-xl
            rounded-full p-4 cursor-pointer transition active:scale-95
            flex items-center justify-center
          "
        >
          {/* New Stylish Icon */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="1.8"
            stroke="white"
            className="w-6 h-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M7 8h10M7 12h6m5 1.5V17a2 2 0 01-2 2H7l-4 3V5a2 2 0 012-2h10a2 2 0 012 2v6.5"
            />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default SupportBox;
