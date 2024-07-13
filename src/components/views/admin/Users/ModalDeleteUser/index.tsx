import Button from "@/components/ui/Button";
import Modal from "@/components/ui/Modal";
import userServices from "@/services/user";
import styles from "./ModalDeletedUsers.module.scss";
import { Dispatch, SetStateAction, useState } from "react";
import { User } from "@/types/user.type";

type PropTypes = {
  deletedUser: User | any;
  setDeletedUser: Dispatch<SetStateAction<{}>>;
  setUsersData: Dispatch<SetStateAction<User[]>>;
  setToaster: Dispatch<SetStateAction<{}>>;
};
const ModalDeleteUser = ({
  deletedUser,
  setDeletedUser,
  setUsersData,
  setToaster,
}: PropTypes) => {
  const [isLoading, setIsLoading] = useState(false);
  const handleDelete = async () => {
    const result = await userServices.deleteUser(deletedUser.id);
    if (result.status === 200) {
      setIsLoading(false);
      setToaster({
        variant: "success",
        message: "User deleted successfully",
      });
      setDeletedUser({});
      const { data } = await userServices.getAllUsers();
      setUsersData(data.data);
    } else {
      setIsLoading(false);
      setToaster({
        variant: "success",
        message: "Failed to delete user",
      });
    }
  };
  return (
    <Modal onClose={() => setDeletedUser({})}>
      <h1 className={styles.modal__title}>Are you sure?</h1>
      <Button type="button" onClick={async () => handleDelete()}>
        {isLoading ? "Deleting..." : "Delete"}
      </Button>
    </Modal>
  );
};
export default ModalDeleteUser;
