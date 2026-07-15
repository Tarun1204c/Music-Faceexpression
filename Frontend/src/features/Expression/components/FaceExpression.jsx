import { useEffect, useRef, useState } from "react";
import { detect, initialize } from "../utils/utils";

const FaceExpression = () => {
  const videoRef = useRef(null);
  const faceLandmarkerRef = useRef(null);
  const streamRef = useRef(null);
  const [expression, setExpression] = useState("Loading...");


  useEffect(() => {
    initialize({faceLandmarkerRef, videoRef, streamRef, setExpression});
  }, []);

  return (
    <div style={{ textAlign: "center", padding: "20px" }}>
      <h2>Face Expression Detection</h2>

      <video
        ref={videoRef}
        autoPlay
        playsInline
        width={640}
        height={480}
        style={{
          border: "2px solid black",
          borderRadius: "10px",
        }}
      />

      <h1>{expression}</h1>

      <button
        onClick={() => {detect({faceLandmarkerRef, videoRef, setExpression})}}
      >
        Detect Expression
      </button>
    </div>
  );
};

export default FaceExpression;
 