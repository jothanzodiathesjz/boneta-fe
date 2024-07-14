import { DomainMenu, MenuItemInit } from "./Menu";

export interface OrderIteminit extends MenuItemInit{
    quantity: number
    total_price: number
    stage:number
}

export class DomainOrderItem extends DomainMenu {
    quantity: number
    total_price: number
    stage:number

    constructor(data: OrderIteminit) {
        super(data)
        this.quantity = data.quantity
        this.total_price = data.total_price
        this.stage = data.stage
    }
}

export interface OrderItemResultInit {
    items: DomainOrderItem[]
    quantity: number
    total_price: number
}

export class OrderItemResult {
    items: DomainOrderItem[]
    quantity: number
    total_price: number

    constructor(data: OrderItemResultInit) {
        this.items = data.items
        this.quantity = data.quantity
        this.total_price = data.total_price
    }
}

export interface OrderSummary {
    items: DomainOrderItem[]
    total_price: number
    quantity: number
    guest: string
    table: string
    mode: string
    created_at: number
    status: string
    payment:DomainPaymentMethod
}

export class DomainOrderSummary{
    items: DomainOrderItem[]
    total_price: number
    quantity: number
    guest: string
    table: string
    mode: string
    created_at: number
    status: string
    payment:DomainPaymentMethod

    constructor(data: OrderSummary) {
        this.items = data.items
        this.total_price = data.total_price
        this.quantity = data.quantity
        this.guest = data.guest
        this.table = data.table
        this.mode = data.mode
        this.created_at = data.created_at
        this.status = data.status
        this.payment = data.payment
    }
}

export type PaymentMethodType = {
    id: string
    name: string
    value: string
}

export class DomainPaymentMethod{
    id: string
    name: string
    value: string

    constructor(data: PaymentMethodType) {
        this.id = data.id
        this.name = data.name
        this.value = data.value
    }
}



export const paymentMethods: PaymentMethodType[] = [
    {
        id: "1",
        name: "Bayar Dikasir",
        value: "cash"
    },
    {
        id: "2",
        name: "Transfer Bank",
        value: "transfer"
    }
]