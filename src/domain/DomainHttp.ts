export type http = {
  get: (url: string) => Promise<any>;
  post: (url: string, data: any) => Promise<any>;
  put: (url: string, data: any) => Promise<any>;
  delete: (url: string) => Promise<any>;
};

interface CreateResponse<T> {
  status: "success";
  message: string;
  data: T;
}

export interface GetResponse<T> {
  status: "success";
  message: string;
  data: T;
}

export interface GetAllResponse<T> {
  status: "success";
  message: string;
  data: T[];
}

export interface UpdateResponse<T> {
  status: "success";
  message: string;
  data: T;
}
export interface Response<T> {
  status: string;
  message: string;
  data: T;
}
