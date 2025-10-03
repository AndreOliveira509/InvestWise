// src/App.js
import React from 'react';
import Header from './components/Header/Header';
import Hero from './components/Hero/Hero';
import Features from './components/Features/Features';
import Benefits from './components/Benefits/Benefits';
import Preview from './components/Preview/Preview';
import Testimonials from './components/Testimonials/Testimonials';
import Faq from './components/Faq/Faq';
import Cta from './components/Cta/Cta';
import Footer from './components/Footer/Footer';

// Lembre-se de aplicar o hook useFadeIn nos componentes
// que ainda não o possuem (Hero, Features, Preview) para
// uma experiência consistente! A lógica é a mesma já mostrada.

function App() {
  return (
    <div className="App">
      <Header />
      <main>
        <Hero />
        <Features />
        <Benefits />
        <Preview />
        <Testimonials />
        <Faq />
        <Cta />
      </main>
      <Footer />
    </div>
  );
}

export default App;