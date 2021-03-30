import React, { useState, useRef } from "react";
import ChevronImage from "./ChevronImage.js";

function Accordion(props) {
  const [setActive, setActiveState] = useState("");
  const [setHeight, setHeightState] = useState("0px");
  const [setRotate, setRotateState] = useState("accordionIcon");

  const content = useRef(null);

  function toggleAccordion() {
    /* if setActive is empty -> set to active otherwise set to empty */
    setActiveState(setActive === "" ? "active" : "");
    /* if setActive is active -> set to 0px otherwise set to content height */
    setHeightState(
      setActive === "active" ? "0px" : `${content.current.scrollHeight}px`
    );
    /* if setActive is active -> set to ">" otherwise rotate to "v" */
    setRotateState(
      setActive === "active" ? "accordionIcon" : "accordionIcon rotate"
    );
  }

  return (
    <div className="accordionWrap">
      {/* When clicked, call the toggleAccordion function */}
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

