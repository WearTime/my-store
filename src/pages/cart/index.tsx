import CartView from "@/components/views/cart";
import productServices from "@/services/product";
import userServices from "@/services/user";
import { useSession } from "next-auth/react";
import Head from "next/head";
import { Dispatch, SetStateAction, useEffect, useState } from "react";

type PropTypes = {
  setToaster: Dispatch<SetStateAction<{}>>;
};
const CartPage = ({ setToaster }: PropTypes) => {
  const [cart, setCart] = useState([]);
  const session: any = useSession();
  const [products, setProducts] = useState([]);

  const getAllProducts = async () => {
    const { data } = await productServices.getAllProducts();
    setProducts(data.data);
  };
  useEffect(() => {
    getAllProducts();
  }, []);

  const getCart = async () => {
    const { data } = await userServices.getCarts();
    setCart(data.data);
  };

  useEffect(() => {
    if (session.data?.accessToken) {
      getCart();
    }
  }, [session]);
  return (
    <>
      <Head>
        <title>Products</title>
      </Head>
      <CartView cart={cart} products={products} />
    </>
  );
};

export default CartPage;
