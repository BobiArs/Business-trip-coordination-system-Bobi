import { Link } from "react-router-dom";

export default function NotFoundPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h1 className="text-4xl font-bold mb-4">404 — Сторінку не знайдено</h1>
      <p className="mb-6">На жаль, такої сторінки не існує.</p>
      <Link
        to="/login"
        className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700 transition"
      >
        Повернутися на головну
      </Link>
    </div>
  );
}
