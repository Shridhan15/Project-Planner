import React from "react";
import Navbar from "./components/Navbar";
import { Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Footer from "./components/Footer";
import PostProject from "./pages/PostProject";
import { ToastContainer, toast } from "react-toastify";
import ProtectedRoute from "./components/ProtectedRoute";
import Profile from "./pages/Profile";
import EditProfile from "./pages/EditProfile.jsx";
import AuthorProfile from "./pages/AuthorProfile.jsx";

const App = () => {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors duration-200">
      <ToastContainer
        theme="colored"
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route
          path="/postproject"
          element={
            <ProtectedRoute>
              <PostProject />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />
        <Route path="/edit-profile" element={<EditProfile />} />
        <Route path="/author/:authorId" element={<AuthorProfile />} />
      </Routes>
      {/* <Footer /> */}
    </div>
  );
};

export default App;
