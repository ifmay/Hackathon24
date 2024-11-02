import { GoogleMap, LoadScript } from "@react-google-maps/api";

const containerStyle = {
  width: "100%",
  height: "400px",
};

const center = {
  lat: 47.6062, // change to spo
  lng: -122.3321,
};

function MainPage() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>Google Maps Integration</h1>
        <LoadScript googleMapsApiKey={process.env.GOOGLE_MAPS_API_KEY}>
          <GoogleMap
            mapContainerStyle={containerStyle}
            center={center}
            zoom={10}
          >
            {/* Child components, like markers, info windows, etc. */}
          </GoogleMap>
        </LoadScript>
      </header>
    </div>
  );
}

export default MainPage;
