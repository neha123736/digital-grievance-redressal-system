import { useEffect, useState } from "react";
import {
  LayoutDashboard,
  AlertTriangle,
  CheckCircle,
  Clock,
  Search
} from "lucide-react";

export default function AdminDashboard() {

  const [complaints, setComplaints] = useState([]);
  const [selected, setSelected] = useState(null);

  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchComplaints();
  }, []);

  const fetchComplaints = async () => {

    const token = localStorage.getItem("token");

    const res = await fetch(
      "http://127.0.0.1:8000/admin/all-complaints",
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );

    const data = await res.json();

    setComplaints(data);
  };

  // UPDATE STATUS
  const updateStatus = async (id, status) => {

    const token = localStorage.getItem("token");

    await fetch(
      `http://127.0.0.1:8000/admin/update-status/${id}`,
      {
        method: "PUT",

        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },

        body: JSON.stringify({
          status
        })
      }
    );

    fetchComplaints();
  };

  // FILTER
  const filtered = complaints.filter((item) =>
    item.title.toLowerCase().includes(search.toLowerCase())
  );

  // STATS
  const total = complaints.length;

  const pending = complaints.filter(
    (x) => x.status === "Pending"
  ).length;

  const progress = complaints.filter(
    (x) => x.status === "In Progress"
  ).length;

  const resolved = complaints.filter(
    (x) => x.status === "Resolved"
  ).length;

  return (

    <div className="min-h-screen bg-gray-100 flex">

      {/* SIDEBAR */}
      <div className="w-64 bg-gradient-to-b from-blue-900 to-blue-700 text-white p-6">

        <h1 className="text-2xl font-bold mb-10">
          Admin Panel
        </h1>

        <div className="space-y-4">

          <div className="flex items-center gap-3 bg-white/20 p-3 rounded-xl">
            <LayoutDashboard />
            Dashboard
          </div>

          <div className="flex items-center gap-3 p-3 rounded-xl hover:bg-white/10 cursor-pointer">
            <AlertTriangle />
            Complaints
          </div>

        </div>

      </div>

      {/* MAIN */}
      <div className="flex-1 p-8">

        {/* TOP */}
        <div className="flex justify-between items-center mb-8">

          <div>
            <h1 className="text-3xl font-bold">
              Complaint Management
            </h1>

            <p className="text-gray-500 mt-1">
              Manage all civic complaints
            </p>
          </div>

          {/* SEARCH */}
          <div className="relative">

            <Search
              className="absolute left-3 top-3 text-gray-400"
              size={18}
            />

            <input
              type="text"
              placeholder="Search..."
              value={search}
              onChange={(e) =>
                setSearch(e.target.value)
              }
              className="pl-10 pr-4 py-3 border rounded-xl bg-white shadow-sm"
            />

          </div>

        </div>

        {/* STATS */}
        <div className="grid grid-cols-4 gap-6 mb-8">

          <div className="bg-white p-6 rounded-2xl shadow">

            <p className="text-gray-500">
              Total
            </p>

            <h1 className="text-4xl font-bold mt-2">
              {total}
            </h1>

          </div>

          <div className="bg-yellow-100 p-6 rounded-2xl shadow">

            <p className="text-yellow-700">
              Pending
            </p>

            <h1 className="text-4xl font-bold mt-2">
              {pending}
            </h1>

          </div>

          <div className="bg-blue-100 p-6 rounded-2xl shadow">

            <p className="text-blue-700">
              In Progress
            </p>

            <h1 className="text-4xl font-bold mt-2">
              {progress}
            </h1>

          </div>

          <div className="bg-green-100 p-6 rounded-2xl shadow">

            <p className="text-green-700">
              Resolved
            </p>

            <h1 className="text-4xl font-bold mt-2">
              {resolved}
            </h1>

          </div>

        </div>

        {/* TABLE */}
        <div className="bg-white rounded-3xl shadow overflow-hidden">

          <table className="w-full">

            <thead className="bg-gray-100">

              <tr>

                <th className="p-5 text-left">
                  Ticket
                </th>

                <th className="text-left">
                  Title
                </th>

                <th>User</th>

                <th>Department</th>

                <th>Priority</th>

                <th>Status</th>

                <th>Action</th>

              </tr>

            </thead>

            <tbody>

              {filtered.map((item) => (

                <tr
                  key={item.id}
                  className="border-t hover:bg-gray-50 transition"
                >

                  <td className="p-5 font-semibold">
                    {item.keyID}
                  </td>

                  <td
                    className="cursor-pointer"
                    onClick={() => setSelected(item)}
                  >
                    {item.title}
                  </td>

                  <td>{item.user_email}</td>

                  <td>{item.department}</td>

                  {/* PRIORITY */}
                  <td>

                    <span className={`px-3 py-1 rounded-full text-sm font-semibold
                    ${
                      item.priority === "High"
                      ? "bg-red-100 text-red-700"

                      : item.priority === "Medium"
                      ? "bg-yellow-100 text-yellow-700"

                      : "bg-green-100 text-green-700"
                    }`}>
                      {item.priority}
                    </span>

                  </td>

                  {/* STATUS */}
                  <td>

                    <span className={`px-3 py-1 rounded-full text-sm font-semibold
                    ${
                      item.status === "Resolved"
                      ? "bg-green-100 text-green-700"

                      : item.status === "In Progress"
                      ? "bg-blue-100 text-blue-700"

                      : item.status === "Under Review"
                      ? "bg-purple-100 text-purple-700"

                      : "bg-yellow-100 text-yellow-700"
                    }`}>
                      {item.status}
                    </span>

                  </td>

                  {/* ACTION */}
                  <td>

                    <select
                      value={item.status}
                      onChange={(e) =>
                        updateStatus(
                          item.id,
                          e.target.value
                        )
                      }
                      className="border px-3 py-2 rounded-lg"
                    >

                      <option>Pending</option>
                      <option>Under Review</option>
                      <option>In Progress</option>
                      <option>Resolved</option>

                    </select>

                  </td>

                </tr>

              ))}

            </tbody>

          </table>

        </div>

      </div>

      {/* MODAL */}
      {selected && (

        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">

          <div className="bg-white w-[500px] rounded-3xl p-8 shadow-2xl">

            <div className="flex justify-between items-center mb-6">

              <h2 className="text-2xl font-bold">
                Complaint Details
              </h2>

              <button
                onClick={() => setSelected(null)}
                className="text-red-500"
              >
                ✕
              </button>

            </div>

            <div className="space-y-4">

              <div>
                <p className="text-gray-500">
                  Ticket ID
                </p>

                <h3 className="font-bold">
                  {selected.keyID}
                </h3>
              </div>

              <div>
                <p className="text-gray-500">
                  Title
                </p>

                <h3 className="font-bold">
                  {selected.title}
                </h3>
              </div>

              <div>
                <p className="text-gray-500">
                  Department
                </p>

                <h3 className="font-bold">
                  {selected.department}
                </h3>
              </div>

              <div>
                <p className="text-gray-500">
                  User
                </p>

                <h3 className="font-bold">
                  {selected.user_email}
                </h3>
              </div>

              <div>
                <p className="text-gray-500">
                  Status
                </p>

                <h3 className="font-bold">
                  {selected.status}
                </h3>
              </div>

            </div>

          </div>

        </div>

      )}

    </div>
  );
}