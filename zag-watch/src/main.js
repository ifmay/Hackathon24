import React, { useState } from "react";
import { GoogleMap, LoadScript } from "@react-google-maps/api";

const containerStyle = {
  width: "100%",
  height: "400px",
};

const center = {
  lat: 47.6587,
  lng: -117.4260,
};

function MainPage() {
  const [activeTab, setActiveTab] = useState("Map");

  return (
    <div className="App">
      <header className="App-header">
        <h1>Zag Watch</h1>
        <h2>Be Scare Aware</h2>
        <div>
          <button onClick={() => setActiveTab("Map")}>Map</button>
          <button onClick={() => setActiveTab("Recent Feed")}>Recent Feed</button>
          <button onClick={() => setActiveTab("Post a Crime")}>Post a Crime</button>
          <button onClick={() => setActiveTab("Resources")}>Resources</button>
        </div>

        {activeTab === "Map" && (
          <LoadScript googleMapsApiKey={process.env.GOOGLE_MAPS_API_KEY}>
            <GoogleMap
              mapContainerStyle={containerStyle}
              center={center}
              zoom={15}
            />
          </LoadScript>
        )}
        {activeTab === "Recent Feed" && <h2>Recent Feed Content</h2>}
        {activeTab === "Post a Crime" && <h2>Post a Crime Form</h2>}
        {activeTab === "Resources" && <h2>Resources Content</h2>}
      </header>
    </div>
  );
}

export default MainPage;
