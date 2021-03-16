import React, { useState, useRef } from "react";
import ChevronImage from "./ChevronImage.js";

function Accordion(props) {
  const [setActive, setActiveState] = useState("");
  const [setHeight, setHeightState] = useState("0px");
  const [setRotate, setRotateState] = useState("accordionIcon");

  const content = useRef(null);

  function toggleAccordion() {
    setActiveState(setActive === "" ? "active" : "");
    setHeightState(
      setActive === "active" ? "0px" : `${content.current.scrollHeight}px`
    );
    setRotateState(
      setActive === "active" ? "accordionIcon" : "accordionIcon rotate"
    );
  }

  return (
    <div className="accordionWrap">
      <button className={`accordion ${setActive}`} onClick={toggleAccordion}>
        <p className="accordionTitle">{props.title}</p>
        <ChevronImage className={`${setRotate}`} width={10} fill={"#777"} />
      </button>
      <div
        ref={content}
        style={{ maxHeight: `${setHeight}` }}
        className="accordionContent"
      >
        <div
          className="accordionText"
          dangerouslySetInnerHTML={{ __html: props.content }}
        />
      </div>
    </div>
  );
}

export default Accordion;

