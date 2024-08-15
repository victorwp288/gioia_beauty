import Image from "next/image";
import GalleryClient from "@/components/GalleryClient";
import {
  heroPicture,
  reception1,
  reception2,
  reception3,
  reception4,
  mirror1,
  mirror2,
  pressoterapia1,
  massaggi1,
  ossigeno,
  bagnoturco1,
  bed,
  rituali1,
} from "@/components/ImagesExports";

const Gallery = () => {
  const imagesWithDescriptions = [
    {
      src: reception1,
      description: "Reception",
    },
    {
      src: reception2,
      description: "Reception",
    },
    {
      src: reception3,
      description: "Reception",
    },
    {
      src: reception4,
      description: "",
    },
    {
      src: mirror1,
      description: "",
    },
    {
      src: mirror2,
      description: "",
    },
    {
      src: pressoterapia1,
      description: "Pressoterapia",
    },
    {
      src: massaggi1,
      description: "",
    },
    {
      src: ossigeno,
      description: "Ossigeno Dermo Infusione",
    },
    {
      src: bagnoturco1,
      description: "Bagno turco",
    },
    {
      src: bed,
      description: "",
    },
    {
      src: rituali1,
      description: "Rituale Himalaya",
    },
  ];

  return (
    <div className="animate-fadeIn grid grid-cols-1 gap-1 sm:grid-cols-2 md:grid-cols-3 md:pt-16 lg:grid-cols-4">
      {imagesWithDescriptions.map((image, index) => (
        <div key={index} className="overflow-hidden">
          <GalleryClient
            imagesWithDescriptions={imagesWithDescriptions}
            index={index} // Pass the current index here
          />
        </div>
      ))}
    </div>
  );
};

export default Gallery;
