import React, { useEffect, useMemo, useRef } from "react";
import Header from "./components/header.js";
import BottomNav from "./components/bottom_nav/bottom_nav.js";
import ThumbNav from "./components/bottom_nav/ThumbNav.js";
import Footer from "./components/footer.js";

function PageWrapper({ children, actions, layoutState, pathname }) {
  const thumbNavRef = useRef(null);
  const bottomNavRef = useRef(null);

  // console.log("PageWrapper rec'd 'layoutState", layoutState);
  // console.log("PageWrapper rec'd actions", actions);
  //
  // CLOSE THUMBNAV ON OUTSIDE CLICK
  //
  useEffect(() => {
    if (layoutState.value == null) return;

    const handleClickOutside = (e) => {
      if (
        thumbNavRef.current &&
        !thumbNavRef.current.contains(e.target) &&
        !bottomNavRef.current.contains(e.target)
      ) {
        actions.setValue(null);
      }
    };

    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, [layoutState.value, actions]);

  useEffect(() => {
    console.log("PageWrapper MOUNTED");
    return () => console.log("PageWrapper UNMOUNTED");
  }, []);

  //
  // CURRENT TOP-LEVEL ROUTE ("home" | "cars" | "compare" | ...)
  //
  const currentRoute = useMemo(() => {
    const first = pathname.split("/")[1];
    return first.length ? first : "home";
  }, [pathname]);

  return (
    <div className="app_root">
      {currentRoute !== "compare" && (
        <Header
          currentRoute={currentRoute}
          PageTransition={actions.PageTransition}
        />
      )}

      {children}

      <Footer />

      {layoutState.showBottomNav && (
        <BottomNav
          ref={bottomNavRef}
          value={layoutState.value}
          setValue={actions.setValue}
        />
      )}

      {layoutState.showBottomNav && (
        <ThumbNav
          ref={thumbNavRef}
          navItem={layoutState.value}
          setValue={actions.setValue}
        />
      )}
    </div>
  );
}

export default PageWrapper;
