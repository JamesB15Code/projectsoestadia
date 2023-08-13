import React from 'react'
import Admin from '../Components/perfiladmin'
import Navbar2 from '../Components/navbar2'
import Fotter from '../Components/footerr'

import ProdPreview from '../Components/prodPreview';
import CarouselFadeExample from '../Components/slider';

export default function PerfilUser() {
  let rol = localStorage.getItem('rol'); 
  if (rol === 'usuario'){
      return (
      <div>
        <Navbar2/>
        <CarouselFadeExample/>
         <ProdPreview/>
        <Fotter/>
      </div>
    )
  }else {
    return (
      <div>
        <Navbar2/>
        <br/>
        <Admin/>
        <Fotter/>
      </div>
    )
    
  }
  
}
