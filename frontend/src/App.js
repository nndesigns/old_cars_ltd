import React, {
  useState,
  useEffect,
  useRef,
  useMemo,
  useCallback,
} from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  useLocation,
} from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import _ from "lodash";
import { getInventory } from "./components/axiosCalls.js";
import { getLocationFromBrowser, setLocalInv } from "./user/locationSlice";
import ScrollToTopButton from "./components/scrollToTopBtn.js";
import { getLocalOffers, ScrollToTop } from "./components/utils.js";
import Header from "./components/header.js";
import BottomNav from "./components/bottom_nav/bottom_nav.js";
import ThumbNav from "./components/bottom_nav/ThumbNav.js";
//ROUTES
import Home from "./pages/home.js";
import Favorites from "./pages/favorites.js";
import Cars from "./pages/cars.js";
import VehiclePage from "./pages/vehiclePage.js";
import Compare from "./pages/compare.js";

import Footer from "./components/footer.js";
import "./index.css";
import { saveFilter } from "./user/filtersSlice";

import { AnimatePresence, motion } from "framer-motion";

// ----------------- CONSTANTS -----------------
const defaultFilterState = {
  sort: "Best match",
  dist_radius: null, //DISTANCE FILTER
  veh_locations: [], //DISTANCE FILTER
  minPrice: null,
  maxPrice: null,
  makes: [],
  models: {},
  styles: [],
  yearFrom: null,
  yearTo: null,
  mileage: null,
  fuelType: null,
  features: null,
  carSize: null,
  doors: null,
  exteriorColor: null,
  interiorColor: null,
  drivetrain: null,
  transmission: null,
  cylinders: null,
  MPGHwy: null,
  vin: null,
};

/// TRANSITION (Framer-Motion)
const PageTransition = ({ children, style }) => (
  <motion.div
    initial={{ opacity: 0, y: 30 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -30 }}
    transition={{ duration: 0.8 }}
    style={style}
  >
    {children}
  </motion.div>
);

const FadeTransition = ({ children, style }) => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    transition={{ duration: 0.8 }}
    style={style}
  >
    {children}
  </motion.div>
);

// ----------------- PAGE WRAPPER -----------------
const PageWrapper = function PageWrapper({
  children,
  inv,
  setValue,
  value,
  showBottomNav,
  setAppliedFilters,
  setOrderedFilters,
  handleClearFilters,
  setPreventScroll,
  location,
}) {
  const thumbNavRef = useRef(null);
  const bottomNavRef = useRef(null);
  // const location = useLocation();

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
    [location.pathname]
  );

  // console.log("location.pathname", location.pathname);
  console.log("currentRoute", currentRoute);
  const backgroundGradient = `
  linear-gradient(
    to bottom,
    rgba(9, 30, 48, 1) 0%,
    rgba(9, 30, 48, 0) 10%
  )
`;

  return (
    <div
      className="app_root"
      style={{ background: !currentRoute.length ? backgroundGradient : "" }}
    >
      {currentRoute !== "compare" && (
        // <PageTransition key={location.pathname}>
        <Header
          currentRoute={!currentRoute.length ? "home" : currentRoute}
          inv={inv}
          setAppliedFilters={setAppliedFilters}
          setOrderedFilters={setOrderedFilters}
          handleClearFilters={handleClearFilters}
          setPreventScroll={setPreventScroll}
          PageTransition={PageTransition}
        />
        // </PageTransition>
      )}
      {children}
      <Footer inv={inv} /> {/* WHY DOES FOOTER NEED INV */}
      {showBottomNav && (
        <BottomNav ref={bottomNavRef} value={value} setValue={setValue} />
      )}
      {showBottomNav && (
        <ThumbNav ref={thumbNavRef} navItem={value} setValue={setValue} />
      )}
    </div>
  );
};

// ----------------- MAIN APP -----------------
function App() {
  const dispatch = useDispatch();
  const reduxSavedFilters = useSelector(
    (state) => state.filters.appliedFilters || {}
  );
  console.log("App.js just re-rendered!!!");

  const loc = useLocation();
  //FOR DISABLING APP SCROLL WHILE MODALS OPEN
  // const [showMobileFilterPanel, setShowMobileFilterPanel] = useState(false);
  const [preventScroll, setPreventScroll] = useState(false);

  const location = useSelector((state) => state.location);
  const heartedCars = useSelector((state) => state.favorites.heartedCars);

  //APPLIED FILTERS
  const [appliedFilters, setAppliedFilters] = useState(
    Object.keys(reduxSavedFilters).length > 0
      ? reduxSavedFilters
      : defaultFilterState
  );
  //ORDERED FILTERS
  const [orderedFilters, setOrderedFilters] = useState(() => {
    const stored = localStorage.getItem("orderedFilters"); ///runs on mount only
    return stored ? JSON.parse(stored) : [];
  });
  const [value, setValue] = useState(null);
  const [showBottomNav, setShowBottomNav] = useState(window.innerWidth < 768);
  const [below820, setBelow820] = useState(window.innerWidth < 820);
  const [above375, setAbove375] = useState(window.innerWidth > 375);
  const [inventory, setInventory] = useState([]);
  //COMPARE CARS
  const [compareCars, setCompareCars] = useState(() => {
    const saved = localStorage.getItem("compareCars");
    return saved ? JSON.parse(saved) : [];
  });
  //CHOSEN CARS (displayed in Compare)
  // const [chosenCars, setChosenCars] = useState([]);
  const [chosenCars, setChosenCars] = useState(() => {
    const saved = localStorage.getItem("chosenCars");
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem("compareCars", JSON.stringify(compareCars));
    localStorage.setItem("chosenCars", JSON.stringify(chosenCars));
    // console.log("compareCars (app.js)", compareCars);
    // console.log("chosenCars (app.js)", chosenCars);

    if (compareCars.length >= 2 && !chosenCars.length) {
      setChosenCars([compareCars[0], compareCars[1]]);
    } else if (compareCars.length >= 2 && chosenCars.length === 1) {
      //if use ralready went into 'Compare' (setting 'chosenCars'), then came back to ComparePanel and removed one of the 'chosenCars' objects from the 'handleRemove' of the ComparePanel, resulting in there only being 1 'chosenCars' object
      const existing = chosenCars[0];
      //auto-append that single chosenCar obj with another 'compareCar' obj whose .id differs from the remainig 'chosenCars' obj
      const nextCar = compareCars.find((car) => car.id !== existing.id);

      if (nextCar) {
        console.log("this part here ran");
        setChosenCars([existing, nextCar]);
      }
    }
  }, [compareCars, chosenCars]);

  // ✅ Moved handleClearFilters here so it can be shared
  const handleClearFilters = useCallback(() => {
    const { sort, ...filtersWithoutSort } = defaultFilterState;
    setAppliedFilters({ sort: appliedFilters.sort, ...filtersWithoutSort });
    setOrderedFilters([]);
  }, [appliedFilters.sort, setAppliedFilters, setOrderedFilters]);

  // SAVE ORDERED FILTERS TO LOCAL STORAGE
  useEffect(() => {
    localStorage.setItem("orderedFilters", JSON.stringify(orderedFilters));
  }, [orderedFilters]);

  // Save applied filters to Redux
  useEffect(() => {
    console.log("latest appliedFilters", appliedFilters);
    dispatch(saveFilter(appliedFilters));
  }, [appliedFilters, dispatch]);

  //RESIZE HANDLER
  useEffect(() => {
    let timeout;
    const handleResize = () => {
      clearTimeout(timeout);
      timeout = setTimeout(() => {
        setShowBottomNav(window.innerWidth < 768);
        if (window.innerWidth > 768) setValue(null);
        setAbove375(window.innerWidth > 375);
        setBelow820(window.innerWidth < 820);
      }, 150);
    };
    window.addEventListener("resize", handleResize);
    return () => {
      clearTimeout(timeout);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  // FETCH INVENTORY
  useEffect(() => {
    if (inventory.length > 0) return;
    (async () => {
      try {
        const fetchedInventory = await getInventory();
        setInventory(fetchedInventory);
      } catch (err) {
        console.error("Error loading inventory:", err);
      }
    })();
  }, [inventory.length]);

  // GET USER LOCATION
  useEffect(() => {
    // check if redux location obj has location values
    const isLocationValid =
      location &&
      location.zip &&
      location.city &&
      location.state &&
      location.latitude &&
      location.longitude;
    if (!isLocationValid) {
      // get user location
      dispatch(getLocationFromBrowser());
    }
  }, [dispatch, location]);

  // MEMOIZED FILTERED INVENTORY
  const activeInv = useMemo(
    () => inventory.filter((car) => car.status),
    [inventory]
  );

  const localInventory = useMemo(() => {
    if (!location) return [];
    return getLocalOffers(activeInv, location, 100, false);
  }, [activeInv, location]);

  // DISABLE SCROLLING IN /CARS WHEN

  useEffect(() => {
    console.log("preventScroll", preventScroll);
    if (preventScroll) {
      const scrollY = window.scrollY;
      document.body.style.position = "fixed";
      document.body.style.top = `-${scrollY}px`;
      document.body.style.width = "100%";
    } else {
      const scrollY = parseInt(document.body.style.top || "0") * -1;
      document.body.style.position = "";
      document.body.style.top = "";
      window.scrollTo(0, scrollY);
    }
  }, [preventScroll]);

  // Update Redux with local inventory (location.localInv)
  useEffect(() => {
    if (!location || inventory.length === 0) return;
    if (!_.isEqual(location.localInv, localInventory)) {
      dispatch(setLocalInv(localInventory));
    }
  }, [localInventory, location, inventory.length, dispatch]);

  // CARS PROPS
  const carsProps = useMemo(
    () => ({
      location,
      inventory,
      below820,
      above375,
      defaultFilterState,
      appliedFilters,
      setAppliedFilters,
      orderedFilters,
      setOrderedFilters,
      compareCars, /// NEW
      setCompareCars, ////NEW
      chosenCars,
      setChosenCars,
      // showMobileFilterPanel,
      // setShowMobileFilterPanel,
      setPreventScroll,
    }),
    [
      inventory,
      location,
      below820,
      above375,
      appliedFilters,
      orderedFilters,
      compareCars,
      chosenCars,
      // showMobileFilterPanel,
    ]
  );
  //HOME PROPS
  const homeProps = useMemo(
    () => ({
      inventory,
      location,
      appliedFilters,
      handleClearFilters, // for makeModelSearch() Picker/Carousels
      setOrderedFilters,
      setAppliedFilters,
    }),
    [inventory, location, appliedFilters, handleClearFilters]
  );

  return (
    //<Router>
    <AnimatePresence mode="wait">
      {/* <PageTransition> */}
      <PageWrapper
        // key={location.pathname}
        inv={inventory}
        setValue={setValue}
        value={value}
        showBottomNav={showBottomNav}
        appliedFilters={appliedFilters}
        setAppliedFilters={setAppliedFilters}
        setOrderedFilters={setOrderedFilters}
        handleClearFilters={handleClearFilters} // Header
        setPreventScroll={setPreventScroll}
        location={/* location */ loc}
      >
        <ScrollToTop />
        <ScrollToTopButton />

        <Routes location={loc} key={loc.pathname}>
          <Route
            // path="/"
            index
            element={
              // <PageTransition>
              <Home
                {...homeProps}
                PageTransition={PageTransition}
                FadeTransition={FadeTransition}
              />
              //</PageTransition>
            }
          />

          <Route
            path="/favorites/*"
            element={
              <PageTransition>
                <Favorites hearted_cars={heartedCars} location={location} />
              </PageTransition>
            }
          />

          <Route
            path="/cars/*"
            element={
              <PageTransition>
                <Cars {...carsProps} />
              </PageTransition>
            }
          />

          <Route
            path="/car/:id"
            element={
              <PageTransition>
                <VehiclePage inventory={inventory} />
              </PageTransition>
            }
          />

          <Route
            path="/compare"
            element={
              <PageTransition>
                <Compare
                  compareCars={compareCars}
                  setCompareCars={setCompareCars}
                  location={location}
                  inventory={inventory}
                  chosenCars={chosenCars}
                  setChosenCars={setChosenCars}
                  setPreventScroll={setPreventScroll}
                />
              </PageTransition>
            }
          />
        </Routes>
      </PageWrapper>
      {/* </PageTransition> */}
    </AnimatePresence>
    //</Router>
  );
}

export default App;
