import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FileText,
  Clock,
  CheckCircle,
  AlertCircle
} from "lucide-react";

import Card from "../component/Card";
import Topbar from "../component/Topbar";
import Sidebar from "../component/Sidebar";

export default function Dashboard() {

  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    resolved: 0,
    high: 0
  });

  const [recent, setRecent] = useState([]);

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {

    try {

      const token = localStorage.getItem("token");

      const res = await fetch(
        "http://127.0.0.1:8000/my-complaints",
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      const data = await res.json();

      const complaints = data.data || [];

      // stats
      const total = complaints.length;

      const pending = complaints.filter(
        (x) => x.status === "Pending"
      ).length;

      const resolved = complaints.filter(
        (x) => x.status === "Resolved"
      ).length;

      const high = complaints.filter(
        (x) => x.priority === "High"
      ).length;

      setStats({
        total,
        pending,
        resolved,
        high
      });

      // recent activity
      setRecent(complaints.slice(0, 3));

    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-100">

      {/* SIDEBAR */}
      <Sidebar />

      {/* RIGHT */}
      <div className="flex-1 flex flex-col">

        {/* TOPBAR */}
        <Topbar />

        {/* CONTENT */}
        <div className="p-8">

          <h1 className="text-2xl font-bold mb-6">
            Dashboard
          </h1>

          {/* CARDS */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">

            <Card
              title="Total"
              value={stats.total}
              icon={<FileText />}
              color="bg-blue-100 text-blue-600"
            />

            <Card
              title="Pending"
              value={stats.pending}
              icon={<Clock />}
              color="bg-yellow-100 text-yellow-600"
            />

            <Card
              title="Resolved"
              value={stats.resolved}
              icon={<CheckCircle />}
              color="bg-green-100 text-green-600"
            />

            <Card
              title="High Priority"
              value={stats.high}
              icon={<AlertCircle />}
              color="bg-red-100 text-red-600"
            />

          </div>

          {/* GRID */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

            {/* LEFT */}
            <div className="lg:col-span-2">

              <div className="bg-white p-6 rounded-2xl shadow">

                <h2 className="font-semibold mb-4">
                  Recent Activity
                </h2>

                {recent.length === 0 ? (
                  <p className="text-gray-500">
                    No complaints found
                  </p>
                ) : (

                  recent.map((item, index) => (

                    <div
                      key={index}
                      className="mb-5 border-b pb-4"
                    >

                      <div className="flex justify-between">

                        <div>
                          <p className="font-medium">
                            {item.title}
                          </p>

                          <p className="text-sm text-gray-500">
                            {item.category}
                          </p>
                        </div>

                        <span
                          className={`text-sm px-3 py-1 rounded-full
                          ${
                            item.status === "Resolved"
                              ? "bg-green-100 text-green-700"
                              : item.status === "Pending"
                              ? "bg-yellow-100 text-yellow-700"
                              : "bg-blue-100 text-blue-700"
                          }`}
                        >
                          {item.status}
                        </span>

                      </div>

                      {/* progress */}
                      <div className="w-full bg-gray-200 h-2 rounded mt-3">

                        <div
                          className={`h-2 rounded
                          ${
                            item.status === "Resolved"
                              ? "bg-green-500 w-full"
                              : item.status === "In Progress"
                              ? "bg-blue-500 w-2/3"
                              : "bg-yellow-500 w-1/3"
                          }`}
                        ></div>

                      </div>

                    </div>

                  ))
                )}

              </div>

            </div>

            {/* RIGHT */}
            <div className="space-y-6">

              {/* QUICK ACTIONS */}
              <div className="bg-white p-5 rounded-2xl shadow">

                <h3 className="font-semibold mb-3">
                  Quick Actions
                </h3>

                <ul className="space-y-2 text-sm">

                  <li
                    onClick={() => window.location.href="/submit"}
                    className="hover:text-blue-600 cursor-pointer"
                  >
                    Submit Complaint
                  </li>

                  <li
                    onClick={() => window.location.href="/track"}
                    className="hover:text-blue-600 cursor-pointer"
                  >
                    Track Complaint
                  </li>

                </ul>

              </div>

              {/* IMPACT */}
              <div className="bg-gradient-to-br from-blue-500 to-blue-700 text-white p-5 rounded-2xl shadow">

                <h3 className="font-semibold mb-2">
                  Your Impact
                </h3>

                <p className="text-sm">
                  You've solved {stats.resolved} civic issues 🎉
                </p>

              </div>

            </div>

          </div>

        </div>

      </div>

    </div>
  );
}