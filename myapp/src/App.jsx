import { useEffect, useRef, useState } from 'react'
import './App.css'
import { BrowserRouter , Routes , Route } from 'react-router-dom'


import Home from "./Home.jsx"
import CallPage from './Call.jsx'

function App() {



  return (
    <>
      <BrowserRouter>
      <Routes>
        <Route path={"/"} element={<Home/>}/>
        <Route path={"/callpage"} element={<CallPage/>}/>
      </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
