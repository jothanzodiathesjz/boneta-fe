import React, { useState, useEffect } from 'react';
import { Sidebar } from 'primereact/sidebar';
import { Button } from 'primereact/button';
import { DomainOrderItem, OrderItemResult } from '@/domain/OrderItem';

interface CartPopFinalProps {
    data: OrderItemResult;
    visible: boolean;
    onVisibleChange: () => void;
    onUpdateData: (updatedData: OrderItemResult) => void;
    click: () => void;
}

export const CartPopFinal: React.FC<CartPopFinalProps> = ({ visible, onVisibleChange, data, onUpdateData, click }) => {

    const [localData, setLocalData] = useState<OrderItemResult | null>(null);

    useEffect(() => {
        setLocalData(data);
        if(localData && localData.items.length===0){
            setLocalData(null);
            onVisibleChange();
            localStorage.removeItem('order');
        }
    }, [data]);


    const increment = (value:DomainOrderItem) => {
        if(!localData) return
        const index = localData?.items.findIndex((v) => v.uuid === value.uuid);
        if (index !== -1 ) {
            const newItems = [...localData.items];
            newItems[index].quantity++ ;
            newItems[index].total_price = newItems[index].price * newItems[index].quantity;

            setLocalData({ ...localData, items: newItems,quantity:localData.quantity+1,total_price:localData.total_price+value.price });
            onUpdateData({ ...localData, items: newItems,quantity:localData.quantity+1,total_price:localData.total_price+value.price });
        }
    };

    const decrement = (value:DomainOrderItem) => {
        if(!localData) return
        const index = localData.items.findIndex((v) => v.uuid === value.uuid);
        
        if (index !== -1) {
            const newItems = [...localData.items];
            if (newItems[index].quantity === 1) {
                newItems.splice(index, 1);
            } else {
                newItems[index].quantity--;
                newItems[index].total_price = newItems[index].price * newItems[index].quantity;
            }
            setLocalData({ ...localData, items: newItems,quantity:localData.quantity-1,total_price:localData.total_price-value.price });
            onUpdateData({ ...localData, items: newItems,quantity:localData.quantity-1,total_price:localData.total_price-value.price });
        }
    };

    return (
        <Sidebar
            visible={visible}
            position="bottom"
            header='Pesanan Saya'
            className='md:w-[500px] w-full rounded-t-xl h-[70vh] flex flex-col pb-0'
            onHide={onVisibleChange}>
            {localData &&
            <div className='flex flex-col gap-3 p-3 justify-between h-full'>
                <div className='flex flex-col gap-4 h-full'>
                    {localData.items.map((v) => (
                        <div 
                        key={v.uuid}
                        className='flex flex-row w-full justify-between items-center gap-3'>
                            <div className='flex flex-col'>
                                <span className='font-medium'>{v.name}</span>
                                {/* <span className=''>{v.price.toLocaleString()}</span> */}
                                <span className=''>{v.total_price.toLocaleString('id-ID', { style: 'currency', currency: 'IDR' })}</span>
                            </div>
                            <div className='flex flex-row gap-2 items-center border border-primary rounded-xl p-2'>
                                <Button
                                    className='h-8'
                                    label='-'
                                    severity='danger'
                                    onClick={()=>decrement(v)}
                                />
                                <span className='mx-3 text-center'>{v.quantity}</span>
                                <Button
                                    className='h-8'
                                    label='+'
                                    severity='danger'
                                    onClick={()=>increment(v)}
                                />
                            </div>
                        </div>
                    ))}
                  
            </div>
                    <div className='flex flex-col gap-2'>
                        <div className='w-full p-2 border rounded-xl flex flex-row justify-between items-ends border-neutral-70'>
                            <span>{localData.total_price.toLocaleString('id-ID', { style: 'currency', currency: 'IDR' })}</span>
                            <div className='flex flex-col gap-2'>
                                <span>{localData.quantity} Items</span>
                            </div>
                        </div>
                        <Button
                            className='sticky bottom-0 w-full'
                            label='Proses Pesanan'
                            severity='warning'
                            onClick={click}
                        />
                    </div>
            </div>
            }
        </Sidebar>
    );
}