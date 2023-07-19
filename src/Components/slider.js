import React from "react";
import Carousel from "react-bootstrap/Carousel";

import img1 from "../img/img1.webp";
import img3 from "../img/Galaxy-S23.jpg";
import img4 from "../img/img3.webp";

const slides = [
  {
    image: img1,
    title: "First slide label",
    description: "Nulla vitae elit libero, a pharetra augue mollis interdum.",
  },

  {
    image: img3,
    title: "Third slide label",
    description:
      "Praesent commodo cursus magna, vel scelerisque nisl consectetur.",
  },
  {
    image: img4,
    title: "For slide label",
    description:
      "Praesent commodo cursus magna, vel scelerisque nisl consectetur.",
  },
];

const CarouselFadeExample = () => {
  return (
    <Carousel className="carousel silder mt-5 ">
      {slides.map((slide, index) => (
        <Carousel.Item className="" key={index}>
          <img
            className="d-block w-100 "
            src={slide.image}
            alt={`Slide ${index + 1}`}
          />
          <Carousel.Caption>
            <p className="carousel-description">{slide.description}</p>
          </Carousel.Caption>
        </Carousel.Item>
      ))}
    </Carousel>
  );
};

export default CarouselFadeExample;
