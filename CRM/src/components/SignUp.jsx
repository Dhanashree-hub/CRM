import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../components/signup.css";

const Signup = () => {
  const [activeTab, setActiveTab] = useState("Admin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const navigate = useNavigate();

  const handleSignup = async () => {
    // Validate email format
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email)) {
      alert("Please enter a valid email address!");
      return;
    }

    // Validate password length
    if (password.length < 6) {
      alert("Password must be at least 6 characters long!");
      return;
    }

    // Check if passwords match
    if (password !== confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    try {
      const response = await fetch(`http://localhost:5000/api/${activeTab.toLowerCase()}Signup`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        alert(`${activeTab} account created successfully!`);

        // Clear the form fields
        setEmail("");
        setPassword("");
        setConfirmPassword("");

        navigate("/"); // Redirect to login page after signup
      } else {
        alert(data.message || "Error creating account!");
      }
    } catch (error) {
      console.error("Error signing up:", error);
      alert("An error occurred during signup.");
    }
  };

  const handleGoToLogin = () => {
    navigate("/"); // Redirect to the login page
  };

  return (
    <div className="signup-container">
      <div className="signup-box">
        <h2>Sign Up</h2>

        {/* Admin/Agent Toggle */}
        <div className="tab-switch">
          <button className={activeTab === "Admin" ? "active" : ""} onClick={() => setActiveTab("Admin")}>
            Admin
          </button>
          <button className={activeTab === "Agent" ? "active" : ""} onClick={() => setActiveTab("Agent")}>
            Agent
          </button>
        </div>

        {/* Signup Form */}
        <label>Email:</label>
        <input 
          type="email" 
          value={email} 
          onChange={(e) => setEmail(e.target.value)} 
          placeholder="Enter email" 
        />

        <label>Password:</label>
        <input 
          type="password" 
          value={password} 
          onChange={(e) => setPassword(e.target.value)} 
          placeholder="Enter password" 
        />

        <label>Confirm Password:</label>
        <input 
          type="password" 
          value={confirmPassword} 
          onChange={(e) => setConfirmPassword(e.target.value)} 
          placeholder="Confirm password" 
        />

        <button onClick={handleSignup}>Sign Up</button>

        <p>Already have an account? <span className="login-link" onClick={handleGoToLogin}>Login here</span></p>
      </div>
    </div>
  );
};

export default Signup;
