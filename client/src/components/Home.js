import React, { useRef } from "react";
import { useEffect } from "react";
import { useState } from "react";
import { Link } from "react-router-dom";
// import { Carousel } from "react-bootstrap";
import TestCarousel from "./TestCarousel";
import Carousel from "react-bootstrap/Carousel";

const Home = () => {
  return (
    <>
      <div className="home">
        <div className="home2">
          <h1>The Number One Trust Source for Concert Tickets </h1>
          <h3>Created By Concert Lovers for Concert Lovers</h3>
        </div>
        <TestCarousel />
      </div>
    </>
  );
};

export default Home;
