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
      formData.append(
        "mobileNumber",
        mobileNumber ? mobileNumber : ""
      );
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
        className="max-w-4xl mx-auto mt-25 bg-white p-8 rounded-xl shadow-xl space-y-6"
      >
        <h2 className="text-3xl font-bold text-center text-gray-800">
          Edit Profile
        </h2>

        {/*----------- Profile Image Upload --------------*/}
        <div className="flex justify-center">
          <label htmlFor="image" className="relative group cursor-pointer">
            <img
              src={
                profileImage
                  ? URL.createObjectURL(profileImage) // preview selected image
                  : userProfile.profileImage || assets.profile_icon  
              }
              alt="Profile"
              className="w-28 h-28 object-cover rounded-full border-2 border-gray-300 shadow-md group-hover:opacity-80 transition duration-200"
            />

            <img
              src={assets.upload_icon}
              alt="Upload"
              className="absolute -bottom-2 -right-2 w-8 h-8 bg-black rounded-full p-1 border border-gray-300"
            />

            <input
              type="file"
              id="image"
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files[0];
                if (file) {
                  setProfileImage(file);
                }
              }}
            />
          </label>
        </div>

        {/* Input Fields */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* -----------Left Column----------- */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Name
              </label>
              <input
                type="text"
                name="name"
                onChange={(e) => setName(e.target.value)}
                defaultValue={userProfile.name}
                required 
                className="mt-1 w-full px-4 py-2 border rounded-md bg-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Mobile Number
              </label>
              <input
                name="mobileNumber"
                onChange={(e) => {
                  const value = e.target.value;
                  if (/^\d{0,10}$/.test(value)) {
                    setMobileNumber(value);
                  }
                }} 
                defaultValue={userProfile.mobileNumber}
                type="tel"
                pattern="\d{10}"
                inputMode="numeric"
                placeholder="Enter 10-digit mobile number"
                className="mt-1 w-full px-4 py-2 border rounded-md bg-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Email
              </label>
              <input
                name="email"
                required
                disabled
                onChange={(e) => setEmail(e.target.value)}
                type="email"
                defaultValue={userProfile.email}
                className="mt-1 w-full px-4 py-2 border rounded-md bg-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* ---------Right Column-------------- */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Year of Study
              </label>
              <input
                name="yearOfStudy"
                onChange={(e) => setYearOfStudy(e.target.value)}
                type="text"
                defaultValue={userProfile.yearOfStudy}
                className="mt-1 w-full px-4 py-2 border rounded-md bg-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Skills
              </label>
              <input
                name="skills"
                onChange={(e) => setSkills(e.target.value)}
                type="text"
                defaultValue={userProfile.skills}
                className="mt-1 w-full px-4 py-2 border rounded-md bg-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Tech Stack
              </label>
              <input
                name="technologiesKnown"
                onChange={(e) => settechnologiesKnown(e.target.value)}
                type="text"
                defaultValue={userProfile.technologiesKnown}
                className="mt-1 w-full px-4 py-2 border rounded-md bg-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>

        <div className="flex justify-center">
          <button
            type="submit"
            className="cursor-pointer mt-4 px-6 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition"
          >
            Save Changes
          </button>

          <button
            type="button"
            className="cursor-pointer ml-1 mt-4 px-6 py-2 bg-red-400 text-white font-medium rounded-lg hover:bg-red-500 transition"
            onClick={() => navigate("/profile")}
          >
            Cancel
          </button>
        </div>
      </form>
    )
  );
};

export default EditProfile;
