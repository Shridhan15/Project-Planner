import React from "react";

const Footer = () => {
  return (
    <footer className="w-full bg-gray-900 text-gray-300 py-6 px-4 border-t border-gray-800 flex flex-col md:flex-row items-center justify-between mt-8">
      <div className="flex flex-col md:flex-row items-center gap-2 md:gap-6 text-sm">
        <span className="font-semibold">Project Partner</span>
        <span>© {new Date().getFullYear()} All rights reserved.</span>
        <span className="hidden md:inline">|</span>
        <span>Developed by Shridhan</span>
      </div>
      <div className="flex items-center gap-4 mt-2 md:mt-0 text-sm">
        <span>Follow :</span>
        <a
          href="https://www.linkedin.com/in/shridhan-suman-3970a3293/"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-blue-400 transition"
        >
          Linkedin
        </a>
        <a
          href="https://github.com/Shridhan15"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-blue-300 transition"
        >
          Github
        </a>
        <a
          href="https://www.instagram.com/shridhan_me/"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-pink-400 transition"
        >
          Instagram
        </a>
      </div>
    </footer>
  );
};

export default Footer;
