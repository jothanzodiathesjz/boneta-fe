export type Order = {
  orderId: number;
  customerName: string;
  product: string;
  quantity: number;
  price: number;
  orderDate: string;
  status: string;
};

export const orders: Order[] = [
  {
    orderId: 1,
    customerName: "John Doe",
    product: "Laptop",
    quantity: 1,
    price: 1500,
    orderDate: "2024-06-01",
    status: "Shipped",
  },
  {
    orderId: 2,
    customerName: "Jane Smith",
    product: "Smartphone",
    quantity: 2,
    price: 800,
    orderDate: "2024-06-02",
    status: "Processing",
  },
  {
    orderId: 3,
    customerName: "Samuel Green",
    product: "Tablet",
    quantity: 3,
    price: 300,
    orderDate: "2024-06-03",
    status: "Delivered",
  },
  {
    orderId: 4,
    customerName: "Emily Brown",
    product: "Smartwatch",
    quantity: 2,
    price: 200,
    orderDate: "2024-06-04",
    status: "Cancelled",
  },
  {
    orderId: 5,
    customerName: "Michael Johnson",
    product: "Headphones",
    quantity: 4,
    price: 100,
    orderDate: "2024-06-05",
    status: "Shipped",
  },
  {
    orderId: 6,
    customerName: "Laura Wilson",
    product: "Camera",
    quantity: 1,
    price: 700,
    orderDate: "2024-06-06",
    status: "Processing",
  },
  {
    orderId: 7,
    customerName: "Daniel Lee",
    product: "Monitor",
    quantity: 2,
    price: 300,
    orderDate: "2024-06-07",
    status: "Delivered",
  },
  {
    orderId: 8,
    customerName: "Sophia Harris",
    product: "Keyboard",
    quantity: 3,
    price: 50,
    orderDate: "2024-06-08",
    status: "Cancelled",
  },
  {
    orderId: 9,
    customerName: "James Clark",
    product: "Mouse",
    quantity: 5,
    price: 30,
    orderDate: "2024-06-09",
    status: "Shipped",
  },
];
