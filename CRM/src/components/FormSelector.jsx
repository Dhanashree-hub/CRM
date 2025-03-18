import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./FormSelector.css";

export default function FormSelector() {
  const [formTitle, setFormTitle] = useState("");
  const navigate = useNavigate();

  const handleCreate = () => {
    if (formTitle.trim()) {
      navigate("/FormBuilder", { state: { formTitle } });
    }
  };

  return (
    <div className="container2">
      <div className="form-box1">
        <label className="form-title-label">Form Title</label>
        <input
          type="text"
          value={formTitle}
          onChange={(e) => setFormTitle(e.target.value)}
          placeholder="Enter form title"
        />
        <div className="buttons">
          <button className="cancel" onClick={() => navigate("/crm-template")}>Cancel</button>
          <button className="create" onClick={handleCreate}>Create</button>
        </div>
      </div>
    </div>
  );
}