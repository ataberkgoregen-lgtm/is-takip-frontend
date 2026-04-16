import React, { useState } from "react";
import { useJob } from "../context/JobContext";
import ApplicationForm from "../components/ApplicationForm";
import ApplicationCard from "../components/ApplicationCard";

const FILTER_OPTIONS = ["Tümü", "Beklemede", "Geri Dönüş Yapıldı", "Kabul Edildi", "Reddedildi"];

export default function TrackerPage() {
  const { applications, loading, error } = useJob();
  const [editingApp, setEditingApp] = useState(null);
  const [filter, setFilter] = useState("Tümü");
  const [search, setSearch] = useState("");

  const filtered = applications.filter((app) => {
    const matchStatus = filter === "Tümü" || app.status === filter;
    const matchSearch =
      app.company.toLowerCase().includes(search.toLowerCase()) ||
      app.position.toLowerCase().includes(search.toLowerCase());
    return matchStatus && matchSearch;
  });

  const stats = {
    total: applications.length,
    pending: applications.filter((a) => a.status === "Beklemede").length,
    response: applications.filter((a) => a.status === "Geri Dönüş Yapıldı").length,
    accepted: applications.filter((a) => a.status === "Kabul Edildi").length,
    rejected: applications.filter((a) => a.status === "Reddedildi").length,
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-100 px-6 py-4 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-gray-900">💼 İş Başvuru Takibi</h1>
            <p className="text-xs text-gray-500 mt-0.5">Başvurularını kolayca takip et</p>
          </div>
          <div className="flex items-center gap-4 text-center">
            <div>
              <p className="text-lg font-bold text-gray-800">{stats.total}</p>
              <p className="text-xs text-gray-400">Toplam</p>
            </div>
            <div>
              <p className="text-lg font-bold text-yellow-500">{stats.pending}</p>
              <p className="text-xs text-gray-400">Beklemede</p>
            </div>
            <div>
              <p className="text-lg font-bold text-blue-500">{stats.response}</p>
              <p className="text-xs text-gray-400">Geri Dönüş</p>
            </div>
            <div>
              <p className="text-lg font-bold text-green-500">{stats.accepted}</p>
              <p className="text-xs text-gray-400">Kabul</p>
            </div>
            <div>
              <p className="text-lg font-bold text-red-500">{stats.rejected}</p>
              <p className="text-xs text-gray-400">Red</p>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Sol: Form */}
          <div className="lg:w-80 flex-shrink-0">
            <ApplicationForm
              editingApp={editingApp}
              onCancelEdit={() => setEditingApp(null)}
            />
          </div>

          {/* Sağ: Liste */}
          <div className="flex-1">
            <div className="flex flex-col sm:flex-row gap-3 mb-5">
              <input
                type="text"
                placeholder="Şirket veya pozisyon ara..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="flex-1 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-100 transition bg-white"
              />
              <div className="flex gap-1 flex-wrap">
                {FILTER_OPTIONS.map((opt) => (
                  <button
                    key={opt}
                    onClick={() => setFilter(opt)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${
                      filter === opt
                        ? "bg-blue-600 text-white"
                        : "bg-white border border-gray-200 text-gray-600 hover:bg-gray-50"
                    }`}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </div>

            {loading && (
              <div className="text-center py-12 text-gray-400 text-sm">Yükleniyor...</div>
            )}
            {error && (
              <div className="p-4 bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg">
                {error}
              </div>
            )}

            {!loading && !error && filtered.length === 0 && (
              <div className="text-center py-16">
                <p className="text-4xl mb-3">📭</p>
                <p className="text-gray-500 text-sm">
                  {applications.length === 0
                    ? "Henüz başvuru eklenmemiş. Soldaki formu kullanarak başlayabilirsin."
                    : "Filtrelere uyan başvuru bulunamadı."}
                </p>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3">
              {filtered.map((app) => (
                <ApplicationCard
                  key={app.id}
                  app={app}
                  onEdit={(a) => {
                    setEditingApp(a);
                    window.scrollTo({ top: 0, behavior: "smooth" });
                  }}
                />
              ))}
            </div>

            {/* Zaman belirteci açıklaması */}
            {filtered.length > 0 && (
              <div className="mt-6 flex items-center gap-4 text-xs text-gray-400 bg-white border border-gray-100 rounded-xl px-4 py-2.5">
                <span className="font-medium text-gray-500">Belirteç:</span>
                <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-blue-500 inline-block" /> 0-7 gün</span>
                <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-green-500 inline-block" /> 8-30 gün</span>
                <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-red-500 inline-block" /> 30+ gün</span>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
