import React from "react";
import Navbarr from "../Components/navbar";
import Footer from "../Components/footerr";
import Showtablets from "../Components/showTablets";

export default function showTablets() {
  return (
    <div>
      <Navbarr /> 
      <br/>
      <Showtablets/>
      <br/>
      <Footer />
    </div>
  );
}
