import React, { useEffect, useState } from "react";
import axios from "axios";
import "./AgentLeadsList.css"; // Make sure to import the CSS

const AgentLeadsList = () => {
  const [agentLeads, setAgentLeads] = useState([]);

  const handleBack = () => {
    window.history.back();
  };

  useEffect(() => {
    const fetchAgentLeads = async () => {
      const email = localStorage.getItem("userEmail"); // Get user email from local storage
      try {
        const response = await axios.get(`http://localhost:5000/api/getAgentLeads?email=${email}`);
        setAgentLeads(response.data);
      } catch (error) {
        console.error("Error fetching agent leads:", error);
      }
    };

    fetchAgentLeads();
  }, []);

  return (
    <div className="agent-leads-list">
      {/* Back Button */}
      <button className="back-btn1" onClick={handleBack}>
        ← 
      </button>

      <h2>Agent Leads List</h2>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Email</th>
            <th>Password</th>
            <th>Lead Status</th>
            <th>Assigned Leads</th>
          </tr>
        </thead>
        <tbody>
          {agentLeads.map((lead, index) => (
            <tr key={index}>
              <td>{lead.id}</td>
              <td>{lead.name}</td>
              <td>{lead.email}</td>
              <td>*****</td> {/* Masked password */}
              <td>{lead.leadStatus}</td>
              <td>{lead.assignedLeads}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AgentLeadsList;
