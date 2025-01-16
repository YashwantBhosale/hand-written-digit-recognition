import React from "react";

type ActivationGridProps = {
	activation: number[];
	index: number;
	isLastLayer: boolean;
};
const ActivationGrid: React.FC<ActivationGridProps> = ({ activation, index, isLastLayer }) => {
	const maxValue = Math.max(...activation) || 1;
	const normalizedActivation = activation.map((v) => v / maxValue);

	return (
		<div key={index} className="w-[60vw] space-y-2 mx-auto">
			<h3 className="text-lg font-medium text-gray-800">Layer {index + 1}</h3>
			<div
				className="grid gap-1"
				style={{
					gridTemplateColumns: `repeat(auto-fit, minmax(10px, 1fr))`,
					placeContent: "center",
				}}
			>
				{normalizedActivation.map((value, i) => (
					<div
						key={i}
						className="aspect-square relative flex items-center justify-center"
						style={{
							backgroundColor: `rgba(59, 130, 246, ${value})`,
							border: "1px solid rgba(59, 130, 246, 0.5)",
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

export default ActivationGrid;
