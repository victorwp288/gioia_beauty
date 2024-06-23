import Image from "next/image";
import { demo1, demo2, demo3, demo4 } from "@/components/ServicesImages";
import GalleryClient from "@/components/GalleryClient";

const Gallery = () => {
  const images = [demo1, demo2, demo3, demo4, demo1, demo2, demo3, demo4];
  return (
    <div className="animate-fadeIn grid grid-cols-1 gap-1 sm:grid-cols-2 md:grid-cols-3 md:pt-16 lg:grid-cols-4">
      {images.map((image, index) => (
        <div key={index} className="overflow-hidden">
          <GalleryClient images={images} index={index} />
        </div>
      ))}
    </div>
  );
};

export default Gallery;
