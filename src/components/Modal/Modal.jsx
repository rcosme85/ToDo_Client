import styles from "./Modal.module.css";

const Modal = ({ isOpen, onClose, children }) => {
  return (
    <div
      className={styles.modalContainer}
      style={{ display: isOpen ? "grid" : "none" }}
    >
      <div className={styles.modalBody}>
        <button className={styles.modalClose} onClick={onClose}>
          X
        </button>
        {children}
      </div>
    </div>
  );
};

export default Modal;
