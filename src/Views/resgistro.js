import React, { Component } from "react";
import Registro from "../Components/registro";
import Navbar from "../Components/navbar"

class registro extends Component {
  render() {
    return (
      <div id="Login">
        <div>
          <Navbar />
          <Registro />
        </div>
      </div>
    );
  }
}

export default registro;
