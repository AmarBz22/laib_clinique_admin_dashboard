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
import AddAppointmentPage from './pages/AddAppointmen';
import CourseStaticPage from './pages/courseStaticPage';

function App() {
  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={
            <RequireAuth allowedRoles={['admin', 'recepsionist']}>
              <Layout>
                <Home />
              </Layout>
            </RequireAuth>
          }
        />
        <Route path="/login" element={<Login />} />
        <Route
          path="/appointments"
          element={
            <RequireAuth allowedRoles={['admin', 'recepsionist']}>
              <Layout>
                <AppointmentPage />
              </Layout>
            </RequireAuth>
          }
        />
        <Route
          path="/orders"
          element={
            <RequireAuth allowedRoles={['admin', 'recepsionist']}>
              <Layout>
                <OrderPage />
              </Layout>
            </RequireAuth>
          }
        />
        <Route
          path="/courses"
          element={
            <RequireAuth allowedRoles={['admin', 'recepsionist']}>
              <Layout>
                <CoursesPage />
              </Layout>
            </RequireAuth>
          }
        />
        <Route
          path="/statistics"
          element={
            <RequireAuth allowedRoles={['admin']}>
              <Layout>
                <StatisticsPage />
              </Layout>
            </RequireAuth>
          }
        />
        <Route
          path="/statistics/courseStatics"
          element={
            <RequireAuth allowedRoles={['admin']}>
              <Layout>
                <CourseStaticPage />
              </Layout>
            </RequireAuth>
          }
        />
        <Route
          path="/courses/addCourse"
          element={
            <RequireAuth allowedRoles={['admin', 'recepsionist']}>
              <Layout>
                <AddCourse />
              </Layout>
            </RequireAuth>
          }
        />
        <Route
          path="/courses/edit/:courseId"
          element={
            <RequireAuth allowedRoles={['admin', 'recepsionist']}>
              <Layout>
                <EditCourse />
              </Layout>
            </RequireAuth>
          }
        />
        <Route
          path="/appointments/:appointmentId"
          element={
            <RequireAuth allowedRoles={['admin', 'recepsionist']}>
              <Layout>
                <AppointmentInformationPage />
              </Layout>
            </RequireAuth>
          }
        />
        <Route
        path="/appointments/addAppointment"
        element={
          <RequireAuth allowedRoles={['admin', 'recepsionist']}>
            <Layout>
              <AddAppointmentPage />
            </Layout>
          </RequireAuth>
        }
      />
        <Route
          path="/orders/:orderId"
          element={
            <RequireAuth allowedRoles={['admin', 'recepsionist']}>
              <Layout>
                <OrderInformationPage />
              </Layout>
            </RequireAuth>
          }
        />
        <Route
          path="/courses/:courseId"
          element={
            <RequireAuth allowedRoles={['admin', 'recepsionist']}>
              <Layout>
                <CourseInformationPage />
              </Layout>
            </RequireAuth>
          }
        />
        <Route
          path="/products"
          element={
            <RequireAuth allowedRoles={['admin', 'recepsionist']}>
              <Layout>
                <ProductPage />
              </Layout>
            </RequireAuth>
          }
        />
        <Route
          path="/products/addProduct"
          element={
            <RequireAuth allowedRoles={['admin', 'recepsionist']}>
              <Layout>
                <AddProduct />
              </Layout>
            </RequireAuth>
          }
        />
        <Route
          path="/products/:productId"
          element={
            <RequireAuth allowedRoles={['admin', 'recepsionist']}>
              <Layout>
                <ProductInformationPage />
              </Layout>
            </RequireAuth>
          }
        />
        <Route
          path="/products/edit/:productId"
          element={
            <RequireAuth allowedRoles={['admin', 'recepsionist']}>
              <Layout>
                <EditProduct />
              </Layout>
            </RequireAuth>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
