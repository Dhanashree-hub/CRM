import React, { useState, useMemo } from "react";
import { FaBoxOpen, FaTruck, FaCheckCircle, FaDollarSign, FaArrowLeft } from "react-icons/fa";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import "../components/Dashboard.css"; // Import your custom CSS

const Dashboard = () => {
  const navigate = useNavigate(); // Create a navigate function

  // State for leads data
  const [leads, setLeads] = useState([
    { id: 1, Firstname: "", Lastname: "", Phone: "", Address: "", Email: "", leadStatus: "Interested" },
    { id: 2, leadStatus: "New Lead" },
    { id: 3, leadStatus: "Interested" },
    { id: 4, leadStatus: "Interested" },
    { id: 5, leadStatus: "Interested" }
  ]);

  // Function to handle lead status change
  const handleLeadStatusChange = (id, newStatus) => {
    setLeads((prevLeads) =>
      prevLeads.map((lead) =>
        lead.id === id ? { ...lead, leadStatus: newStatus } : lead
      )
    );
  };

  // Dynamically calculate summary data
  const leadsData = useMemo(() => {
    const interested = leads.filter((lead) => lead.leadStatus === "Interested").length;
    const onHold = leads.filter((lead) => lead.leadStatus === "On Hold").length;
    const newLead = leads.filter((lead) => lead.leadStatus === "New Lead").length;
    const totalLeads = leads.length;

    return { interested, onHold, newLead, totalLeads };
  }, [leads]);

  // Get all column keys dynamically (excluding 'id')
  const columnKeys = Object.keys(leads[0]).filter((key) => key !== "id");

  // Reorder columns to ensure 'leadStatus' is always last
  const orderedColumns = [...columnKeys.filter((key) => key !== "leadStatus"), "leadStatus"];

  // Function to navigate back to the CRMTemplate page
  const handleBackButtonClick = () => {
    navigate("/crm-template"); // Navigate to the CRMTemplate page
  };

  return (
    <div className="dashboard">
      {/* Back Button */}
      <button className="back-button" onClick={handleBackButtonClick}>
        <FaArrowLeft />
      </button>

      {/* Summary Cards */}
      <div className="summary">
        <SummaryCard icon={<FaBoxOpen />} label="Interested" count={leadsData.interested} />
        <SummaryCard icon={<FaTruck />} label="On Hold" count={leadsData.onHold} />
        <SummaryCard icon={<FaCheckCircle />} label="New Lead" count={leadsData.newLead} />
        <SummaryCard icon={<FaDollarSign />} label="Total Leads" count={leadsData.totalLeads} />
      </div>

      {/* Leads Table */}
      <div className="table-container1">
        <table className="leads-table">
          <thead>
            <tr>
              <th>SR.No</th>
              {orderedColumns.map((column) => (
                <th key={column}>{column.replace(/([A-Z])/g, " $1").trim()}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {leads.map((lead, index) => (
              <tr key={lead.id}>
                <td>{index + 1}</td>
                {orderedColumns.map((column) => {
                  if (column === "leadStatus") {
                    return (
                      <td key={column}>
                        <select
                          value={lead.leadStatus}
                          onChange={(e) => handleLeadStatusChange(lead.id, e.target.value)}
                        >
                          <option value="Interested">Interested</option>
                          <option value="On Hold">On Hold</option>
                          <option value="New Lead">New Lead</option>
                        </select>
                      </td>
                    );
                  }
                  return <td key={column}>{lead[column]}</td>;
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// SummaryCard Component
const SummaryCard = ({ icon, label, count }) => (
  <div className="summary-card">
    {icon}
    <p>{label}</p>
    <h4>{count}</h4>
  </div>
);

export default Dashboard;
