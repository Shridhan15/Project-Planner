import React, { useContext } from "react";
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
import { ProjectContext } from "../context/ProjectContext.jsx";
import SupportBox from "./components/SupportBox.jsx";
import MessagesPage from "./pages/MessagePage.jsx";
import MessageNotification from "./components/MessageNotification.jsx";

const App = () => {
  const { messageNotifications, userProfile, removeMessageNotification } =
    useContext(ProjectContext);

  return (
    <div className="flex flex-col min-h-screen bg-white transition-colors duration-200">
      <ToastContainer />
      <Navbar />

      <main className="flex-grow">
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
          <Route path="/messages" element={<MessagesPage />} />
        </Routes>
      </main>

      {userProfile && <Footer />}
      <SupportBox />
    </div>
  );
};

export default App;
