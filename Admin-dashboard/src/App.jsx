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
import CourseInformationPage from './pages/CourseInformationPage';
import EditCourse from './pages/EditCourse';
import ProductPage from './pages/ProductPage';
import AddProduct from './pages/AddProduct';
import ProductInformationPage from './pages/ProuductInformationPage';
import EditProduct from './pages/EditProduct';


function App() {
  

  return (
    <Router>
        {/* <Layout> Wrap the layout around all routes */}
        <Routes>
          <Route path="/" element={<RequireAuth><Layout><Home /></Layout></RequireAuth>} />
          <Route path="/login" element={<Login />} />
          <Route path="/appointments" element={<RequireAuth><Layout><AppointmentPage /></Layout></RequireAuth>} />
          <Route path="/orders" element={<RequireAuth><Layout><OrderPage /></Layout></RequireAuth>} />
          <Route path="/courses" element={<RequireAuth><Layout><CoursesPage /></Layout></RequireAuth>} />
          <Route path="/statistics" element={<RequireAuth><Layout><StatisticsPage /></Layout></RequireAuth>} />
          <Route path="/courses/addCourse" element={<RequireAuth><Layout><AddCourse /></Layout></RequireAuth>} />
          <Route path="/courses/edit/:courseId" element={<RequireAuth><Layout><EditCourse /></Layout></RequireAuth>} />

          <Route path="/appointments/:appointmentId" element={<RequireAuth><Layout><AppointmentInformationPage /></Layout></RequireAuth>} /> {/* Dynamic route */}
          <Route path="/orders/:orderId" element={<RequireAuth><Layout><OrderInformationPage /></Layout></RequireAuth>} /> {/* Dynamic route */}
          <Route path="/courses/:courseId" element={<RequireAuth><Layout><CourseInformationPage /></Layout></RequireAuth>} />
          <Route path="/products" element={<RequireAuth><Layout><ProductPage /></Layout></RequireAuth>} />
          <Route path="/products/addProduct" element={<RequireAuth><Layout><AddProduct /></Layout></RequireAuth>} />
          <Route path="/products/:productId" element={<RequireAuth><Layout><ProductInformationPage /></Layout></RequireAuth>} />
          <Route path="/products/edit/:productId" element={<RequireAuth><Layout><EditProduct /></Layout></RequireAuth>} />




        </Routes>
      {/* </Layout> */}
    </Router>
  );
}

export default App;
