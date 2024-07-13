import Button from "@/components/ui/Button";
import Modal from "@/components/ui/Modal";
import styles from "./ModalDeletedProduct.module.scss";
import { Dispatch, SetStateAction, useState } from "react";
import productServices from "@/services/product";
import { Product } from "@/types/product.type";
import { deleteFile } from "@/lib/firebase/service";

type PropTypes = {
  deletedProduct: Product | any;
  setDeletedProduct: Dispatch<SetStateAction<{}>>;
  setProductsData: Dispatch<SetStateAction<Product[]>>;
  setToaster: Dispatch<SetStateAction<{}>>;
};
const ModalDeleteProduct = ({
  deletedProduct,
  setDeletedProduct,
  setProductsData,
  setToaster,
}: PropTypes) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleDelete = async () => {
    const result = await productServices.deleteProduct(deletedProduct.id);
    if (result.status === 200) {
      setIsLoading(false);
      deleteFile(
        `/images/products/${deletedProduct.id}/${
          deletedProduct.image.split("%2F")[3].split("?")[0]
        }`,
        async (status: boolean) => {
          if (status) {
            setToaster({
              variant: "success",
              message: "Success delete product",
            });
            setDeletedProduct({});
            const { data } = await productServices.getAllProducts();
            setProductsData(data.data);
          }
        }
      );
    } else {
      setIsLoading(false);
      setToaster({
        variant: "success",
        message: "Failed to delete Product",
      });
    }
  };
  return (
    <Modal onClose={() => setDeletedProduct({})}>
      <h1 className={styles.modal__title}>Are you sure?</h1>
      <Button type="button" onClick={async () => handleDelete()}>
        {isLoading ? "Deleting..." : "Delete"}
      </Button>
    </Modal>
  );
};
export default ModalDeleteProduct;
