import { GoogleMap, LoadScript } from "@react-google-maps/api";

const containerStyle = {
  width: "100%",
  height: "400px",
};

// Coordinates for Spokane
const center = {
  lat: 47.6586, // Spokane latitude
  lng: -117.4260, // Spokane longitude
};

function MainPage() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>Zag Watch</h1>
        <h2>Scare Aware</h2>
        <LoadScript googleMapsApiKey={process.env.GOOGLE_MAPS_API_KEY}>
          <GoogleMap
            mapContainerStyle={containerStyle}
            center={center} // Center the map on Spokane
            zoom={10} // Zoom level for visibility
          >
            {/* Child components, like markers, info windows, etc. */}
          </GoogleMap>
        </LoadScript>
      </header>
    </div>
  );
}

export default MainPage;
