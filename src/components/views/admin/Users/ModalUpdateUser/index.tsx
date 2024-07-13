import Button from "@/components/ui/Button";
import Modal from "@/components/ui/Modal";
import Select from "@/components/ui/Select";
import Input from "@/components/ui/input";
import userServices from "@/services/user";
import { User } from "@/types/user.type";
import { Dispatch, FormEvent, SetStateAction, useState } from "react";
import styles from "./ModalUpdateUser.module.scss";

type PropTypes = {
  updatedUser: User | any;
  setUpdatedUser: Dispatch<SetStateAction<{}>>;
  setUsersData: Dispatch<SetStateAction<User[]>>;
  setToaster: Dispatch<SetStateAction<{}>>;
};

const modalUpdateUser = ({
  updatedUser,
  setUpdatedUser,
  setUsersData,
  setToaster,
}: PropTypes) => {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const [isLoading, setIsLoading] = useState(false);

  const handleUpdateUser = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);
    const form: any = event.target as HTMLFormElement;
    const data = {
      role: form.role?.value,
    };

    const result = await userServices.updateUser(updatedUser.id, data);

    if (result.status === 200) {
      form.reset();
      setIsLoading(false);
      setUpdatedUser({});
      const { data } = await userServices.getAllUsers();
      setUsersData(data.data);
      setToaster({
        variant: "success",
        message: "User updated successfully",
      });
    } else {
      setIsLoading(false);
      setToaster({
        variant: "success",
        message: "Failed to update user",
      });
    }
  };
  return (
    <Modal onClose={() => setUpdatedUser({})}>
      <h1>Update User</h1>
      <form onSubmit={handleUpdateUser} className={styles.form}>
        <Input
          label="Fullname"
          type="text"
          name="fullname"
          defaultValue={updatedUser.fullname}
          disabled
          className={styles.form__input}
        />
        <Input
          label="Email"
          type="email"
          name="email"
          defaultValue={updatedUser.email}
          disabled
          className={styles.form__input}
        />
        <Input
          label="Phone"
          type="phone"
          name="phone"
          defaultValue={updatedUser.phone}
          disabled
          className={styles.form__input}
        />
        <Select
          label="Role"
          name="role"
          defaultValue={updatedUser.role}
          options={[
            { label: "Member", value: "member" },
            { label: "Admin", value: "admin" },
          ]}
          className={styles.form__input}
        />
        <Button type="submit">{isLoading ? "Updating..." : "Update"}</Button>
      </form>
    </Modal>
  );
};

export default modalUpdateUser;
