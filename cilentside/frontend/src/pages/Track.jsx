import React, { useState } from "react";
import { Search, CheckCircle, Clock, AlertTriangle } from "lucide-react";

export default function TrackComplaint() {

  const [ticketID, setTicketID] = useState("");
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState(null);

  const handleTrack = async () => {

    if (!ticketID) {
      alert("Enter Ticket ID");
      return;
    }

    try {

      setLoading(true);

      const res = await fetch(
        `http://127.0.0.1:8000/track-complaint/${ticketID}`
      );

      const result = await res.json();

      if (!res.ok) {
        alert(result.detail);
        return;
      }

      setData(result);

    } catch (err) {
      console.log(err);
      alert("Server error");

    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-blue-50 to-slate-200 p-6">

      {/* PAGE HEADER */}
      <div className="max-w-5xl mx-auto">

        <h1 className="text-4xl font-bold text-gray-800">
          Track Complaint
        </h1>

        <p className="text-gray-500 mt-2">
          Enter your ticket ID to track complaint status
        </p>

        {/* CARD */}
        <div className="bg-white rounded-3xl shadow-xl mt-8 p-10">

          <div className="flex flex-col items-center">

            {/* ICON */}
            <div className="w-24 h-24 rounded-full bg-blue-100 flex items-center justify-center mb-6">

              <Search
                size={45}
                className="text-blue-600"
              />

            </div>

            <h2 className="text-3xl font-bold text-gray-800">
              Find Your Complaint
            </h2>

            <p className="text-gray-500 mt-2 mb-8 text-center">
              Enter the ticket ID from your email confirmation
            </p>

            {/* INPUT */}
            <div className="w-full max-w-md">

              <label className="text-sm font-semibold text-gray-700">
                Ticket ID
              </label>

              <input
                type="text"
                placeholder="e.g. D7DCE4A1"
                value={ticketID}
                onChange={(e) => setTicketID(e.target.value)}
                className="w-full mt-2 px-5 py-4 border border-gray-300 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500"
              />

              {/* BUTTON */}
              <button
                onClick={handleTrack}
                disabled={loading}
                className={`w-full mt-6 py-4 rounded-2xl text-white font-semibold transition-all duration-300
                ${
                  loading
                    ? "bg-gray-400"
                    : "bg-gradient-to-r from-blue-500 to-blue-700 hover:scale-[1.02]"
                }`}
              >

                {loading
                  ? "Tracking..."
                  : "Track Complaint"}

              </button>

            </div>

          </div>

          {/* RESULT */}
          {data && (

            <div className="mt-12 border-t pt-8">

              <div className="grid md:grid-cols-2 gap-6">

                {/* LEFT */}
                <div className="space-y-5">

                  <div>
                    <p className="text-gray-500 text-sm">
                      Complaint Title
                    </p>

                    <h3 className="font-bold text-xl">
                      {data.title}
                    </h3>
                  </div>

                  <div>
                    <p className="text-gray-500 text-sm">
                      Category
                    </p>

                    <h3 className="font-semibold">
                      {data.category}
                    </h3>
                  </div>

                  <div>
                    <p className="text-gray-500 text-sm">
                      Department
                    </p>

                    <h3 className="font-semibold">
                      {data.department}
                    </h3>
                  </div>

                </div>

                {/* RIGHT */}
                <div className="space-y-5">

                  <div>
                    <p className="text-gray-500 text-sm">
                      Status
                    </p>

                    <div className="mt-2">

                      {data.status === "Resolved" ? (

                        <span className="flex items-center gap-2 text-green-600 font-semibold">

                          <CheckCircle size={20} />

                          Resolved

                        </span>

                      ) : data.status === "In Progress" ? (

                        <span className="flex items-center gap-2 text-blue-600 font-semibold">

                          <Clock size={20} />

                          In Progress

                        </span>

                      ) : (

                        <span className="flex items-center gap-2 text-yellow-600 font-semibold">

                          <AlertTriangle size={20} />

                          Pending

                        </span>

                      )}

                    </div>
                  </div>

                  <div>
                    <p className="text-gray-500 text-sm">
                      Priority
                    </p>

                    <h3
                      className={`font-bold text-lg
                      ${
                        data.priority === "High"
                          ? "text-red-600"
                          : data.priority === "Medium"
                          ? "text-yellow-600"
                          : "text-green-600"
                      }`}
                    >
                      {data.priority}
                    </h3>
                  </div>

                  <div>
                    <p className="text-gray-500 text-sm">
                      Address
                    </p>

                    <h3 className="font-semibold">
                      {data.address}
                    </h3>
                  </div>

                </div>

              </div>

            </div>

          )}

        </div>

      </div>

    </div>
  );
}