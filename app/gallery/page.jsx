"use client";

// pages/gallery.js

import React, { useState } from "react";
import Image from "next/image";
import Modal from "react-modal";
import { FaArrowLeft, FaArrowRight, FaTimes } from "react-icons/fa";
import { demo1, demo2, demo3, demo4 } from "@/components/ServicesImages";

const Gallery = () => {
  const images = [
    demo1,
    demo2,
    demo3,
    demo4,
    demo1,
    demo2,
    demo3,
    demo4,
    // Add more image URLs as needed
  ];

  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  const openModal = (index) => {
    setCurrentIndex(index);
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
  };

  const goToPrevious = () => {
    setCurrentIndex(
      (prevIndex) => (prevIndex - 1 + images.length) % images.length
    );
  };

  const goToNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
  };

  return (
    <div className="animate-fadeIn grid grid-cols-1 gap-1 sm:grid-cols-2 md:grid-cols-3 md:pt-20 lg:grid-cols-4">
      {images.map((image, index) => (
        <div key={index} className="overflow-hidden">
          <Image
            src={image}
            width={300}
            height={300}
            alt={`Image ${index}`}
            className="object-cover h-full w-full cursor-pointer"
            onClick={() => openModal(index)}
          />
        </div>
      ))}
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        contentLabel="Image Modal"
        className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-75"
        overlayClassName="fixed inset-0 bg-black bg-opacity-75"
      >
        <button
          className=" z-20 absolute md:top-20 top-20 right-0 m-2 p-2 bg-white rounded-full"
          onClick={closeModal}
        >
          <FaTimes />
        </button>
        <button
          className="z-20 absolute top-1/2 left-4 transform -translate-y-1/2 p-2 bg-white rounded-full"
          onClick={goToPrevious}
        >
          <FaArrowLeft />
        </button>
        <button
          className="z-20 absolute top-1/2 right-4 transform -translate-y-1/2 p-2 bg-white rounded-full"
          onClick={goToNext}
        >
          <FaArrowRight />
        </button>
        <div className="relative max-w-3xl mx-auto">
          <div className="flex justify-center items-center">
            <Image
              src={images[currentIndex]}
              width={800}
              height={800}
              alt={`Image ${currentIndex}`}
              className="max-h-screen h-auto w-auto"
            />
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default Gallery;
