import React, { useState, useCallback, useRef } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import ActivationGrid from "./ActivationGrid";



// set for everything on page to be not draggable
if (typeof document !== "undefined") {
  document.body.style.userSelect = "none";
}

const GridCanvas = () => {
	const [prediction, setPrediction] = useState<number | null>(null);
	const [activations, setActivations] = useState<number[][]>([]);
	const GRID_SIZE = 28;
	let test = [
		0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
		0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
		0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
		0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
		0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
		0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
		0, 0, 3, 18, 18, 18, 126, 136, 175, 26, 166, 255, 247, 127, 0, 0, 0, 0, 0,
		0, 0, 0, 0, 0, 0, 0, 30, 36, 94, 154, 170, 253, 253, 253, 253, 253, 225,
		172, 253, 242, 195, 64, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 49, 238, 253, 253,
		253, 253, 253, 253, 253, 253, 251, 93, 82, 82, 56, 39, 0, 0, 0, 0, 0, 0, 0,
		0, 0, 0, 0, 0, 18, 219, 253, 253, 253, 253, 253, 198, 182, 247, 241, 0, 0,
		0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 80, 156, 107, 253, 253, 205,
		11, 0, 43, 154, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 14,
		1, 154, 253, 90, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
		0, 0, 0, 0, 0, 139, 253, 190, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
		0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 11, 190, 253, 70, 0, 0, 0, 0, 0, 0, 0, 0, 0,
		0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 35, 241, 225, 160, 108, 1,
		0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 81,
		240, 253, 253, 119, 25, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
		0, 0, 0, 0, 0, 0, 45, 186, 253, 253, 150, 27, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
		0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 16, 93, 252, 253, 187, 0, 0, 0, 0, 0,
		0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 249, 253, 249,
		64, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 46, 130,
		183, 253, 253, 207, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
		0, 39, 148, 229, 253, 253, 253, 250, 182, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
		0, 0, 0, 0, 0, 0, 0, 24, 114, 221, 253, 253, 253, 253, 201, 78, 0, 0, 0, 0,
		0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 23, 66, 213, 253, 253, 253, 253, 198,
		81, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 18, 171, 219, 253,
		253, 253, 253, 195, 80, 9, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
		55, 172, 226, 253, 253, 253, 253, 244, 133, 11, 0, 0, 0, 0, 0, 0, 0, 0, 0,
		0, 0, 0, 0, 0, 0, 0, 0, 0, 136, 253, 253, 253, 212, 135, 132, 16, 0, 0, 0,
		0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
		0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
		0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
		0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
	].map((value) => value / 255.0);

	const [grid, setGrid] = useState(test);
	const [isDrawing, setIsDrawing] = useState(false);
	const lastPos = useRef({ row: -1, col: -1 });

	const getGridPosition = (index: number) => ({
		row: Math.floor(index / GRID_SIZE),
		col: index % GRID_SIZE,
	});

	const interpolatePoints = (
		start: { row: number; col: number },
		end: { row: number; col: number }
	) => {
		const points = [];
		const deltaRow = end.row - start.row;
		const deltaCol = end.col - start.col;
		const distance = Math.max(Math.abs(deltaRow), Math.abs(deltaCol));

		if (distance === 0) return [end];

		for (let step = 0; step <= distance; step++) {
			const t = distance === 0 ? 0 : step / distance;
			const row = Math.round(start.row + deltaRow * t);
			const col = Math.round(start.col + deltaCol * t);
			points.push({ row, col });
		}

		return points;
	};

	const applyPenEffect = (centerIndex: number, intensity: number = 0.97) => {
		const currentPos = getGridPosition(centerIndex);

		setGrid((prev) => {
			const newGrid = [...prev];
			const radius = 2;
			let points = [];

			if (lastPos.current.row === -1) {
				points = [currentPos];
			} else {
				points = interpolatePoints(lastPos.current, currentPos);
			}

			points.forEach((point) => {
				for (let i = -radius; i <= radius; i++) {
					for (let j = -radius; j <= radius; j++) {
						const currentRow = point.row + i;
						const currentCol = point.col + j;

						if (
							currentRow < 0 ||
							currentRow >= GRID_SIZE ||
							currentCol < 0 ||
							currentCol >= GRID_SIZE
						) {
							continue;
						}

						const distance = Math.sqrt(i * i + j * j);
						const effectIntensity = Math.max(
							0,
							intensity * (1 - distance / (radius + 1))
						);

						const index = currentRow * GRID_SIZE + currentCol;
						newGrid[index] = Math.min(
							1,
							Math.max(newGrid[index], effectIntensity)
						);
					}
				}
			});

			return newGrid;
		});

		lastPos.current = currentPos;
	};

	const handleMouseDown = useCallback((index: number) => {
		setIsDrawing(true);
		lastPos.current = { row: -1, col: -1 }; // Reset last position
		applyPenEffect(index);
	}, []);

	const handleMouseEnter = useCallback(
		(index: number) => {
			if (isDrawing) {
				applyPenEffect(index);
			}
		},
		[isDrawing]
	);

	const handleMouseUp = useCallback(() => {
		setIsDrawing(false);
		lastPos.current = { row: -1, col: -1 }; // Reset last position
	}, []);

	const clearGrid = useCallback(() => {
		setGrid(Array(GRID_SIZE * GRID_SIZE).fill(0));
		lastPos.current = { row: -1, col: -1 }; // Reset last position
	}, []);

	const handleSubmit = async () => {
		try {
			const response = await fetch("/api/directpredict", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ image: grid }),
			});
			const data = await response.json();
			console.log(data);
			setPrediction(data.prediction);
			setActivations(data.activations);
		} catch (error) {
			console.error("Error:", error);
		}
	};

	const getBackgroundColor = (value: number) => {
		const intensity = Math.floor((1 - value) * 255);
		return `rgb(${intensity}, ${intensity}, ${intensity})`;
	};

	return (
		<>
			<Card className="w-full max-w-lg" draggable={false}>
				<CardHeader>
					<CardTitle>MNIST Drawing Grid</CardTitle>
				</CardHeader>
				<CardContent>
					<div
						className="grid gap-[1px] bg-gray-200 w-fit mx-auto"
						style={{
							gridTemplateColumns: `repeat(${GRID_SIZE}, 1fr)`,
						}}
						onMouseLeave={() => {
							setIsDrawing(false);
							lastPos.current = { row: -1, col: -1 };
						}}
						onMouseUp={handleMouseUp}
						draggable={false}
					>
						{grid.map((value, index) => (
							<div
								key={index}
								className="w-3 h-3 transition-colors"
								style={{
									backgroundColor: getBackgroundColor(value),
								}}
								onMouseDown={() => handleMouseDown(index)}
								onMouseEnter={() => handleMouseEnter(index)}
								draggable={false}
							/>
						))}
					</div>
					<div className="flex gap-4 mt-4 justify-center">
						<Button onClick={clearGrid} variant="outline" size="sm">
							Clear
						</Button>
						<Button onClick={handleSubmit} size="sm">
							Predict
						</Button>
					</div>
				</CardContent>
			</Card>

			{prediction !== null && (
				<div className="w-[60vw] mx-auto mt-6">
					<h2 className="text-xl font-bold mb-2">Prediction</h2>
					<p className="text-lg text-blue-600">{prediction}</p>
				</div>
			)}

			{activations?.length > 0 && (
				<div className="w-full mb-10">
					<h2 className="text-xl font-bold mb-4 w-[60%] mx-auto">Network Activations</h2>
					{activations?.map((activation, index) => {
						const isLastLayer = index === activations.length - 1;
						return (
							<ActivationGrid
								activation={activation}
								index={index}
								isLastLayer={isLastLayer}
							/>
						);
					})}
				</div>
			)}
		</>
	);
};

export default GridCanvas;
