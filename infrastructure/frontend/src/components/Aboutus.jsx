import React from "react";
import "../css/Aboutus.css";
import Us from "./fragments/Us";
import Gabrielpng from "../assets/Gabriel.png";
import Lucaspng from "../assets/Lucas.jpeg";
import Pedropng from "../assets/Pedro.png";
import Victorpng from "../assets/Victor.png";

const Aboutus = () => {
  return (
    <div className="aboutus-container">
      <div className="aboutus-title">
        <h1>Sobre nós</h1>
      </div>

      <div className="person-container">
        <div className="person-image-container">
          <img src={Lucaspng} alt="Lucas" className="person-image" />
          <div className="person-name">Lucas</div>
        </div>
        <div className="person-text-container">
          <div className="person-description">Lucas</div>
        </div>
      </div>

      <div className="person-container">
        <div className="person-image-container">
          <img src={Victorpng} alt="Victor" className="person-image" />
          <div className="person-name">Victor</div>
        </div>
        <div className="person-text-container">
          <div className="person-description">Victor</div>
        </div>
      </div>

      <div className="person-container">
        <div className="person-image-container">
          <img src={Pedropng} alt="Pedro" className="person-image" />
          <div className="person-name">Pedro</div>
        </div>
        <div className="person-text-container">
          <div className="person-description"> Pedro</div>
        </div>
      </div>

      <div className="person-container">
        <div className="person-image-container">
          <img src={Gabrielpng} alt="Gabriel" className="person-image" />
          <div className="person-name">Gabriel</div>
        </div>
        <div className="person-text-container">
          <div className="person-description"> Gabriel</div>
        </div>
      </div>
    </div>
  );
};

export default Aboutus;
