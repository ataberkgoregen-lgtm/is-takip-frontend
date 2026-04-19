import React, { createContext, useContext, useReducer, useEffect } from "react";
import { useAuth } from "./AuthContext";

const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";
const API_URL = `${BASE_URL}/api/applications`;

const JobContext = createContext();

const initialState = {
  applications: [],
  loading: false,
  error: null,
};

function reducer(state, action) {
  switch (action.type) {
    case "SET_LOADING":
      return { ...state, loading: action.payload };
    case "SET_ERROR":
      return { ...state, error: action.payload, loading: false };
    case "SET_APPLICATIONS":
      return { ...state, applications: action.payload, loading: false };
    case "ADD_APPLICATION":
      return {
        ...state,
        applications: [action.payload, ...state.applications],
      };
    case "UPDATE_APPLICATION":
      return {
        ...state,
        applications: state.applications.map((app) =>
          app._id === action.payload._id ? action.payload : app,
        ),
      };
    case "DELETE_APPLICATION":
      return {
        ...state,
        applications: state.applications.filter(
          (app) => app._id !== action.payload,
        ),
      };
    default:
      return state;
  }
}

export function JobProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);
  const { token } = useAuth();

  const authHeaders = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };

  useEffect(() => {
    if (token) fetchApplications();
  }, [token]);

  const fetchApplications = async () => {
    dispatch({ type: "SET_LOADING", payload: true });
    try {
      const res = await fetch(API_URL, { headers: authHeaders });
      const data = await res.json();
      dispatch({
        type: "SET_APPLICATIONS",
        payload: Array.isArray(data) ? data : [],
      });
    } catch {
      dispatch({ type: "SET_ERROR", payload: "Veriler yüklenemedi." });
    }
  };

  const addApplication = async (formData) => {
    const res = await fetch(API_URL, {
      method: "POST",
      headers: authHeaders,
      body: JSON.stringify(formData),
    });
    if (!res.ok) throw new Error("Başvuru eklenemedi.");
    const data = await res.json();
    dispatch({ type: "ADD_APPLICATION", payload: data });
    return data;
  };

  const updateApplication = async (id, formData) => {
    const res = await fetch(`${API_URL}/${id}`, {
      method: "PUT",
      headers: authHeaders,
      body: JSON.stringify(formData),
    });
    if (!res.ok) throw new Error("Güncelleme başarısız.");
    const data = await res.json();
    dispatch({ type: "UPDATE_APPLICATION", payload: data });
    return data;
  };

  const deleteApplication = async (id) => {
    const res = await fetch(`${API_URL}/${id}`, {
      method: "DELETE",
      headers: authHeaders,
    });
    if (!res.ok) throw new Error("Silme başarısız.");
    dispatch({ type: "DELETE_APPLICATION", payload: id });
  };

  return (
    <JobContext.Provider
      value={{ ...state, addApplication, updateApplication, deleteApplication }}
    >
      {children}
    </JobContext.Provider>
  );
}

export function useJob() {
  return useContext(JobContext);
}
