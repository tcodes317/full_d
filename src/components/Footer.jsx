import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white py-8 mt-8">
      <div className="container mx-auto text-center">
        <p className="text-sm">
          &copy; {new Date().getFullYear()} My Website. All rights reserved.
        </p>
        <div className="mt-4">
          <a href="#home" className="text-gray-400 hover:text-white px-3">Home</a>
          <a href="#about" className="text-gray-400 hover:text-white px-3">About</a>
          <a href="#services" className="text-gray-400 hover:text-white px-3">Services</a>
          <a href="#contact" className="text-gray-400 hover:text-white px-3">Contact</a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;