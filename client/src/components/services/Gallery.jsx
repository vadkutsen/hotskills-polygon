const Gallery = ({ images }) => {
  function slidesPlugin(activeSlide = 0) {
    const slides = document.querySelectorAll(".slide");

    slides[activeSlide]?.classList.add("active");

    function clearActiveClasses() {
      slides.forEach((slide) => {
        slide.classList.remove("active");
      });
    }

    for (const slide of slides) {
      slide.addEventListener("click", () => {
        clearActiveClasses();
        slide.classList.add("active");
      });
    }
  }

  slidesPlugin();

  return (
    <div className="container">
      {images.map((image, i) => (
        <div
          key={i}
          className="slide"
          style={{
            backgroundImage: `url(${image})`,
          }}
        />
      ))}
    </div>
  );
};

export default Gallery;
