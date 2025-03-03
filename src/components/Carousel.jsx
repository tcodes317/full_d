import { useEffect, useState, useRef } from "react";

const images = [
  "https://images.pexels.com/photos/414171/pexels-photo-414171.jpeg",
  "https://images.pexels.com/photos/210243/pexels-photo-210243.jpeg",
  "https://images.pexels.com/photos/355747/pexels-photo-355747.jpeg",
];

const Carousel = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const intervalRef = useRef(null);

  useEffect(() => {
    // Function to go to the next slide
    const nextSlide = () => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    };

    // Auto-slide every 3 seconds
    intervalRef.current = setInterval(nextSlide, 3000);

    // Cleanup function to stop interval when component unmounts
    return () => clearInterval(intervalRef.current);
  }, []);

  // Manual navigation
  const prevSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex === 0 ? images.length - 1 : prevIndex - 1));
  };

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
  };

  return (
    <div className="relative w-[1456px] h-screen overflow-hidden">
      {/* Image Container */}
      <div className="absolute inset-0 transition-all duration-700">
        <img src={images[currentIndex]} alt="carousel" className="w-full h-full object-cover" />
      </div>

      {/* Previous Button */}
      <button
        onClick={prevSlide}
        className="absolute left-5 top-1/2 transform -translate-y-1/2 bg-gray-900 bg-opacity-50 text-white p-4 rounded-full hover:bg-gray-700 transition"
      >
        ❮
      </button>

      {/* Next Button */}
      <button
        onClick={nextSlide}
        className="absolute right-5 top-1/2 transform -translate-y-1/2 bg-gray-900 bg-opacity-50 text-white p-4 rounded-full hover:bg-gray-700 transition"
      >
        ❯
      </button>

      {/* Dots Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-3">
        {images.map((_, index) => (
          <div
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`w-4 h-4 rounded-full cursor-pointer transition-all ${
              currentIndex === index ? "bg-white scale-110" : "bg-gray-500"
            }`}
          ></div>
        ))}
      </div>
    </div>
  );
};

export default Carousel;