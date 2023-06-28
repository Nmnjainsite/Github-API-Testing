import { Routes, Route, Navigate } from "react-router-dom";
import "./App.css";

import Home from "./Home";
import Install from "./Install";

function App() {
  const profileData = localStorage.getItem("githubData");
  const profile = profileData ? JSON.parse(profileData) : null;
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      {profile?.login ? (
        <Route path="/install" element={<Install />} />
      ) : (
        <Route path="/" element={<Home />} />
      )}
      <Route
        path="/*"
        element={<Navigate to={profile?.login ? "/install" : "/"} />}
      />
    </Routes>
  );
}

export default App;
