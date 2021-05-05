import React, { useState, useRef } from "react";
import ChevronImage from "./ChevronImage.js";
import Green_Check from '../assets/Green_Check.png'
import Red_X from '../assets/Red_X.png'

const ResultCard = (props) => {
  const [setActive, setActiveState] = useState("");
  const [setHeight, setHeightState] = useState("0px");
  const [setRotate, setRotateState] = useState("accordionIcon");

  const content = useRef(null);

  function toggleAccordion() {
    /* if setActive is empty -> set to active otherwise set to empty */
    setActiveState(setActive === "" ? "result_card-active" : "");
    /* if setActive is active -> set to 0px otherwise set to content height */
    setHeightState(
      setActive === "result_card-active" ? "0px" : `${content.current.scrollHeight}px`
    );
    /* if setActive is active -> set to ">" otherwise rotate to "v" */
    setRotateState(
      setActive === "result_card-active" ? "result-wrapper__button-arrow" : "result-wrapper__button-arrow rotate"
    );
  }

  return (
    <div className="result-wrapper">
      {/* When clicked, call the toggleAccordion function */}
      <button className={`result-wrapper__button ${setActive}`} onClick={toggleAccordion}>
        <img className="result-wrapper__button-status" src={props.detection === "Negative" ? Red_X : Green_Check} alt='status' />
        <h1 className={`result-wrapper__button-title ${props.detection === "Negative" ? "negative" : "positive"}`}>
            {props.detection}
        </h1>
        <ChevronImage className={`${setRotate}`} width={10} fill={"#777"} />
      </button>
      <div
        ref={content}
        style={{ maxHeight: `${setHeight}` }}
        className="result-wrapper__content"
      >
        {props.children}
      </div>
    </div>
  );
}

export default ResultCard;

