import useSWR,{Fetcher} from 'swr';
import { HttpClient } from '@/services/httpClient';
import { Response } from '@/domain/DomainHttp';

export function useFetchData<T>(endpoint: string) {
    const fetcherFn: Fetcher<Response<T>> =  ((url:string)=> fetch(url).then(res => res.json()));
  
  const { data, error,isLoading } = useSWR<Response<T>>(`${process.env.NEXT_PUBLIC_BASE_URL}${endpoint}`, fetcherFn,{
    revalidateIfStale: false,
    revalidateOnFocus: false,
  });
  
  return {
    data,
    isLoading: isLoading,
    isError: !!error,
  };
}