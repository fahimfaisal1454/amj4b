// src/Routes/Routes.jsx
import { createBrowserRouter, Navigate } from "react-router-dom";

import Main from "../Layout/Main";
import ErrorPage from "../Pages/ErrorPage/ErrorPage";
import Home from "../Pages/Home/Home";
import About from "../Pages/AboutUs/AboutUs";


import BannersAdmin from "../Dashboard/BannersAdmin";
// import ProgramsAdmin from "../Dashboard/ProgramsAdmin";
import ImpactsAdmin from "../Dashboard/ImpactsAdmin";
import StoriesAdmin from "../Dashboard/StoriesAdmin";
import NewsAdmin from "../Dashboard/NewsAdmin";
import ContactsAdmin from "../Dashboard/ContactsAdmin";
import ProjectsAdmin from "../Dashboard/ProjectsAdmin";
import DashboardLayout from "../Dashboard/DashboardLayout";
import AboutAdmin from "../Dashboard/AboutAdmin";
import ContactInfoAdmin from "../Dashboard/ContactInfoAdmin"; 
import Login from "../Dashboard/Login";

function PrivateRoute({ children }) {
  const token = localStorage.getItem("token");
  return token ? children : <Navigate to="/login" replace />;
}

function DashboardHome() {
  return (
    <div className="space-y-1">
      <h1 className="text-xl font-bold">Admin Dashboard</h1>
      <p className="text-gray-600 text-sm">Use the sidebar to manage content.</p>
    </div>
  );
}

export const router = createBrowserRouter([
  // PUBLIC
  {
    path: "/",
    element: <Main />,
    errorElement: <ErrorPage />,
    children: [
      { index: true, element: <Home /> },
      { path: "about", element: <About /> },
    ],
  },

  // LOGIN (public)
  { path: "/login", element: <Login /> },

  // DASHBOARD (protected)
  {
    path: "/dashboard",
    element: (
      <PrivateRoute>
        <DashboardLayout />
      </PrivateRoute>
    ),
    children: [
      { index: true, element: <DashboardHome /> },
      { path: "about", element: <AboutAdmin /> },
   
    { path: "about", element: <AboutAdmin /> },
    { path: "banners", element: <BannersAdmin /> },
    { path: "projects", element: <ProjectsAdmin/> },
    { path: "impacts", element: <ImpactsAdmin /> },
    { path: "stories", element: <StoriesAdmin /> },
    { path: "news", element: <NewsAdmin /> },
    { path: "contacts", element: <ContactsAdmin /> },
    { path: "contact-info", element: <ContactInfoAdmin /> }
    ],
  },
]);
