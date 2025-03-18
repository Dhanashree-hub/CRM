import { useState, useEffect } from "react";
import * as XLSX from "xlsx"; // Import XLSX for Excel handling
import { useNavigate } from "react-router-dom";
import "../components/styles.css";

const sections = {
  Company: ["Company Name", "Registration Number"],
  Banking: ["Account Number", "IFSC Code"],
  PersonalDetails: ["First Name", "Last Name", "Phone", "Address"]
};

export default function CRMForm() {
  const navigate = useNavigate();
  const [activeSubsections, setActiveSubsections] = useState({});
  const [activeFields, setActiveFields] = useState({});
  const [formData, setFormData] = useState({});
  const [showPopup, setShowPopup] = useState(false);
  const [excelData, setExcelData] = useState([]);

  useEffect(() => {
    setActiveFields({});
    setActiveSubsections({});
  }, []);

  const toggleSubsection = (section) => {
    setActiveSubsections((prev) => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const toggleField = (section, field) => {
    setActiveFields((prev) => {
      const updatedSection = { ...prev[section], [field]: !prev[section]?.[field] };
      return { ...prev, [section]: updatedSection };
    });
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleCreateForm = () => {
    const hasSelectedFields = Object.values(activeFields).some((section) =>
      Object.values(section).some((isChecked) => isChecked)
    );

    if (!hasSelectedFields) {
      alert("Please select at least one field before creating the form.");
      return;
    }

    localStorage.setItem("generatedFormFields", JSON.stringify(activeFields));
    localStorage.setItem("formData", JSON.stringify(formData));

    setActiveFields({});
    setActiveSubsections({});

    alert("Form saved successfully!");
  };

  // Open and Close Popup Functions
  const openPopup = () => setShowPopup(true);
  const closePopup = () => {
    setShowPopup(false);
    setExcelData([]);
  };

  // Handle Excel File Upload
  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: "array" });
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];
        const parsedData = XLSX.utils.sheet_to_json(sheet, { header: 1 });

        setExcelData(parsedData);
      };
      reader.readAsArrayBuffer(file);
    }
  };

  return (
    <div className="container1">
      <div className="top-right-button">
        <button className="open-popup-button" onClick={openPopup}>📂 Import Excel</button>
      </div>

      <div className="createsidebar">
        <button className="back-button" onClick={() => navigate("/Home")}>⬅</button>
        <h2>Mandatory</h2>
        <ul>
          {Object.keys(sections).map((section) => (
            <li key={section} className="sidebar-item">
              <input
                type="checkbox"
                id={section}
                checked={!!activeSubsections[section]}
                onChange={() => toggleSubsection(section)}
              />
              <label htmlFor={section}>{section}</label>
              {activeSubsections[section] && (
                <ul className="subsection">
                  {sections[section].map((field) => (
                    <li key={field}>
                      <input
                        type="checkbox"
                        id={field}
                        checked={!!activeFields[section]?.[field]}
                        onChange={() => toggleField(section, field)}
                      />
                      <label htmlFor={field}>{field}</label>
                    </li>
                  ))}
                </ul>
              )}
            </li>
          ))}
        </ul>
      </div>

      <div className="form-section">
        <div className="form-header">
          <button className="create-form-button" onClick={handleCreateForm}>Create Form</button>
        </div>

        <div className="form-container1">
          {Object.keys(sections).map((section) => (
            activeFields[section] &&
            Object.values(activeFields[section]).some((val) => val) && (
              <div key={section} className="form-subsection">
                <h3>{section}</h3>
                {sections[section].map(
                  (field) =>
                    activeFields[section]?.[field] && (
                      <div key={field} className="input-field-container1">
                        <h4>{field}</h4>
                        <input
                          type="text"
                          name={field.toLowerCase().replace(/\s/g, "")}
                          value={formData[field.toLowerCase().replace(/\s/g, "")] || ""}
                          onChange={handleChange}
                          className="input-field"
                          placeholder={`Enter ${field}`}
                        />
                      </div>
                    )
                )}
              </div>
            )
          ))}
          <button className="submit-button">Submit</button>
        </div>
      </div>

      {showPopup && (
        <div className="popup-overlay">
          <div className="popup-box">
            {/* <span className="close-popup" onClick={closePopup}>✖</span> */}
            <h3>Upload Excel</h3>
            <input type="file" accept=".xlsx, .xls" onChange={handleFileUpload} className="file-input" />
            {excelData.length > 0 && (
              <div className="popup-content">
                <table className="popup-table">
                  <tbody>
                    {excelData.map((row, index) => (
                      <tr key={index}>
                        {row.map((cell, cellIndex) => (
                          <td key={cellIndex}>{cell}</td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
            <div className="popup-buttons">
              <button className="submit-btn1">Submit</button>
              <button className="cancel-btn" onClick={closePopup}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
