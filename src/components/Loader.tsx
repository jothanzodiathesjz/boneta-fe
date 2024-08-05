import React from 'react'

export default function Loader() {
  return (
    <div 
    style={{zIndex:10000}}
    className='w-full h-screen flex justify-center items-center fixed top-0 left-0  bg-black/70'>
    <div className="loader">
    <div className="panWrapper">
        <div className="pan">
        <div className="food" />
        <div className="panBase" />
        <div className="panHandle" />
        </div>
        <div className="panShadow" />
    </div>
    </div>
    </div>

  )
}
