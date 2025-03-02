
export default function Home() {
  return (
      <div className="my-28">
        <div className="flex items-center flex-col font-bold">
            {/* <div className='mb-4 flex items-center border shadow-sm p-4 bg-amber-100 text-amber-700 rounded-full uppercase'>
                Rich Sharing
            </div> */}
              <h1 className='text-3xl md:text-6xl text-center text-neutral-700 mb-6'>
                Felvevő: Capture & share videos
              </h1>
              <div className='text-3xl md:text-6xl bg-gradient-to-r from-emerald-600 to-cyan-600 text-white px-4 p-2 rounded-md pb-4 w-fit'>
                Powered with AI
              </div>
        </div>
        <div className="text-sm md:text-xl text-neutral-400 mt-4 max-w-xs md:max-w-2xl text-center mx-auto">
          Effortlessly capture, share, and organize your screen recordings across multiple workspaces. Streamline collaboration with seamless video uploads powered with AI.
        </div>
      </div>
  );
}
