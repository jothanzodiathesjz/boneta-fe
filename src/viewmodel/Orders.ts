import { useState } from "react";
import { DomainOrder } from "@/domain/Orders";
import { HttpClient } from "@/services/httpClient";
import { getCookie, parseCookie } from "@/utils/cookies";

const http = new HttpClient();

const OrdersViewModel = () => {
  const [orders, setOrders] = useState<DomainOrder[]>([]);
  const guest = localStorage.getItem("guest") || "";
  const user = getCookie("user");
  const parseUser = user ? parseCookie(user) : null;
  const { data, error, isError, isLoading, mutate } = http.Send<DomainOrder[]>(
    `${parseUser ? `/api/orders/${parseUser.uuid}` : `/api/orderswg/${guest}`}`,
    undefined,
    undefined,
  );

  return {
    orders,
    setOrders,
    data,
    error,
    isError,
    isLoading,
    mutate,
  };
};

export default OrdersViewModel;
