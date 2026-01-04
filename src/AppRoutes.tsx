import { lazy, Suspense } from "react";
import { Route, Routes } from "react-router-dom";
import "./App.css";
import Loader from "../src/component/PortfolioLoader/Loader";

const Layout = lazy(() => import("./component/Layout/Layout"));
const Home = lazy(() => import("./pages/Home/Home"));
const About = lazy(() => import("./pages/About/About"));
const Contact = lazy(() => import("./pages/ContactForm/Contact"));
const Resume = lazy(() => import("./pages/Resume/Resume"));
const Work = lazy(() => import("./pages/Works/Work"));
const Recruiters = lazy(() => import("./pages/Recruiters/Recruiters.tsx"));


function AppRoutes() {
  return (
    <Routes>
      <Route
        path="/"
        element={
          <Suspense fallback={<Loader />}>
            <Layout />
          </Suspense>
        }
      >
        <Route
          path="/recruiters"
          element={
            <Suspense fallback={<Loader />}>
              <Recruiters />
            </Suspense>
          }
        />
        <Route
          index
          element={
            <Suspense fallback={<Loader />}>
              <Home />
            </Suspense>
          }
        />
        <Route
          path="/About"
          element={
            <Suspense fallback={<Loader />}>
              <About />
            </Suspense>
          }
        />
        <Route
          path="/Contact"
          element={
            <Suspense fallback={<Loader />}>
              <Contact />
            </Suspense>
          }
        />
        <Route
          path="/Resume"
          element={
            <Suspense fallback={<Loader />}>
              <Resume />
            </Suspense>
          }
        />
        <Route
          path="/Work"
          element={
            <Suspense fallback={<Loader />}>
              <Work />
            </Suspense>
          }
        />
      </Route>

    </Routes>
  );
}

export default AppRoutes;
