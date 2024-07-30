"use client";

import React, { useState, ChangeEvent, FormEvent, useRef } from 'react';
import { Toast } from 'primereact/toast';
import { InputText } from 'primereact/inputtext';
import { InputTextarea } from 'primereact/inputtextarea';
import { Button } from 'primereact/button';
import { InputNumber } from 'primereact/inputnumber';
import { useRouter } from 'next/navigation';

export default function RegisterPage() {
    const toast = useRef<Toast>(null);
    const [formData, setFormData] = useState({
        username: '',
        password: '',
        email: '',
        profile: {
            firstName: '',
            lastName: '',
            age: 0,
            address: ''
        }
    });
    const router = useRouter();
    const [errors, setErrors] = useState({
        username: '',
        password: '',
        email: '',
        firstName: '',
        lastName: '',
        age: '',
        address: ''
    });

    const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        const [mainField, subField] = name.split('.');

        if (subField) {
            setFormData((prevState) => ({
                ...prevState,
                [mainField]: {
                    ...prevState[mainField as keyof typeof formData],
                    [subField]: value
                }
            }));
        } else {
            setFormData((prevState) => ({
                ...prevState,
                [name]: value
            }));
        }

        if (value.trim() === '') {
            setErrors((prevState) => ({
                ...prevState,
                [name]: `${name} is required`,
            }));
        } else {
            setErrors((prevState) => ({
                ...prevState,
                [name]: '',
            }));
        }
    };

    const handleNumberChange = (name: string, value: number) => {
        setFormData((prevState) => ({
            ...prevState,
            profile: {
                ...prevState.profile,
                [name]: value
            }
        }));

        if (value <= 0) {
            setErrors((prevState) => ({
                ...prevState,
                [name]: `${name} must be greater than 0`,
            }));
        } else {
            setErrors((prevState) => ({
                ...prevState,
                [name]: '',
            }));
        }
    };

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        let valid = true;

        // Validasi sebelum submit
        if (formData.username.trim() === '') {
            setErrors((prevState) => ({
                ...prevState,
                username: 'Username is required',
            }));
            valid = false;
        }
        if (formData.password.trim() === '') {
            setErrors((prevState) => ({
                ...prevState,
                password: 'Password is required',
            }));
            valid = false;
        }
        if (formData.email.trim() === '') {
            setErrors((prevState) => ({
                ...prevState,
                email: 'Email is required',
            }));
            valid = false;
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            setErrors((prevState) => ({
                ...prevState,
                email: 'Email is invalid',
            }));
            valid = false;
        }
        if (formData.profile.firstName.trim() === '') {
            setErrors((prevState) => ({
                ...prevState,
                firstName: 'First Name is required',
            }));
            valid = false;
        }
        if (formData.profile.lastName.trim() === '') {
            setErrors((prevState) => ({
                ...prevState,
                lastName: 'Last Name is required',
            }));
            valid = false;
        }
        if (formData.profile.address.trim() === '') {
            setErrors((prevState) => ({
                ...prevState,
                address: 'Address is required',
            }));
            valid = false;
        }
        if (formData.profile.age <= 0) {
            setErrors((prevState) => ({
                ...prevState,
                age: 'Age must be greater than 0',
            }));
            valid = false;
        }

        if (valid) {
            // Submit data
            console.log('Form Data:', formData);
            fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/create-user`,{
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    ...formData,
                    roles:["user"]
                })
            }).then((response) => response.json()).then((data) => {
                console.log('Success:', data);
                if (toast.current) {
                    toast.current.show({ severity: 'success', summary: 'Success', detail: 'Registration Successful', life: 3000 });
                }
            }).catch((error) => {
                console.error('Error:', error);
                if (toast.current) {
                    toast.current.show({ severity: 'error', summary: 'Error', detail: 'Registration Failed', life: 3000 });
                }
            }).finally(() => {
                router.push('/login');
            });
        }
    };

    return (
        <div className="flex min-h-screen w-full flex-col items-center justify-center bg-slate-200 px-5 py-20">
            <div className="flex flex-row items-center p-4">
        <span style={{ fontSize: "2.4rem" }} className="material-icons text-orange-600">restaurant</span>
        <span style={{ fontSize: "2.4rem" }} className="text-red-700 font-bold">Boneta</span>
      </div>
            <div className="w-full md:w-[30vw]  bg-white rounded-md shadow-sm flex flex-col">
            <div className="w-full shadow-sm shadow-slate-200 p-4 flex justify-center">
                <span style={{ fontSize: "1.2rem" }} className="font-semibold text-4xl text-center">Register</span>
                </div>
                <Toast ref={toast} />
                <form onSubmit={handleSubmit} className="w-full flex flex-col gap-6 p-4">
                    <div className="w-full">
                        <label htmlFor="username" className="block text-gray-700 font-bold mb-2">
                            Username
                        </label>
                        <InputText
                            id="username"
                            name="username"
                            value={formData.username}
                            onChange={handleChange}
                            className="w-full p-2 border rounded"
                        />
                        {errors.username && <small className="p-error">{errors.username}</small>}
                    </div>
                    <div className="w-full">
                        <label htmlFor="password" className="block text-gray-700 font-bold mb-2">
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
                        {errors.password && <small className="p-error">{errors.password}</small>}
                    </div>
                    <div className="w-full">
                        <label htmlFor="email" className="block text-gray-700 font-bold mb-2">
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
                        {errors.email && <small className="p-error">{errors.email}</small>}
                    </div>
                    <div className="w-full">
                        <label htmlFor="firstName" className="block text-gray-700 font-bold mb-2">
                            First Name
                        </label>
                        <InputText
                            id="firstName"
                            name="profile.firstName"
                            value={formData.profile.firstName}
                            onChange={handleChange}
                            className="w-full p-2 border rounded"
                        />
                        {errors.firstName && <small className="p-error">{errors.firstName}</small>}
                    </div>
                    <div className="w-full">
                        <label htmlFor="lastName" className="block text-gray-700 font-bold mb-2">
                            Last Name
                        </label>
                        <InputText
                            id="lastName"
                            name="profile.lastName"
                            value={formData.profile.lastName}
                            onChange={handleChange}
                            className="w-full p-2 border rounded"
                        />
                        {errors.lastName && <small className="p-error">{errors.lastName}</small>}
                    </div>
                    <div className="w-full">
                        <label htmlFor="address" className="block text-gray-700 font-bold mb-2">
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
                        {errors.address && <small className="p-error">{errors.address}</small>}
                    </div>
                    <div className="w-full">
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
                    </div>
                    <Button type="submit" label="Register" className="w-full p-2 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" />
                </form>
            </div>
        </div>
    );
}
