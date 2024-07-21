import { DomainPaymentMethod,DomainOrderItem,DomainOrderSummary,OrderItemResult } from "./OrderItem";
import { DomainCustomer } from "./Customer";

export interface OrderInit {
    uuid?: string
    uuid_user: string
    order_id: string
    guest: string
    items: DomainOrderItem[]
    customer: DomainCustomer
    status: string
    table: string
    total_price: number
    quantity: number
    payment: DomainPaymentMethod
    payment_image?: string
    seen?: boolean
    delivery?: boolean
    customer_location?: string
    created_at?: number
    deleted_at?: number
}

export class DomainOrder {
    uuid?: string
    uuid_user: string
    guest: string
    order_id: string
    items: DomainOrderItem[]
    customer: DomainCustomer
    status: string
    table: string
    total_price: number
    quantity: number
    payment: DomainPaymentMethod
    payment_image?: string
    seen?: boolean
    delivery?: boolean
    customer_location?: string
    created_at?: number
    deleted_at?: number

    constructor(data: OrderInit) {  
        this.uuid = data.uuid
        this.uuid_user = data.uuid_user
        this.guest = data.guest
        this.order_id = data.order_id
        this.items = data.items
        this.customer = data.customer
        this.status = data.status
        this.table = data.table
        this.total_price = data.total_price
        this.quantity = data.quantity
        this.payment = data.payment
        this.payment_image = data.payment_image
        this.seen = data.seen
        this.delivery = data.delivery
        this.customer_location = data.customer_location
        this.created_at = data.created_at
        this.deleted_at = data.deleted_at
    }
}