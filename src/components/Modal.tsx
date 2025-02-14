import React from 'react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;

  return (
    <div style={overlayStyle} onClick={onClose}>
      <div style={modalStyle} onClick={(e) => e.stopPropagation()}>
        {children}
      </div>
    </div>
  );
};

const overlayStyle: React.CSSProperties = {
  position: 'fixed',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundColor: 'rgba(0, 0, 0, 0.7)', // Aseguramos que el fondo esté completamente oscuro
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  zIndex: 99999999,
  margin: 0, // Asegura que no haya márgenes adicionales
  padding: 0, // Elimina cualquier posible espacio extra
};

const modalStyle: React.CSSProperties = {
  backgroundColor: 'white',
  padding: '20px',
  borderRadius: '8px',
  maxWidth: '400px',
  width: '100%',
  zIndex: 9999999999,
  position: 'relative',
  overflow: 'hidden', // Evita el desbordamiento y el desplazamiento del modal
};

const closeButtonStyle: React.CSSProperties = {
  position: 'absolute',
  top: '10px',
  right: '10px',
  border: 'none',
  backgroundColor: 'transparent',
  fontSize: '18px',
  cursor: 'pointer',
};

export default Modal;
