import Button from "@/components/ui/Button";
import Input from "@/components/ui/input";
import Modal from "@/components/ui/Modal";
import Select from "@/components/ui/Select";
import { Dispatch, FormEvent, SetStateAction, useState } from "react";
import styles from "./ModalAddProduct.module.scss";
import { Product } from "@/types/product.type";
import InputFile from "@/components/ui/InputFile";
import productServices from "@/services/product";
import { uploadFile } from "@/lib/firebase/service";
import Image from "next/image";

type PropTypes = {
  setModalAddProduct: Dispatch<SetStateAction<boolean>>;
  setToaster: Dispatch<SetStateAction<{}>>;
  setProductsData: Dispatch<SetStateAction<Product[]>>;
};
const ModalAddProduct = ({
  setModalAddProduct,
  setToaster,
  setProductsData,
}: PropTypes) => {
  const [isLoading, setIsLoading] = useState(false);
  const [stockCount, setStockCount] = useState([{ size: "", qty: 0 }]);
  const [uploadedImage, setUploadedImage] = useState<File | null>(null);

  const handleStock = (e: any, type: string, i: number) => {
    const newStockCount: any = [...stockCount];
    newStockCount[i][type] = e.target.value;
    setStockCount(newStockCount);
  };

  const uploadImage = (id: string, form: any) => {
    const file = form.image.files[0];
    const newName = "main." + file.name.split(".")[1];
    if (file) {
      uploadFile(
        id,
        file,
        newName,
        "products",
        async (status: boolean, newImageURL: string) => {
          if (status) {
            const data = {
              image: newImageURL,
            };
            const result = await productServices.updateProduct(id, data);

            if (result.status == 200) {
              setIsLoading(false);
              setUploadedImage(null);
              form.reset();
              setModalAddProduct(false);
              const { data } = await productServices.getAllProducts();
              setProductsData(data.data);
              setToaster({
                variant: "success",
                message: "Success Product Added",
              });
            } else {
              setIsLoading(false);
              setToaster({
                variant: "danger",
                message: "Failed Add Product",
              });
            }
          } else {
            setIsLoading(false);
            setToaster({
              variant: "danger",
              message: "Failed Add Product",
            });
          }
        }
      );
    }
  };
  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);
    const form: any = event.target as HTMLFormElement;
    const stock = stockCount.map((stock) => {
      return {
        size: stock.size,
        qty: parseInt(`${stock.qty}`),
      };
    });
    const data = {
      name: form.name.value,
      price: parseInt(form.price.value),
      description: form.description.value,
      category: form.category.value,
      status: form.status.value,
      stock: stock,
      image: "",
    };

    const result = await productServices.addProduct(data);

    if (result.status == 200) {
      uploadImage(result.data.data.id, form);
    }
  };

  return (
    <Modal onClose={() => setModalAddProduct(false)}>
      <h1>Add Product</h1>
      <form onSubmit={handleSubmit} className={styles.form}>
        <Input
          label="Name"
          type="text"
          name="name"
          placeholder="Insert Product Name"
          className={styles.form__input}
        />
        <Input
          label="Price"
          type="number"
          name="price"
          placeholder="Insert Product Price"
          className={styles.form__input}
        />
        <Input
          label="Description"
          type="text"
          name="description"
          placeholder="Insert Product Description"
          className={styles.form__input}
        />
        <Select
          label="Category"
          name="category"
          options={[
            { label: "Men", value: "men" },
            { label: "Women", value: "women" },
          ]}
          className={styles.form__input}
        />
        <Select
          label="Status"
          name="status"
          options={[
            { label: "Released", value: "true" },
            { label: "Not Released", value: "false" },
          ]}
          className={styles.form__input}
        />
        <label htmlFor="image" className={styles.form__label}>
          Image
        </label>
        <div className={styles.form__image}>
          {uploadedImage ? (
            <Image
              width={200}
              height={200}
              src={URL.createObjectURL(uploadedImage)}
              alt="image"
              className={styles.form__image__preview}
            />
          ) : (
            <div className={styles.form__image__placeholder}>No Image</div>
          )}
          <InputFile
            name="image"
            uploadedImage={uploadedImage}
            setUploadedImage={setUploadedImage}
          />
        </div>
        <label htmlFor="stock" className={styles.form__input}>
          Stock
        </label>
        {stockCount.map((item: { size: string; qty: number }, i: number) => (
          <div className={styles.form__stock} key={i}>
            <div className={styles.form__stock__item}>
              <Input
                label="Size"
                name="size"
                type="text"
                placeholder="Insert Product Size"
                onChange={(e) => handleStock(e, "size", i)}
                className={styles.form__input}
              />
            </div>
            <div className={styles.form__stock__item}>
              <Input
                label="Qty"
                name="qty"
                type="text"
                placeholder="Insert Product Quantity"
                onChange={(e) => handleStock(e, "qty", i)}
                className={styles.form__input}
              />
            </div>
          </div>
        ))}
        <Button
          type="button"
          className={styles.form__stock__button}
          onClick={() => setStockCount([...stockCount, { size: "", qty: 0 }])}
        >
          Add New Stock
        </Button>

        <Button type="submit" disabled={isLoading}>
          {isLoading ? "Loading..." : "Add Product"}
        </Button>
      </form>
    </Modal>
  );
};

export default ModalAddProduct;
