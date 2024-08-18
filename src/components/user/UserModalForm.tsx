import React, { useState, ChangeEvent, FormEvent, useRef, useEffect } from 'react';
import { userModalViewModel } from '@/viewmodel/User.vm';
import { Sidebar } from 'primereact/sidebar';
import { Toast } from 'primereact/toast';
import { InputText } from 'primereact/inputtext';
import { InputTextarea } from 'primereact/inputtextarea';
import { Dropdown } from 'primereact/dropdown';
import { Button } from 'primereact/button';
import { InputNumber } from 'primereact/inputnumber';
import { DomainProfile,DomainUser, DomainUserWithProfile } from '@/domain/Users';
import { DomainAuth } from '@/domain/Auth';
import { Checkbox } from "primereact/checkbox";
import { CheckboxChangeEvent } from 'primereact/checkbox';

type UserModalFormType = {
    uuid: string;
    visible: boolean;
    updating: boolean;
    selected: DomainUserWithProfile | null;
    errorMessage: (error: string) => void;
    successMessage: (success: string) => void;
    submit: () => void;
    closeModal: () => void;
};

const stylePt = {
    header: {
        style: {
            fontWeight: 'bold',
            border: '1px solid #dee2e6',
            backgroundColor: '#ffff',
        },
    },
    content: {
        style: {
            padding: '1rem',
            boxShadow: 'none',
            border: 'none',
        },
    },
    root: {
        style: {
            boxShadow: 'none',
        },
    },
};

export default function UserModalForm({ uuid, closeModal, visible, submit, updating,selected,errorMessage,successMessage }: UserModalFormType) {
    const toast = useRef<Toast>(null);
    const vm = userModalViewModel();
    const [auth, setAuth] = useState<DomainAuth>({
        password: '',
        username: '',
    });
    const [profile, setProfile] = useState<DomainProfile>({
        address: '',
        age: 0,
        firstName: '',
        lastName: '',
    });
    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [errors, setErrors] = useState({
        username: '',
        password: '',
        firstName: '',
        lastName: '',
        address: '',
        age: '',
        fullName: '',
        email: '',
        phone: '',
    });
    const [phone, setPhone] = useState('');
    const [roles, setRoles] = useState<string[]>([]);
    const role_options = [
        "admin",
        "user",
        "kurir",
        "kasir",
        "pimpinan",
        "kitchen",
    ]
    const onIngredientsChange = (e: CheckboxChangeEvent) => {
        let _roles = [...roles];

        if (e.checked)
            _roles.push(e.value);
        else
            _roles.splice(_roles.indexOf(e.value), 1);

        setRoles(_roles);
    }

    const handleAuthChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setAuth((prevState) => ({
            ...prevState,
            [name]: value,
        }));

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

    const handleProfileChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setProfile((prevState) => ({
            ...prevState,
            [name]: value,
        }));

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
        setProfile((prevState) => ({
            ...prevState,
            [name]: value,
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

    // const handleFullNameChange = (e: ChangeEvent<HTMLInputElement>) => {
    //     setFullName(e.target.value);

    //     if (e.target.value.trim() === '') {
    //         setErrors((prevState) => ({
    //             ...prevState,
    //             fullName: 'Full Name is required',
    //         }));
    //     } else {
    //         setErrors((prevState) => ({
    //             ...prevState,
    //             fullName: '',
    //         }));
    //     }
    // };

    const handleEmailChange = (e: ChangeEvent<HTMLInputElement>) => {
        setEmail(e.target.value);

        if (e.target.value.trim() === '') {
            setErrors((prevState) => ({
                ...prevState,
                email: 'Email is required',
            }));
        } else if (!/\S+@\S+\.\S+/.test(e.target.value)) {
            setErrors((prevState) => ({
                ...prevState,
                email: 'Email is invalid',
            }));
        } else {
            setErrors((prevState) => ({
                ...prevState,
                email: '',
            }));
        }
    };

    const clearForm = () => {
        setAuth({
            password: '',
            username: '',
        });
        setProfile({
            address: '',
            age: 0,
            firstName: '',
            lastName: '',
        })
        setFullName('');
        setRoles([]);
        setEmail('');
    }

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        let valid = true;

        // Validasi sebelum submit
        if (auth.username.trim() === '') {
            setErrors((prevState) => ({
                ...prevState,
                username: 'Username is required',
            }));
            valid = false;
        }
        if (auth.password.trim() === '') {
            setErrors((prevState) => ({
                ...prevState,
                password: 'Password is required',
            }));
            valid = false;
        }
        if (profile.firstName.trim() === '') {
            setErrors((prevState) => ({
                ...prevState,
                firstName: 'First Name is required',
            }));
            valid = false;
        }
        if (profile.lastName.trim() === '') {
            setErrors((prevState) => ({
                ...prevState,
                lastName: 'Last Name is required',
            }));
            valid = false;
        }
        if (profile.address.trim() === '') {
            setErrors((prevState) => ({
                ...prevState,
                address: 'Address is required',
            }));
            valid = false;
        }
        // if (profile.age <= 0) {
        //     setErrors((prevState) => ({
        //         ...prevState,
        //         age: 'Age must be greater than 0',
        //     }));
        //     valid = false;
        // }
        if (phone.trim() === '') {
            setErrors((prevState) => ({
                ...prevState,
                phone: 'Phone is required',
            }));
            valid = false;
        }
        if (email.trim() === '') {
            setErrors((prevState) => ({
                ...prevState,
                email: 'Email is required',
            }));
            valid = false;
        } else if (!/\S+@\S+\.\S+/.test(email)) {
            setErrors((prevState) => ({
                ...prevState,
                email: 'Email is invalid',
            }));
            valid = false;
        }

        if (valid) {
            const userData = {
                auth,
                profile,
                fullName,
                email,
                phone
            };
            vm.createUser(auth,profile,fullName,roles,email,phone);
            closeModal();
            submit();
        }
    };
    const phoneRegex = /^\(?(\d{3})\)?[- ]?(\d{3})[- ]?(\d{4})$/;
useEffect(() => {
    if(updating && selected){
        setAuth({
            username:selected?.username!,
            password:""
        })
        setProfile(selected.profile)
        setEmail(selected.email!)
        setPhone(selected.phone!)
        setFullName("")
        setRoles(selected.roles)
    }
},[updating,uuid])

useEffect(() => {
    if(vm.errorMessage){
        console.log(vm.errorMessage)
        errorMessage(vm.errorMessage)
    }
},[vm.errorMessage])
useEffect(() => {
    if(vm.successMessage){
        successMessage(vm.successMessage)
    }
},[vm.successMessage])

    return (
        <Sidebar
            pt={stylePt}
            className="h-screen bg-[#FAFAFD]"
            visible={visible}
            header="User Form"
            position="bottom"
            onHide={()=>(closeModal(),clearForm())}
        >
            <Toast ref={toast} />
            <div className="w-full flex flex-row">
                <div className="w-full flex p-4 bg-gray-100 rounded-lg shadow-md">
                    <form onSubmit={handleSubmit} className="w-full flex flex-col gap-6">
                        <div className="w-full flex flex-row gap-5">
                            <div className="w-full flex  gap-3">
                                <div className='w-full flex flex-col gap-2'>
                                <div className="w-full">
                                    <label htmlFor="username" className="block text-gray-700 font-bold mb-2">
                                        Username
                                    </label>
                                    <InputText
                                        id="username"
                                        name="username"
                                        placeholder='Masuukan username'
                                        value={auth.username}
                                        onChange={handleAuthChange}
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
                                        placeholder='Masuukan password'
                                        type="password"
                                        value={auth.password}
                                        onChange={handleAuthChange}
                                        className="w-full p-2 border rounded"
                                    />
                                    {errors.password && <small className="p-error">{errors.password}</small>}
                                </div>
                                <div className="w-full">
                                    <label htmlFor="firstName" className="block text-gray-700 font-bold mb-2">
                                        First Name
                                    </label>
                                    <InputText
                                        id="firstName"
                                        name="firstName"
                                        placeholder='Masuukan first name'
                                        value={profile.firstName}
                                        onChange={handleProfileChange}
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
                                        name="lastName"
                                        placeholder='Masuukan last name'
                                        value={profile.lastName}
                                        onChange={handleProfileChange}
                                        className="w-full p-2 border rounded"
                                    />
                                    {errors.lastName && <small className="p-error">{errors.lastName}</small>}
                                </div>
                                {/* <div className="w-full">
                                    <label htmlFor="fullName" className="block text-gray-700 font-bold mb-2">
                                        Full Name
                                    </label>
                                    <InputText
                                        id="fullName"
                                        name="fullName"
                                        placeholder='Masukan full name'
                                        value={fullName}
                                        onChange={handleFullNameChange}
                                        className="w-full p-2 border rounded"
                                    />
                                    {errors.fullName && <small className="p-error">{errors.fullName}</small>}
                                </div> */}
                               
                                </div>

                                <div className='w-full flex flex-col gap-2'>
                                {/* <div className="w-full">
                                    <label htmlFor="age" className="block text-gray-700 font-bold mb-2">
                                        Age
                                    </label>
                                    <InputNumber
                                        id="age"
                                        name="age"
                                        value={profile.age}
                                        placeholder='Masukan age'
                                        onValueChange={(e) => handleNumberChange('age', e.value ?? 0)}
                                        className="w-full p-0"
                                    />
                                    {errors.age && <small className="p-error">{errors.age}</small>}
                                </div> */}
                                <div className="w-full">
                                    <label htmlFor="email" className="block text-gray-700 font-bold mb-2">
                                        Email
                                    </label>
                                    <InputText
                                        id="email"
                                        name="email"
                                        placeholder='Masukan email'
                                        type="email"
                                        value={email}
                                        onChange={handleEmailChange}
                                        className="w-full p-2 border rounded"
                                    />
                                    {errors.email && <small className="p-error">{errors.email}</small>}
                                </div>
                                <div className="w-full">
                                    <label htmlFor="phone" className="block text-gray-700 font-bold mb-2">
                                        Phone
                                    </label>
                                    <InputText
                                        id="phone"
                                        name="phone"
                                        placeholder='Masukan phone'
                                        inputMode='text'
                                        maxLength={12}
                                        value={phone}
                                        keyfilter={/[0-9]/}
                                        onChange={(v)=>setPhone(v.target.value)}
                                        className="w-full p-2 border rounded"
                                    />
                                    {errors.phone && <small className="p-error">{errors.phone}</small>}
                                </div>
                                <div className="w-full">
                                    <label htmlFor="address" className="block text-gray-700 font-bold mb-2">
                                        Address
                                    </label>
                                    <InputTextarea
                                        id="address"
                                        name="address"
                                        value={profile.address}
                                        placeholder='Masukan address'
                                        onChange={handleProfileChange}
                                        rows={3}
                                        className="w-full p-2 border rounded"
                                    />
                                    {errors.address && <small className="p-error">{errors.address}</small>}
                                </div>
                                
                                <label htmlFor="" className="block text-gray-700 font-bold mb-2">
                                        roles
                                    </label>
                                <div className="card flex flex-row justify-content-center gap-3">
                                    {role_options.map((role,index) => 
                                    <div 
                                    key={index}
                                    className="flex align-items-center">
                                        <Checkbox inputId={"role"+role} id={"role"+role} name={role} value={role} onChange={onIngredientsChange} checked={roles.includes(role)} />
                                        <label htmlFor={"role"+role}className="ml-2">{role}</label>
                                    </div>
                                )}
                                </div>
                                </div>
                            </div>
                        </div>
                        {!updating && <Button 
                        type="submit" 
                        label="Submit" 
                        className="w-full p-2 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" />}
                    </form>
                </div>
            </div>
        </Sidebar>
    );
}
