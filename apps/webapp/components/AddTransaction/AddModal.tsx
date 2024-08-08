import React, { useState } from 'react';
import Modal from "../Modal";
import Button from "../Button";
import './AddTransaction.css';  // Import the CSS file

type AddTransactionProps = {
  isOpen: boolean;
  onClose: () => void;
}

const AddTransaction: React.FC<AddTransactionProps> = ({ isOpen, onClose }) => {
  const [activeSection, setActiveSection] = useState<number>(1);
  const totalSections = 6;

  if (!isOpen) return null;

  const handleNext = () => {
    setActiveSection(prev => (prev < totalSections ? prev + 1 : prev));
  }

  const handlePrevious = () => {
    setActiveSection(prev => (prev > 1 ? prev - 1 : prev));
  }

  const progressPercentage = (activeSection / totalSections) * 100;

  return (
    <Modal isOpen={isOpen} onClose={onClose} className="py-2 rounded-lg flex flex-col ">
      <div className="flex justify-around items-stretch h-full section-container">
        <div className={`section ${activeSection === 1 ? 'active' : ''}`} onClick={() => setActiveSection(1)}>Space</div>
        <div className={`section ${activeSection === 2 ? 'active' : ''}`} onClick={() => setActiveSection(2)}>Account</div>
        <div className={`section ${activeSection === 3 ? 'active' : ''}`} onClick={() => setActiveSection(3)}>Type</div>
        <div className={`section ${activeSection === 4 ? 'active' : ''}`} onClick={() => setActiveSection(4)}>Category</div>
        <div className={`section ${activeSection === 5 ? 'active' : ''}`} onClick={() => setActiveSection(5)}>Date</div>
        <div className={`section ${activeSection === 6 ? 'active' : ''}`} onClick={() => setActiveSection(6)}>Amount</div>
      </div>

      {/* Progress Bar */}
      <div className="progress-bar-container">
        <div className="progress-bar" style={{ width: `${progressPercentage}%` }}></div>
      </div>

      {/* Navigation Buttons */}
      <div className="flex justify-between progress-container">
        <Button className="previous-button" onClick={handlePrevious} disabled={activeSection === 1}>
          Previous
        </Button>
        <Button className="next-button" onClick={handleNext} disabled={activeSection === totalSections}>
          Next
        </Button>
      </div>
    </Modal>
  )
}

export default AddTransaction;
