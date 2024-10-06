import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import SideBar from './components/SideBar';
import Header from './components/Header';
import Home from './pages/HomePage';
import AppointmentPage from './pages/AppointmentPage';
import OrderPage from './pages/OrderPage';
import CoursesPage from './pages/CoursesPage';
import StatisticsPage from './pages/StatisticsPage';
import AppointmentInformationPage from './pages/AppointmentInformationPage'; // New import
import OrderInformationPage from './pages/OrderInformationPage'; // New import
import Layout from './Layout';


function App() {
  

  return (
    <Router>
        <Layout> {/* Wrap the layout around all routes */}
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/appointments" element={<AppointmentPage />} />
          <Route path="/orders" element={<OrderPage />} />
          <Route path="/courses" element={<CoursesPage />} />
          <Route path="/statistics" element={<StatisticsPage />} />
          <Route path="/appointments/:appointmentId" element={<AppointmentInformationPage />} /> {/* Dynamic route */}
          <Route path="/orders/:orderId" element={<OrderInformationPage />} /> {/* Dynamic route */}
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
