import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const HeroCarousel = () => {
    const [currentSlide, setCurrentSlide] = useState(0);

    const banners = [
        {
            id: 1,
            image: "https://assets-in.bmscdn.com/promotions/cms/creatives/1690965948939_desktop.jpg",
            title: "Endless Entertainment"
        },
        {
            id: 2,
            image: "https://assets-in.bmscdn.com/promotions/cms/creatives/1692875161492_jawanbanner.jpg",
            title: "Jawan Pre-Booking"
        },
        {
            id: 3,
            image: "https://assets-in.bmscdn.com/promotions/cms/creatives/1691136453926_gadar2.jpg",
            title: "Gadar 2 Now Showing"
        }
    ];

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % banners.length);
        }, 5000);
        return () => clearInterval(timer);
    }, [banners.length]);

    const nextSlide = () => {
        setCurrentSlide((prev) => (prev + 1) % banners.length);
    };

    const prevSlide = () => {
        setCurrentSlide((prev) => (prev - 1 + banners.length) % banners.length);
    };

    return (
        <div style={{ position: 'relative', width: '100%', overflow: 'hidden', backgroundColor: 'var(--bg-tertiary)' }}>
            <div
                style={{
                    display: 'flex',
                    transition: 'transform 0.5s ease-in-out',
                    transform: `translateX(-${currentSlide * 100}%)`,
                    width: '100%'
                }}
            >
                {banners.map((banner) => (
                    <div key={banner.id} style={{ minWidth: '100%', flexShrink: 0 }}>
                        <div style={{
                            position: 'relative',
                            height: '400px',
                            width: '100%',
                            backgroundImage: `url(${banner.image})`,
                            backgroundSize: 'cover',
                            backgroundPosition: 'center',
                            cursor: 'pointer'
                        }}>
                        </div>
                    </div>
                ))}
            </div>

            {/* Navigation Buttons */}
            <button
                onClick={prevSlide}
                style={{
                    position: 'absolute',
                    left: '1rem',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    backgroundColor: 'rgba(0,0,0,0.5)',
                    color: 'white',
                    border: 'none',
                    borderRadius: '50%',
                    width: '40px',
                    height: '40px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    zIndex: 10
                }}
            >
                <ChevronLeft size={24} />
            </button>

            <button
                onClick={nextSlide}
                style={{
                    position: 'absolute',
                    right: '1rem',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    backgroundColor: 'rgba(0,0,0,0.5)',
                    color: 'white',
                    border: 'none',
                    borderRadius: '50%',
                    width: '40px',
                    height: '40px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    zIndex: 10
                }}
            >
                <ChevronRight size={24} />
            </button>

            {/* Indicators */}
            <div style={{
                position: 'absolute',
                bottom: '1rem',
                left: '50%',
                transform: 'translateX(-50%)',
                display: 'flex',
                gap: '0.5rem',
                zIndex: 10
            }}>
                {banners.map((_, index) => (
                    <div
                        key={index}
                        onClick={() => setCurrentSlide(index)}
                        style={{
                            width: '8px',
                            height: '8px',
                            borderRadius: '50%',
                            backgroundColor: currentSlide === index ? 'white' : 'rgba(255,255,255,0.5)',
                            cursor: 'pointer',
                            transition: 'background-color 0.3s'
                        }}
                    />
                ))}
            </div>
        </div>
    );
};

export default HeroCarousel;
