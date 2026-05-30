

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function SubmitComplaint() {
  const [step, setStep] = useState(1);
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    category: "",
    description: "",
    address: "",
    landmark: ""
  });

  const steps = ["Details", "Location", "Evidence", "Review"];

  const progress = ((step - 1) / (steps.length - 1)) * 100;

  // ✅ FILE CHANGE
  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    setFiles(selectedFiles);
  };

  // ✅ DRAG DROP
  const handleDrop = (e) => {
    e.preventDefault();

    const droppedFiles = Array.from(e.dataTransfer.files);

    setFiles(droppedFiles);
  };

  // ✅ SUBMIT
  const handleSubmit = async () => {
    try {
      setLoading(true);

      const token = localStorage.getItem("token");

      if (!token) {
        alert("Login required");
        return;
      }

      const form = new FormData();

      form.append("title", formData.title);
      form.append("category", formData.category);
      form.append("description", formData.description);
      form.append("address", formData.address);
      form.append("landmark", formData.landmark);

      files.forEach((file) => {
        form.append("files", file);
      });

      const res = await fetch("http://127.0.0.1:8000/submit-complaint", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`
        },
        body: form
      });

      const data = await res.json();

      console.log(data);

      if (!res.ok) {
        alert(data.detail || "Error");
        return;
      }

      alert("Complaint submitted 🚀");

      // RESET
      setFormData({
        title: "",
        category: "",
        description: "",
        address: "",
        landmark: ""
      });

      setFiles([]);
      setStep(1);

    } catch (err) {
      console.log(err);
      alert("Server error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-100 via-blue-50 to-slate-200 p-6">

      <div className="w-full max-w-3xl bg-white shadow-2xl rounded-3xl p-8">

        <h1 className="text-3xl font-bold mb-8">
          Submit Complaint 🚀
        </h1>

        {/* STEPPER */}
        <div className="relative flex justify-between mb-10">

          <div className="absolute top-4 w-full h-1 bg-gray-200" />

          <motion.div
            className="absolute top-4 h-1 bg-blue-600"
            animate={{ width: `${progress}%` }}
          />

          {steps.map((label, i) => (
            <div key={i} className="z-10 text-center">

              <div
                className={`w-10 h-10 flex items-center justify-center rounded-full ${
                  step >= i + 1
                    ? "bg-blue-600 text-white"
                    : "bg-gray-300"
                }`}
              >
                {step > i + 1 ? "✓" : i + 1}
              </div>

              <span className="text-xs">{label}</span>
            </div>
          ))}
        </div>

        <AnimatePresence mode="wait">

          <motion.div
            key={step}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >

            {/* STEP 1 */}
            {step === 1 && (
              <div className="space-y-4">

                <input
                  className="input"
                  placeholder="Title"
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      title: e.target.value
                    })
                  }
                />

                <select
                  className="input"
                  value={formData.category}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      category: e.target.value
                    })
                  }
                >
                  <option value="">Select Category</option>

                  <option>Water Supply</option>
                  <option>Electricity</option>
                  <option>Gas Leakage</option>
                  <option>Drainage / Sewage</option>

                  <option>Road Damage / Potholes</option>
                  <option>Street Lighting</option>
                  <option>Traffic Signal Issue</option>
                  <option>Public Transport Issue</option>

                  <option>Garbage Collection</option>
                  <option>Public Toilet Issue</option>
                  <option>Sanitation Problem</option>

                  <option>Park Maintenance</option>
                  <option>Encroachment</option>

                  <option>Other</option>
                </select>

                <textarea
                  className="input"
                  placeholder="Description"
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      description: e.target.value
                    })
                  }
                />
              </div>
            )}

            {/* STEP 2 */}
            {step === 2 && (
              <div className="space-y-4">

                <input
                  className="input"
                  placeholder="Address"
                  value={formData.address}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      address: e.target.value
                    })
                  }
                />

                <input
                  className="input"
                  placeholder="Landmark"
                  value={formData.landmark}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      landmark: e.target.value
                    })
                  }
                />
              </div>
            )}

            {/* STEP 3 */}
            {step === 3 && (
              <div
                onDrop={handleDrop}
                onDragOver={(e) => e.preventDefault()}
                className="border-2 border-dashed border-blue-400 rounded-xl p-10 text-center"
              >
                <p className="mb-4 font-medium">
                  Upload Images
                </p>

                <input
                  type="file"
                  multiple
                  className="hidden"
                  id="fileUpload"
                  onChange={handleFileChange}
                />

                <label
                  htmlFor="fileUpload"
                  className="btn inline-block"
                >
                  Browse
                </label>

                <div className="grid grid-cols-3 gap-3 mt-6">
                  {files.map((f, i) => (
                    <img
                      key={i}
                      src={URL.createObjectURL(f)}
                      alt="preview"
                      className="h-24 w-full object-cover rounded-lg"
                    />
                  ))}
                </div>
              </div>
            )}

            {/* STEP 4 */}
            {step === 4 && (
              <div className="space-y-4">

                <div className="p-4 border rounded-xl">

                  <h2 className="font-bold text-lg mb-2">
                    Complaint Review
                  </h2>

                  <p>
                    <b>Title:</b> {formData.title}
                  </p>

                  <p>
                    <b>Category:</b> {formData.category}
                  </p>

                  <p>
                    <b>Description:</b> {formData.description}
                  </p>

                  <p>
                    <b>Address:</b> {formData.address}
                  </p>

                  <p>
                    <b>Landmark:</b> {formData.landmark}
                  </p>

                  <p>
                    <b>Images:</b> {files.length}
                  </p>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  {files.map((f, i) => (
                    <img
                      key={i}
                      src={URL.createObjectURL(f)}
                      alt="preview"
                      className="h-24 w-full object-cover rounded-lg"
                    />
                  ))}
                </div>
              </div>
            )}

          </motion.div>
        </AnimatePresence>

        {/* BUTTONS */}
        <div className="flex justify-between mt-8">

          <button
            onClick={() => setStep((s) => Math.max(s - 1, 1))}
          >
            Back
          </button>

          <button
            disabled={loading}
            onClick={() => {

              // VALIDATION
              if (step === 1) {
                if (!formData.title || !formData.category) {
                  alert("Fill all fields");
                  return;
                }
              }

              if (step === 4) {
                handleSubmit();
              } else {
                setStep((s) => Math.min(s + 1, 4));
              }
            }}
            className={`px-6 py-2 text-white rounded-lg ${
              loading
                ? "bg-gray-400"
                : "bg-blue-600"
            }`}
          >
            {loading
              ? "Submitting..."
              : step === 4
              ? "Submit"
              : "Next"}
          </button>
        </div>
      </div>

      {/* CSS */}
      <style>{`
        .input{
          width:100%;
          padding:12px;
          border:1px solid #ccc;
          border-radius:10px;
        }

        .btn{
          background:#2563eb;
          color:white;
          padding:8px 20px;
          border-radius:8px;
          cursor:pointer;
        }
      `}</style>
    </div>
  );
}




