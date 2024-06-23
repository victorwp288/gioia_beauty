"use client";

import React, { useState } from "react";
import Image from "next/image";
import Modal from "react-modal";
import { FaArrowLeft, FaArrowRight, FaTimes } from "react-icons/fa";

const GalleryClient = ({ images, index }) => {
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(index);

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
    <>
      <Image
        src={images[index]}
        width={300}
        height={300}
        alt={`Image ${index}`}
        className="object-cover h-full w-full cursor-pointer"
        onClick={() => openModal(index)}
      />
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        contentLabel="Image Modal"
        className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-75"
        overlayClassName="fixed inset-0 bg-black bg-opacity-75"
      >
        <button
          className="z-20 absolute md:top-20 top-20 right-0 m-2 p-2 bg-white rounded-full"
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
    </>
  );
};

export default GalleryClient;
