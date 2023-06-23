import { Routes, Route } from "react-router-dom";
import "./App.css";

import Home from "./Home";
import Install from "./Install";

function App() {
  return (
    <Routes>
      <Route path="/install" element={<Home />} />
      <Route path="/" element={<Install />} />
    </Routes>
  );
}

export default App;
