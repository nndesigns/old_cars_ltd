import React, {
  useState,
  useEffect,
  useMemo,
  // useCallback,
  Suspense,
} from "react";
import { Routes, Route, useLocation } from "react-router-dom";

import PageWrapper from "./PageWrapper";
import ScrollToTopButton from "./components/scrollToTopBtn.js";
// import FullPageLoader from "./components/FullPageLoader";
import FullPageLoader from "./pages/fullpageLoader.js";

import _ from "lodash";

// import { saveFilter } from "./user/filtersSlice";

// FRAMER
import { AnimatePresence } from "framer-motion";
import { PageTransition, FadeTransition } from "./animations";

// HELPERS
// import { getUniqueLocations } from "./components/axiosCalls.js";
import { getLocalOffers, ScrollToTop } from "./components/utils.js";

/// REDUX
import { useDispatch, useSelector } from "react-redux";
import {
  selectUniqueLocationsStatus,
  selectUniqueLocations,
  fetchUniqueLocations,
} from "./uniqueLocationsSlice.js";
import {
  selectInventoryStatus,
  selectInventoryItems,
  fetchInventory,
} from "./inventorySlice";
import { getLocationFromBrowser, setLocalInv } from "./user/locationSlice";
// LOCK SCROLL
// import { lockScroll, unlockScroll } from "./uiSlice.js";
// COMPARE CARS & CHOSEN CARS
import {
  selectCompareCars,
  selectChosenCars,
  setChosenCars,
} from "./user/userSlice.js";

// import { clearFilters } from "./user/filtersSlice.js";

/* const defaultFilterState = {
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
}; */

// PAGE IMPORTS
const Home = React.lazy(() => import("./pages/home"));
const Favorites = React.lazy(() => import("./pages/favorites"));
const Cars = React.lazy(() => import("./pages/cars"));
const VehiclePage = React.lazy(() => import("./pages/vehiclePage"));
const Compare = React.lazy(() => import("./pages/compare"));

function App() {
  // REDUX
  const dispatch = useDispatch();
  const inventory = useSelector(selectInventoryItems);
  const inventoryStatus = useSelector(selectInventoryStatus);
  // const reduxSavedFilters = useSelector((s) => s.filters?.appliedFilters ?? {});
  const reduxUniqueLocations = useSelector(selectUniqueLocations);
  const locationsStatus = useSelector(selectUniqueLocationsStatus);

  const locationRedux = useSelector((s) => s.location);

  // COMPARE & CHOSEN CARS
  const compareCars = useSelector(selectCompareCars);
  const chosenCars = useSelector(selectChosenCars);

  const loc = useLocation();
  const pathname = loc.pathname; // use only stable primitive

  useEffect(() => {
    console.log("LATEST COMPARE CARS", compareCars);
    console.log("LATEST CHOSEN CARS", chosenCars);

    // nothing to do if no compare cars exist
    if (!compareCars?.length) {
      if (chosenCars.length) dispatch(setChosenCars([]));
      return;
    }

    // ---- CASE 1: no chosen cars yet → auto select first two ----
    if (chosenCars.length === 0 && compareCars.length >= 2) {
      dispatch(setChosenCars(compareCars.slice(0, 2)));
      return;
    }

    // ---- CASE 2: only one chosen car → auto-append another ----
    if (chosenCars.length === 1 && compareCars.length >= 2) {
      const existing = chosenCars[0];

      const nextCar = compareCars.find((c) => c.id !== existing.id);

      if (nextCar) {
        dispatch(setChosenCars([existing, nextCar]));
        return;
      }
    }
    // ============================================================
    //   CORE SYNC LOGIC:
    //   remove missing chosenCars + replace when possible
    // ============================================================
    const compareIds = new Set(compareCars.map((c) => c.id));

    // cars still valid (exist in compareCars)
    const stillValid = chosenCars.filter((c) => compareIds.has(c.id));

    // cars that were removed from compareCars
    const removed = chosenCars.filter((c) => !compareIds.has(c.id));

    // no drift → stop
    if (removed.length === 0) return;

    // find potential replacements (not already chosen)
    const replacements = compareCars.filter(
      (c) => !stillValid.some((sc) => sc.id === c.id)
    );

    const updated = [...stillValid];

    // replace each removed car if possible
    for (const removedCar of removed) {
      const replacement = replacements.shift(); // take first unused
      if (replacement) updated.push(replacement);
      // otherwise → simply omit it
    }

    // only dispatch if something changed
    if (
      updated.length !== chosenCars.length ||
      JSON.stringify(updated) !== JSON.stringify(chosenCars)
    ) {
      dispatch(setChosenCars(updated));
    }
  }, [compareCars, chosenCars, dispatch]);

  // PREVENT SCROLL STATE (redux)
  const preventScroll = useSelector((state) => state.ui.preventScroll);

  useEffect(() => {
    console.log("latest preventScroll", preventScroll);
    // document.body.style.overflow = preventScroll ? "hidden" : "";
    // if (preventScroll) {
    //   document.body.style.overflow = "hidden";
    // } else {
    //   document.body.style.overflow = "";
    // }
    if (preventScroll) {
      document.body.style.position = "fixed";
      document.body.style.width = "100%";
    } else {
      document.body.style.position = "";
      document.body.style.width = "";
    }
  }, [preventScroll]);

  const [value, setValue] = useState(null);
  const [showBottomNav, setShowBottomNav] = useState(window.innerWidth < 768);
  const [below820, setBelow820] = useState(window.innerWidth < 820);
  const [above375, setAbove375] = useState(window.innerWidth > 375);

  //
  // 1. LOAD INVENTORY — always runs, no dependencies
  //
  useEffect(() => {
    if (inventoryStatus === "idle") {
      dispatch(fetchInventory());
    }
  }, [inventoryStatus, dispatch]);

  //
  // 2. LOAD UNIQUE LOCATIONS (all unique .city + .state from Inv, in AWS table)— use redux if present, fallback to fetch
  //
  useEffect(() => {
    if (locationsStatus === "idle") {
      dispatch(fetchUniqueLocations());
    }
  }, [locationsStatus, dispatch]);

  //
  // GET USER LOCATION
  //
  useEffect(() => {
    console.log("received locationRedux in useEffect", locationRedux);
    // does it exist already?
    const isLocationValid =
      locationRedux &&
      locationRedux.zip &&
      locationRedux.city &&
      locationRedux.state &&
      locationRedux.latitude &&
      locationRedux.longitude;

    if (!isLocationValid) {
      console.log("this part was reached");
      dispatch(getLocationFromBrowser()) //sets redux w/browser locaiton
        .unwrap()
        .then((result) => {
          console.log("Location from browser:", result);
        })
        .catch((error) => {
          console.error("Error getting location:", error);
        });
    }
  }, [dispatch, locationRedux]);

  //
  // 3. ACTIVE INVENTORY
  //
  const activeInv = useMemo(() => {
    return inventory.filter((car) => car.status);
  }, [inventory]);

  //
  // 4. LOCAL INVENTORY DERIVATION
  //
  const localInventory = useMemo(() => {
    if (!locationRedux?.latitude || !locationRedux?.longitude) return [];
    if (reduxUniqueLocations.length === 0 || activeInv.length === 0) return [];

    return getLocalOffers(
      activeInv,
      reduxUniqueLocations,
      locationRedux,
      100,
      false
    );
  }, [activeInv, reduxUniqueLocations, locationRedux]);

  //
  // 5. UPDATE REDUX WITH LOCALINV
  //
  useEffect(() => {
    if (!locationRedux || inventory.length === 0) return;
    if (!_.isEqual(locationRedux.localInv, localInventory)) {
      dispatch(setLocalInv(localInventory));
    }
  }, [localInventory, locationRedux, inventory, dispatch]);

  //
  //   //RESIZE HANDLER
  //
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

  //
  // STABLE FUNCTIONS
  //

  //
  // MEMOIZED ACTIONS PASSED TO PageWrapper
  //
  const actions = useMemo(
    () => ({
      setValue,
      PageTransition,
    }),
    []
  );

  //
  // LAYOUT STATE FOR PageWrapper
  //
  const layoutState = useMemo(
    () => ({
      value, // RESIZE
      showBottomNav,
    }),
    [value, showBottomNav]
  );

  //
  // ROUTE ELEMENTS
  //
  const HomeElement = useMemo(
    () => (
      <Suspense fallback={<FullPageLoader home />}>
        <Home
          PageTransition={PageTransition}
          FadeTransition={FadeTransition}
          AnimatePresence={AnimatePresence}
        />
      </Suspense>
    ),
    []
  );

  const FavoritesElement = useMemo(
    () => (
      <Suspense fallback={<FullPageLoader />}>
        <Favorites
          PageTransition={PageTransition}
          AnimatePresence={AnimatePresence}
        />
      </Suspense>
    ),
    []
  );

  const CarsElement = useMemo(
    () => (
      <Suspense fallback={<FullPageLoader />}>
        <Cars
          below820={below820}
          above375={above375}
          PageTransition={PageTransition}
          FadeTransition={FadeTransition}
          AnimatePresence={AnimatePresence}
        />
      </Suspense>
    ),
    [below820, above375]
  );

  const VehiclePageElement = useMemo(
    () => (
      <Suspense fallback={<FullPageLoader />}>
        <VehiclePage
          PageTransition={PageTransition}
          AnimatePresence={AnimatePresence}
        />
      </Suspense>
    ),
    []
  );

  const CompareElement = useMemo(
    () => (
      <Suspense fallback={<FullPageLoader />}>
        <Compare
          PageTransition={PageTransition}
          AnimatePresence={AnimatePresence}
        />
      </Suspense>
    ),
    []
  );

  //
  // FINAL ROUTES — STABLE
  //
  const routes = useMemo(
    () => (
      <Routes>
        <Route index element={HomeElement} />
        <Route path="/favorites/*" element={FavoritesElement} />
        <Route path="/cars/*" element={CarsElement} />
        <Route path="/car/:id" element={VehiclePageElement} />
        <Route path="/compare" element={CompareElement} />
      </Routes>
    ),
    [
      HomeElement,
      FavoritesElement,
      CarsElement,
      VehiclePageElement,
      CompareElement,
    ]
  );

  return (
    <PageWrapper
      actions={actions}
      layoutState={layoutState}
      pathname={pathname}
    >
      {routes}
      <ScrollToTop />
      <ScrollToTopButton />
    </PageWrapper>
  );
}

export default App;
