import { useState } from 'react'
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import CRMForm from './components/CRMForm'
import CRMTemplate from './components/CRMTemplate'
import Login from './components/Login';
import Dashboard from './components/Dashboard'
import AgentLeadForm from './components/AgentLeadForm ';
import AgentLeadsList from './components/AgentLeadsList';
import Signup from './components/SignUp';
import FormSelector from './components/FormSelector';
import FormBuilder from './components/FormBuilder';

function App() {
  const [count, setCount] = useState(0)
  

  return (
    <Router>
      <Routes>
      <Route path="/" element={<Login />} />
      <Route path='/signup' element={<Signup />} />
      <Route path="/crm-template" element={<CRMTemplate />} />
      <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/Home" element={<CRMTemplate />} />
        <Route path="/create-form" element={<CRMForm />} />
        <Route path='/create-agent' element={<AgentLeadForm />} />
        <Route path='/agent-list' element={<AgentLeadsList />} />
        <Route path='/FormSelector' element={<FormSelector />} />
        <Route path='/FormBuilder' element={<FormBuilder />} />
      </Routes>
    </Router>
  )
}

export default App
