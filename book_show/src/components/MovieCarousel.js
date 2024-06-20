import React from 'react';
import { Carousel } from 'react-bootstrap';
import './MovieCarousel.css'; // Import your custom CSS for styling

const MovieCarousel = () => {
  return (
    <div className="movie-carousel-container">
      <Carousel interval={3000}  controls={false}  prevIcon={null} nextIcon={null} className="custom-carousel">
        <Carousel.Item>
          <div className="carousel-item-wrapper">
            <img
              src="https://m.media-amazon.com/images/M/MV5BNmYzMWVjNmQtNjJjNy00M2Y4LTkzZjQtZWQ5NmYzMjRjMDIzXkEyXkFqcGdeQXVyMTM1NjM2ODg1._V1_FMjpg_UX1000_.jpg"
              width="250"
              height="300"
              alt="First slide"
            />
            <img
              src="https://pbs.twimg.com/media/GMK3POfWEAA7lSM?format=jpg&name=4096x4096"
              width="250"
              height="300"
              alt="Second slide"
            />
          </div>
        </Carousel.Item>
        <Carousel.Item>
          <div className="carousel-item-wrapper">
            <img
              src="https://preview.redd.it/official-poster-for-kingdom-of-the-planet-of-the-apes-v0-7hkr42zyn1ic1.jpeg?auto=webp&s=ca0033d764b8fc55b8150eca3c8808ca92dc8574"
              width="250"
              height="300"
              alt="Third slide"
            />
            <img
              src="https://m.media-amazon.com/images/M/MV5BYTM4ZDdiNjUtYjBmOS00MGI3LWExOTAtZDU3NmZlOWQ0YTc3XkEyXkFqcGdeQXVyMTUyNjIwMDEw._V1_.jpg"
              width="250"
              height="300"
              alt="Fourth slide"
            />
          </div>
        </Carousel.Item>
        <Carousel.Item>
          <div className="carousel-item-wrapper">
            <img
              src="https://img.republicworld.com/rimages/kathanar_poster-1710647842593.webp"
              width="250"
              height="300"
              alt="Third slide"
            />
            <img
              src="https://m.media-amazon.com/images/M/MV5BOWZiYzE5YjItNjVjNS00MzZjLTkwMTMtODBjNGIxMzQxOTg0XkEyXkFqcGdeQXVyMjkxNzQ1NDI@._V1_.jpg"
              width="250"
              height="300"
              alt="Fourth slide"
            />
          </div>
        </Carousel.Item>
      </Carousel>
    </div>
  );
};

export default MovieCarousel;
