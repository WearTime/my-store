import styles from "./Input.module.scss";

type PropsTypes = {
  label?: string;
  name: string;
  type: string;
  placeholder?: string;
};
const Input = ({ label, name, type, placeholder }: PropsTypes) => {
  return (
    <>
      <div className={styles.container}>
        {label && <label htmlFor={name}>{label}</label>}
        <input
          type={type}
          placeholder={placeholder}
          name={name}
          id={name}
          className={styles.container__input}
        />
      </div>
    </>
  );
};

export default Input;
