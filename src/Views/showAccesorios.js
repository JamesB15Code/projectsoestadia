import React from "react";
import Navbarr from "../Components/navbar";
import Footer from "../Components/footerr";
import ShowAcesorios from "../Components/showAccesorios";

export default function showAcesorios() {
  return (
    <div>
      <Navbarr /> 
      <br/>
      <ShowAcesorios/>
      <br/>
      <Footer />
    </div>
  );
}
