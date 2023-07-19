import React, { Component } from 'react';
import Navbarr from '../Components/navbar';
import ProdPreview from '../Components/prodPreview';
import CarouselFadeExample from '../Components/slider';
import Footer from '../Components/footerr';

class Home extends Component{
    render(){
    return(
        <div id='home'>
            <div>
                <Navbarr/>
                <CarouselFadeExample/>
                <ProdPreview/>
                <Footer/>
            </div>
        </div>
    )      
  }
}

export default Home;