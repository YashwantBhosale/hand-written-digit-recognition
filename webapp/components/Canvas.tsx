"use client";
import React, { useRef } from "react";
import { Button } from "./ui/button";
import { ReactHTMLElement } from "react";

export default function Canvas() {
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
		if(!ctx || !isDrawing) return;

		ctx.beginPath();
		ctx.strokeStyle = "black";
		ctx.lineWidth = 5;
		ctx.moveTo(lastX, lastY);
		ctx.lineTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY);
		ctx.stroke();
		setLastX(e.nativeEvent.offsetX);
		setLastY(e.nativeEvent.offsetY);
	}

	const clear = () => {
		const ctx = canvas.current?.getContext("2d");
		if (!ctx) return;
		ctx.clearRect(0, 0, canvas?.current?.width || 0, canvas?.current?.height || 0);
	}

	return (
		<div>
			<canvas ref={canvas} width="500px" height="500px" style={styles} 
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
		</div>
	);
}
