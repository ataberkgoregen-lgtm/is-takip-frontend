import React, { useState, useEffect } from "react";
import { useJob } from "../context/JobContext";

const emptyForm = {
  company: "",
  position: "",
  location: "",
  salary: "",
  job_url: "",
  applied_at: new Date().toISOString().split("T")[0],
  status: "Beklemede",
  response_type: "",
  response_note: "",
};

const STATUS_OPTIONS = ["Beklemede", "Geri Dönüş Yapıldı", "Reddedildi", "Kabul Edildi"];
const RESPONSE_TYPES = ["Onay", "Mülakat", "Red"];

export default function ApplicationForm({ editingApp, onCancelEdit }) {
  const { addApplication, updateApplication } = useJob();
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    if (editingApp) {
      setForm({
        company: editingApp.company || "",
        position: editingApp.position || "",
        location: editingApp.location || "",
        salary: editingApp.salary || "",
        job_url: editingApp.job_url || "",
        applied_at: editingApp.applied_at || new Date().toISOString().split("T")[0],
        status: editingApp.status || "Beklemede",
        response_type: editingApp.response_type || "",
        response_note: editingApp.response_note || "",
      });
    } else {
      setForm(emptyForm);
    }
  }, [editingApp]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");
    if (!form.company.trim() || !form.position.trim() || !form.applied_at) {
      setErrorMsg("Şirket, pozisyon ve tarih alanları zorunludur.");
      return;
    }
    setSaving(true);
    try {
      if (editingApp) {
        await updateApplication(editingApp.id, form);
        onCancelEdit();
      } else {
        await addApplication(form);
        setForm(emptyForm);
      }
    } catch (err) {
      setErrorMsg(err.message);
    } finally {
      setSaving(false);
    }
  };

  const showResponseFields = form.status === "Geri Dönüş Yapıldı";

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
      <h2 className="text-lg font-semibold text-gray-800 mb-5">
        {editingApp ? "✏️ Başvuruyu Düzenle" : "➕ Yeni Başvuru Ekle"}
      </h2>

      {errorMsg && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg">
          {errorMsg}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">
              Şirket <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              name="company"
              value={form.company}
              onChange={handleChange}
              placeholder="Örn: Google"
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-100 transition"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">
              Pozisyon <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              name="position"
              value={form.position}
              onChange={handleChange}
              placeholder="Örn: Frontend Developer"
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-100 transition"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">Lokasyon</label>
            <input
              type="text"
              name="location"
              value={form.location}
              onChange={handleChange}
              placeholder="Örn: İstanbul / Uzaktan"
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-100 transition"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">Maaş Beklentisi</label>
            <input
              type="text"
              name="salary"
              value={form.salary}
              onChange={handleChange}
              placeholder="Örn: 30.000 TL"
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-100 transition"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">İlan URL</label>
            <input
              type="url"
              name="job_url"
              value={form.job_url}
              onChange={handleChange}
              placeholder="https://..."
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-100 transition"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">
              Başvuru Tarihi <span className="text-red-400">*</span>
            </label>
            <input
              type="date"
              name="applied_at"
              value={form.applied_at}
              onChange={handleChange}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-100 transition"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">Durum</label>
            <select
              name="status"
              value={form.status}
              onChange={handleChange}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-100 transition bg-white"
            >
              {STATUS_OPTIONS.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>

          {showResponseFields && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">Geri Dönüş Türü</label>
                <select
                  name="response_type"
                  value={form.response_type}
                  onChange={handleChange}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-100 transition bg-white"
                >
                  <option value="">Seçiniz</option>
                  {RESPONSE_TYPES.map((r) => (
                    <option key={r} value={r}>{r}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">Not</label>
                <textarea
                  name="response_note"
                  value={form.response_note}
                  onChange={handleChange}
                  rows={3}
                  placeholder="Geri dönüşle ilgili notlarınız..."
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-100 transition resize-none"
                />
              </div>
            </>
          )}
        </div>

        <div className="flex gap-2 pt-2">
          <button
            type="submit"
            disabled={saving}
            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium py-2.5 rounded-lg transition disabled:opacity-50"
          >
            {saving ? "Kaydediliyor..." : editingApp ? "Güncelle" : "Kaydet"}
          </button>
          {editingApp && (
            <button
              type="button"
              onClick={onCancelEdit}
              className="flex-1 border border-gray-200 text-gray-600 text-sm font-medium py-2.5 rounded-lg hover:bg-gray-50 transition"
            >
              İptal
            </button>
          )}
        </div>
      </form>
    </div>
  );
}
