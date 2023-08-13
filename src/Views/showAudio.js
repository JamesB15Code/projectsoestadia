import React from "react";
import Navbarr from "../Components/navbar";
import Footer from "../Components/footerr";
import ShowAudio from "../Components/showAudio";

export default function showAudio() {
  return (
    <div>
      <Navbarr /> 
      <br/>
      <ShowAudio/>
      <br/>
      <Footer />
    </div>
  );
}
