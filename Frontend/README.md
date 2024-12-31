# Location-Based Frontend Application

## Project Overview
A React.js-based frontend application for location-based services, featuring user authentication, address management, and interactive mapping capabilities. The application integrates with a backend API for data persistence and user management.

## Features
- User Authentication (Sign Up/Sign In)
- Real-time Location Tracking
- Interactive Map Integration using Leaflet
- Address Management (Add, View, Categories)
- Location Search with Suggestions
- Recent Location History
- Protected Routes for Authenticated Users

## Tech Stack
- React.js
- React Router v6
- Leaflet for Maps
- Axios for API Requests
- TailwindCSS for Styling
- Context API for State Management

## Prerequisites
- Node.js (v14 or higher)
- npm or yarn
- Backend Server Running (See Backend Documentation)

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file:
```env
REACT_APP_API_URL=http://localhost:8000
```

4. Start the development server:
```bash
npm start
```

## Project Structure
```
src/
├── components/
├── context/
│   └── LocationContext.jsx    # Location state management
├── pages/
│   ├── Home.jsx              # Main dashboard
│   ├── SignIn.jsx            # User authentication
│   ├── SignUp.jsx            # User registration
│   ├── LocationPage.jsx      # Address management
│   ├── MapPage.jsx           # Interactive map
│   └── DeliveryAddress.jsx   # Address form
└── App.jsx                   # Route configuration
```

## Usage Examples

### Authentication
```jsx
// Sign In Example
const handleSignIn = async (e) => {
  e.preventDefault();
  try {
    const response = await axios.post('/api/users/signin', { username, password });
    localStorage.setItem('token', response.data.token);
    navigate('/home');
  } catch (error) {
    alert('Error signing in');
  }
};
```

### Location Tracking
```jsx
// Current Location Example
const getCurrentLocation = () => {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setLocation({ lat: latitude, lng: longitude });
      },
      (error) => alert('Error getting location: ' + error.message)
    );
  }
};
```

### Map Integration
```jsx
// Map Component Example
<MapContainer center={location} zoom={15}>
  <TileLayer
    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
    attribution='&copy; OpenStreetMap contributors'
  />
  <Marker position={location}>
    <Popup>Your Location</Popup>
  </Marker>
</MapContainer>
```

## Protected Routes
```jsx
// Protected Route Example
const PrivateRoute = ({ element }) => {
  const token = localStorage.getItem('token');
  return token ? element : <Navigate to="/signin" />;
};
```

## API Integration
```jsx
// Address Management Example
const fetchAddresses = async () => {
  const token = localStorage.getItem('token');
  const response = await axios.get('/api/users/addresses', {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });
  setAddresses(response.data);
};
```

## Contributing
1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## Additional Configuration

### Environment Variables
- `REACT_APP_API_URL`: Backend API URL
- `REACT_APP_MAPS_API_KEY`: Maps API Key (if required)

### API Endpoints
- `/signin`: User authentication
- `/signup`: User registration
- `/addresses`: Address management
- `/location`: Recent searches

## Troubleshooting
- Ensure the backend server is running and accessible
- Check browser console for any errors
- Verify environment variables are set correctly
- Confirm authentication token is present for protected routes

## License
This project is licensed under the MIT License - see the LICENSE file for details