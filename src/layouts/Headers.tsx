export default function Header({toogle}:any) {
  return (
    <header  className="fixed top-0 z-20  w-full md:w-[500px]  shadow-md bg-[#Ffff] border-b flex flex-row items-center px-3 justify-between">
      <button
      onClick={toogle}
            className="absolute right-3"
            >
                <span className="material-icons">menu</span>
            </button>
            <div className="w-full flex justify-center ">
                <div className="flex flex-row items-center p-4">
                    <span className="material-icons text-orange-600">restaurant</span>
                    <span className="text-red-700 font-bold">Boneta</span>
                </div>
            </div>
    </header>
  )
}
