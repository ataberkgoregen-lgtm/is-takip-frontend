import React from "react";
import { useJob } from "../context/JobContext";

const STATUS_COLORS = {
  "Beklemede": "bg-yellow-50 text-yellow-700 border-yellow-200",
  "Geri Dönüş Yapıldı": "bg-blue-50 text-blue-700 border-blue-200",
  "Reddedildi": "bg-red-50 text-red-700 border-red-200",
  "Kabul Edildi": "bg-green-50 text-green-700 border-green-200",
};

const RESPONSE_TYPE_COLORS = {
  "Onay": "bg-green-100 text-green-800",
  "Mülakat": "bg-blue-100 text-blue-800",
  "Red": "bg-red-100 text-red-800",
};

function getTimeBadge(appliedAt) {
  const now = new Date();
  const applied = new Date(appliedAt);
  const diffDays = Math.floor((now - applied) / (1000 * 60 * 60 * 24));

  if (diffDays <= 7) {
    return { label: `${diffDays} gün önce`, color: "bg-blue-500" };
  } else if (diffDays <= 30) {
    return { label: `${diffDays} gün önce`, color: "bg-green-500" };
  } else {
    return { label: `${diffDays} gün önce`, color: "bg-red-500" };
  }
}

function formatDate(dateStr) {
  if (!dateStr) return "-";
  const d = new Date(dateStr);
  return d.toLocaleDateString("tr-TR", { day: "2-digit", month: "long", year: "numeric" });
}

export default function ApplicationCard({ app, onEdit }) {
  const { deleteApplication } = useJob();
  const timeBadge = getTimeBadge(app.applied_at);

  const handleDelete = async () => {
    if (window.confirm(`"${app.company}" başvurusunu silmek istediğinizden emin misiniz?`)) {
      await deleteApplication(app.id);
    }
  };

  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between gap-2 mb-3">
        <div className="flex items-center gap-2 min-w-0">
          <div className={`w-2.5 h-2.5 rounded-full flex-shrink-0 ${timeBadge.color}`} title={timeBadge.label} />
          <div className="min-w-0">
            <p className="font-semibold text-gray-800 text-sm truncate">{app.company}</p>
            <p className="text-xs text-gray-500 truncate">{app.position}</p>
          </div>
        </div>
        <div className="flex gap-1 flex-shrink-0">
          <button
            onClick={() => onEdit(app)}
            className="text-gray-400 hover:text-blue-500 transition p-1 rounded"
            title="Düzenle"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
          </button>
          <button
            onClick={handleDelete}
            className="text-gray-400 hover:text-red-500 transition p-1 rounded"
            title="Sil"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </div>
      </div>

      <div className="flex items-center justify-between mb-2">
        <span className={`text-xs px-2 py-0.5 rounded-full border font-medium ${STATUS_COLORS[app.status] || "bg-gray-50 text-gray-600 border-gray-200"}`}>
          {app.status}
        </span>
        <span className="text-xs text-gray-400">{formatDate(app.applied_at)}</span>
      </div>

      <div className="flex items-center gap-1 text-xs text-gray-400 mb-1">
        <span className={`inline-block w-2 h-2 rounded-full ${timeBadge.color}`} />
        <span>{timeBadge.label}</span>
      </div>

      {app.location && (
        <p className="text-xs text-gray-400 mt-1">📍 {app.location}</p>
      )}
      {app.salary && (
        <p className="text-xs text-gray-400">💰 {app.salary}</p>
      )}
      {app.job_url && (
        <a
          href={app.job_url}
          target="_blank"
          rel="noreferrer"
          className="text-xs text-blue-500 hover:underline mt-1 block truncate"
        >
          🔗 İlan Linki
        </a>
      )}

      {app.status === "Geri Dönüş Yapıldı" && (
        <div className="mt-3 pt-3 border-t border-gray-100">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs text-gray-500 font-medium">Geri Dönüş:</span>
            {app.response_type && (
              <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${RESPONSE_TYPE_COLORS[app.response_type] || "bg-gray-100 text-gray-600"}`}>
                {app.response_type}
              </span>
            )}
          </div>
          {app.response_note && (
            <p className="text-xs text-gray-500 bg-gray-50 rounded-lg p-2 mt-1">
              {app.response_note}
            </p>
          )}
        </div>
      )}
    </div>
  );
}
