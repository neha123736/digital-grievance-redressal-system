import { useState } from 'react'
import Register from "./pages/Register";
import Login from"./pages/Login";
import Dashboard from "./pages/Dashboard";
import SubmitComplaint from "./pages/Submitcomplaint";
import MyComplaints from "./pages/Mycomplaint";
import Track from "./pages/Track";
import AdminDashboard from "./pages/AdminDashboard";
import './App.css'
import { Routes, Route } from "react-router-dom";
function App() {
  const [count, setCount] = useState(0)

  return (
    <>
    <div>
      <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/register" element={<Register />} />
            <Route path="/dashboard" element={<Dashboard />} />
                 <Route path="/submit" element={<SubmitComplaint />} />
        <Route path="/my-complaints" element={<MyComplaints />} />
        <Route path="/track" element={<Track />} />
         
   {/* ADMIN */}
          <Route
            path="/admin/dashboard"
            element={<AdminDashboard />}
          />

    </Routes>
    
    </div>
     </>
  )
}

export default App
