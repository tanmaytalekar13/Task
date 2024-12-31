import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';
import { BrowserRouter } from 'react-router-dom';
import LocationContext from './context/LocationContext.jsx'; // Make sure to import LocationContext correctly
createRoot(document.getElementById('root')).render(
      <LocationContext>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </LocationContext>
);
