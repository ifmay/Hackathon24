import React, { useState, useEffect, useRef } from "react";

function MainPage() {
  const [activeTab, setActiveTab] = useState("Map");
  const [formVisible, setFormVisible] = useState(false);
  const [markerData, setMarkerData] = useState({ title: "", description: "" });
  const mapRef = useRef(null);
  const mapInstance = useRef(null);
  const [markers, setMarkers] = useState([]);

  useEffect(() => {
    const loadGoogleMaps = () => {
      if (window.google && window.google.maps) {
        initMap();
      } else {
        const script = document.createElement("script");
        script.src = `https://maps.googleapis.com/maps/api/js?key=YOUR_API_KEY&libraries=places`;
        script.async = true;
        script.defer = true;
        script.onload = initMap;
        document.body.appendChild(script);
      }
    };

    const initMap = async () => {
      const { Map } = await window.google.maps.importLibrary("maps");

      mapInstance.current = new Map(mapRef.current, {
        center: { lat: 47.6699, lng: -117.404 },
        zoom: 16,
      });

      mapInstance.current.addListener("click", (e) => {
        addMarker(e.latLng);
      });
    };

    const addMarker = (location) => {
      const newMarker = new window.google.maps.Marker({
        position: location,
        map: mapInstance.current,
      });

      setFormVisible(true);

      newMarker.addListener("click", () => {
        setFormVisible(true);
      });

      setMarkers((prevMarkers) => [...prevMarkers, newMarker]);
    };

    if (activeTab === "Map") {
      loadGoogleMaps();
    }

    return () => {
      if (mapInstance.current) {
        markers.forEach((marker) => marker.setMap(null));
        mapInstance.current = null;
      }
    };
  }, [activeTab]);

  const handleFormSubmit = (e) => {
    e.preventDefault();
    console.log("Marker Data:", markerData);
    setMarkerData({ title: "", description: "" });
    setFormVisible(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setMarkerData((prevData) => ({ ...prevData, [name]: value }));
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>Zag Watch</h1>
        <h2>Be Scare Aware</h2>
        <img
          src="/bulldog1.jpg"
          alt="Bulldog"
          style={{
            position: "absolute",
            top: "10px",
            right: "10px",
            width: "250px",
            height: "auto",
          }}
        />
        <div>
          <button onClick={() => setActiveTab("Map")}>Map</button>
          <button onClick={() => setActiveTab("Resources")}>Resources</button>
        </div>

        {activeTab === "Map" && (
          <div style={{ height: "75vh", width: "100vw", position: "relative" }}>
            <div ref={mapRef} style={{ height: "100%" }}></div>

            {formVisible && (
              <div
                style={{
                  position: "absolute",
                  top: "50%",  // Center vertically
                  left: "50%", // Center horizontally
                  transform: "translate(-50%, -50%)", // Adjust to center exactly
                  backgroundColor: "white",
                  padding: "10px",
                  boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
                  zIndex: 1000,
                }}
              >
                <form onSubmit={handleFormSubmit}>
                  <label>
                    Title:
                    <input
                      type="text"
                      name="title"
                      value={markerData.title}
                      onChange={handleInputChange}
                      required
                    />
                  </label>
                  <br />
                  <label>
                    Description:
                    <textarea
                      name="description"
                      value={markerData.description}
                      onChange={handleInputChange}
                      required
                    />
                  </label>
                  <br />
                  <button type="submit">Save</button>
                  <button type="button" onClick={() => setFormVisible(false)}>
                    Cancel
                  </button>
                </form>
              </div>
            )}
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
