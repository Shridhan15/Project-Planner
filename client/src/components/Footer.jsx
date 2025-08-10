import React from "react";

const Footer = () => {
  return (
    <footer className="w-full bg-gray-900 text-gray-200 py-6 px-4 border-t border-gray-800 flex flex-col md:flex-row items-center justify-between mt-8">
      <div className="flex flex-col md:flex-row items-center gap-2 md:gap-6">
        <span className="font-semibold">Project Partner</span>
        <span>© {new Date().getFullYear()} All rights reserved.</span>
        <span className="hidden md:inline">|</span>
        <span className="text-sm">
          Made with <span className="text-pink-400">♥</span> by Shridhan
        </span>
      </div>
      <div className="flex items-center gap-4 mt-2 md:mt-0">
        <span className="text-sm">Follow us:</span>
        <a
          href="https://facebook.com"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-blue-400 transition"
        >
          Facebook
        </a>
        <a
          href="https://twitter.com"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-blue-300 transition"
        >
          Twitter
        </a>
        <a
          href="https://instagram.com"
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
