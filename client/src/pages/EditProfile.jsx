import React, { use, useContext, useState } from "react";
import { assets } from "../assets/assets";
import { ProjectContext } from "../../context/ProjectContext";
import axios from "axios";
import { toast } from "react-toastify";

const EditProfile = () => {
  const { token, navigate, backendUrl, fetchUserProfile, userProfile } =
    useContext(ProjectContext);
  const [name, setName] = useState(userProfile?.name || "");
  const [email, setEmail] = useState("");
  const [mobileNumber, setMobileNumber] = useState("");
  const [yearOfStudy, setYearOfStudy] = useState("");
  const [skills, setSkills] = useState("");
  const [technologiesKnown, settechnologiesKnown] = useState("");
  const [profileImage, setProfileImage] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      if (!name.trim()) {
        toast.error("Name cannot be empty or just spaces");
        return;
      }
      formData.append("name", name ? name : userProfile.name);
      formData.append("email", email ? email : userProfile.email);
      formData.append("mobileNumber", mobileNumber ? mobileNumber : "");
      formData.append(
        "yearOfStudy",
        yearOfStudy ? yearOfStudy : userProfile.yearOfStudy
      );
      formData.append("skills", skills ? skills : userProfile.skills);
      formData.append(
        "technologiesKnown",
        technologiesKnown ? technologiesKnown : userProfile.yearOfStudy
      );
      if (profileImage) {
        formData.append("profileImage", profileImage);
      } else {
        formData.append("profileImage", "");
      }

      const response = await axios.put(
        backendUrl + "/api/user/update-profile",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log("Response of updation", response.data);
      if (response.data.success) {
        toast.success("Profile Update successfully");
        fetchUserProfile();
        navigate("/profile");
      }
    } catch (error) {
      console.log("Error in updating;", error);
    }
  };

  return (
    userProfile && (
      <form
        onSubmit={handleSubmit}
        className="
        max-w-4xl mx-auto mt-24 p-10 rounded-2xl
        bg-white/10 backdrop-blur-xl shadow-2xl 
        border border-white/20 space-y-8
      "
      >
        {/* ---- Heading ---- */}
        <h2
          className="text-3xl font-bold text-center 
        text-violet-200 drop-shadow-sm"
        >
          Edit Profile
        </h2>

        {/* ---- Profile Image ---- */}
        <div className="flex justify-center">
          <label htmlFor="image" className="relative group cursor-pointer">
            <img
              src={
                profileImage
                  ? URL.createObjectURL(profileImage)
                  : userProfile.profileImage || assets.profile_icon
              }
              alt="Profile"
              className="
              w-32 h-32 rounded-full object-cover 
              border-2 border-violet-400/40 shadow-lg 
              group-hover:opacity-80 transition
            "
            />

            <img
              src={assets.upload_icon}
              alt="Upload"
              className="
              absolute -bottom-2 -right-2 w-9 h-9 p-1.5 rounded-full
              bg-black/70 border border-white/20 shadow-md
            "
            />

            <input
              type="file"
              id="image"
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files[0];
                if (file) setProfileImage(file);
              }}
            />
          </label>
        </div>

        {/* ---- Inputs ---- */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* LEFT SIDE */}
          <div className="space-y-5">
            <div>
              <label className="text-gray-300 text-sm font-medium">Name</label>
              <input
                type="text"
                required
                defaultValue={userProfile.name}
                onChange={(e) => setName(e.target.value)}
                className="
                mt-1 w-full px-4 py-2 rounded-lg
                bg-white/10 text-white placeholder-gray-400
                border border-white/20 focus:ring-2
                focus:ring-violet-400 outline-none
              "
              />
            </div>

            <div>
              <label className="text-gray-300 text-sm font-medium">
                Mobile Number
              </label>
              <input
                type="tel"
                inputMode="numeric"
                defaultValue={userProfile.mobileNumber}
                onChange={(e) => {
                  const val = e.target.value;
                  if (/^\d{0,10}$/.test(val)) setMobileNumber(val);
                }}
                placeholder="Enter 10-digit mobile number"
                className="
                mt-1 w-full px-4 py-2 rounded-lg
                bg-white/10 text-white placeholder-gray-400
                border border-white/20 focus:ring-2
                focus:ring-violet-400 outline-none
              "
              />
            </div>

            <div>
              <label className="text-gray-300 text-sm font-medium">Email</label>
              <input
                disabled
                defaultValue={userProfile.email}
                className="
                mt-1 w-full px-4 py-2 rounded-lg
                bg-white/5 text-gray-400 cursor-not-allowed
                border border-white/10
              "
              />
            </div>
          </div>

          {/* RIGHT SIDE */}
          <div className="space-y-5">
            <div>
              <label className="text-gray-300 text-sm font-medium">
                Year of Study
              </label>
              <input
                type="text"
                defaultValue={userProfile.yearOfStudy}
                onChange={(e) => setYearOfStudy(e.target.value)}
                className="
                mt-1 w-full px-4 py-2 rounded-lg
                bg-white/10 text-white placeholder-gray-400
                border border-white/20 focus:ring-2
                focus:ring-violet-400 outline-none
              "
              />
            </div>

            <div>
              <label className="text-gray-300 text-sm font-medium">
                Skills
              </label>
              <input
                type="text"
                defaultValue={userProfile.skills}
                onChange={(e) => setSkills(e.target.value)}
                className="
                mt-1 w-full px-4 py-2 rounded-lg
                bg-white/10 text-white placeholder-gray-400
                border border-white/20 focus:ring-2
                focus:ring-violet-400 outline-none
              "
              />
            </div>

            <div>
              <label className="text-gray-300 text-sm font-medium">
                Tech Stack
              </label>
              <input
                type="text"
                defaultValue={userProfile.technologiesKnown}
                onChange={(e) => settechnologiesKnown(e.target.value)}
                className="
                mt-1 w-full px-4 py-2 rounded-lg
                bg-white/10 text-white placeholder-gray-400
                border border-white/20 focus:ring-2
                focus:ring-violet-400 outline-none
              "
              />
            </div>
          </div>
        </div>

        {/* ---- Buttons ---- */}
        <div className="flex justify-center gap-4 pt-4">
          {/* Save Button */}
          <button
            type="submit"
            className="
            cursor-pointer px-6 py-2 rounded-lg 
            bg-gradient-to-r from-violet-600 to-indigo-600 
            text-white font-semibold 
            hover:from-violet-500 hover:to-indigo-500
            hover:shadow-violet-500/40 
            border border-violet-400/30
            active:scale-95 transition-all duration-200
          "
          >
            Save Changes
          </button>

          {/* Cancel Button */}
          <button
            type="button"
            onClick={() => navigate("/profile")}
            className="
            cursor-pointer px-6 py-2 rounded-lg 
            bg-red-500/20 backdrop-blur-xl 
            text-red-200 font-semibold 
            border border-red-400/30 
            hover:bg-red-500/30 hover:text-red-100
            hover:shadow-red-500/40 
            active:scale-95 transition-all duration-200
          "
          >
            Cancel
          </button>
        </div>
      </form>
    )
  );
};

export default EditProfile;
