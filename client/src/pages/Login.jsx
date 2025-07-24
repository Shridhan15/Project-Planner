import React, { useState } from "react";
import { useContext } from "react";
import { ProjectContext } from "../../context/ProjectContext.jsx";
import { useEffect } from "react";
import { toast } from "react-toastify";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const { backendUrl, token, setToken, navigate } = useContext(ProjectContext);

  const [currentState, setCurrentState] = useState("Sign Up");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

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
        // console.log("Response:", response.data);
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
        // console.log("Response:", response.data);
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
    if (token) {
      navigate("/");
    }
  }, [token]);

  return (
    <form
      onSubmit={onSubmitHandler}
      className="flex flex-col items-center justify-center gap-4 p-4 w-full max-w-md mx-auto mt-20 bg-gray-100 shadow-lg rounded-lg"
    >
      <div className="inline-flex items-center gap-2 mb-2 mt-10">
        <p className="prata-regular text-3xl">{currentState} </p>
        <hr className="border-none h-[1.5px] w-8 bg-gray-800" />
      </div>
      {currentState === "Login" ? (
        ""
      ) : (
        <input
          className="border border-gray-500 w-full px-3 py-2"
          type="text"
          placeholder="enter name"
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      )}

      <input
        className="border border-gray-500 w-full px-3 py-2"
        type="email"
        placeholder="enter email"
        required
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      <input
        className="border border-gray-500 w-full px-3 py-2"
        type="password"
        placeholder="enter password"
        required
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      <div className="cursor-pointer text-blue-500 hover:underline font-light">
        {currentState === "Login" ? (
          <p onClick={() => setCurrentState("Sign Up")}>Create an account</p>
        ) : (
          <p onClick={() => setCurrentState("Login")}>
            Already have an account?
          </p>
        )}
      </div>

      <div>
        <button
          type="submit"
          className={`cursor-pointer ${
            currentState === "Login" ? "bg-blue-500" : "bg-green-500"
          } text-white px-4 py-2 rounded-lg`}
        >
          {currentState}
        </button>
      </div>
    </form>
  );
};

export default Login;
