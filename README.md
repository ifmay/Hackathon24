# Zag Watch

Zag Watch is a web application designed to increase awareness and facilitate reporting of crimes in your area. The app allows users to view a map, add markers for incidents, and access critical resources.

Authors:
Drew Fitzpatrick, Isabelle May, and Maura Sweeny

## Features
1. **Interactive Map**:
   - Add markers for crime incidents by clicking on the map.
   - Markers can include details such as title, category, and description.
   - View and edit marker details.

2. **Crime Feed**:
   - Displays recent reports with details like category, description, and date posted.

3. **Resources Section**:
   - Provides contact information for emergency and non-emergency crime reporting.

4. **Tab Navigation**:
   - Switch between the "Map" and "Resources" views using a tab interface.

## Getting Started

### Prerequisites

Ensure you have the following installed:

- **Node.js**: Required to run the development environment.
- **Google Maps API Key**: Needed for map functionality.

### Installation

1. Clone the repository:
   git clone <repository-url>
   cd <repository-directory>
2. Install dependencies:
   npm install
3. Add Google Maps API key
4. Run the application:
   npm start

The application will be available at http://localhost:3000.

## How to Use

### Map Tab

#### Adding a Marker
- Click on any location on the map to add a marker.
- A form will appear to input details about the incident.

#### Editing Marker Details
- Click on an existing marker to view or edit its details.

#### Submitting the Form
- Fill in the **title**, **category**, and **description** fields.
- Click **Save** to add the report to the feed.

#### Canceling a Marker
- If you decide not to save the marker, click **Cancel** to remove it from the map.

### Resources Tab
Provides emergency and non-emergency contacts:
- **Emergency**: Call 911 for urgent situations.
- **Gonzaga Campus Security**: Call 509-313-2222.
- **Spokane Crime Reporting Center (CrimeCheck)**: Call 509-456-2233.

## Code Overview

### Components

#### State Management
- **useState**: Manages active tab, form visibility, marker data, etc.
- **useRef**: Stores references to the map and marker instances.

#### Google Maps Integration
- Loads Google Maps API dynamically.
- Initializes the map centered on Spokane, WA.
- Allows user interactions like adding and clicking markers.

#### Form Handling
- Validates input fields for title and description.
- Dynamically updates the recent feed upon submission.

#### Tab Navigation
- Toggles between the **Map** and **Resources** views.

### Dependencies
- **React**: UI library for building components.
- **Google Maps API**: Provides map and location services.
- **uuid**: Generates unique IDs for markers and posts.

### Known Issues
- **Marker Persistence**: Currently, markers are not stored persistently. Data will reset on page reload.

### Future Enhancements
- Add user authentication for private reports.
- Enable persistent storage for markers and feed data.
- Enhance map interactivity with filtering and clustering features.
- Support multiple languages for greater accessibility.

### Screenshot
![image](https://github.com/user-attachments/assets/2a888cc9-bae8-4841-b877-73b561583092)

