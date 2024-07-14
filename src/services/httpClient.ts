// import { useRouter } from "next/navigation";
import useSWR, { Fetcher,SWRConfiguration , KeyedMutator } from 'swr';
import { Response } from "@/domain/DomainHttp";
import { FetchOptions } from "@/domain/Http";
import { getCookie } from "@/utils/cookies";

const cockies = getCookie('accessToken');

export class HttpClient {
    constructor(
      public base_url: string = process.env.NEXT_PUBLIC_BASE_URL ?? 'http://localhost:8000',
      public token: string | null = cockies ?? null
    ) {
      console.log("HTTP Client Constructed with base_url: ", base_url);
            
    }
  
    // Define the GetData method
    Send<T>(endpoint: string, fetcher?: Fetcher<Response<T>>, options?: FetchOptions, config?: SWRConfiguration): { data: Response<T> | null, isLoading: boolean, isError: boolean,error: any, mutate: KeyedMutator<Response<T>> } {
      const fetcherFn: Fetcher<Response<T>> = fetcher ?? ((url:string)=> fetch(url,options).then(res => res.json()));
      const { data, error ,isLoading,mutate} = useSWR<Response<T>>(`${this.base_url}${endpoint}`, fetcherFn, config);
  
      return {
        data: data ?? null,
        isLoading: isLoading,
        isError: !!error,
        error: error,
        mutate
      };
    }    


    async Post<T>(endpoint: string, options?: FetchOptions): Promise<Response<T>> {
      const response = await fetch(`${this.base_url}${endpoint}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${this.token}`,

        },
        ...options
      });
      const data = await response.json();
      return data;
    }
    
    async PostWithFile<T>(endpoint: string, file: File, options?: FetchOptions): Promise<Response<T>> {
      const formData = new FormData();
      formData.append('file', file);
      const response = await fetch(`${this.base_url}${endpoint}`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${this.token}`,
        },
        body: formData,
        ...options
      });
      const data = await response.json();
      return data;
    }

    
    async Put<T>(endpoint: string, options?: FetchOptions): Promise<Response<T>> {
      const response = await fetch(`${this.base_url}${endpoint}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${this.token}`,
        },
        ...options
      });
      const data = await response.json();
      return data;
    }
    
    
    async Delete<T>(endpoint: string, options?: FetchOptions): Promise<Response<T>> {
      try {
        const response = await fetch(`${this.base_url}${endpoint}`, {
          method: "DELETE",
          headers: {
            "Authorization": `Bearer ${this.token}`,
          },
          ...options
        });
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        return data;
      } catch (error) {
        console.error(error);
        throw error;
      }
    }
    
    
    
  }
