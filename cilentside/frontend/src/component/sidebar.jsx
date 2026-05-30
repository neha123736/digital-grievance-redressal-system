import { Link, useLocation } from "react-router-dom";

export default function Sidebar() {
  const location = useLocation();

  const menu = [
    { name: "Dashboard", path: "/dashboard" },
    { name: "Submit Complaint", path: "/submit" },
    { name: "My Complaints", path: "/my-complaints" },
    { name: "Track", path: "/track" },
  ];

  return (
    <div className="w-64 bg-white shadow-lg p-5 h-screen sticky top-0">

      <h2 className="text-xl font-bold mb-6 text-blue-600">
        Digital Grievance
      </h2>

      <ul className="space-y-3">

        {menu.map((item, i) => (
          <Link key={i} to={item.path}>
            <li
              className={`p-3 rounded-lg cursor-pointer transition
              ${
                location.pathname === item.path
                  ? "bg-blue-100 text-blue-600 font-medium"
                  : "hover:bg-gray-100"
              }`}
            >
              {item.name}
            </li>
          </Link>
        ))}

      </ul>
    </div>
  );
}