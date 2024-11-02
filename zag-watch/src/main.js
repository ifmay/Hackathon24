import React, { useState, useEffect, useRef } from "react";
import { GoogleMap, LoadScript } from "@react-google-maps/api";

const containerStyle = {
  width: "100%",
  height: "400px",
};

const center = {
  lat: 47.6587,
  lng: -117.426,
};

function MainPage() {
  const [activeTab, setActiveTab] = useState("Map");
  const mapRef = useRef(null); // Reference to the map DOM element
  const mapInstance = useRef(null); // Store the map instance

  useEffect(() => {
    const loadGoogleMaps = () => {
      // Check if the google maps library is already loaded
      if (window.google) {
        initMap();
      } else {
        const script = document.createElement("script");
        script.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyAn2L7XjusuIyjQ19kmmpsdlytyKOBvIr0&libraries=places`;
        script.async = true;
        script.defer = true;
        script.onload = initMap; // Call initMap when the script loads
        document.body.appendChild(script);
      }
    };

    const initMap = async () => {
      const { Map } = await window.google.maps.importLibrary("maps");
      // Create the map instance and attach it to the mapRef's current DOM element
      mapInstance.current = new Map(mapRef.current, {
        center: { lat: 47.6699, lng: -117.404 }, //spo
        zoom: 16,
      });
    };

    loadGoogleMaps();

    return () => {
      // Cleanup logic, if necessary
      mapInstance.current = null; // Clear the map instance on cleanup
    };
  }, []);

  return (
    <div className="App">
      <header className="App-header">
        <h1>Zag Watch</h1>
        <h2>Be Scare Aware</h2>
        <div>
          <button onClick={() => setActiveTab("Map")}>Map</button>
          <button onClick={() => setActiveTab("Recent Feed")}>
            Recent Feed
          </button>
          <button onClick={() => setActiveTab("Post a Crime")}>
            Post a Crime
          </button>
          <button onClick={() => setActiveTab("Resources")}>Resources</button>
        </div>

        {activeTab === "Map" && (
          <div style={{ height: "75vh", width: "100vw" }}>
            {" "}
            {/* Full height and width for the map */}
            <div ref={mapRef} style={{ height: "100%" }}></div>{" "}
            {/* Map container */}
          </div>
        )}
        {activeTab === "Recent Feed" && <h2>Recent Feed Content</h2>}
        {activeTab === "Post a Crime" && <h2>Post a Crime Form</h2>}
        {activeTab === "Resources" && <h2>Resources Content</h2>}
      </header>
    </div>
  );
}

export default MainPage;
