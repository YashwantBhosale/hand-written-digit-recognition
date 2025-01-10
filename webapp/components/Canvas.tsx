"use client"
import React, { useRef, useState } from "react";
import { Button } from "@/components/ui/button";

const Canvas = () => {
  const canvas = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [lastX, setLastX] = useState(0);
  const [lastY, setLastY] = useState(0);
  const [prediction, setPrediction] = useState<number | null>(null);
  const [activations, setActivations] = useState<number[][]>([]);

  const draw = (e: React.MouseEvent<HTMLCanvasElement, MouseEvent>) => {
    const ctx = canvas.current?.getContext("2d");
    if (!ctx || !isDrawing) return;

    ctx.beginPath();
    ctx.strokeStyle = "black";
    ctx.lineWidth = 5;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.moveTo(lastX, lastY);
    ctx.lineTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY);
    ctx.stroke();

    setLastX(e.nativeEvent.offsetX);
    setLastY(e.nativeEvent.offsetY);
  };

  const clear = () => {
    const ctx = canvas.current?.getContext("2d");
    if (!ctx) return;
    ctx.fillStyle = "white";
    ctx.fillRect(0, 0, canvas.current?.width || 0, canvas.current?.height || 0);
    setPrediction(null);
    setActivations([]);
  };

  const getCanvasImage = () => {
    return canvas.current?.toDataURL("image/png");
  };

  const getPredictedDigit = async () => {
    try {
      const image = getCanvasImage();
      if (!image) return;

      const response = await fetch("/api/predict", {
        method: "POST",
        body: JSON.stringify({ image }),
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();
      setPrediction(data.prediction);
      if (data.activations) {
        setActivations(data.activations);
      }

      console.log(data);
    } catch (err) {
      console.error(err);
    }
  };

  const renderActivationGrid = (activation: number[], index: number, isLastLayer: boolean) => {
	const maxValue = Math.max(...activation) || 1;
	const normalizedActivation = activation.map((v) => v / maxValue);
  
	return (
	  <div key={index} className="w-[60vw] space-y-2">
		<h3 className="text-lg font-medium text-gray-800">Layer {index + 1}</h3>
		<div
		  className="grid gap-1"
		  style={{
			gridTemplateColumns: `repeat(auto-fit, minmax(10px, 1fr))`,
		  }}
		>
		  {normalizedActivation.map((value, i) => (
			<div
			  key={i}
			  className="aspect-square relative flex items-center justify-center"
			  style={{
				backgroundColor: `rgba(59, 130, 246, ${value})`,
				border: "1px solid rgba(59, 130, 246, 0.5)"
			  }}
			>
			  {isLastLayer && normalizedActivation.length === 10 && (
				<span className="text-black font-medium">{i}</span> 
			  )}
			</div>
		  ))}
		</div>
	  </div>
	);
  };
  

  return (
    <div className="space-y-6 p-4">
      <div className="flex flex-col items-center w-full">
        <h1 className="text-2xl font-bold mb-4">Digit Recognition</h1>
        <canvas
          ref={canvas}
          width="200"
          height="200"
          className="border border-gray-300 bg-white"
          onMouseDown={(e) => {
            setIsDrawing(true);
            setLastX(e.nativeEvent.offsetX);
            setLastY(e.nativeEvent.offsetY);
          }}
          onMouseUp={() => setIsDrawing(false)}
          onMouseOut={() => setIsDrawing(false)}
          onMouseMove={draw}
        />
        <div className="flex gap-4 mt-4">
          <Button onClick={clear}>Clear</Button>
          <Button onClick={getPredictedDigit}>Predict</Button>
        </div>
      </div>

      {prediction !== null && (
        <div className="w-full">
          <h2 className="text-xl font-bold mb-2">Prediction</h2>
          <p className="text-lg text-blue-600">{prediction}</p>
        </div>
      )}

      {activations.length > 0 && (
        <div className="w-full">
          <h2 className="text-xl font-bold mb-4">Network Activations</h2>
          {activations.map((activation, index) => {
			const isLastLayer = index === activations.length - 1;
			return renderActivationGrid(activation, index, isLastLayer);
			})}
        </div>
      )}
    </div>
  );
};

export default Canvas;
