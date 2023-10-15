import React from "react";
import styles from "./addMemberModal.module.scss";

const AddMemberModal = ({
  closeModal,
  member,
  capital,
  setCapital,
  setRole,
  role,
  handleModalSubmit,
  modalMessage,
}) => {
  return (
    <>
      <div className={styles.modal}>
        <span className={styles.close} onClick={closeModal}>
          &times;
        </span>
        <h2>{member.name}</h2>
        <div>
          Capital:
          <input
            type="number"
            value={capital}
            onChange={(e) => setCapital(e.target.value)}
          />
        </div>
        <div>
          Role:
          <select value={role} onChange={(e) => setRole(e.target.value)}>
            <option value="founder">Founder</option>
            <option value="member">Member</option>
          </select>
        </div>
        {modalMessage && <p className={styles.message}>{modalMessage}</p>}
        <button onClick={handleModalSubmit}>Add Member</button>
      </div>
      <div className={styles.backdrop}></div>
    </>
  );
};

export default AddMemberModal;
