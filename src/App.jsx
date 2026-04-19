import React from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { JobProvider } from "./context/JobContext";
import TrackerPage from "./pages/TrackerPage";
import LoginPage from "./pages/LoginPage";

function AppRoutes() {
  const { token } = useAuth();

  if (!token) return <LoginPage />;

  return (
    <JobProvider>
      <Router>
        <Switch>
          <Route exact path="/" component={TrackerPage} />
        </Switch>
      </Router>
    </JobProvider>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  );
}

export default App;
