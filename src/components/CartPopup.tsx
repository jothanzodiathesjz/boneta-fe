import React, { useState ,useEffect} from 'react';
import { Sidebar } from 'primereact/sidebar';
import { Button } from 'primereact/button';
import { DomainOrderItem } from '@/domain/OrderItem';

interface CartPopupProps {
    data:DomainOrderItem;
    visible: boolean;
    onVisibleChange: () => void;
    onUpdateData: (updatedData: DomainOrderItem) => void;
    onSubmit: (item: DomainOrderItem) => void;
}

export const CartPopup: React.FC<CartPopupProps> = ({ visible, onVisibleChange, data, onUpdateData, onSubmit }) => {
   
    const [localData, setLocalData] = useState(data);

    useEffect(() => {
        setLocalData(data);
    }, [data]);

    const increment = () => {
        const updatedData = { ...localData, total_price: localData.total_price + localData.price, quantity: localData.quantity + 1 };
        setLocalData(updatedData);
        onUpdateData(updatedData);
    };

    const decrement = () => {
        if(localData.quantity === 0) return
        const updatedData = { ...localData, total_price: localData.total_price - localData.price, quantity: localData.quantity - 1 };
        setLocalData(updatedData);
        onUpdateData(updatedData);
    };

    return (
        <Sidebar
            visible={visible}
            position="bottom"
            header={localData?.name}
            className='md:w-[500px] w-full rounded-t-xl h-44 flex flex-col pb-0'
            onHide={onVisibleChange}>
            {localData && <div className='flex flex-col gap-4'>
                <div className='flex flex-row w-full justify-between items-center gap-3'>
                    <span className='font-semibold'>{localData.total_price.toLocaleString('id-ID', { style: 'currency', currency: 'IDR' })}</span>
                    <div className='flex flex-row gap-2 items-center border border-primary rounded-xl p-2'>
                        <Button 
                        label='-'
                            severity='danger' 
                            onClick={decrement} 
                        />
                        <span className='mx-3 text-center'>{localData.quantity}</span>
                        <Button 
                        label='+'
                            severity='danger'
                            onClick={increment} 
                        />
                    </div>
                </div>
                {/* <Button
                disabled={localData.quantity === 0} 
                onClick={()=>onSubmit(localData)}
                severity='info' label="Add" /> */}
            </div>}
        </Sidebar>
    );
}
