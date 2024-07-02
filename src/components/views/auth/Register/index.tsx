import Link from "next/link";
import styles from "./Register.module.scss";
import { useRouter } from "next/router";
import { FormEvent, useState } from "react";
import Input from "@/components/ui/input";
import Button from "@/components/ui/Button";
import AuthServices from "@/services/auth";
import AuthLayout from "@/components/layouts/AuthLayout";

const RegisterView = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const { push } = useRouter();
  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);
    setError("");
    const form = event.target as HTMLFormElement;
    const data = {
      email: form.email?.value,
      fullname: form.fullname?.value,
      phone: form.phone?.value,
      password: form.password?.value,
    };

    const result = await AuthServices.registerAccount(data);

    if (result.status === 200) {
      form.reset();
      setIsLoading(false);
      push("/auth/login");
    } else {
      setIsLoading(false);
      setError("Emaill Is Already registered");
    }
  };
  return (
    <AuthLayout
      title="Register"
      error={error}
      link="/auth/login"
      linkText={"Have an Account? Sign in"}
    >
      <form onSubmit={handleSubmit}>
        <Input label="Fullname" type="text" name="fullname" />
        <Input label="Email" type="email" name="email" />
        <Input label="Phone" type="phone" name="phone" />
        <Input label="Password" type="password" name="password" />
        <Button type="submit" className={styles.register__button}>
          {isLoading ? "Loading..." : "Register"}
        </Button>
      </form>
    </AuthLayout>
  );
};

export default RegisterView;
