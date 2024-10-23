import { useState } from "react";
import { Nullable } from "primereact/ts-helpers";
import { HttpClient } from "@/services/httpClient";
import { DomainOrder, DomainOrderSummarry } from "@/domain/Orders";
import { getCookie } from "@/utils/cookies";
import { UnixToDateString, UnixToDateStringReverse } from "@/utils/date";
const coockies = getCookie("accessToken");
const http = new HttpClient();
export const OrderDashboardViewModel = () => {
  const [dates, setDates] = useState<Nullable<(Date | null)[]>>([
    new Date(),
    new Date(),
  ]);
  const [date, setDate] = useState(
    UnixToDateStringReverse(new Date().getTime(), "-"),
  );
  const [selectedOrder, setSelectedOrder] = useState<DomainOrder | null>(null);

  const { data, isError, isLoading, mutate } = http.Send<DomainOrderSummarry>(
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
  return {
    data,
    date,
    setDate,
    isError,
    isLoading,
    mutate,
    selectedOrder,
    setSelectedOrder,
    dates,
    setDates,
  };
};
