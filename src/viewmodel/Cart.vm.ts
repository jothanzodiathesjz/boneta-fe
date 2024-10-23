import { useState } from "react";
import { DomainOrderItem, OrderItemResult } from "@/domain/OrderItem";

export const CartViewModel = () => {
  const [orderItemList, setOrderItemList] = useState<DomainOrderItem[]>([]);
};
