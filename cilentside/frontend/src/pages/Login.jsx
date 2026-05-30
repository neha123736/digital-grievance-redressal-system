import { useState } from "react";
import { Mail, Lock, Eye } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

export default function Login() {
  const [showPass, setShowPass] = useState(false);

  const [form, setForm] = useState({
    email: "",
    password: ""
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  // ✅ LOGIN FUNCTION (UPDATED)
  const handleLogin = async (e) => {
  e.preventDefault();

  const res = await fetch("http://127.0.0.1:8000/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(form)
  });

  const data = await res.json();
  console.log("LOGIN RESPONSE:", data);

  if (!res.ok) {
    alert(data.detail);
    return;
  }

  // ✅ SAVE TOKEN
  localStorage.setItem("token", data.token);
  localStorage.setItem("email", data.email);
  localStorage.setItem("role", data.role);

  // redirect
  //navigate("/dashboard");
  if (data.role === "admin") {

  navigate("/admin/dashboard");

} else {

  navigate("/dashboard");

}
};

  return (
    <div className="min-h-screen flex bg-gradient-to-br from-blue-900 via-blue-700 to-blue-500">

      {/* LEFT PANEL SAME */}
      <div className="hidden lg:flex w-1/2 flex-col justify-center px-16 text-white relative">
        <h1 className="text-5xl font-bold leading-tight mb-6">
          Welcome Back 👋
        </h1>
        <p className="text-lg text-blue-100 mb-10">
          Login to continue reporting and tracking civic issues in your community.
        </p>

        <div className="flex gap-6">
          {["25K+ Users", "95% Success", "48h Response"].map((item, i) => (
            <div key={i} className="bg-white/20 backdrop-blur-lg px-6 py-4 rounded-xl shadow-lg">
              <p className="font-bold text-xl">{item.split(" ")[0]}</p>
              <p className="text-sm">{item.split(" ").slice(1).join(" ")}</p>
            </div>
          ))}
        </div>
      </div>

      {/* RIGHT PANEL */}
      <div className="w-full lg:w-1/2 flex items-center justify-center px-6 py-10">
        <div className="w-full max-w-md bg-white/90 backdrop-blur-xl shadow-2xl rounded-3xl p-8 border border-white/30">

          <h2 className="text-3xl font-bold mb-2 text-gray-800">
            Login
          </h2>

          <p className="text-gray-500 mb-6">
            Welcome back! Please enter your details
          </p>

          <form onSubmit={handleLogin} className="space-y-5">

            {/* Email */}
            <div className="relative group">
              <Mail className="absolute left-3 top-3 text-gray-400" size={18} />
              <input
                type="email"
                name="email"
                onChange={handleChange}
                placeholder="Email Address"
                className="w-full pl-10 py-3 border border-gray-300 rounded-xl 
                bg-white/70 backdrop-blur-md
                focus:ring-2 focus:ring-blue-400 focus:border-blue-400 
                hover:shadow-md transition-all duration-300 outline-none"
              />
            </div>

            {/* Password */}
            <div className="relative group">
              <Lock className="absolute left-3 top-3 text-gray-400" size={18} />

              <input
                type={showPass ? "text" : "password"}
                name="password"
                onChange={handleChange}
                placeholder="Password"
                className="w-full pl-10 pr-10 py-3 border rounded-xl 
                bg-white/70 backdrop-blur-md
                focus:ring-2 focus:ring-blue-400 focus:border-blue-400 
                hover:shadow-md transition-all duration-300 outline-none"
              />

              <Eye
                size={18}
                className="absolute right-3 top-3 cursor-pointer text-gray-400 hover:text-blue-600 transition"
                onClick={() => setShowPass(!showPass)}
              />
            </div>

            {/* Remember + Forgot */}
            <div className="flex justify-between items-center text-sm text-gray-600">
              <label className="flex items-center">
                <input type="checkbox" className="mr-2 accent-blue-600" />
                Remember me
              </label>

              <span className="text-blue-600 cursor-pointer hover:underline">
                Forgot Password?
              </span>
            </div>

            {/* BUTTON */}
            <button
              type="submit"
              className="w-full py-3 bg-gradient-to-r from-blue-600 to-blue-800 
              text-white rounded-xl font-semibold shadow-lg 
              hover:scale-105 hover:shadow-blue-500/40 
              active:scale-95 transition-all duration-300"
            >
              Login 🚀
            </button>

          </form>

          {/* Footer */}
          <p className="text-center text-sm mt-6 text-gray-600">
            Don’t have an account?{" "}
            <Link to="/register" className="text-blue-600 font-semibold hover:underline">
              Register
            </Link>
          </p>

        </div>
      </div>
    </div>
  );
}