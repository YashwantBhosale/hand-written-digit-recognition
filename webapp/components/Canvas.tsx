"use client";
import React, { useRef } from "react";
import { Button } from "./ui/button";
import { ReactHTMLElement } from "react";

type CanvasProps = {
	digit: number | null;
	setDigit: React.Dispatch<React.SetStateAction<number | null>>;
};

// reference: https://codepen.io/wahidn/pen/ZRQNZJ
export default function Canvas({ digit, setDigit }: CanvasProps) {
	const canvas = useRef<HTMLCanvasElement>(null);
	const [isDrawing, setIsDrawing] = React.useState(false);
	const [lastX, setLastX] = React.useState(0);
	const [lastY, setLastY] = React.useState(0);

	const styles = {
		marginTop: "1rem",
		marginBottom: "1rem",
		border: "1px solid black",
		innerWidth: "100%",
		innerHeight: "100%",
		backgroundColor: "white",
	};

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
	};

	const getCanvasImage = () => {
		const ctx = canvas.current?.getContext("2d");
		if (!ctx) return;

		return canvas.current?.toDataURL("image/png");
	};
	const getScaledDownImage = () => {
		if (!canvas.current) return;

		const tempCanvas = document.createElement("canvas");
		const finalCanvas = document.createElement("canvas");

		tempCanvas.width = canvas.current.width;
		tempCanvas.height = canvas.current.height;
		finalCanvas.width = 28;
		finalCanvas.height = 28;

		const tempCtx = tempCanvas.getContext("2d");
		const finalCtx = finalCanvas.getContext("2d");
		if (!tempCtx || !finalCtx) return;

		tempCtx.fillStyle = "white";
		tempCtx.fillRect(0, 0, tempCanvas.width, tempCanvas.height);

		const scaleRatio = 28 / canvas.current.width;

		tempCtx.lineWidth = 5 * scaleRatio;
		tempCtx.lineCap = "round";
		tempCtx.lineJoin = "round";
		tempCtx.strokeStyle = "black";

		tempCtx.drawImage(canvas.current, 0, 0);

		const imageData = tempCtx.getImageData(
			0,
			0,
			tempCanvas.width,
			tempCanvas.height
		);
		const data = imageData.data;

		for (let i = 0; i < data.length; i += 4) {
			const avg = (data[i] + data[i + 1] + data[i + 2]) / 3;
			const value = avg < 240 ? 0 : 255;
			data[i] = data[i + 1] = data[i + 2] = value;
		}
		tempCtx.putImageData(imageData, 0, 0);

		finalCtx.fillStyle = "white";
		finalCtx.fillRect(0, 0, 28, 28);

		finalCtx.imageSmoothingEnabled = true;
		finalCtx.imageSmoothingQuality = "high";

		finalCtx.drawImage(tempCanvas, 0, 0, 28, 28);

		const finalImageData = finalCtx.getImageData(0, 0, 28, 28);
		const finalData = finalImageData.data;
		for (let i = 0; i < finalData.length; i += 4) {
			const avg = (finalData[i] + finalData[i + 1] + finalData[i + 2]) / 3;
			const value = avg < 240 ? 0 : 255;
			finalData[i] = finalData[i + 1] = finalData[i + 2] = value;
		}
		finalCtx.putImageData(finalImageData, 0, 0);

		return finalCanvas.toDataURL("image/png");
	};

	const getPredictedDigit = async () => {
		try {
			const scaledDownImage = getCanvasImage();
			if (!scaledDownImage) return;

			const response = await fetch("/api/predict", {
				method: "POST",
				body: JSON.stringify({ image: scaledDownImage }),
				headers: {
					"Content-Type": "application/json",
				},
			});

			const data = await response.json();
			console.log(data);
			setDigit(data.prediction);
		} catch (err) {
			console.log(err);
		}
	};

	const downloadScaledDownImage = () => {
		const scaledDownImage = getCanvasImage();
		if (!scaledDownImage) return;

		const link = document.createElement("a");
		link.href = scaledDownImage;
		link.download = "scaledDownImage.png";
		link.click();
	};
	return (
		<div>
			<canvas
				ref={canvas}
				width="200px"
				height="200px"
				style={styles}
				onMouseDown={(e: React.MouseEvent) => {
					setIsDrawing(true);
					setLastX(e.nativeEvent.offsetX);
					setLastY(e.nativeEvent.offsetY);
				}}
				onMouseUp={() => setIsDrawing(false)}
				onMouseOut={() => setIsDrawing(false)}
				onMouseMove={draw}
			></canvas>
			<Button onClick={clear}>Clear</Button>
			<Button onClick={getPredictedDigit} className="ml-3">
				Predict
			</Button>
			<Button onClick={downloadScaledDownImage} className="ml-3">
				Download
			</Button>
		</div>
	);
}
