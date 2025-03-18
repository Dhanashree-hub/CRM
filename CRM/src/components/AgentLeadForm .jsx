import { useState } from "react";
import "./AgentLeadForm.css";

const AgentLeadForm = () => {
  const [formData, setFormData] = useState({
    id: "",
    name: "",
    email: "",
    password: "",
    leadStatus: "Active",
    assignedLeads: "",
  });

  const [successMessage, setSuccessMessage] = useState(""); // State for success message
  const [errorMessage, setErrorMessage] = useState(""); // State for error message

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const adminEmail = localStorage.getItem("userEmail"); // Get the logged-in admin's email

    if (!adminEmail) {
      alert("You must be logged in as an admin to submit this form.");
      return;
    }

    try {
      const response = await fetch("http://localhost:5000/api/saveAgentLead", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ...formData, adminEmail }), // Include admin's email
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Error: ${errorData.message}`);
      }

      const result = await response.json();
      setSuccessMessage("Agent lead saved successfully!");
      setErrorMessage(""); // Clear error message

      // Reset the form after successful submission
      setFormData({
        id: "",
        name: "",
        email: "",
        password: "",
        leadStatus: "Active",
        assignedLeads: "",
      });
    } catch (error) {
      console.error("Error submitting agent lead:", error.message);
      setSuccessMessage(""); // Clear success message on error
      setErrorMessage("Failed to submit agent lead.");
    }
  };

  const handleBack = () => {
    window.history.back();
  };

  return (
    <div className="container2">
      <button className="back-btn" onClick={handleBack}>
        ←
      </button>

      <div className="form-container2">
        <h2>Agent Lead Form</h2>
        {successMessage && <p className="success-message">{successMessage}</p>} {/* Display success message */}
        {errorMessage && <p className="error-message">{errorMessage}</p>} {/* Display error message */}
        
        <form onSubmit={handleSubmit}>
          {Object.keys(formData).map((key) =>
            key !== "leadStatus" ? (
              <div key={key} className="form-group">
                <label>{key.charAt(0).toUpperCase() + key.slice(1)}</label>
                <input
                  type={key === "password" ? "password" : "text"}
                  name={key}
                  value={formData[key]}
                  onChange={handleChange}
                  required
                />
              </div>
            ) : (
              <div key={key} className="form-group">
                <label>Agent Lead Status</label>
                <select
                  name={key}
                  value={formData[key]}
                  onChange={handleChange}
                >
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </div>
            )
          )}
          <button type="submit" className="submit-btn">Submit</button>
        </form>
      </div>

      <div className="preview-container">
        <h3>Agent Preview</h3>
        {Object.entries(formData).map(([key, value]) => (
          <p key={key}>
            <strong>{key.charAt(0).toUpperCase() + key.slice(1)}:</strong> {value}
          </p>
        ))}
      </div>
    </div>
  );
};

export default AgentLeadForm;
