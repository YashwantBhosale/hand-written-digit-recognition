import GridCanvas from "@/components/CustomGridCanvas";
import "./App.css";

function App() {

	return (
		<main>
			<h1 className="text-black text-2xl mb-4">
				Welcome to Hand written digit recognition model
			</h1>
			<p>Draw a digit on the provided canvas to get started</p>
			<GridCanvas />
		</main>
	);
}

export default App;
