import { useState } from "react";
import { User, Mail, Phone, Lock, Eye } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

export default function Register() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    role: "user" // ✅ DEFAULT ROLE
  });

  const [showPass, setShowPass] = useState(false);
  const navigate = useNavigate();

  // ✅ HANDLE INPUT
  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  // ✅ REGISTER API CALL
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch("http://127.0.0.1:8000/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(form)
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.detail);
        return;
      }

      // ✅ AUTO LOGIN AFTER REGISTER
      await handleAutoLogin();

    } catch (err) {
      console.log(err);
      alert("Server error ❌");
    }
  };

  // ✅ AUTO LOGIN FUNCTION
  const handleAutoLogin = async () => {
    const res = await fetch("http://127.0.0.1:8000/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        email: form.email,
        password: form.password
      })
    });

    const data = await res.json();

    if (!res.ok) {
      alert(data.detail);
      return;
    }

    // ✅ SAVE TOKEN + ROLE
    localStorage.setItem("token", data.access_token);
    localStorage.setItem("role", data.role);

    // ✅ ROLE BASE REDIRECT
    if (data.role === "admin") {
      navigate("/admin");
    } else {
      navigate("/dashboard");
    }
  };

  return (
    <div className="min-h-screen flex bg-gradient-to-br from-blue-900 via-blue-700 to-indigo-600">

      {/* LEFT PANEL */}
      <div className="hidden lg:flex w-1/2 flex-col justify-center px-16 text-white relative">

        <h1 className="text-5xl font-extrabold leading-tight mb-6">
          Build Better Cities 🌍
        </h1>

        <p className="text-lg text-blue-100 mb-10">
          Join thousands of users solving real-world civic issues faster and smarter.
        </p>

        <div className="flex gap-6">
          {["25K+ Users", "95% Success", "48h Response"].map((item, i) => (
            <div key={i} className="bg-white/20 backdrop-blur-xl px-6 py-4 rounded-2xl shadow-lg hover:scale-105 transition">
              <p className="font-bold text-xl">{item.split(" ")[0]}</p>
              <p className="text-sm">{item.split(" ").slice(1).join(" ")}</p>
            </div>
          ))}
        </div>

        <div className="absolute w-80 h-80 bg-blue-400 rounded-full blur-3xl opacity-30 top-20 left-20"></div>
      </div>

      {/* RIGHT PANEL */}
      <div className="w-full lg:w-1/2 flex items-center justify-center px-6 py-10">

        <div className="w-full max-w-md bg-white/80 backdrop-blur-2xl shadow-2xl rounded-3xl p-8 border border-white/30">

          <h2 className="text-3xl font-bold text-gray-800 mb-2">
            Create Account
          </h2>

          <p className="text-gray-500 mb-6">
            Start reporting and tracking civic issues
          </p>

          <form className="space-y-5" onSubmit={handleSubmit}>

            {/* NAME */}
            <div className="relative group">
              <User className="absolute left-3 top-3 text-gray-400" size={18} />
              <input
                type="text"
                name="name"
                onChange={handleChange}
                placeholder="Full Name"
                className="input"
              />
            </div>

            {/* EMAIL */}
            <div className="relative group">
              <Mail className="absolute left-3 top-3 text-gray-400" size={18} />
              <input
                type="email"
                name="email"
                onChange={handleChange}
                placeholder="Email Address"
                className="input"
              />
            </div>

            {/* PHONE */}
            <div className="relative group">
              <Phone className="absolute left-3 top-3 text-gray-400" size={18} />
              <input
                type="text"
                name="phone"
                onChange={handleChange}
                placeholder="Phone Number"
                className="input"
              />
            </div>

            {/* PASSWORD */}
            <div className="relative group">
              <Lock className="absolute left-3 top-3 text-gray-400" size={18} />
              <input
                type={showPass ? "text" : "password"}
                name="password"
                onChange={handleChange}
                placeholder="Create Password"
                className="input"
              />

              <Eye
                size={18}
                className="absolute right-3 top-3 cursor-pointer text-gray-400 hover:text-blue-600"
                onClick={() => setShowPass(!showPass)}
              />
            </div>

            {/* ROLE SELECT (ADMIN/USER) */}
            <select
              name="role"
              onChange={handleChange}
              className="input"
            >
              <option value="user">User</option>
              <option value="admin">Admin</option>
            </select>

            {/* BUTTON */}
            <button
              type="submit"
              className="w-full py-3 bg-gradient-to-r from-blue-600 to-indigo-700 
              text-white rounded-xl font-semibold shadow-lg 
              hover:scale-105 transition"
            >
              Create Account 🚀
            </button>

          </form>

          {/* FOOTER */}
          <p className="text-center text-sm mt-6 text-gray-600">
            Already have an account?{" "}
            <Link to="/" className="text-blue-600 font-semibold hover:underline">
              Sign in
            </Link>
          </p>

        </div>
      </div>

      {/* STYLE */}
      <style>{`
        .input {
          width: 100%;
          padding: 12px;
          border: 1px solid #ccc;
          border-radius: 10px;
          background: rgba(255,255,255,0.7);
          outline: none;
        }
        .input:focus {
          border-color: #2563eb;
          box-shadow: 0 0 0 2px rgba(37,99,235,0.2);
        }
      `}</style>
    </div>
  );
}