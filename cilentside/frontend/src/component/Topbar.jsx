import { useNavigate } from "react-router-dom";

export default function Topbar() {

  const navigate = useNavigate();

  // REAL USER DATA
  const userName = localStorage.getItem("name") || "Guest";

  const userRole =
    localStorage.getItem("role") || "User";

  // initials
  const initials = userName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .substring(0, 2);

  return (

    <header className="fixed top-0 left-0 w-full z-50 bg-white border-b shadow-sm">

      <div className="max-w-[1600px] mx-auto flex justify-between items-center px-6 py-3">

        {/* SEARCH */}
        <input
          type="text"
          placeholder="Search complaints..."
          className="
          w-1/3
          px-4 py-2
          border border-gray-200
          rounded-xl
          bg-gray-50
          focus:ring-2 focus:ring-blue-200
          outline-none
          transition-all
        "
        />

        {/* RIGHT */}
        <div className="flex items-center gap-6">

          {/* BUTTON */}
          <button
            onClick={() => navigate("/submit")}
            className="
            bg-blue-600
            hover:bg-blue-700
            text-white
            px-5 py-2
            rounded-lg
            font-medium
            transition-colors
          "
          >
            + Submit Complaint
          </button>

          {/* USER */}
          <div className="flex items-center gap-3">

            <div className="text-right hidden sm:block">

              <p className="text-sm font-semibold text-gray-800">
                {userName}
              </p>

              <p className="text-xs text-gray-500 uppercase tracking-wide">
                {userRole}
              </p>

            </div>

            {/* AVATAR */}
            <div
              className="
              w-10 h-10
              bg-blue-100
              text-blue-700
              border border-blue-200
              flex items-center justify-center
              rounded-full
              font-bold
            "
            >
              {initials}
            </div>

          </div>

        </div>

      </div>

    </header>
  );
}