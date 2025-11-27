import React, { useState, useContext, useEffect } from "react";
import { ProjectContext } from "../../context/ProjectContext.jsx";
import { toast } from "react-toastify";
import axios from "axios";
import { Eye, EyeOff } from "lucide-react";

const Login = () => {
  const { backendUrl, token, setToken, navigate } = useContext(ProjectContext);

  const [currentState, setCurrentState] = useState("Sign Up");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    console.log(backendUrl);
  }, []);

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    try {
      if (currentState === "Sign Up") {
        const response = await axios.post(backendUrl + "/api/user/register", {
          name,
          email,
          password,
        });

        if (response.data.success) {
          toast.success("Registration successful!");
          setCurrentState("Login");
          setToken(response.data.token);
          localStorage.setItem("token", response.data.token);
        } else {
          toast.error(response.data.message || "Registration failed.");
        }
      } else {
        const response = await axios.post(backendUrl + "/api/user/login", {
          email,
          password,
        });

        if (response.data.success) {
          toast.success("Login successful!");
          setToken(response.data.token);
          localStorage.setItem("token", response.data.token);
        } else {
          toast.error(response.data.message || "Login failed.");
        }
      }
    } catch (error) {
      console.error("Error during form submission:", error);
      toast.error("An error occurred. Please try again later.");
    }
  };

  useEffect(() => {
    if (token) navigate("/");
  }, [token]);

  return (
    <form
      onSubmit={onSubmitHandler}
      className="flex flex-col items-center justify-center gap-5 p-6 w-full max-w-md mx-auto mt-32 
      bg-gradient-to-br from-slate-900/80 via-violet-900/50 to-black/60 
      backdrop-blur-md border border-slate-700 
      shadow-xl rounded-2xl text-gray-200"
    >
      {/* Toggle Login/Signup */}
      <p className="font-medium text-2xl text-center mb-2">
        <span
          className={`cursor-pointer hover:text-violet-400 transition ${
            currentState === "Sign Up" ? "text-violet-300 font-semibold" : ""
          }`}
          onClick={() => setCurrentState("Sign Up")}
        >
          Sign Up
        </span>{" "}
        /{" "}
        <span
          className={`cursor-pointer hover:text-violet-400 transition ${
            currentState === "Login" ? "text-violet-300 font-semibold" : ""
          }`}
          onClick={() => setCurrentState("Login")}
        >
          Login
        </span>
      </p>

      {/* Name Field (Only for Sign Up) */}
      {currentState !== "Login" && (
        <input
          className="w-full px-4 py-2 rounded-lg bg-slate-800 border border-slate-700 
          text-gray-200 placeholder-gray-400 focus:outline-none focus:ring-2 
          focus:ring-violet-500 transition"
          type="text"
          placeholder="Enter your name"
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      )}

      {/* Email */}
      <input
        className="w-full px-4 py-2 rounded-lg bg-slate-800 border border-slate-700 
        text-gray-200 placeholder-gray-400 focus:outline-none focus:ring-2 
        focus:ring-violet-500 transition"
        type="email"
        placeholder="Enter your email"
        required
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      {/* Password with Eye Button */}
      <div className="w-full relative">
        <input
          className="w-full px-4 py-2 rounded-lg bg-slate-800 border border-slate-700 
          text-gray-200 placeholder-gray-400 focus:outline-none focus:ring-2 
          focus:ring-violet-500 transition"
          type={showPassword ? "text" : "password"}
          placeholder="Enter your password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        {/* Eye Button */}
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="absolute cursor-pointer right-3 top-1/2 -translate-y-1/2 text-gray-300 hover:text-white"
        >
          {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
        </button>
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        className={`w-full cursor-pointer py-2 rounded-lg text-white transition font-semibold 
        ${
          currentState === "Login"
            ? "bg-violet-600 hover:bg-violet-700"
            : "bg-green-600 hover:bg-green-700"
        }`}
      >
        {currentState}
      </button>
    </form>
  );
};

export default Login;
