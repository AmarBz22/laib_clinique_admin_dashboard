import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import Home from './pages/HomePage';
import AppointmentPage from './pages/AppointmentPage';
import OrderPage from './pages/OrderPage';
import CoursesPage from './pages/CoursesPage';
import StatisticsPage from './pages/StatisticsPage';
import AppointmentInformationPage from './pages/AppointmentInformationPage'; // New import
import OrderInformationPage from './pages/OrderInformationPage'; // New import
import Layout from './Layout';
import Login from './pages/Login';
import RequireAuth from './components/RequireAuth';
import AddCourse from './pages/AddCourse';
import { SidebarProvider, useSidebar } from './SidebarContext';

function App() {
  return (
    <SidebarProvider>
      <Router>
        <AppContent />
      </Router>
    </SidebarProvider>
  );
}

const AppContent = () => {
  const { isSidebarOpen } = useSidebar(); 

  return (
    <div className={`${isSidebarOpen ? "responsive-div ml-auto" : "w-full"}`}>
      <Routes>
        <Route path="/" element={<RequireAuth><Layout><Home /></Layout></RequireAuth>} />
        <Route path="/login" element={<Login />} />
        <Route path="/appointments" element={<RequireAuth><Layout><AppointmentPage /></Layout></RequireAuth>} />
        <Route path="/orders" element={<RequireAuth><Layout><OrderPage /></Layout></RequireAuth>} />
        <Route path="/courses" element={<RequireAuth><Layout><CoursesPage /></Layout></RequireAuth>} />
        <Route path="/statistics" element={<RequireAuth><Layout><StatisticsPage /></Layout></RequireAuth>} />
        <Route path="/courses/addCourse" element={<RequireAuth><Layout><AddCourse /></Layout></RequireAuth>} />
        <Route path="/appointments/:appointmentId" element={<RequireAuth><Layout><AppointmentInformationPage /></Layout></RequireAuth>} />
        <Route path="/orders/:orderId" element={<RequireAuth><Layout><OrderInformationPage /></Layout></RequireAuth>} />
      </Routes>
    </div>
  );
}

export default App;
