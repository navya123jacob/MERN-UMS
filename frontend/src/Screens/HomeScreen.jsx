import React from 'react';
import Hero from '../Components/Hero';
import Header from '../Components/Header';

const HomeScreen = () => {
  return (
    <>
      <Header />
      <div className="home-screen-bg">
        <Hero />
      </div>
    </>
  );
}

export default HomeScreen;
