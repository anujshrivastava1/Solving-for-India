import React, { useState, useRef, useEffect } from "react";
import "./result.css";

const Result = ({ disease, sym }) => {
  const [isScreenLarge, setIsScreenLarge] = useState(false);
  useEffect(() => {
    function handleResize() {
      setIsScreenLarge(window.innerWidth > 1083);
    }

    window.addEventListener("resize", handleResize);
    handleResize(); // call once initially

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <>
      <div className="container1">
        <h3>{disease}</h3>
        <p>Which symptoms match the {disease}?</p>
        <div className="flex">
          {sym.map((item) => {
            return (
              <div className="container2">
                <h4>{item}</h4>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
};

export default Result;
