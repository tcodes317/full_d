import { useState, useRef, useEffect } from "react";

const cards = [
  { id: 1, title: "Card 1", image: "https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg" },
  { id: 2, title: "Card 2", image: "https://images.pexels.com/photos/669580/pexels-photo-669580.jpeg" },
  { id: 3, title: "Card 3", image: "https://images.pexels.com/photos/276467/pexels-photo-276467.jpeg" },
  { id: 4, title: "Card 4", image: "https://images.pexels.com/photos/325185/pexels-photo-325185.jpeg" },
  { id: 5, title: "Card 5", image: "https://images.pexels.com/photos/1236701/pexels-photo-1236701.jpeg" },
];

const CardIv = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const sliderRef = useRef(null);
  const totalSlides = cards.length;

  useEffect(() => {
    if (sliderRef.current) {
      sliderRef.current.style.transform = `translateY(-${currentIndex * 100}%)`;
      sliderRef.current.style.transition = "transform 0.5s ease-in-out";
    }
  }, [currentIndex]);

  const goToNextSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex >= totalSlides - 1 ? 0 : prevIndex + 1));
  };

  const goToPrevSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex === 0 ? totalSlides - 1 : prevIndex - 1));
  };

  return (
    <div className="relative w-full h-screen flex items-center justify-center bg-gray-100">
      <div className="w-80 h-96 overflow-hidden relative">
        {/* Slider Container */}
        <div ref={sliderRef} className="flex flex-col transition-transform duration-700 ease-in-out">
          {cards.map((card, index) => (
            <div key={card.id} className="min-h-[100%] flex flex-col items-center justify-center p-5">
              <div className="bg-white shadow-lg rounded-lg p-5 w-80 text-center">
                <img src={card.image} alt={card.title} className="w-full h-48 object-cover rounded-lg" />
                <h3 className="text-xl font-bold mt-4">{card.title}</h3>
              </div>
              <div className="flex gap-4 mt-4">
                {index > 0 && (
                  <button
                    onClick={goToPrevSlide}
                    className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-700 transition"
                  >
                    Up
                  </button>
                )}
                {index < totalSlides - 1 && (
                  <button
                    onClick={goToNextSlide}
                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
                  >
                    Down
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CardIv;