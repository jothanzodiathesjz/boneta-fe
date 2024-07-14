import React, { useState ,useEffect} from 'react';
import { OrderItemResult } from '@/domain/OrderItem';

interface CartResultProps {
    click: () => void;
    data:OrderItemResult
}

export  const  CartResult : React.FC<CartResultProps> =({click,data})=> {
    return (
            <div className='fixed bottom-0 w-full md:w-[500px] z-30  flex flex-col  items-center gap-3 rounded-xl p-5 bg-danger-pressed '> 
                <div className='w-full flex flex-row justify-between items-center gap-3'>
                    <div className="flex flex-col">
                        <span className='font-semibold text-white'>{data.quantity} ITEM(S)</span>
                        <span className='font-semibold text-neutral-300'>RP {data.total_price}</span>
                    </div>
                    <button
                    onClick={click}
                    className="flex flex-row gap-2 items-center">
                    <span className="text-white">Lihat Pesanan</span>
                    <i className="pi pi-angle-right text-neutral-300"></i>
                    </button>
                </div>
                
            </div>
    )
}   