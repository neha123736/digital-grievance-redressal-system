import { Outlet } from "react-router-dom";
import Topbar from "./components/Topbar";
import Sidebar from "./components/Sidebar";

export default function Layout() {

  return (

    <div className="min-h-screen bg-gray-100">

      {/* TOPBAR */}
      <Topbar
        userName="Neha Rathod"
        userRole="Citizen"
      />

      <div className="flex">

        {/* SIDEBAR */}
        <Sidebar />

        {/* PAGE CONTENT */}
        <main className="flex-1 pt-20 ml-64 p-6">

          <Outlet />

        </main>

      </div>

    </div>
  );
}