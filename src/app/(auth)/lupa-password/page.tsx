"use client"
import { useState,useRef,useEffect } from "react";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { HttpClient } from "@/services/httpClient";
import { Toast } from 'primereact/toast';

const http = new HttpClient();
export default function page() {
    const [email, setEmail] = useState('');
    const [validateEmail,setValidateEmail] = useState(false);
    const [errors,setErrors] = useState('');
    const [loading,setLoading] = useState(false);
    const [isSucces,setIsSucces] = useState(false);
    const toast = useRef<Toast>(null);
    const handleSubmit = async ()=>{
        if(!email){
            setValidateEmail(true);
            setErrors('Email is required')
            return
        }
        setLoading(true)
        try {
            const response = await http.Post<any>('/api/request-reset-password', {
                body: JSON.stringify({email})
            });
            if (toast.current) {
                toast.current.show({ severity: 'success', summary: 'Success', detail: 'Email Berhasil Dikirim', life: 3000 });
            }
            setIsSucces(true)
        } catch (error) {
            const errorMessage = (error as Error).message;
            if (toast.current) {
                toast.current.show({ severity: 'error', summary: 'Error', detail: errorMessage, life: 3000 });
            }
        }
        setLoading(false)
    }


  return (
    <div className="flex min-h-screen w-full flex-col items-center justify-center bg-slate-200 px-5">
        <Toast ref={toast} />
        <div className="w-full md:w-[30vw]  bg-white rounded-md shadow-sm flex flex-col">
        <div className="w-full shadow-sm shadow-slate-200 p-4 flex flex-col justify-center">
          <span style={{ fontSize: "1.2rem" }} className="font-semibold text-4xl text-start">Lupa Password</span>
        </div>
        {!isSucces && <div className="w-full h-full p-5 flex flex-col gap-4">
          <span className="text-start text-dark">Kami akan mengirim link ubah password ke email Kamu</span>
          <label htmlFor="email">Email</label>
          <InputText
            id="email"
            placeholder="Masukkan Email"
            inputMode="email"
            onChange={(e) => {
              setEmail(e.target.value);
            }}
            invalid={validateEmail}
          />
          {validateEmail && <small className="p-error">{errors}</small>}
          <Button
          severity="danger"
          disabled={loading}
          loading={loading}
          onClick={handleSubmit}
            label="Kirim"
          />
          </div>}
          {isSucces && <div className="w-full h-full p-5 flex flex-col gap-4">
            <span className="text-start text-dark">Email Berhasil dikirim</span>
          <span className="text-start text-dark">Kami akan mengirim link ubah password ke email Kamu</span>

          </div>}
        </div>
    </div>
  )
}
