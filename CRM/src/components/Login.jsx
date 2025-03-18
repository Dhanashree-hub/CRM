import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../components/Login.css";

const Login = () => {
  const [activeTab, setActiveTab] = useState("Admin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async () => {
    if (activeTab === "Admin") {
      // Backend logic for Admin login
      try {
        const response = await fetch("http://localhost:5000/api/adminLogin", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email, password }),
        });

        const data = await response.json();

        if (response.ok) {
          localStorage.setItem("isAuthenticated", "true");
          localStorage.setItem("userRole", "Admin");
          localStorage.setItem("userEmail", email); // Store user email
          
          // Clear form fields
          setEmail("");
          setPassword("");
          
          navigate("/Home"); // Redirect to Home page
        } else {
          alert(data.message || "Invalid email or password!");
        }
      } catch (error) {
        console.error("Error logging in:", error);
        alert("An error occurred during login.");
      }
    } else {
      alert("Only Admin can log in through this system.");
    }


    


  };

  const handleSignupRedirect = () => {
    navigate("/signup"); // Redirect to Signup page
  };

  useEffect(() => {
    console.log("Login component mounted");
  }, []);

  return (
    <div className="login-container">
      <div className="login-box">
        <h2>Sign In</h2>

        {/* Admin/Agent Toggle */}
        <div className="tab-switch">
          <button className={activeTab === "Admin" ? "active" : ""} onClick={() => setActiveTab("Admin")}>
            Admin
          </button>
          <button className={activeTab === "Agent" ? "active" : ""} onClick={() => setActiveTab("Agent")}>
            Agent
          </button>
        </div>

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button onClick={handleLogin}>Login</button>

        <p>Don't have an account? <span onClick={handleSignupRedirect}>Sign Up</span></p>
      </div>
    </div>
  );
};

export default Login;
