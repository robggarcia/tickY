import Carousel from "react-bootstrap/Carousel";

const TestCarousel = () => {
  return (
    <>
      <div className="carousel">
        <Carousel>
          <Carousel.Item>
            <div className="carouselImg">
              <img
                className="d-block w-100"
                src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRNSjz4D9d6d--7uxAwRUG3pjD71yNDGu03Nw&usqp=CAU"
                // src="holder.js/800x400?text=Second slide&bg=282c34"
              />
            </div>
            Test caption 1
          </Carousel.Item>
          <Carousel.Item>
            <img
              className="d-block w-100"
              src="holder.js/800x400?text=Second slide&bg=282c34"
              alt="Second slide"
            />
            <div className="carouselCaption">
              <Carousel.Caption>
                <h3>2 slide label TESffffffT</h3>
                <p>Here we can add the first sentence.</p>
              </Carousel.Caption>
            </div>
          </Carousel.Item>
          <Carousel.Item>
            <img
              className="d-block w-100"
              src="holder.js/800x400?text=Third slide&bg=20232a"
              alt="Third slide"
            />
            <div className="carouselCaption">
              <Carousel.Caption>
                <h3>3 slide label TESffffffT</h3>
                <p>Here we can add the first sentence.</p>
              </Carousel.Caption>
            </div>
          </Carousel.Item>
        </Carousel>
      </div>
    </>
  );
};

export default TestCarousel;
