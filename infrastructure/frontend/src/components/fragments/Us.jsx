import React from "react";

const Us = ({ personImage, personText }) => {
  return (
    <div>
      <div className="container-person">
        <div className="containerimage">
          <img className="personimg" src={personImage} alt="" />
        </div>
        <div className="containertext">
          <h1> {personText} </h1>
        </div>
      </div>
    </div>
  );
};

export default Us;
