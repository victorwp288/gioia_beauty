import React from "react";
import Modal from "react-modal";

const customStyles = {
  content: {
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",
    transform: "translate(-50%, -50%)",
  },
};

const BookingConfirmation = ({ isOpen, onRequestClose }) => {
  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      style={customStyles}
      contentLabel="Appointment Booked"
    >
      <h2>Appointment Booked!</h2>
      <button onClick={onRequestClose}>Close</button>
    </Modal>
  );
};

export default BookingConfirmation;
