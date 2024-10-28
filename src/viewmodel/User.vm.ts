import { useState, useRef } from "react";
import { HttpClient } from "@/services/httpClient";
import { getCookie } from "@/utils/cookies";
import { Toast } from "primereact/toast";
import { confirmDialog } from "primereact/confirmdialog";
import {
  DomainProfile,
  DomainUser,
  DomainUserWithProfile,
} from "@/domain/Users";
import { DomainAuth } from "@/domain/Auth";
const coockies = getCookie("accessToken");

const http = new HttpClient();
export const UsersViewModel = () => {
  const toast = useRef<Toast>(null);
  const [user, setUser] = useState<DomainUser>();
  const [auth, setAuth] = useState<DomainAuth>();
  const [profile, setProfile] = useState<DomainProfile>();
  const [isOpen, setIsOpen] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [selectedUser, setSelectedUser] =
    useState<DomainUserWithProfile | null>(null);

  const data = http.Send<DomainUserWithProfile[]>(
    "/api/userlist",
    undefined,
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${coockies}`,
      },
    },
    {
      revalidateOnMount: true,
    },
  );

  const deleteUser = async (d: DomainUserWithProfile) => {
    const accept = async () => {
      try {
        await http.Delete<DomainUserWithProfile>(
          `/api/user/${d.uuid}`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${coockies}`,
            },
          },
        );
        toast.current?.show({
          severity: "info",
          summary: "Success",
          detail: "SuccessFully Deleted",
          life: 3000,
        });
      } catch (error) {
        console.log(error);
        toast.current?.show({
          severity: "error",
          summary: "Gagal",
          detail: "Failed",
          life: 3000,
        });
      }
      data.mutate();
    };

    const reject = () => {
      toast.current?.show({
        severity: "warn",
        summary: "ditolak",
        detail: "You have ditolak",
        life: 3000,
      });
    };
    confirmDialog({
      message: "Do you want to delete this record?",
      header: "Delete Confirmation",
      icon: "pi pi-info-circle",
      defaultFocus: "reject",
      acceptClassName: "p-button-danger",
      accept,
      reject,
    });
  };

  return {
    data,
    auth,
    profile,
    toast,
    setAuth,
    setProfile,
    user,
    setUser,
    isOpen,
    setIsOpen,
    deleteUser,
    updating,
    setUpdating,
    selectedUser,
    setSelectedUser,
  };
};

export const userModalViewModel = () => {
  const [uuid, setUuid] = useState("");
  const [updating, setUpdating] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>("");
  const [successMessage, setSuccessMessage] = useState<string | null>("");

  const getUser = async (uuid: string) => {
    try {
      const data = await http.Get<DomainUserWithProfile>(`/api/user/${uuid}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${coockies}`,
        },
      });
      return data;
    } catch (error) {
      console.log(error);
    }
  };

  const createUser = async (
    auth: DomainAuth,
    profile: DomainProfile,
    fullName: string,
    roles: string[],
    email: string,
    phone: string,
  ) => {
    try {
      const response = await http.Post<DomainUserWithProfile>(
        "/api/create-user",
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${coockies}`,
          },
          body: JSON.stringify({
            username: auth.username,
            password: auth.password,
            profile,
            roles,
            fullName,
            email,
            phone,
          }),
        },
      );
      setSuccessMessage(response.message);
    } catch (error) {
      const errorM = (error as Error).message;
      setErrorMessage(errorM);
      console.log(error);
    }
    setUpdating(false);
  };

  return {
    uuid,
    setUuid,
    createUser,
    getUser,
    errorMessage,
    setErrorMessage,
    updating,
    setUpdating,
    successMessage,
    setSuccessMessage,
  };
};
