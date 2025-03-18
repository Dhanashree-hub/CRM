import React from "react";
import "../components/Welcome.css";

const Dashboard = () => {
  return (
    <div className="dashboard1">
      {/* Header Section */}
      <div className="header">
        <div className="profile">
          <div className="icon1">🏢</div>
          <h2>Welcome</h2>
        </div>
        <div className="dropdown">
          <select>
            <option>Home</option>
          </select>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="stats-grid">
        <div className="card">
          <h3>My Open Deals</h3>
          <p>0</p>
        </div>
        <div className="card">
          <h3>My Untouched Deals</h3>
          <p>0</p>
        </div>
        <div className="card">
          <h3>My Calls Today</h3>
          <p>0</p>
        </div>
        <div className="card">
          <h3>My Leads</h3>
          <p>0</p>
        </div>
      </div>

      {/* Tasks, Meetings & Additional Sections */}
      <div className="task-meeting">
        <div className="task-card">
          <h3>My Open Tasks</h3>
          <div className="empty">
            <img src="task-icon.png" alt="No Tasks" />
            <p>No Tasks found.</p>
          </div>
        </div>
        <div className="meeting-card">
          <h3>My Meetings</h3>
          <div className="empty">
            <img src="meeting-icon.png" alt="No Meetings" />
            <p>No Meetings found.</p>
          </div>

          {/* Added New Sections Below My Meetings */}
          <div className="additional-section">
            <div className="leads-card">
              <h3>Today's Leads</h3>
              <p>0</p>
            </div>
            <div className="deals-card">
              <h3>My Deals Closing This Month</h3>
              <p>0</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
