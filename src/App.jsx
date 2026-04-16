import React from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { JobProvider } from "./context/JobContext";
import TrackerPage from "./pages/TrackerPage";

function App() {
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

export default App;
