import styles from "./input.module.scss";

type PropsTypes = {
  label?: string;
  name: string;
  type: string;
  placeholder?: string;
  defaultValue?: string;
  disabled?: boolean;
};
const Input = ({
  label,
  name,
  type,
  placeholder,
  defaultValue,
  disabled,
}: PropsTypes) => {
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
          defaultValue={defaultValue}
          disabled={disabled}
        />
      </div>
    </>
  );
};

export default Input;
