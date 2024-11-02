import React from "react";
import MainPage from "./main.js";
import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* main page */}
        <Route path="/" element={<MainPage />} />
        {/* add other pages if want */}
        <Route path="/other" element={<other />} />
        {/* edit post page */};{/* url not found */}
        <Route
          path="*"
          element={
            <>
              <h1>404 Error- Not Found</h1>
            </>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
