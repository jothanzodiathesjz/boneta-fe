"use client";
import { useEffect, useRef ,useState} from "react";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { AuthViewModel, auth } from "@/viewmodel/Auth.vm";
import { parseCookies, setCookie, destroyCookie } from 'nookies'
import { Messages } from "primereact/messages";
import { useAuthStore } from "@/store/AuthStore";
import { useRouter } from "next/navigation";
import { HttpClient } from "@/services/httpClient";
const http = new HttpClient();
export default function Login() {
  const vm = AuthViewModel()
  const msgs = useRef<Messages>(null);
  const auth = useAuthStore();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleAuth = async ()=>{
    setLoading(true)
    try {
      const response = await http.Post<any>('/api/auth', {
        body: JSON.stringify(vm.auth)
      })
      setCookie(null, 'accessToken', response.data, {
        maxAge: 30 * 24 * 60 * 60,
        path: '/',
      })
      await auth.fetchUser(response.data)
    } catch (error) {
      const errormsg = (error as Error).message
      if (msgs.current) {
        msgs.current.clear();
        msgs.current.show({ id: '1', sticky: true, severity: 'error', summary: 'error', detail: errormsg === 'user not found' ? errormsg : 'Username or Password Invalid' , closable: true });
      }
    } finally {
      setLoading(false)
    }
  }
  
  useEffect(() => {
    if (auth.user) {
      router.push('/processing')
    }
  }, [auth.user])


  return (
    <div className="flex min-h-screen w-full flex-col items-center justify-center bg-slate-200 px-5">
      <div className="flex flex-row items-center p-4">
        <span style={{ fontSize: "2.4rem" }} className="material-icons text-orange-600">restaurant</span>
        <span style={{ fontSize: "2.4rem" }} className="text-red-700 font-bold">Boneta</span>
      </div>
      <div className="w-full md:w-[30vw]  bg-white rounded-md shadow-sm flex flex-col">
        <div className="w-full shadow-sm shadow-slate-200 p-4 flex justify-center">
          <span style={{ fontSize: "1.2rem" }} className="font-semibold text-4xl text-center">Login</span>
        </div>
        <div className="w-full h-full p-5 flex flex-col gap-4">
          <label htmlFor="username">Username</label>
          <InputText
            id="username"
            placeholder="Username"
            inputMode="text"
            value={vm.auth.username}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => vm.setAuth({ ...vm.auth, username: e.target.value })}
          />
          <label htmlFor="password">Password</label>
          <InputText
            id="password"
            type="password"
            placeholder="Password"
            enterKeyHint="go"
            onKeyUp={(e) => {
              if(e.code === 'Enter') {
                handleAuth()
              }
            }}
          
            value={vm.auth.password}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => vm.setAuth({ ...vm.auth, password: e.target.value })}
          />
          <Button
            label="Login"
            loading={loading}
            onClick={() => {
              handleAuth()
            }}
          />
          <Messages ref={msgs} />
          <div className="w-full flex justify-end gap-3">
            <span>Don't have an account?</span>
            <button className="text-blue-600" 
            onClick={() => router.push('/register')}
            >Register</button>
          </div>
          <div className="w-full flex justify-end gap-3">
            <button className="text-blue-600" 
            onClick={() => router.push('/lupa-password')}
            >Lupa password ?</button>
          </div>
        </div>
      </div>
    </div>
  );
}
