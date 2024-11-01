"use client";
import { useState, useRef } from "react";
import { Button } from "primereact/button";
import { HttpClient } from "@/services/httpClient";
import { Toast } from "primereact/toast";
import { useParams } from "next/navigation";
import { Password } from "primereact/password";

const http = new HttpClient();
export default function page() {
  const [password, setPassword] = useState("");
  const [validatePassword, setValidatePassword] = useState(false);
  const [errors, setErrors] = useState("");
  const [loading, setLoading] = useState(false);
  const [isSucces, setIsSucces] = useState(false);
  const toast = useRef<Toast>(null);
  const { oid } = useParams();
  const handleSubmit = async () => {
    if (!password) {
      setValidatePassword(true);
      setErrors("Password is required");
      return;
    }
    setLoading(true);
    try {
     await http.Post<any>("/api/reset-password", {
       body: JSON.stringify({
         password,
         token: oid,
       }),
     });
      if (toast.current) {
        toast.current.show({
          severity: "success",
          summary: "Success",
          detail: "Password Berhasil Dikirim",
          life: 3000,
        });
      }
      setIsSucces(true);
    } catch (error) {
      const errorMessage = (error as Error).message;
      if (toast.current) {
        toast.current.show({
          severity: "error",
          summary: "Error",
          detail: errorMessage,
          life: 3000,
        });
      }
    }
    setLoading(false);
    setTimeout(() => {
      window.location.href = "/login";
    }, 500);
  };
  return (
    <div className="flex min-h-screen w-full flex-col items-center justify-center bg-slate-200 px-5">
      <Toast ref={toast} />
      <div className="w-full md:w-[30vw]  bg-white rounded-md shadow-sm flex flex-col">
        <div className="w-full shadow-sm shadow-slate-200 p-4 flex flex-col justify-center">
          <span
            style={{ fontSize: "1.2rem" }}
            className="font-semibold text-4xl text-start"
          >
            New Password
          </span>
        </div>
        <div className="w-full h-full p-5 flex flex-col gap-4">
          <label htmlFor="password">Password</label>
          <Password
            value={password}
            className="w-full"
            toggleMask
            id="password"
            pt={{
              input: { className: "w-full" },
            }}
            inputStyle={{ width: "27vw" }}
            onChange={(e) => (
              setPassword(e.target.value), console.log(e.target.value)
            )}
            invalid={validatePassword}
          />
          {validatePassword && <small className="p-error">{errors}</small>}
          <Button
            severity="danger"
            disabled={loading}
            loading={loading}
            onClick={handleSubmit}
            label="Kirim"
          />
        </div>
      </div>
    </div>
  );
}
