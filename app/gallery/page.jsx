// pages/gallery.js

import React from "react";
import Image from "next/image";

const Gallery = () => {
  const images = [
    "https://via.placeholder.com/300",
    "https://via.placeholder.com/300",
    "https://via.placeholder.com/300",
    "https://via.placeholder.com/300",
    "https://via.placeholder.com/300",
    "https://via.placeholder.com/300",
    // Add more image URLs as needed
  ];

  return (
    <div className=" grid grid-cols-1 gap-1 sm:grid-cols-2 md:grid-cols-3 md:pt-20 lg:grid-cols-4">
      {images.map((image, index) => (
        <div key={index} className="overflow-hidden ">
          <Image
            src={image}
            width={300}
            height={300}
            alt={`Image ${index}`}
            className="h-auto w-full"
          />
        </div>
      ))}
    </div>
  );
};

export default Gallery;
