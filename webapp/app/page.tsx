import Canvas from "../components/Canvas"

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center pt-20">
      <h1 className='text-white text-2xl mb-4'>Welcome to Hand written digit recognition model</h1>
      <p>Draw a digit on the provided canvas to get started</p>
      <Canvas />
    </main>
  )
}
