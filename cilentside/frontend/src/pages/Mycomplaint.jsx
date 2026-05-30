import React, { useEffect, useState } from "react";

export default function MyComplaintsDashboard() {
  const [complaints, setComplaints] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  // UI states
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");
  const [sort, setSort] = useState("newest");
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState(null);

  const itemsPerPage = 5;

  useEffect(() => {
    fetchData();
  }, []);

 const fetchData = async () => {
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

    console.log("API DATA:", data);

    setComplaints(data.data || []);
    setStats(data.stats || {});

  } catch (err) {
    console.log(err);
  } finally {
    setLoading(false);
  }
};

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-pulse text-lg text-gray-600">
          Loading Dashboard...
        </div>
      </div>
    );
  }

  // 🔍 SEARCH + FILTER
  const filteredComplaints = complaints.filter((item) => {
    const matchSearch =
      item.title.toLowerCase().includes(search.toLowerCase());

    const matchFilter =
      filter === "All" || item.status === filter;

    return matchSearch && matchFilter;
  });

  // 🔃 SORT
  const sortedComplaints = [...filteredComplaints].sort((a, b) => {

  const dateA = new Date(a.date);
  const dateB = new Date(b.date);

  if (sort === "newest") {
    return dateB - dateA;
  }

  return dateA - dateB;
});

  // 📄 PAGINATION
  const startIndex = (page - 1) * itemsPerPage;

  const finalData = sortedComplaints.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 p-6 space-y-6">

      {/* HEADER */}
      <div className="bg-gradient-to-r from-indigo-600 via-blue-600 to-purple-600 text-white p-6 rounded-2xl shadow-lg flex justify-between items-center">

        <div>
          <h2 className="text-3xl font-bold">My Complaints</h2>
          <p className="text-sm opacity-90 mt-1">
            Track civic issues in real time
          </p>
        </div>

        <button
          onClick={() => window.location.href = "/submit"}
          className="bg-white text-indigo-700 px-5 py-2 rounded-xl font-semibold hover:scale-105 transition"
        >
          + Submit Complaint
        </button>

      </div>

      {/* STATS */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-5">

        <div className="bg-white p-5 rounded-2xl shadow hover:-translate-y-1 transition border-l-4 border-gray-500">
          <p className="text-gray-500 text-sm">Total</p>
          <h3 className="text-3xl font-bold">{stats?.total || 0}</h3>
        </div>

        <div className="bg-white p-5 rounded-2xl shadow hover:-translate-y-1 transition border-l-4 border-yellow-500">
          <p className="text-gray-500 text-sm">Pending</p>
          <h3 className="text-3xl font-bold text-yellow-600">
            {stats?.pending || 0}
          </h3>
        </div>

        <div className="bg-white p-5 rounded-2xl shadow hover:-translate-y-1 transition border-l-4 border-blue-500">
          <p className="text-gray-500 text-sm">In Progress</p>
          <h3 className="text-3xl font-bold text-blue-600">
            {stats?.in_progress || 0}
          </h3>
        </div>

        <div className="bg-white p-5 rounded-2xl shadow hover:-translate-y-1 transition border-l-4 border-green-500">
          <p className="text-gray-500 text-sm">Resolved</p>
          <h3 className="text-3xl font-bold text-green-600">
            {stats?.resolved || 0}
          </h3>
        </div>

      </div>

      {/* SEARCH + FILTER + SORT */}
      {/* SEARCH + FILTER + SORT */}
<div className="bg-white p-5 rounded-2xl shadow flex flex-col lg:flex-row gap-4 lg:items-center lg:justify-between">

  <div className="w-full lg:w-[60%]">
    <input
      value={search}
      onChange={(e) => {
        setSearch(e.target.value);
        setPage(1);
      }}
      placeholder="Search complaints..."
      className="w-full px-5 py-3 border border-gray-300 rounded-xl outline-none focus:ring-2 focus:ring-blue-500"
    />
  </div>

  <div className="flex gap-3 justify-end">

    <select
      value={filter}
      onChange={(e) => {
        setFilter(e.target.value);
        setPage(1);
      }}
      className="px-4 py-3 border border-gray-300 rounded-xl bg-white"
    >
      <option>All</option>
      <option>Pending</option>
      <option>In Progress</option>
      <option>Resolved</option>
    </select>

    <select
      value={sort}
      onChange={(e) => setSort(e.target.value)}
      className="px-4 py-3 border border-gray-300 rounded-xl bg-white"
    >
      <option value="newest">Newest</option>
      <option value="oldest">Oldest</option>
    </select>

  </div>
</div>

      {/* TABLE */}
     {/* TABLE */}
<div className="bg-white rounded-2xl shadow overflow-hidden">

  <table className="w-full border-collapse">

    <thead className="bg-gray-100 text-gray-700">
      <tr>

        <th className="p-5 text-left font-semibold">
          Key ID
        </th>

        <th className="p-5 text-left font-semibold">
          Title
        </th>

        <th className="p-5 text-left font-semibold">
          Category
        </th>

        <th className="p-5 text-left font-semibold">
          Department
        </th>

        <th className="p-5 text-left font-semibold">
          Status
        </th>

        <th className="p-5 text-left font-semibold">
          Priority
        </th>

        <th className="p-5 text-left font-semibold">
          Date
        </th>

      </tr>
    </thead>

    <tbody>

      {finalData.map((item, i) => (
        <tr
          key={i}
          onClick={() => setSelected(item)}
          className="border-t hover:bg-indigo-50 transition cursor-pointer"
        >

          <td className="p-5 font-semibold text-gray-800">
            {item.keyID}
          </td>

          <td className="p-5">
            {item.title}
          </td>

          <td className="p-5 text-gray-600">
            {item.category}
          </td>

          <td className="p-5 text-gray-600">
            {item.department}
          </td>

          <td className="p-5">
            <span
              className={`px-3 py-1 rounded-full text-xs font-semibold
              ${
                item.status === "Resolved"
                  ? "bg-green-100 text-green-700"
                  : item.status === "In Progress"
                  ? "bg-blue-100 text-blue-700"
                  : "bg-yellow-100 text-yellow-700"
              }`}
            >
              {item.status}
            </span>
          </td>

          <td className="p-5 font-bold">
            <span
              className={
                item.priority === "High"
                  ? "text-red-600"
                  : item.priority === "Medium"
                  ? "text-yellow-600"
                  : "text-green-600"
              }
            >
              {item.priority}
            </span>
          </td>

          <td className="p-5 text-gray-500 whitespace-nowrap">
            {item.date
              ? new Date(item.date).toLocaleString()
              : "N/A"}
          </td>

        </tr>
      ))}

    </tbody>

  </table>
</div>

      {/* PAGINATION */}
     {/* PAGINATION */}
<div className="flex justify-center items-center gap-4 pt-2">

  <button
    disabled={page === 1}
    onClick={() => setPage(page - 1)}
    className="px-4 py-2 bg-white shadow rounded-lg disabled:opacity-40 hover:bg-gray-100"
  >
    Prev
  </button>

  <span className="font-semibold text-gray-700">
    Page {page}
  </span>

  <button
    disabled={startIndex + itemsPerPage >= sortedComplaints.length}
    onClick={() => setPage(page + 1)}
    className="px-4 py-2 bg-white shadow rounded-lg disabled:opacity-40 hover:bg-gray-100"
  >
    Next
  </button>

</div>

      {/* MODAL */}
      {selected && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center">

          <div className="bg-white p-6 rounded-2xl w-96 shadow-xl">

            <h2 className="text-xl font-bold mb-2">{selected.title}</h2>

            <p className="text-gray-600 mb-2">{selected.category}</p>
            <p className="text-gray-500 mb-4">{selected.address}</p>

            <span className="px-3 py-1 bg-blue-100 text-blue-600 rounded-full text-sm">
              {selected.status}
            </span>

            <button
              onClick={() => setSelected(null)}
              className="mt-4 w-full bg-red-500 text-white py-2 rounded-lg"
            >
              Close
            </button>

          </div>

        </div>
      )}

    </div>
  );
}