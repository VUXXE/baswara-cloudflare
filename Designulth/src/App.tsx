import React from 'react'
import Hero from './components/Hero'
import Details from './components/Details'
import Gallery from './components/Gallery'
import Quote from './components/Quote'
import RSVP from './components/RSVP'
import Gift from './components/Gift'
import Memories from './components/Memories'
import Footer from './components/Footer'
import MusicPlayer from './components/MusicPlayer'
import { useScrollAnimation } from './hooks/useScrollAnimation'

function App() {
  useScrollAnimation();

  return (
    <div className="app-container">
      <Hero />
      <div className="app-content-wrapper">
        <Details />
        <Gallery />
        <Quote />
        <RSVP />
        <Gift />
        <Memories />
        <Footer />
      </div>
      <MusicPlayer />
    </div>
  )
}

export default App
