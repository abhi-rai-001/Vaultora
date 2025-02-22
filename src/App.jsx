import React from 'react'
import Navbar from './Components/Navbar'
import Hero from './Components/Hero'
import Footer from './Components/Footer'
const App = () => {
  return (
    <div className="font-poppins  inset-0 -z-10 h-full w-full bg-white [background:radial-gradient(125%_125%_at_50%_10%,#fff_40%,#3b82f6_100%)]">
      
      <Navbar/>
      <Hero/>
      <Footer/>

    </div>
  )
}

export default App
