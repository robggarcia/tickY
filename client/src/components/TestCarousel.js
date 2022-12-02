import Carousel from "react-bootstrap/Carousel";
import "../App.css";
const TestCarousel = () => {
  return (
    <>
      <div className="carousel">
        <Carousel>
          <Carousel.Item>
            <div className="carouselImg">
              <img
                className="test2"
                src="https://media.vsstatic.com/image/upload/f_auto,q_auto/hero/category/68-other-concerts/other-concerts-tickets-1.jpg"
                // src="holder.js/800x400?text=Second slide&bg=282c34"
              />
            </div>
            <h3>No Fees. Just Easy Tickets.</h3>
          </Carousel.Item>
          <Carousel.Item>
            <div classname="carouselImg">
              <img
                className="test2"
                src="https://www.jonesaroundtheworld.com/wp-content/uploads/2019/05/Electric-Zoo-New-York-Electronic-Music-Festival-2021.jpeg"
                // src="holder.js/800x400?text=Second slide&bg=282c34"
              />
            </div>
            <h3>
              All tickets are 100% guaranteed to be valid. If there's ever an
              issue, we'll replace them on the spot.
            </h3>
          </Carousel.Item>
        </Carousel>
      </div>
    </>
  );
};

export default TestCarousel;
