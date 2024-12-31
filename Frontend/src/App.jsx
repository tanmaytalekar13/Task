import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Home from './pages/Home';
import MapPage from './pages/MapPage';
import DeliveryAddress from './pages/DeliveryAddress';
import SignUp from './pages/SignUp';
import SignIn from './pages/SignIn';
import UserProtectedWrapper from './pages/UserProtectedWrapper';
import LocationPage from './pages/LocationPage';
const PrivateRoute = ({ element }) => {
  const token = localStorage.getItem('token');
  return token ? element : <Navigate to="/signin" />;
};

const App = () => {
  return (
      <Routes>
        <Route path="/home" element={<PrivateRoute element={<Home />} />} />
        <Route path="/map" element={<PrivateRoute element={<MapPage />} />} />
       
          <Route path="/address" element={
             <UserProtectedWrapper >
            <DeliveryAddress />
            </UserProtectedWrapper>
            } />

        <Route path="/" element={<SignUp />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/location" element={<LocationPage />} />
      </Routes>
  );
};

export default App;
