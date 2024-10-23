"use client";
import React, { useState, ChangeEvent, FormEvent, useRef } from "react";
import { Toast } from "primereact/toast";
import { InputText } from "primereact/inputtext";
import { InputTextarea } from "primereact/inputtextarea";
import { Button } from "primereact/button";
import { InputNumber } from "primereact/inputnumber";
import { useRouter } from "next/navigation";
import { HttpClient } from "@/services/httpClient";
import { DomainUser } from "@/domain/Users";
const http = new HttpClient();

export default function RegisterPage() {
  const toast = useRef<Toast>(null);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    email: "",
    phone: "",
    profile: {
      firstName: "",
      lastName: "",
      age: 0,
      address: "",
    },
  });
  const router = useRouter();
  const [errors, setErrors] = useState({
    username: "",
    password: "",
    email: "",
    phone: "",
    firstName: "",
    lastName: "",
    age: "",
    address: "",
  });

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    const [mainField, subField] = name.split(".");

    if (subField) {
      setFormData((prevState) => {
        const mainFieldObject = prevState[
          mainField as keyof typeof formData
        ] as unknown;
        if (typeof mainFieldObject === "object" && mainFieldObject !== null) {
          return {
            ...prevState,
            [mainField]: {
              ...mainFieldObject,
              [subField]: value,
            },
          };
        }
        return prevState;
      });

      if (value.trim() === "") {
        setErrors((prevState) => {
          const mainFieldErrors = prevState[
            mainField as keyof typeof errors
          ] as unknown;
          if (typeof mainFieldErrors === "object" && mainFieldErrors !== null) {
            return {
              ...prevState,
              [mainField]: {
                ...mainFieldErrors,
                [subField]: `${subField} is required`,
              },
            };
          }
          return prevState;
        });
      } else {
        setErrors((prevState) => {
          const mainFieldErrors = prevState[
            mainField as keyof typeof errors
          ] as unknown;
          if (typeof mainFieldErrors === "object" && mainFieldErrors !== null) {
            return {
              ...prevState,
              [mainField]: {
                ...mainFieldErrors,
                [subField]: "",
              },
            };
          }
          return prevState;
        });
      }
    } else {
      if (name === "phone") {
        setFormData((prevState) => ({
          ...prevState,
          [name]: value.replace(/[^0-9]/g, ""),
        }));
      } else if (name === "username") {
        setFormData((prevState) => ({
          ...prevState,
          [name]: value.replace(/\s/g, ""),
        }));
      } else {
        setFormData((prevState) => ({
          ...prevState,
          [name]: value,
        }));
      }
      if (value.trim() === "") {
        setErrors((prevState) => ({
          ...prevState,
          [name]: `${name} is required`,
        }));
      } else {
        setErrors((prevState) => ({
          ...prevState,
          [name]: "",
        }));
      }
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    let valid = true;
    setLoading(true);

    // Validasi sebelum submit
    if (formData.username.trim() === "") {
      setErrors((prevState) => ({
        ...prevState,
        username: "Username is required",
      }));
      valid = false;
    }
    if (formData.password.trim() === "") {
      setErrors((prevState) => ({
        ...prevState,
        password: "Password is required",
      }));
      valid = false;
    }
    if (formData.password.length < 8) {
      setErrors((prevState) => ({
        ...prevState,
        password: "Password must be at least 8 characters",
      }));
      valid = false;
    }
    if (formData.email.trim() === "") {
      setErrors((prevState) => ({
        ...prevState,
        email: "Email is required",
      }));
      valid = false;
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      setErrors((prevState) => ({
        ...prevState,
        email: "Email is invalid",
      }));
      valid = false;
    }

    if (formData.phone.trim() === "") {
      setErrors((prevState) => ({
        ...prevState,
        phone: "Phone is required",
      }));
      valid = false;
    }

    if (formData.profile.firstName.trim() === "") {
      setErrors((prevState) => ({
        ...prevState,
        firstName: "First Name is required",
      }));
      valid = false;
    }
    if (formData.profile.lastName.trim() === "") {
      setErrors((prevState) => ({
        ...prevState,
        lastName: "Last Name is required",
      }));
      valid = false;
    }
    if (formData.profile.address.trim() === "") {
      setErrors((prevState) => ({
        ...prevState,
        address: "Address is required",
      }));
      valid = false;
    }

    if (valid) {
      // Submit data
      console.log("Form Data:", formData);
      try {
        const response = await http.Post<DomainUser>("/api/register", {
          body: JSON.stringify({
            ...formData,
            roles: ["user"],
          }),
        });
        if (response) {
          if (toast.current) {
            toast.current.show({
              severity: "success",
              summary: "Success",
              detail: "Registration Successful",
              life: 3000,
            });
          }
        }
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
    }

    setLoading(false);
  };

  return (
    <div className="flex min-h-screen w-full flex-col items-center justify-center bg-slate-200 px-5 py-20">
      <div className="flex flex-row items-center p-4">
        <span
          style={{ fontSize: "2.4rem" }}
          className="material-icons text-orange-600"
        >
          restaurant
        </span>
        <span style={{ fontSize: "2.4rem" }} className="text-red-700 font-bold">
          Boneta
        </span>
      </div>
      <div className="w-full md:w-[60vw]  bg-white rounded-md shadow-sm flex flex-col">
        <div className="w-full shadow-sm shadow-slate-200 p-4 flex justify-center">
          <span
            style={{ fontSize: "1.2rem" }}
            className="font-semibold text-4xl text-center"
          >
            Register
          </span>
        </div>
        <Toast ref={toast} />
        <form
          onSubmit={handleSubmit}
          className="w-full flex flex-col gap-6 p-4"
        >
          <div className="w-full flex flex-col md:flex-row gap-3">
            <div className="w-full flex flex-col gap-2">
              <div className="w-full">
                <label
                  htmlFor="username"
                  className="block text-gray-700 font-bold mb-2"
                >
                  Username
                </label>
                <InputText
                  id="username"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  className="w-full p-2 border rounded"
                />
                {errors.username && (
                  <small className="p-error">{errors.username}</small>
                )}
              </div>
              <div className="w-full">
                <label
                  htmlFor="password"
                  className="block text-gray-700 font-bold mb-2"
                >
                  Password
                </label>
                <InputText
                  id="password"
                  name="password"
                  type="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full p-2 border rounded"
                />
                {errors.password && (
                  <small className="p-error">{errors.password}</small>
                )}
              </div>
              <div className="w-full">
                <label
                  htmlFor="email"
                  className="block text-gray-700 font-bold mb-2"
                >
                  Email
                </label>
                <InputText
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full p-2 border rounded"
                />
                {errors.email && (
                  <small className="p-error">{errors.email}</small>
                )}
              </div>
              <div className="w-full">
                <label
                  htmlFor="phone"
                  className="block text-gray-700 font-bold mb-2"
                >
                  Phone
                </label>
                <InputText
                  id="phone"
                  name="phone"
                  type="text"
                  maxLength={13}
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full p-2 border rounded"
                />
                {errors.phone && (
                  <small className="p-error">{errors.phone}</small>
                )}
              </div>
            </div>

            <div className="w-full flex flex-col gap-2">
              <div className="w-full">
                <label
                  htmlFor="firstName"
                  className="block text-gray-700 font-bold mb-2"
                >
                  First Name
                </label>
                <InputText
                  id="firstName"
                  name="profile.firstName"
                  value={formData.profile.firstName}
                  onChange={handleChange}
                  className="w-full p-2 border rounded"
                />
                {errors.firstName && (
                  <small className="p-error">{errors.firstName}</small>
                )}
              </div>
              <div className="w-full">
                <label
                  htmlFor="lastName"
                  className="block text-gray-700 font-bold mb-2"
                >
                  Last Name
                </label>
                <InputText
                  id="lastName"
                  name="profile.lastName"
                  value={formData.profile.lastName}
                  onChange={handleChange}
                  className="w-full p-2 border rounded"
                />
                {errors.lastName && (
                  <small className="p-error">{errors.lastName}</small>
                )}
              </div>
              <div className="w-full">
                <label
                  htmlFor="address"
                  className="block text-gray-700 font-bold mb-2"
                >
                  Address
                </label>
                <InputTextarea
                  id="address"
                  name="profile.address"
                  value={formData.profile.address}
                  onChange={handleChange}
                  rows={3}
                  className="w-full p-2 border rounded"
                />
                {errors.address && (
                  <small className="p-error">{errors.address}</small>
                )}
              </div>
            </div>
          </div>
          {/* <div className="w-full">
                        <label htmlFor="age" className="block text-gray-700 font-bold mb-2">
                            Age
                        </label>
                        <InputNumber
                            id="age"
                            name="age"
                            value={formData.profile.age}
                            onValueChange={(e) => handleNumberChange('age', e.value ?? 0)}
                            className="w-full"
                        />
                        {errors.age && <small className="p-error">{errors.age}</small>}
                    </div> */}
          <Button
            type="submit"
            label="Register"
            loading={loading}
            disabled={loading}
            className="w-full p-2 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          />
          <div className="w-full flex justify-end gap-3">
            <span>Alditolak have an account?</span>
            <button
              type="button"
              className="text-blue-600"
              onClick={() => router.push("/login")}
            >
              Login
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
