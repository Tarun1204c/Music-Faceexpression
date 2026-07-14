import { useEffect, useRef, useState } from "react";
import {
  FilesetResolver,
  FaceLandmarker,
} from "@mediapipe/tasks-vision";

const FaceExpression = () => {
  const videoRef = useRef(null);
  const [expression, setExpression] = useState("Loading...");
  const faceLandmarkerRef = useRef(null);

  useEffect(() => {
    let animationId;

    const initialize = async () => {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
      });

      videoRef.current.srcObject = stream;
      await videoRef.current.play();

      const vision = await FilesetResolver.forVisionTasks(
        "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision/wasm"
      );

      faceLandmarkerRef.current =
        await FaceLandmarker.createFromOptions(vision, {
          baseOptions: {
            modelAssetPath:
              "https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/1/face_landmarker.task",
          },
          runningMode: "VIDEO",
          outputFaceBlendshapes: true,
          numFaces: 1,
        });

      detect();
    };

    const detect = () => {
      if (
        !faceLandmarkerRef.current ||
        !videoRef.current
      ) {
        animationId = requestAnimationFrame(detect);
        return;
      }

      const results =
        faceLandmarkerRef.current.detectForVideo(
          videoRef.current,
          performance.now()
        );

      if (results.faceBlendshapes.length > 0) {
        const shapes =
          results.faceBlendshapes[0].categories;

        const getScore = (name) =>
          shapes.find((s) => s.categoryName === name)?.score || 0;

        const smile =
          (getScore("mouthSmileLeft") +
            getScore("mouthSmileRight")) /
          2;

        const frown =
          (getScore("mouthFrownLeft") +
            getScore("mouthFrownRight")) /
          2;

        const jowOpen = getScore("jowOpen");

        if (smile > 0.7)
          setExpression("😊 Happy");
        else if (frown > 0.6)
          setExpression("😔 Sad");
        else if (jowOpen > 0.6)
          setExpression("😲 Surprised");
        else
          setExpression("😐 Neutral");
      } else {
        setExpression("No Face Detected");
      }
 
      animationId = requestAnimationFrame(detect);
    };

    initialize();

    return () => cancelAnimationFrame(animationId);
  }, []);

  return (
    <div style={{ textAlign: "center" }}>
      <h2>Face Expression Detection</h2>

      <video
        ref={videoRef}
        autoPlay
        playsInline
        width="640"
        height="480"
      />

      <h1>{expression}</h1>
    </div>
  );
};

export default FaceExpression;