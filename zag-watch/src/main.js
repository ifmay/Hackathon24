import React, { useState, useEffect, useRef } from "react";
import { v4 as uuidv4 } from "uuid";

function MainPage() {
  const [activeTab, setActiveTab] = useState("Map");
  const [formVisible, setFormVisible] = useState(false); // Track form visibility
  const [formPosition, setFormPosition] = useState({ lat: null, lng: null }); // Position of the form
  const [markerData, setMarkerData] = useState({
    title: "",
    category: "",
    description: "",
  }); // Form data
  const mapRef = useRef(null); // Reference to the map DOM element
  const mapInstance = useRef(null); // Store the map instance
  const [markers, setMarkers] = useState([]); // Store an array of markers
  const [posts, setPosts] = useState([]);
  let [error, setError] = useState("");

  useEffect(() => {
    const loadGoogleMaps = () => {
      if (window.google && window.google.maps) {
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

      mapInstance.current = new Map(mapRef.current, {
        center: { lat: 47.6699, lng: -117.404 }, // Spokane coordinates
        zoom: 16,
      });

      // Add click listener to place a marker on click
      mapInstance.current.addListener("click", (e) => {
        addMarker(e.latLng);
      });
    };

    const addMarker = (location) => {
      const newMarker = new window.google.maps.Marker({
        position: location,
        map: mapInstance.current,
      });

      // Show form and set its position
      setFormVisible(true);
      setFormPosition({ lat: location.lat(), lng: location.lng() });

      // Add click listener to marker to re-open form if needed
      newMarker.addListener("click", () => {
        setFormVisible(true);
        setFormPosition({ lat: location.lat(), lng: location.lng() });
      });

      // Update the markers state to include the new marker
      setMarkers((prevMarkers) => [...prevMarkers, newMarker]);
    };

    // Load Google Maps if the active tab is "Map"
    if (activeTab === "Map") {
      loadGoogleMaps();
    }

    return () => {
      // Cleanup logic
      if (mapInstance.current) {
        // Remove all markers from the map
        markers.forEach((marker) => marker.setMap(null));
        mapInstance.current = null; // Clear the map instance on cleanup
      }
    };
  }, [activeTab, markers]); // Add activeTab as a dependency

  const handleFormSubmit = (e) => {
    e.preventDefault();
    // Handle form data submission here (e.g., save marker data)
    console.log("Marker Data:", markerData);

    const { title, description, category } = markerData;
    const finalCategory = category === "" ? "General" : category;

    if (title.length === 0) {
      error += "Title is required\n";
    }

    if (description.length === 0) {
      error += "Content is required\n";
    }

    if (error) {
      setError(error.trim());
      return; // exit if there are errors
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
          <div style={{ height: "75vh", width: "100vw", position: "relative" }}>
            <div ref={mapRef} style={{ height: "100%" }}></div>

            {/* Render form at specified position */}
            {formVisible && (
              <div
                style={{
                  position: "absolute",
                  top: "50%",
                  left: "50%",
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
                      v
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
                  <button type="submit">Save</button>
                  <button type="button" onClick={() => setFormVisible(false)}>
                    Cancel
                  </button>
                </form>
              </div>
            )}
          </div>
        )}
        {activeTab === "Recent Feed" && (
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
        )}
        {activeTab === "Post a Crime" && <h2>Post a Crime Form</h2>}
        {activeTab === "Resources" && <h2>Resources Content</h2>}
      </header>
    </div>
  );
}

export default MainPage;
