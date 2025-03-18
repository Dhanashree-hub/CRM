require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 5000;
const MONGO_URI = "mongodb://127.0.0.1:27017/crmDatabase"; // Local MongoDB Compass

app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose
  .connect(MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

// Schema & Model for Admin Users
const adminUserSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});

const AdminUser = mongoose.model("AdminUser", adminUserSchema);

// Schema & Model for Leads (generic)
const leadSchema = new mongoose.Schema({
  adminEmail: { type: String, required: true }, // Reference to the admin user's email
}, { strict: false });

const Lead = mongoose.model("Lead", leadSchema);

// Schemas for specific leads
const companyLeadSchema = new mongoose.Schema({ adminEmail: { type: String, required: true } }, { strict: false });
const CompanyLead = mongoose.model("CompanyLead", companyLeadSchema);

const bankingLeadSchema = new mongoose.Schema({ adminEmail: { type: String, required: true } }, { strict: false });
const BankingLead = mongoose.model("BankingLead", bankingLeadSchema);

const personalDetailsLeadSchema = new mongoose.Schema({ adminEmail: { type: String, required: true } }, { strict: false });
const PersonalDetailsLead = mongoose.model("PersonalDetailsLead", personalDetailsLeadSchema);

// Schema & Model for Agent Leads
const agentLeadSchema = new mongoose.Schema({
  id: String,
  name: String,
  email: String,
  password: String,
  leadStatus: { type: String, enum: ["Active", "Inactive"], default: "Active" },
  assignedLeads: String,
  adminEmail: { type: String, required: true }, // Reference to the admin user's email
});

const AgentLead = mongoose.model("AgentLead", agentLeadSchema);





// API Route for Admin Signup
app.post("/api/adminSignup", async (req, res) => {
  const { email, password } = req.body;

  try {
    const newAdmin = new AdminUser({ email, password });
    await newAdmin.save();
    res.status(201).json({ message: "Admin account created successfully!" });
  } catch (error) {
    res.status(500).json({ message: "Error creating Admin account", error });
  }
});

// API Route for Admin Login
app.post("/api/adminLogin", async (req, res) => {
  const { email, password } = req.body;

  try {
    const admin = await AdminUser.findOne({ email, password });
    if (admin) {
      res.status(200).json({ message: "Admin logged in successfully!", email });
    } else {
      res.status(401).json({ message: "Invalid email or password!" });
    }
  } catch (error) {
    res.status(500).json({ message: "Error logging in", error });
  }
});

// API Routes for Saving Leads
app.post("/api/saveCompanyLead", async (req, res) => {
  const { adminEmail, ...companyLeadData } = req.body;
  try {
    const newCompanyLead = new CompanyLead({ ...companyLeadData, adminEmail });
    await newCompanyLead.save();
    res.status(201).json({ message: "Company lead saved successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error saving company lead", error });
  }
});

app.post("/api/saveBankingLead", async (req, res) => {
  const { adminEmail, ...bankingLeadData } = req.body;
  try {
    const newBankingLead = new BankingLead({ ...bankingLeadData, adminEmail });
    await newBankingLead.save();
    res.status(201).json({ message: "Banking lead saved successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error saving banking lead", error });
  }
});

app.post("/api/savePersonalDetailsLead", async (req, res) => {
  const { adminEmail, ...personalDetailsLeadData } = req.body;
  try {
    const newPersonalDetailsLead = new PersonalDetailsLead({ ...personalDetailsLeadData, adminEmail });
    await newPersonalDetailsLead.save();
    res.status(201).json({ message: "Personal details lead saved successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error saving personal details lead", error });
  }
});

// API Routes for Fetching Leads
app.get("/api/getCompanyLeads", async (req, res) => {
  const { email } = req.query;
  try {
    const companyLeads = await CompanyLead.find({ adminEmail: email }).select("-__v -_id");
    res.status(200).json(companyLeads);
  } catch (error) {
    res.status(500).json({ message: "Error fetching company leads", error });
  }
});

app.get("/api/getBankingLeads", async (req, res) => {
  const { email } = req.query;
  try {
    const bankingLeads = await BankingLead.find({ adminEmail: email }).select("-__v -_id");
    res.status(200).json(bankingLeads);
  } catch (error) {
    res.status(500).json({ message: "Error fetching banking leads", error });
  }
});

app.get("/api/getPersonalDetailsLeads", async (req, res) => {
  const { email } = req.query;
  try {
    const personalDetailsLeads = await PersonalDetailsLead.find({ adminEmail: email }).select("-__v -_id");
    res.status(200).json(personalDetailsLeads);
  } catch (error) {
    res.status(500).json({ message: "Error fetching personal details leads", error });
  }
});

// API Routes for Agent Leads
app.post("/api/saveAgentLead", async (req, res) => {
  const { adminEmail, ...agentLeadData } = req.body; // Extract admin email from request
  try {
    const newAgentLead = new AgentLead({ ...agentLeadData, adminEmail });
    await newAgentLead.save();
    res.status(201).json({ message: "Agent lead saved successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error saving agent lead", error });
  }
});

app.get("/api/getAgentLeads", async (req, res) => {
  const { email } = req.query; // Get email from query parameters
  try {
    const agentLeads = await AgentLead.find({ adminEmail: email }).select("-__v -_id");
    res.status(200).json(agentLeads);
  } catch (error) {
    res.status(500).json({ message: "Error fetching agent leads", error });
  }
});

app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
