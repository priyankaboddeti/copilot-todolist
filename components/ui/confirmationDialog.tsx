import React, { useState } from 'react';
import { Button } from './button';

interface ConfirmationDialogProps {
  title: string;
  onConfirm: () => void;
  onCancel: () => void;
}

const ConfirmationDialog: React.FC<ConfirmationDialogProps> = ({
  title,
  onConfirm,
  onCancel,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleConfirm = () => {
    onConfirm();
    setIsOpen(false);
  };

  const handleCancel = () => {
    onCancel();
    setIsOpen(false);
  };

  return (
    <div style={{backgroundColor:"#00b2b9",height:"50px"}}>
      <Button onClick={() => setIsOpen(true)}>Delete Task</Button>
      {isOpen && (
        <div className="dialog">
          <h3>Are you sure you want to delete "{title}"?</h3>
          <Button onClick={handleConfirm}>Yes</Button>
          <Button onClick={handleCancel}>No</Button>
        </div>
      )}
    </div>
  );
};

export default ConfirmationDialog;