import { useState } from "react";
import { HttpClient } from "@/services/httpClient";
import { DomainOrder, DomainOrderSummarry } from "@/domain/Orders";
import { getCookie } from "@/utils/cookies";
import { UnixToDateStringReverse } from "@/utils/date";
import { Nullable } from "primereact/ts-helpers";
const coockies = getCookie("accessToken");

const http = new HttpClient();
const kitchenViewModel = () => {
  const [selectedOrder, setSelectedOrder] = useState<DomainOrder | null>(null);
  const [dates, _setDates] = useState<Nullable<(Date | null)[]>>([
    new Date(),
    new Date(),
  ]);
  const { data, isError, isLoading, mutate } = http.Send<DomainOrder[]>(
    "/api/orders?status=menunggu",
    undefined,
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${coockies}`,
      },
    },
    {
      revalidateOnMount: true,
      refreshInterval: 5000,
    },
  );
  const [orders, setOrders] = useState<DomainOrder[]>(data?.data ?? []);
  const data2 = http.Send<DomainOrder[]>(
    "/api/orders?status=proses",
    undefined,
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${coockies}`,
      },
    },
    {
      revalidateOnMount: true,
    },
  );
  const data3 = http.Send<DomainOrder[]>(
    "/api/orders?status=diterima",
    undefined,
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${coockies}`,
      },
    },
    {
      revalidateOnMount: true,
    },
  );
  const data4 = http.Send<DomainOrderSummarry>(
    `/api/orders-summary/?sDate=${UnixToDateStringReverse(dates![0] ? dates![0].getTime() : new Date().getTime(), "-")}&eDate=${UnixToDateStringReverse(dates![1] ? dates![1].getTime() : new Date().getTime(), "-")}`,
    undefined,
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${coockies}`,
      },
    },
    {
      revalidateOnMount: true,
    },
  );

  const handleProcess = async (status: string) => {
    try {
      await http.Put<DomainOrder>(`/api/order`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${coockies}`,
        },
        body: JSON.stringify({ uuid: selectedOrder?.uuid, status: status }),
      });
      setSelectedOrder(null);
      mutate();
      data2.mutate();
    } catch (error) {
      console.log(error);
    }
    mutate();
    data2.mutate();
    data3.mutate();
    data4.mutate();
  };

  const updateSeen = async (uuid: string) => {
    try {
      await http.Put<DomainOrder>(`/api/order-seen`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${coockies}`,
        },
        body: JSON.stringify({ uuid: uuid, seen: true }),
      });
    } catch (error) {
      console.log(error);
    }
    mutate();
  };
  const handleDeleteItem = async (uuid: string, uuid_item: string) => {
    setSelectedOrder(null);
    try {
      const response = await http.Delete<DomainOrder>(
        `/api/order-item/${uuid}/${uuid_item}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${coockies}`,
          },
        },
      );
      setSelectedOrder(response.data);
    } catch (error) {
      console.log(error);
    }
    mutate();
  };

  return {
    data,
    isError,
    isLoading,
    mutate,
    selectedOrder,
    setSelectedOrder,
    data2,
    handleProcess,
    orders,
    setOrders,
    updateSeen,
    data3,
    handleDeleteItem,
    data4,
  };
};

export default kitchenViewModel;
