import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";

import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Layout2D from "./pages/Layout2D";
import MyDesigns from "./pages/MyDesigns";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import About from "./pages/AboutUs";
import Contact from "./pages/ContactUs";

// Wrapper component to conditionally show Navbar and Footer
function Layout({ children, user, setUser, showNavbar = true, showFooter = true }) {
  const location = useLocation();
  
  // Pages that should NOT show navbar
  const noNavbarPaths = ["/login", "/register"];
  const noFooterPaths = ["/login", "/register", "/designer"];
  
  const shouldShowNavbar = showNavbar && !noNavbarPaths.includes(location.pathname) && !location.pathname.startsWith("/designer");
  const shouldShowFooter = showFooter && !noFooterPaths.includes(location.pathname) && !location.pathname.startsWith("/designer");

  return (
    <>
      {shouldShowNavbar && <Navbar user={user} setUser={setUser} />}
      {children}
      {shouldShowFooter && <Footer />}
    </>
  );
}

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Check if user is logged in
    const token = localStorage.getItem("token");
    const userData = localStorage.getItem("user");
    if (token && userData) {
      setUser(JSON.parse(userData));
    }
  }, []);

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            <Layout user={user} setUser={setUser}>
              <Landing />
            </Layout>
          }
        />

        <Route
          path="/login"
          element={
            <Layout user={user} setUser={setUser} showNavbar={false} showFooter={false}>
              <Login />
            </Layout>
          }
        />

        <Route
          path="/register"
          element={
            <Layout user={user} setUser={setUser} showNavbar={false} showFooter={false}>
              <Register />
            </Layout>
          }
        />

        <Route
          path="/designs"
          element={
            <Layout user={user} setUser={setUser}>
              <MyDesigns />
            </Layout>
          }
        />

        <Route
          path="/designer"
          element={
            <Layout user={user} setUser={setUser} showNavbar={false} showFooter={false}>
              <Layout2D />
            </Layout>
          }
        />

        <Route
          path="/designer/:id"
          element={
            <Layout user={user} setUser={setUser} showNavbar={false} showFooter={false}>
              <Layout2D />
            </Layout>
          }
        />

        <Route
          path="/about"
          element={
            <Layout user={user} setUser={setUser}>
              <About />
            </Layout>
          }
        />

        <Route
          path="/contact"
          element={
            <Layout user={user} setUser={setUser}>
              <Contact />
            </Layout>
          }
        />

        
      </Routes>
    </BrowserRouter>
  );
}

export default App;