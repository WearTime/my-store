import instance from "@/lib/axios/instance";

const AuthServices = {
  registerAccount: (data: any) => instance.post("/api/user/register", data),
};

export default AuthServices;
