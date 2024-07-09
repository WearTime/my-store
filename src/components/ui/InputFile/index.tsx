import { Dispatch, SetStateAction } from "react";
import styles from "./Input.module.scss";

type PropTypes = {
  uploadedImage: File | null;
  setUploadedImage: Dispatch<SetStateAction<File | null>>;
  name: string;
};
const InputFile = ({ name, uploadedImage, setUploadedImage }: PropTypes) => {
  return (
    <div className={styles.file}>
      <label className={styles.file__label} htmlFor={name}>
        {uploadedImage?.name ? (
          <p>{uploadedImage?.name}</p>
        ) : (
          <>
            <p>Upload a new Image, larger image will be reszed automatically</p>
            <p>
              Maximum upload size is <b>1MB</b>
            </p>
          </>
        )}
      </label>
      <input
        className={styles.file__input}
        type="file"
        name={name}
        id={name}
        onChange={(e: any) => {
          e.preventDefault();
          setUploadedImage(e.currentTarget.files[0]);
        }}
      />
    </div>
  );
};

export default InputFile;
