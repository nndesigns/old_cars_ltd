import React, { useState, useEffect, useRef, useMemo } from "react";

import axios from "axios";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  useLocation,
} from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { getLocationFromBrowser, setLocalInv } from "./user/locationSlice";
import { getOffers, ScrollToTop } from "./components/utils.js";
import Header from "./components/header.js";
import BottomNav from "./components/bottom_nav/bottom_nav.js";
import ThumbNav from "./components/bottom_nav/ThumbNav.js";
import Home from "./pages/home.js";
import Favorites from "./pages/favorites.js";
import Cars from "./pages/cars.js";
import VehiclePage from "./pages/vehiclePage.js";
import _ from "lodash";
import Footer from "./components/footer.js";
import "./index.css";
import { saveFilter } from "./user/filtersSlice";

//PAGEWRAPPER
function PageWrapper({ children, inv, setValue, value, showBottomNav }) {
  const thumbNavRef = useRef(null);
  const bottomNavRef = useRef(null);
  const location = useLocation();

  useEffect(() => {
    if (value != null) {
      const handleClickOutside = (event) => {
        if (
          thumbNavRef.current &&
          !thumbNavRef.current.contains(event.target) &&
          !bottomNavRef.current.contains(event.target)
        ) {
          setValue(null);
        }
      };
      document.addEventListener("click", handleClickOutside);
      return () => document.removeEventListener("click", handleClickOutside);
    }
  }, [value, setValue]);

  const currentRoute = useMemo(
    () => location.pathname.split("/")[1],
    [location]
  );

  return (
    <div className="app_root">
      <Header currentRoute={currentRoute} inv={inv} />
      {children}
      <Footer inv={inv} />
      {showBottomNav && (
        <BottomNav ref={bottomNavRef} value={value} setValue={setValue} />
      )}
      {showBottomNav && (
        <ThumbNav ref={thumbNavRef} navItem={value} setValue={setValue} />
      )}
    </div>
  );
}

function App() {
  const dispatch = useDispatch();
  //REDUX STATES
  //REDUX SAVED FILTERS (SETTING APPLIED FILTERS)
  // DEFAULT FILTER STATE
  const reduxSavedFilters = useSelector(
    (state) => state.filters.appliedFilters || {}
  );
  const defaultFilterState = {
    sort: "Best match",
    minPrice: null,
    maxPrice: null,
    makes: [],
    models: {},
    styles: [],

    yearFrom: null,
    yearTo: null,
    mileage: null, //or less
    fuelType: null,
    features: null,
    carSize: null,
    doors: null,
    exteriorColor: null,
    interiorColor: null,
    drivetrain: null,
    transmission: null,
    cylinders: null,
    MPGHwy: null, //or more
  };
  //////// APPLIED FILTERS
  /*   const sanitizedReduxFilters = { ...reduxSavedFilters };
  delete sanitizedReduxFilters.bodyType; */

  const [appliedFilters, setAppliedFilters] = useState(
    Object.keys(reduxSavedFilters).length > 0
      ? reduxSavedFilters
      : defaultFilterState
  );
  ///////// ORDERED FILTERS USESTATE
  const [orderedFilters, setOrderedFilters] = useState([]);
  useEffect(() => {
    if (orderedFilters.length > 0) {
      localStorage.setItem("orderedFilters", JSON.stringify(orderedFilters));
    }
  }, [orderedFilters]);

  useEffect(() => {
    const stored = localStorage.getItem("orderedFilters");
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        // optionally validate it's an array of strings that are keys in appliedFilters
        setOrderedFilters(parsed);
      } catch (e) {
        console.error("Failed to parse orderedFilters:", e);
      }
    }
  }, []);

  //SAVE CHANGES TO  APPLIED FILTERS TO REDUX STATE
  useEffect(() => {
    dispatch(saveFilter(appliedFilters));
  }, [appliedFilters, dispatch]);

  const location = useSelector((state) => state.location);
  const heartedCars = useSelector((state) => state.favorites.heartedCars);

  const [value, setValue] = useState(null);
  const [showBottomNav, setShowBottomNav] = useState(window.innerWidth < 768);
  //For <CARS/> (.left_panel & <CarsToolbar/>)
  const [below820, setBelow820] = useState(window.innerWidth < 820);
  const [above375, setAbove375] = useState(window.innerWidth > 375);
  const [inventory, setInventory] = useState([]);
  // const entireState = useSelector((state) => state);

  useEffect(() => {
    const handleResize = () => {
      setShowBottomNav(window.innerWidth < 768);
      if (window.innerWidth > 768) setValue(null);
      setAbove375(window.innerWidth > 375);
      setBelow820(window.innerWidth < 820);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Only dispatch location fetch once on mount
  useEffect(() => {
    if (inventory.length > 0) return;
    //if no invenotry
    const fetchInventory = async () => {
      try {
        const response = await axios.get("http://localhost:5001/api/inventory");
        if (!_.isEqual(inventory, response.data)) {
          setInventory(response.data);
        }
      } catch (err) {
        console.error("Error fetching inventory:", err);
      }
    };

    fetchInventory();
  }, [inventory]);

  //GET USER LOCATION, SAVE TO REDUX
  useEffect(() => {
    const isLocationValid =
      location &&
      location.zip &&
      location.city &&
      location.state &&
      location.latitude &&
      location.longitude;

    if (!isLocationValid) {
      dispatch(getLocationFromBrowser());
    }
  }, [dispatch, location]);

  //LISTEN FOR REDUX STATE.LOCATION,
  // SAVE ACTIVE INV W/IN 100mi OF LOC TO REDUX
  useEffect(() => {
    if (!location || inventory.length === 0) return;

    const activeInv = inventory.filter((car) => car.status);
    //FILTER INV BY USER LOCATION (REDUX)
    const localInventory = getOffers(activeInv, location, 100, false);
    //SET LOC-FILTERED INV TO 'localInv' IN LOCATION (REDUX)
    if (!_.isEqual(location.localInv, localInventory)) {
      dispatch(setLocalInv(localInventory)); //set the redux state.location.localInv array  /obj's spec to location (running 'getOffers' here)
    }
  }, [inventory, location, dispatch]);

  return (
    <Router>
      <PageWrapper
        inv={inventory.filter((car) => car.status)}
        setValue={setValue}
        value={value}
        showBottomNav={showBottomNav}
      >
        <ScrollToTop />
        <Routes>
          <Route
            path="/*"
            element={
              <Home
                inventory={inventory}
                location={location}
                appliedFilters={appliedFilters}
                setOrderedFilters={setOrderedFilters}
                setAppliedFilters={setAppliedFilters}
              />
            }
          />
          <Route
            path="/favorites/*"
            element={<Favorites hearted_cars={heartedCars} />}
          />
          <Route
            path="/cars/*"
            element={
              <Cars
                inventory={inventory}
                below820={below820}
                above375={above375}
                defaultFilterState={defaultFilterState}
                appliedFilters={appliedFilters}
                setAppliedFilters={setAppliedFilters}
                orderedFilters={orderedFilters}
                setOrderedFilters={setOrderedFilters}
              />
            }
          />
          <Route
            path="/car/:id"
            element={<VehiclePage inventory={inventory} />}
          />
        </Routes>
      </PageWrapper>
    </Router>
  );
}

export default App;
