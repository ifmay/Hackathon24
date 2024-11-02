import React, { useState, useEffect, useRef } from "react";
import { v4 as uuidv4 } from "uuid";

/** change how date appears, enter date incident occurred, filter based on date posted */

function MainPage() {
  const [activeTab, setActiveTab] = useState("Map");
  const [formVisible, setFormVisible] = useState(false);
  const [markerData, setMarkerData] = useState({
    title: "",
    category: "",
    description: "",
  });
  const [selectedMarker, setSelectedMarker] = useState(null);
  const [isReadOnly, setIsReadOnly] = useState(false);
  const mapRef = useRef(null);
  const mapInstance = useRef(null);
  const [markers, setMarkers] = useState([]);
  const [posts, setPosts] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadGoogleMaps = () => {
      if (window.google && window.google.maps) {
        initMap();
      } else {
        const script = document.createElement("script");
        script.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyAn2L7XjusuIyjQ19kmmpsdlytyKOBvIr0&libraries=places`;
        script.async = true;
        script.defer = true;
        script.onload = initMap;
        document.body.appendChild(script);
      }
    };

    const initMap = () => {
      const { Map, Marker } = window.google.maps;
      const AdvancedMarkerElement = window.google.maps.AdvancedMarkerElement;

      mapInstance.current = new Map(mapRef.current, {
        center: { lat: 47.6699, lng: -117.404 },
        zoom: 16,
      });

      mapInstance.current.addListener("click", (e) => {
        addMarker(e.latLng, AdvancedMarkerElement || Marker);
      });
    };

    const addMarker = (location, MarkerClass) => {
      const markerId = uuidv4();
      const marker = new MarkerClass({
        position: location,
        map: mapInstance.current,
        title: "Crime Report Marker",
      });

      marker.set("id", markerId);
      marker.set("data", { title: "", category: "", description: "" });

      setMarkerData({ title: "", category: "", description: "" });
      setSelectedMarker(marker);
      setIsReadOnly(false);
      setFormVisible(true);

      marker.addListener("click", () => {
        const markerData = marker.get("data");
        setMarkerData(markerData);
        setSelectedMarker(marker);
        setIsReadOnly(markerData.title !== "" || markerData.description !== "");
        setFormVisible(true);
      });

      setMarkers((prevMarkers) => [...prevMarkers, marker]);
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
  }, [activeTab, markers]);

  const handleFormSubmit = (e) => {
    e.preventDefault();
    setError("");

    if (isReadOnly) {
      setFormVisible(false);
      return;
    }

    const { title, description, category } = markerData;
    const finalCategory = category === "" ? "General" : category;

    let validationError = "";
    if (title.length === 0) validationError += "Title is required\n";
    if (description.length === 0) validationError += "Content is required\n";

    if (validationError) {
      setError(validationError.trim());
      return;
    }

    const newPost = {
      id: uuidv4(),
      category: finalCategory,
      title,
      description,
      datePosted: new Date().toISOString(),
    };

    setPosts((prevPosts) => [...prevPosts, newPost]);
    setMarkerData({ title: "", category: "", description: "" });

    if (selectedMarker) {
      selectedMarker.set("data", { title, category, description });
    }

    setFormVisible(false);
    setSelectedMarker(null);
  };

  const handleCancel = () => {
    if (selectedMarker) {
      selectedMarker.setMap(null); // Remove marker from the map
      setMarkers((prevMarkers) =>
        prevMarkers.filter((marker) => marker !== selectedMarker)
      );
    }
    setFormVisible(false);
    setSelectedMarker(null);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setMarkerData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>Zag Watch</h1>
        <h2 style={{ fontSize: "1em" }}>Be Scare Aware</h2>
        <img
          src="/bulldog1.jpg"
          alt="Bulldog"
          style={{
            position: "absolute",
            top: "10px",
            right: "10px",
            width: "225px",
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
                  top: "50%",
                  left: "50%",
                  transform: "translate(-50%, -50%)",
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
                      placeholder="Add title..."
                      required
                      readOnly={isReadOnly}
                    />
                  </label>
                  <br />
                  <label>
                    Choose a Category:
                    <select
                      name="category"
                      value={markerData.category}
                      onChange={handleInputChange}
                      required
                      disabled={isReadOnly}
                    >
                      <option value="">Select a category</option>
                      <option value="robbery">Robbery</option>
                      <option value="assault">Assault</option>
                      <option value="MV-theft">
                        (Attempted/) Motor Vehicle Theft
                      </option>
                      <option value="home-invasion">
                        (Attempted/) Home Invasion
                      </option>
                      <option value="Other">Other</option>
                    </select>
                  </label>
                  <br />
                  <label>
                    Description:
                    <textarea
                      name="description"
                      value={markerData.description}
                      onChange={handleInputChange}
                      placeholder="Add text..."
                      required
                      readOnly={isReadOnly}
                    />
                  </label>
                  <br />
                  {error && <p style={{ color: "red" }}>{error}</p>}
                  <button type="submit">{isReadOnly ? "Close" : "Save"}</button>
                  {!isReadOnly && (
                    <button type="button" onClick={handleCancel}>
                      Cancel
                    </button>
                  )}
                </form>
              </div>
            )}
            <div className="new-record">
              <h2>Recent Feed Content</h2>
              {posts.map((post) => (
                <div key={post.id}>
                  <h3>{post.title}</h3>
                  <p>{post.description}</p>
                  <p>Category: {post.category}</p>
                  <p>Date Posted: {post.datePosted}</p>
                </div>
              ))}
            </div>
          </div>
        )}
        {activeTab === "Resources" && (
          <div>
            <h2 style={{ fontSize: "1em", color: "maroon" }}>Resources!</h2>
            <p>
              To report an urgent situation where law enforcement, fire, or
              emergency medical services are required, please call 911.
            </p>{" "}
            <p>
              To file a report with Gonzaga Campus Security, call the Security
              Communications Center at 509-313-2222.
            </p>
            <p>
              To report non-emergency or delayed crimes to SPD, contact the
              Spokane Crime Reporting Center (CrimeCheck) at 509-456-2233.
            </p>
            <img
              src="/bulldog2.png"
              alt="Bulldog"
              style={{
                position: "absolute",
                top: "560px",
                left: "150px",
                width: "500px",
                height: "auto",
              }}
            />
          </div>
        )}
      </header>
    </div>
  );
}

export default MainPage;
