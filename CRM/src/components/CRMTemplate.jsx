import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { FaTachometerAlt, FaPlus, FaFileAlt, FaEye, FaUserPlus, FaUsers } from "react-icons/fa";
import "./styles1.css";
import Welcome from "../components/Welcome"

export default function CRMTemplate() {
  const navigate = useNavigate();
  const [formFields, setFormFields] = useState(null);
  const [formData, setFormData] = useState({});
  const [activeTab, setActiveTab] = useState("Company");
  const [activeLeadsTab, setActiveLeadsTab] = useState("Company"); // New state for leads tab
  const [showForm, setShowForm] = useState(false);
  const [leads, setLeads] = useState([]);
  const [showTable, setShowTable] = useState(false);
  const [tableHeaders, setTableHeaders] = useState([]);

  useEffect(() => {
    const savedFields = JSON.parse(localStorage.getItem("generatedFormFields"));
    setFormFields(savedFields);
  }, []);

  const handleGenerateLead = () => {
    setShowForm(true);
    setShowTable(false);
    setFormData({}); // Reset form data when generating a new lead
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (section) => {
    const emptyFields = Object.keys(formFields[section])
      .filter((field) => formFields[section][field])
      .filter((field) => !formData[field.toLowerCase().replace(/\s/g, "")]);

    if (emptyFields.length > 0) {
      alert(`Please fill the following fields in ${section}: ${emptyFields.join(", ")}`);
      return;
    }

    try {
      const adminEmail = localStorage.getItem("userEmail"); // Get the logged-in admin's email
      let apiUrl;

      // Determine the correct API URL based on the section
      switch (section) {
        case "Company":
          apiUrl = "http://localhost:5000/api/saveCompanyLead";
          break;
        case "Banking":
          apiUrl = "http://localhost:5000/api/saveBankingLead";
          break;
        case "PersonalDetails":
          apiUrl = "http://localhost:5000/api/savePersonalDetailsLead";
          break;
        default:
          throw new Error("Invalid section");
      }

      const response = await axios.post(apiUrl, { ...formData, adminEmail });
      console.log("Response:", response.data); // Log the response
      alert(`${section} form submitted successfully!`);
      setFormData({}); // Reset form data after submission
    } catch (error) {
      console.error("Error submitting form:", error.response || error);
      alert("Failed to submit form.");
    }
  };

  const handleShowLeads = async () => {
    try {
      const email = localStorage.getItem("userEmail"); // Get the logged-in admin's email
      let apiUrl;

      // Determine the correct API URL based on the active leads tab
      switch (activeLeadsTab) {
        case "Company":
          apiUrl = `http://localhost:5000/api/getCompanyLeads?email=${email}`;
          break;
        case "Banking":
          apiUrl = `http://localhost:5000/api/getBankingLeads?email=${email}`;
          break;
        case "PersonalDetails":
          apiUrl = `http://localhost:5000/api/getPersonalDetailsLeads?email=${email}`;
          break;
        default:
          throw new Error("Invalid section");
      }

      const response = await axios.get(apiUrl);
      if (response.data.length > 0) {
        setLeads(response.data);
        const allKeys = new Set();
        response.data.forEach((lead) => {
          Object.keys(lead).forEach((key) => allKeys.add(key));
        });
        setTableHeaders(Array.from(allKeys));
        setShowTable(true);
        setShowForm(false);
      } else {
        alert("No leads available.");
        setShowTable(false);
      }
    } catch (error) {
      console.error("Error fetching leads:", error);
      alert("Failed to load leads.");
    }
  };

  // Fetch leads whenever the activeLeadsTab changes
  useEffect(() => {
    if (showTable) {
      handleShowLeads();
    }
  }, [activeLeadsTab]);

  return (
    <div className="container">
      <nav className="navbar">
        <div className="navbar-content">
          <div className="search-container">
            <input type="text" className="search-bar" placeholder="Search..." />
            <button className="search-button">Search</button>
          </div>
          <div className="navbar-icons">
            <button className="icon-button" title="Add">
              <i className="fas fa-plus"></i>
            </button>
            <button className="icon-button" title="Notifications">
              <i className="fas fa-bell"></i>
            </button>
            <button className="icon-button" title="Settings">
              <i className="fas fa-cog"></i>
            </button>
            <button className="icon-button" title="Help">
              <i className="fas fa-question-circle"></i>
            </button>
          </div>
          <div className="navbar-buttons">
            <button className="upgrade-button">Upgrade</button>
            <button className="copilot-button">Copilot</button>
            <button className="sign-out-button" onClick={() => navigate("/")}>
              <i className="fas fa-sign-out-alt"></i> Sign Out
            </button>
          </div>
        </div>
      </nav>

      <div className="sidebar">
        <h2>Lead</h2>
        <button className="sidebar-button" onClick={() => navigate("/dashboard")}>
          <FaTachometerAlt className="icon" /> <span>Dashboard</span>
        </button>
        <button className="sidebar-button" onClick={() => navigate("/FormSelector")}>
          <FaPlus className="icon" /> <span>Create Form</span>
        </button>
        <button className="sidebar-button" onClick={handleGenerateLead}>
          <FaFileAlt className="icon" /> <span>Generate Lead</span>
        </button>
        <button className="sidebar-button" onClick={handleShowLeads}>
          <FaEye className="icon" /> <span>Show Lead</span>
        </button>
        <button className="sidebar-button" onClick={() => navigate("/create-agent")}>
          <FaUserPlus className="icon" /> <span>Create Agent</span>
        </button>
        <button className="sidebar-button" onClick={() => navigate("/agent-list")}>
          <FaUsers className="icon" /> <span>Agent List</span>
        </button>
      </div>

      {/* Main Content */}
      <div className="main-content">
        {showForm && formFields ? (
          <div className="form-container">
            {/* Tabs for Form */}
            <div className="tabs">
              {Object.keys(formFields).map((section) => (
                <button
                  key={section}
                  className={`tab-button ${activeTab === section ? "active" : ""}`}
                  onClick={() => setActiveTab(section)}
                >
                  {section}
                </button>
              ))}
            </div>

            {/* Tab Content for Form */}
            <div className="tab-content">
              {Object.keys(formFields).map(
                
                (section) =>
                  activeTab === section &&
                  Object.values(formFields[section]).some((val) => val) && (
                    <div key={section} className="form-subsection">
                      <h3>{section}</h3>
                      {Object.keys(formFields[section]).map(
                        (field) =>
                          formFields[section][field] && (
                            <div key={field} className="input-field-container">
                              <h4>{field}</h4>
                              <input
                                type="text"
                                name={field.toLowerCase().replace(/\s/g, "")}
                                value={formData[field.toLowerCase().replace(/\s/g, "")] || ""}
                                onChange={handleChange}
                                className="input-field"
                              />
                            </div>
                          )
                      )}
                      <button className="submit-button" onClick={() => handleSubmit(section)}>
                        Submit {section} Form
                      </button>
                    </div>
                  )
              )}
            </div>
          </div>
        ) : showTable ? (
          <div className="table-container">
            {/* Tabs for Leads */}
            <div className="tabs1">
              <button
                className={`tab-button ${activeLeadsTab === "Company" ? "active" : ""}`}
                onClick={() => {
                  setActiveLeadsTab("Company");
                  handleShowLeads(); // Fetch leads when switching tabs
                }}
              >
                Company
              </button>
              <button
                className={`tab-button ${activeLeadsTab === "Banking" ? "active" : ""}`}
                onClick={() => {
                  setActiveLeadsTab("Banking");
                  handleShowLeads(); // Fetch leads when switching tabs
                }}
              >
                Banking
              </button>
              <button
                className={`tab-button ${activeLeadsTab === "PersonalDetails" ? "active" : ""}`}
                onClick={() => {
                  setActiveLeadsTab("PersonalDetails");
                  handleShowLeads(); // Fetch leads when switching tabs
                }}
              >
                Personal Details
              </button>
            </div>

            {/* Tab Content for Leads */}
            <div className="tab-content">
              {activeLeadsTab === "Company" && leads.length > 0 ? (
                <table className="leads-table">
                  <thead>
                    <tr>
                      {tableHeaders.map((key) => (
                        <th key={key}>{key.toUpperCase().replace(/_/g, " ")}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {leads.map((lead, index) => (
                      <tr key={index}>
                        {tableHeaders.map((key) => (
                          <td key={key}>{lead[key] || "-"}</td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : activeLeadsTab === "Banking" && leads.length > 0 ? (
                <table className="leads-table">
                  <thead>
                    <tr>
                      {tableHeaders.map((key) => (
                        <th key={key}>{key.toUpperCase().replace(/_/g, " ")}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {leads.map((lead, index) => (
                      <tr key={index}>
                        {tableHeaders.map((key) => (
                          <td key={key}>{lead[key] || "-"}</td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : activeLeadsTab === "PersonalDetails" && leads.length > 0 ? (
                <table className="leads-table">
                  <thead>
                    <tr>
                      {tableHeaders.map((key) => (
                        <th key={key}>{key.toUpperCase().replace(/_/g, " ")}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {leads.map((lead, index) => (
                      <tr key={index}>
                        {tableHeaders.map((key) => (
                          <td key={key}>{lead[key] || "-"}</td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <h3>No leads available for {activeLeadsTab}</h3>
              )}
            </div>
          </div>
        ) : (<Welcome/>
          
        )}
      </div>
    </div>
  );
}
