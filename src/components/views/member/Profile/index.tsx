import MemberLayout from "@/components/layouts/MemberLayout";
import styles from "./Profile.module.scss";
import Input from "@/components/ui/input";
import Button from "@/components/ui/Button";
import Image from "next/image";
import { uploadFile } from "@/lib/firebase/service";
import { Dispatch, FormEvent, SetStateAction, useState } from "react";
import userServices from "@/services/user";
import { User } from "@/types/user.type";

type PropTypes = {
  profile: User | any;
  setProfile: Dispatch<SetStateAction<{}>>;
  setToaster: Dispatch<SetStateAction<{}>>;
  session: any;
};
const ProfileMemberView = ({
  profile,
  setProfile,
  session,
  setToaster,
}: PropTypes) => {
  const [changeImage, setChangeImage] = useState<File | any>({});
  const [isLoading, setIsLoading] = useState("");

  const handleChangeProfile = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading("profile");
    const form = e.target as HTMLFormElement;
    const data = {
      // email: form.email?.value,
      fullname: form.fullname?.value,
      phone: form.phone?.value,
    };
    const result = await userServices.updateProfile(
      data,
      session.data?.accessToken
    );

    if (result.status === 200) {
      setIsLoading("");
      setProfile({
        ...profile,
        fullname: data.fullname,
        phone: data.phone,
      });
      form.reset();
      setToaster({
        variant: "success",
        message: "Profile updated successfully",
      });
    } else {
      setIsLoading("");
    }
  };
  const handleChangeProfilePicture = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading("picture");
    const form = e.target as HTMLFormElement;
    const file = form.image.files[0];

    if (file) {
      uploadFile(
        profile.id,
        file,
        async (status: boolean, newImageURL: string) => {
          if (status) {
            const data = {
              image: newImageURL,
            };
            const result = await userServices.updateProfile(
              data,
              session.data?.accessToken
            );

            if (result.status === 200) {
              setIsLoading("");
              setProfile({
                ...profile,
                image: newImageURL,
              });
              setChangeImage({});
              form.reset();
              setToaster({
                variant: "success",
                message: "Profile picture updated successfully",
              });
            } else {
              setIsLoading("");
            }
          } else {
            setIsLoading("");
            setChangeImage({});
            setToaster({
              variant: "danger",
              message: "Failed to upload profile picture",
            });
          }
        }
      );
    }
  };
  const handleChangePassword = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading("password");
    const form = e.target as HTMLFormElement;
    const data = {
      password: form["new-password"].value,
      oldPassword: form["old-password"].value,
      encryptedPassword: profile.password,
    };
    try {
      const result = await userServices.updateProfile(
        data,
        session.data?.accessToken
      );

      if (result.status === 200) {
        setIsLoading("");
        form.reset();
        setToaster({
          variant: "success",
          message: "Password updated successfully",
        });
      }
    } catch (error) {
      setIsLoading("");
      setToaster({
        variant: "danger",
        message: "Failed to update password",
      });
    }
  };
  return (
    <MemberLayout>
      <div>
        <div className={styles.profile__title}>Member Profile Page</div>
        <div className={styles.profile__main}>
          <div className={styles.profile__main__row}>
            <div className={styles.profile__main__row__avatar}>
              <h2 className={styles.profile__main__row__avatar__title}>
                Avatar
              </h2>
              {profile.image ? (
                <Image
                  className={styles.profile__main__row__avatar__image}
                  src={profile.image}
                  alt="Profile"
                  width={200}
                  height={200}
                />
              ) : (
                <div className={styles.profile__main__row__avatar__image}>
                  {profile?.fullname?.charAt(0)}
                </div>
              )}
              <form onSubmit={handleChangeProfilePicture}>
                <label
                  className={styles.profile__main__row__avatar__label}
                  htmlFor="upload-image"
                >
                  {changeImage.name ? (
                    <p>{changeImage.name}</p>
                  ) : (
                    <>
                      <p>
                        Upload a new avatar, larger image will be reszed
                        automatically
                      </p>
                      <p>
                        Maximum upload size is <b>1MB</b>
                      </p>
                    </>
                  )}
                </label>
                <input
                  className={styles.profile__main__row__avatar__input}
                  type="file"
                  name="image"
                  id="upload-image"
                  onChange={(e: any) => {
                    e.preventDefault();
                    setChangeImage(e.currentTarget.files[0]);
                  }}
                />
                <Button
                  className={styles.profile__main__row__avatar__button}
                  type="submit"
                  variant="primary"
                >
                  {isLoading == "picture" ? "Uploading..." : "Upload"}
                </Button>
              </form>
            </div>
            <div className={styles.profile__main__row__profile}>
              <h2 className={styles.profile__main__row__profile__title}>
                Profile
              </h2>
              <form onSubmit={handleChangeProfile}>
                <Input
                  label="Fullname"
                  name="fullname"
                  defaultValue={profile.fullname}
                  type="text"
                />
                <Input
                  label="Phone"
                  name="phone"
                  defaultValue={profile.phone}
                  type="number"
                  placeholder="Input your phone number"
                />
                <Input
                  label="Email"
                  name="email"
                  defaultValue={profile.email}
                  type="email"
                  disabled
                />
                <Input
                  label="Role"
                  name="role"
                  defaultValue={profile.role}
                  type="role"
                  disabled
                />
                {/* <Input
              label="Password"
              name="password"
              defaultValue={profile.password}
              type="password"
            /> */}
                <Button type="submit" variant="primary">
                  {isLoading == "profile" ? "Updating..." : "Update Profile"}
                </Button>
              </form>
            </div>
            <div className={styles.profile__main__row__password}>
              <h2>Change Password</h2>
              <form onSubmit={handleChangePassword}>
                <Input
                  name="old-password"
                  label="Old Password"
                  type="password"
                  placeholder="Enter your current password"
                  disabled={profile.type == "google"}
                />
                <Input
                  name="new-password"
                  label="New Password"
                  type="password"
                  placeholder="Enter your new password"
                  disabled={profile.type == "google"}
                />
                <Button
                  type="submit"
                  disabled={isLoading == "password" || profile.type == "google"}
                >
                  {isLoading == "password" ? "Updating..." : "Update Password"}
                </Button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </MemberLayout>
  );
};

export default ProfileMemberView;
