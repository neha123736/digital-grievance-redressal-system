export default function Card({ title, value, icon, color }) {
  return (
    <div className="bg-white p-6 rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 border border-gray-100">

      <div className="flex justify-between items-center mb-4">
        <div className={`p-3 rounded-xl ${color}`}>
          {icon}
        </div>
        <span className="text-green-500 text-sm font-medium">↗</span>
      </div>

      <h2 className="text-3xl font-bold text-gray-800">{value}</h2>
      <p className="text-gray-500 text-sm mt-1">{title}</p>
    </div>
  );
}