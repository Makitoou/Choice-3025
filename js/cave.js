document.addEventListener("DOMContentLoaded", function () {
  document.body.style.filter = "brightness(0)";
  document.body.style.transition = "filter 1.5s ease";

  setTimeout(() => {
    document.body.style.filter = "brightness(1)";
  }, 100);

  setTimeout(() => {
    document.body.style.transition = "";
    document.body.style.filter = "";
  }, 1600);

  createSurfaceImages();
});
const imagesOnSurface = [];

function createSurfaceImages() {
  const imagesData = [
    { file: "bar.png", x: 320, y: 60 },
    { file: "file.png", x: 200, y: 800 },
    { file: "diamonds.png", x: 1300, y: 80 },
    { file: "bar.png", x: 1550, y: 70 },
  ];

  imagesData.forEach((imgData) => {
    const imageElem = document.createElement("img");
    imageElem.src = `../images/${imgData.file}`;
    imageElem.className = "artefact";
    imageElem.style.position = "fixed";
    imageElem.style.left = `${imgData.x}px`;
    imageElem.style.bottom = `${imgData.y}px`;
    imageElem.style.opacity = "0";
    imageElem.style.zIndex = "1000";
    document.body.appendChild(imageElem);

    imageElem.onload = () => {
      setTimeout(() => (imageElem.style.opacity = "1"), 100);
    };

    imageElem.addEventListener("click", () => {
      imageElem.style.opacity = "0";
      setTimeout(() => imageElem.remove(), 1000);
    });

    imagesOnSurface.push(imageElem);
  });
}
