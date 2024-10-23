import { useState } from "react";
import { HttpClient } from "@/services/httpClient";
import { DomainAuth } from "@/domain/Auth";

export const AuthViewModel = () => {
  const [auth, setAuth] = useState<DomainAuth>({
    username: "",
    password: "",
  });

  return {
    auth,
    setAuth,
  };
};

export function auth(v: DomainAuth) {
  const { data, isError, isLoading } = new HttpClient().Send<DomainAuth>(
    "/api/auth",
    undefined,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(v),
    },
  );

  return {
    data,
    isError,
    isLoading,
  };
}
