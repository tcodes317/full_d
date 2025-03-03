import { useEffect, useState, useRef } from "react";

const cards = [
  { id: 1, title: "Card 1", image: "https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg" },
  { id: 2, title: "Card 2", image: "https://images.pexels.com/photos/669580/pexels-photo-669580.jpeg" },
  { id: 3, title: "Card 3", image: "https://images.pexels.com/photos/276467/pexels-photo-276467.jpeg" },
  { id: 4, title: "Card 4", image: "https://images.pexels.com/photos/325185/pexels-photo-325185.jpeg" },
];

const CardSlider = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const sliderRef = useRef(null);

  useEffect(() => {
    // Function to move to the next slide
    const nextSlide = () => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % cards.length);
    };

    // Auto-slide every 3 seconds
    const interval = setInterval(nextSlide, 3000);

    return () => clearInterval(interval); // Cleanup on unmount
  }, []);

  useEffect(() => {
    // Update translateX to move cards
    if (sliderRef.current) {
      sliderRef.current.style.transform = `translateX(-${currentIndex * 100}%)`;
    }
  }, [currentIndex]);

  const prevSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex === 0 ? cards.length - 1 : prevIndex - 1));
  };

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % cards.length);
  };

  return (
    <div className="relative w-full h-screen flex items-center justify-center bg-gray-100">
      <div className="w-[80%] max-w-4xl overflow-hidden relative">
        {/* Slider Container */}
        <div ref={sliderRef} className="flex transition-transform duration-700 ease-in-out">
          {cards.map((card) => (
            <div key={card.id} className="min-w-full flex justify-center p-5">
              <div className="bg-white shadow-lg rounded-lg p-5 w-80 text-center">
                <img src={card.image} alt={card.title} className="w-full h-48 object-cover rounded-lg" />
                <h3 className="text-xl font-bold mt-4">{card.title}</h3>
              </div>
            </div>
          ))}
        </div>

        {/* Previous Button */}
        <button
          onClick={prevSlide}
          className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-gray-900 bg-opacity-50 text-white p-3 rounded-full hover:bg-gray-700 transition"
        >
          ❮
        </button>

        {/* Next Button */}
        <button
          onClick={nextSlide}
          className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-gray-900 bg-opacity-50 text-white p-3 rounded-full hover:bg-gray-700 transition"
        >
          ❯
        </button>
      </div>
    </div>
  );
};

export default CardSlider;