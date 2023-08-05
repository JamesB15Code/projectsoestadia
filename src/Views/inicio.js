import React, { Component } from 'react';
import Navbarr from '../Components/navbar';
import NavbarAdmin from '../Components/navbar2';
import ProdPreview from '../Components/prodPreview';
import CarouselFadeExample from '../Components/slider';
import Footer from '../Components/footerr';
import Admin from '../Components/perfil';

class Home extends Component{
    render(){
        let rol = localStorage.getItem('rol'); 
        if (rol === 'admin')
        {
        return(  
        <div id='home'>
         <div>
         <Navbarr/>
         <Admin/>
         <Footer/>
         </div>
        </div>)
        }else {
         return(    
         <div id='home'>
         <div>
         <Navbarr/>
         <CarouselFadeExample/>
         <ProdPreview/>
         <Footer/>
         </div>
         </div>)
        }

   /* return(
        <div id='home'>
            <div>
                <Navbarr/>
                <CarouselFadeExample/>
                <ProdPreview/>
                <Footer/>
            </div>
        </div>
    )  */    
  }
}

export default Home;
