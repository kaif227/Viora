import { useState } from 'react'
import './App.css'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import LandingPage from './pages/landingPage.jsx'
import HomeComponent from './pages/home.jsx';
import Auth from './pages/authentication.jsx'
import { AuthProvider } from './context/authConext.jsx'
import VideoMeetComp from './pages/videoMeetComp.jsx';
import History from './pages/history.jsx';
function App() {

  return (
    <>
    <Router>
      <AuthProvider>
        <Routes>
          <Route path= "/" element={<LandingPage/>} />
          {/* <Route path= "/home" element={<LandingPage/>} /> */}
          <Route path="/auth" element={<Auth/>} />
          <Route path="/home" element={<HomeComponent/>} />
          <Route path="/:url" element={<VideoMeetComp/>} />
          <Route path="/history" element={<History/>} />
        </Routes>
      </AuthProvider>
    </Router>
      {/* <LandingPage/> */}
    </>
  )
}

export default App
