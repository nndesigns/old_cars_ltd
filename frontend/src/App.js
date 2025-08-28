// import React, {
//   useState,
//   useEffect,
//   useRef,
//   useMemo,
//   useCallback,
// } from "react";
// import {
//   BrowserRouter as Router,
//   Route,
//   Routes,
//   useLocation,
// } from "react-router-dom";
// import { useSelector, useDispatch } from "react-redux";
// import _ from "lodash";
// import { getInventory } from "./components/axiosCalls.js";
// import { getLocationFromBrowser, setLocalInv } from "./user/locationSlice";
// import { getOffers, ScrollToTop } from "./components/utils.js";
// import Header from "./components/header.js";
// import BottomNav from "./components/bottom_nav/bottom_nav.js";
// import ThumbNav from "./components/bottom_nav/ThumbNav.js";
// import Home from "./pages/home.js";
// import Favorites from "./pages/favorites.js";
// import Cars from "./pages/cars.js";
// import VehiclePage from "./pages/vehiclePage.js";
// import Footer from "./components/footer.js";
// import "./index.css";
// import { saveFilter } from "./user/filtersSlice";

// // ----------------- CONSTANTS -----------------
// const defaultFilterState = {
//   sort: "Best match",
//   minPrice: null,
//   maxPrice: null,
//   makes: [],
//   models: {},
//   styles: [],
//   yearFrom: null,
//   yearTo: null,
//   mileage: null,
//   fuelType: null,
//   features: null,
//   carSize: null,
//   doors: null,
//   exteriorColor: null,
//   interiorColor: null,
//   drivetrain: null,
//   transmission: null,
//   cylinders: null,
//   MPGHwy: null,
// };

// // ----------------- PAGE WRAPPER -----------------
// const PageWrapper = React.memo(function PageWrapper({
//   children,
//   inv,
//   setValue,
//   value,
//   showBottomNav,
//   appliedFilters,
//   setAppliedFilters,
//   setOrderedFilters,
//   defaultFilterState,
// }) {
//   const thumbNavRef = useRef(null);
//   const bottomNavRef = useRef(null);
//   const location = useLocation();

//   const handleClearFilters = useCallback(() => {
//     const { sort, ...filtersWithoutSort } = defaultFilterState;
//     setAppliedFilters({ sort: appliedFilters.sort, ...filtersWithoutSort });
//     setOrderedFilters([]);
//   }, [
//     appliedFilters.sort,
//     defaultFilterState,
//     setAppliedFilters,
//     setOrderedFilters,
//   ]);

//   useEffect(() => {
//     if (value != null) {
//       const handleClickOutside = (event) => {
//         if (
//           thumbNavRef.current &&
//           !thumbNavRef.current.contains(event.target) &&
//           !bottomNavRef.current.contains(event.target)
//         ) {
//           setValue(null);
//         }
//       };
//       document.addEventListener("click", handleClickOutside);
//       return () => document.removeEventListener("click", handleClickOutside);
//     }
//   }, [value, setValue]);

//   const currentRoute = useMemo(
//     () => location.pathname.split("/")[1],
//     [location.pathname]
//   );

//   return (
//     <div className="app_root">
//       <Header
//         currentRoute={currentRoute}
//         inv={inv}
//         setAppliedFilters={setAppliedFilters}
//         setOrderedFilters={setOrderedFilters}
//         handleClearFilters={handleClearFilters}
//       />
//       {children}
//       <Footer inv={inv} />
//       {showBottomNav && (
//         <BottomNav ref={bottomNavRef} value={value} setValue={setValue} />
//       )}
//       {showBottomNav && (
//         <ThumbNav ref={thumbNavRef} navItem={value} setValue={setValue} />
//       )}
//     </div>
//   );
// });

// // ----------------- MAIN APP -----------------
// function App() {
//   const dispatch = useDispatch();
//   const reduxSavedFilters = useSelector(
//     (state) => state.filters.appliedFilters || {}
//   );

//   const location = useSelector((state) => state.location);
//   const heartedCars = useSelector((state) => state.favorites.heartedCars);

//   const [appliedFilters, setAppliedFilters] = useState(
//     Object.keys(reduxSavedFilters).length > 0
//       ? reduxSavedFilters
//       : defaultFilterState
//   );

//   const [orderedFilters, setOrderedFilters] = useState(() => {
//     const stored = localStorage.getItem("orderedFilters"); ///runs on mount only
//     return stored ? JSON.parse(stored) : [];
//   });
//   const [value, setValue] = useState(null);
//   const [showBottomNav, setShowBottomNav] = useState(window.innerWidth < 768);
//   const [below820, setBelow820] = useState(window.innerWidth < 820);
//   const [above375, setAbove375] = useState(window.innerWidth > 375);
//   const [inventory, setInventory] = useState([]);

//   // Save ordered filters to localStorage
//   useEffect(() => {
//     // console.log("orderedFilter JUST MODIFIED");
//     localStorage.setItem("orderedFilters", JSON.stringify(orderedFilters));
//   }, [orderedFilters]);

//   // console.log("orderedFilters IN APP", orderedFilters);

//   // Save applied filters to Redux
//   useEffect(() => {
//     dispatch(saveFilter(appliedFilters));
//   }, [appliedFilters, dispatch]);

//   // Throttled resize handler
//   useEffect(() => {
//     let timeout;
//     const handleResize = () => {
//       clearTimeout(timeout);
//       timeout = setTimeout(() => {
//         setShowBottomNav(window.innerWidth < 768);
//         if (window.innerWidth > 768) setValue(null);
//         setAbove375(window.innerWidth > 375);
//         setBelow820(window.innerWidth < 820);
//       }, 150);
//     };
//     window.addEventListener("resize", handleResize);
//     return () => {
//       clearTimeout(timeout);
//       window.removeEventListener("resize", handleResize);
//     };
//   }, []);

//   // Fetch inventory on mount
//   useEffect(() => {
//     if (inventory.length > 0) return;
//     (async () => {
//       try {
//         const fetchedInventory = await getInventory();
//         setInventory(fetchedInventory);
//       } catch (err) {
//         console.error("Error loading inventory:", err);
//       }
//     })();
//   }, [inventory.length]);

//   // Get user location
//   useEffect(() => {
//     const isLocationValid =
//       location &&
//       location.zip &&
//       location.city &&
//       location.state &&
//       location.latitude &&
//       location.longitude;
//     if (!isLocationValid) {
//       dispatch(getLocationFromBrowser());
//     }
//   }, [dispatch, location]);

//   // Memoized filtered inventory
//   const activeInv = useMemo(
//     () => inventory.filter((car) => car.status),
//     [inventory]
//   );
//   const localInventory = useMemo(() => {
//     if (!location) return [];
//     return getOffers(activeInv, location, 100, false);
//   }, [activeInv, location]);

//   // Update Redux with local inventory
//   useEffect(() => {
//     if (!location || inventory.length === 0) return;
//     if (!_.isEqual(location.localInv, localInventory)) {
//       dispatch(setLocalInv(localInventory));
//     }
//   }, [localInventory, location, inventory.length, dispatch]);

//   // Memoized props for routes to prevent re-renders
//   const carsProps = useMemo(
//     () => ({
//       inventory,
//       below820,
//       above375,
//       defaultFilterState,
//       appliedFilters,
//       setAppliedFilters,
//       orderedFilters,
//       setOrderedFilters,
//     }),
//     [inventory, below820, above375, appliedFilters, orderedFilters]
//   );

//   const homeProps = useMemo(
//     () => ({
//       inventory,
//       location,
//       appliedFilters,
//       handleClearFilters,
//       setOrderedFilters,
//       setAppliedFilters,
//     }),
//     [inventory, location, appliedFilters]
//   );

//   return (
//     <Router>
//       <PageWrapper
//         inv={inventory}
//         setValue={setValue}
//         value={value}
//         showBottomNav={showBottomNav}
//         appliedFilters={appliedFilters}
//         setAppliedFilters={setAppliedFilters}
//         setOrderedFilters={setOrderedFilters}
//         defaultFilterState={defaultFilterState}
//       >
//         <ScrollToTop />
//         <Routes>
//           <Route path="/*" element={<Home {...homeProps} />} />
//           <Route
//             path="/favorites/*"
//             element={<Favorites hearted_cars={heartedCars} />}
//           />
//           <Route path="/cars/*" element={<Cars {...carsProps} />} />
//           <Route
//             path="/car/:id"
//             element={<VehiclePage inventory={inventory} />}
//           />
//         </Routes>
//       </PageWrapper>
//     </Router>
//   );
// }

// export default App;

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
import { getOffers, ScrollToTop } from "./components/utils.js";
import Header from "./components/header.js";
import BottomNav from "./components/bottom_nav/bottom_nav.js";
import ThumbNav from "./components/bottom_nav/ThumbNav.js";
import Home from "./pages/home.js";
import Favorites from "./pages/favorites.js";
import Cars from "./pages/cars.js";
import VehiclePage from "./pages/vehiclePage.js";
import Footer from "./components/footer.js";
import "./index.css";
import { saveFilter } from "./user/filtersSlice";

// ----------------- CONSTANTS -----------------
const defaultFilterState = {
  sort: "Best match",
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
};

// ----------------- PAGE WRAPPER -----------------
const PageWrapper = React.memo(function PageWrapper({
  children,
  inv,
  setValue,
  value,
  showBottomNav,
  appliedFilters,
  setAppliedFilters,
  setOrderedFilters,
  handleClearFilters,
}) {
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
    [location.pathname]
  );

  return (
    <div className="app_root">
      <Header
        currentRoute={!currentRoute.length ? "home" : currentRoute}
        inv={inv}
        setAppliedFilters={setAppliedFilters}
        setOrderedFilters={setOrderedFilters}
        handleClearFilters={handleClearFilters}
      />
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
});

// ----------------- MAIN APP -----------------
function App() {
  const dispatch = useDispatch();
  const reduxSavedFilters = useSelector(
    (state) => state.filters.appliedFilters || {}
  );

  const location = useSelector((state) => state.location);
  const heartedCars = useSelector((state) => state.favorites.heartedCars);

  const [appliedFilters, setAppliedFilters] = useState(
    Object.keys(reduxSavedFilters).length > 0
      ? reduxSavedFilters
      : defaultFilterState
  );

  const [orderedFilters, setOrderedFilters] = useState(() => {
    const stored = localStorage.getItem("orderedFilters"); ///runs on mount only
    return stored ? JSON.parse(stored) : [];
  });
  const [value, setValue] = useState(null);
  const [showBottomNav, setShowBottomNav] = useState(window.innerWidth < 768);
  const [below820, setBelow820] = useState(window.innerWidth < 820);
  const [above375, setAbove375] = useState(window.innerWidth > 375);
  const [inventory, setInventory] = useState([]);

  // ✅ Moved handleClearFilters here so it can be shared
  const handleClearFilters = useCallback(() => {
    const { sort, ...filtersWithoutSort } = defaultFilterState;
    setAppliedFilters({ sort: appliedFilters.sort, ...filtersWithoutSort });
    setOrderedFilters([]);
  }, [appliedFilters.sort, setAppliedFilters, setOrderedFilters]);

  // Save ordered filters to localStorage
  useEffect(() => {
    localStorage.setItem("orderedFilters", JSON.stringify(orderedFilters));
  }, [orderedFilters]);

  // Save applied filters to Redux
  useEffect(() => {
    dispatch(saveFilter(appliedFilters));
  }, [appliedFilters, dispatch]);

  // Throttled resize handler
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

  // Fetch inventory on mount
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

  // Get user location
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

  // Memoized filtered inventory
  const activeInv = useMemo(
    () => inventory.filter((car) => car.status),
    [inventory]
  );
  const localInventory = useMemo(() => {
    if (!location) return [];
    return getOffers(activeInv, location, 100, false);
  }, [activeInv, location]);

  // Update Redux with local inventory
  useEffect(() => {
    if (!location || inventory.length === 0) return;
    if (!_.isEqual(location.localInv, localInventory)) {
      dispatch(setLocalInv(localInventory));
    }
  }, [localInventory, location, inventory.length, dispatch]);

  // Memoized props for routes
  const carsProps = useMemo(
    () => ({
      inventory,
      below820,
      above375,
      defaultFilterState,
      appliedFilters,
      setAppliedFilters,
      orderedFilters,
      setOrderedFilters,
    }),
    [inventory, below820, above375, appliedFilters, orderedFilters]
  );

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
    <Router>
      <PageWrapper
        inv={inventory}
        setValue={setValue}
        value={value}
        showBottomNav={showBottomNav}
        appliedFilters={appliedFilters}
        setAppliedFilters={setAppliedFilters}
        setOrderedFilters={setOrderedFilters}
        handleClearFilters={handleClearFilters} // ✅ passed into Header
      >
        <ScrollToTop />
        <Routes>
          <Route path="/*" element={<Home {...homeProps} />} />{" "}
          {/* ✅ has access now */}
          <Route
            path="/favorites/*"
            element={<Favorites hearted_cars={heartedCars} />}
          />
          <Route path="/cars/*" element={<Cars {...carsProps} />} />
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
