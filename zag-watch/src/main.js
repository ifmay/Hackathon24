import React, { useState, useEffect, useRef } from "react";
import { v4 as uuidv4 } from "uuid";

function MainPage() {
  const [activeTab, setActiveTab] = useState("Map");
  const [formVisible, setFormVisible] = useState(false);
  const [markerData, setMarkerData] = useState({
    title: "",
    category: "",
    description: "",
  });
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

      setMarkers((prevMarkers) => [...prevMarkers, newMarker]);

      setFormVisible(true);
      setMarkerData({ title: "", category: "", description: "" });

      newMarker.addListener("click", () => {
        setFormVisible(true);
      });
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
  }, [activeTab]); // Removed `markers` as dependency to prevent re-initialization

  const handleFormSubmit = (e) => {
    e.preventDefault();
    setError("");

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
    setFormVisible(false);
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
        <h2>Be Scare Aware</h2>
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
                    />
                  </label>
                  <br />
                  {error && <p style={{ color: "red" }}>{error}</p>}
                  <button type="submit">Save</button>
                  <button type="button" onClick={() => setFormVisible(false)}>
                    Cancel
                  </button>
                </form>
              </div>
            )}
            <div>
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
        {activeTab === "Resources" && <h2>Resources Content</h2>}
      </header>
    </div>
  );
}

export default MainPage;
