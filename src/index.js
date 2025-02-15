import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import reportWebVitals from './reportWebVitals';
import TestPage from '../src/components/TestPage';
import Preferences from './components/preferences/Preferences';
import Instruments from './components/instruments/Instruments';
import Contacts from './components/contacts/Contacts';
import Charts from "./components/charts/Charts"
import './index.css';
// import { isAutorize } from './components/header/Header';


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    // <React.StrictMode>
      <Router>
        <Routes>
          <Route path="/main" element={<React.StrictMode><TestPage /></React.StrictMode>}  />
          <Route path="/" element={<TestPage />} />
          <Route path="/charts" element={<Charts />} />
          <Route path="/instruments" element={<Instruments />} />
          <Route path="/preferences" element={<Preferences />} />
          <Route path="/contacts" element={<Contacts />} />
          <Route path="*" element={<Navigate to="/main" />} />
        </Routes>
      </Router>
    // </React.StrictMode>
);

reportWebVitals();
