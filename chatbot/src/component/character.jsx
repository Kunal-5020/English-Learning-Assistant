import React, { useState, useEffect } from "react";

const Character = ({ isSpeaking}) => {
  const [currentMouth, setCurrentMouth] = useState("neutral.png");

  useEffect(() => {
    if (isSpeaking) {
      const mouthImages = ["10.png","1.png"];
      let index = 0;
      const interval = setInterval(() => {
        setCurrentMouth(mouthImages[index]);
        index = (index + 1) % mouthImages.length;
      }, 400); // Change every 300ms
      return () => clearInterval(interval); // Cleanup on stop
    } else {
      setCurrentMouth("1.png");
    }
  }, [isSpeaking]);

  return (
    <div style={{ position: "relative", display: "inline-block" }}>
      <img
        src="/images/character.png"
        alt="Character Body"
        style={{ width: "300px" }}
      />
      <img
        src={`/images/${currentMouth}`}
        alt="Character Mouth"
        style={{
          position: "absolute",
          top: "59%",
          left: "51%",
          transform: "translate(-50%, -50%)",
          width: "35px",
          height:"20px"
        }}
      />
    </div>
  );
};

export default Character;
