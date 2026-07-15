import {
  FilesetResolver,
  FaceLandmarker,
} from "@mediapipe/tasks-vision";

export const initialize = async ({
  faceLandmarkerRef,
  videoRef,
  streamRef,
  setExpression,
}) => {
  try {
    // Open Camera
    streamRef.current = await navigator.mediaDevices.getUserMedia({
      video: true,
    });

    videoRef.current.srcObject = streamRef.current;
    await videoRef.current.play();

    // Load MediaPipe Vision
    const vision = await FilesetResolver.forVisionTasks(
      "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision/wasm"
    );

    // Create Face Landmarker
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

    setExpression("📷 Camera Ready");
  } catch (err) {
    console.error(err);
    setExpression("❌ Camera Permission Denied");
  }
};

export const detect = ({
  faceLandmarkerRef,
  videoRef,
  setExpression,
}) => {
  if (!faceLandmarkerRef.current || !videoRef.current) {
    return;
  }

  const results = faceLandmarkerRef.current.detectForVideo(
    videoRef.current,
    performance.now()
  );

  if (!results.faceBlendshapes.length) {
    setExpression("😶 No Face Detected");
    return;
  }

  const shapes = results.faceBlendshapes[0].categories;

  const getScore = (name) =>
    shapes.find((s) => s.categoryName === name)?.score || 0;

  const smile =
    (getScore("mouthSmileLeft") +
      getScore("mouthSmileRight")) / 2;

  const frown =
    (getScore("mouthFrownLeft") +
      getScore("mouthFrownRight")) / 2;

  const jawOpen = getScore("jawOpen");

  const browUp = getScore("browInnerUp");

  const browDown =
    (getScore("browDownLeft") +
      getScore("browDownRight")) / 2;

  console.table({
    Smile: smile.toFixed(2),
    Frown: frown.toFixed(2),
    JawOpen: jawOpen.toFixed(2),
    BrowUp: browUp.toFixed(2),
    BrowDown: browDown.toFixed(2),
  });

  if (smile > 0.5) {
    setExpression("😊 Happy");
  } else if (jawOpen > 0.35 && browUp > 0.2) {
    setExpression("😲 Surprised");
  } else if (frown > 0.2 || browDown > 0.2) {
    setExpression("😔 Sad");
  } else {
    setExpression("😐 Neutral");
  }
};