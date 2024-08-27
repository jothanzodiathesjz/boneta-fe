'use client';
import React, { useEffect,useRef } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { CategoryViewModel } from '@/viewmodel/Category';
import { Button } from 'primereact/button';
import { DomainCategory } from '@/domain/Category';
import { Dialog } from 'primereact/dialog';
import TextInput from '@/components/input/TextInput.component';
import { ConfirmDialog } from 'primereact/confirmdialog';
import { Toast } from 'primereact/toast';
import { QRCodeCanvas } from "qrcode.react";
import { InputText } from 'primereact/inputtext';
import Loading from '@/components/Loading';

export default function Others() {
    const vm_category = CategoryViewModel()
    const qrRef = useRef<HTMLDivElement>(null);
    const actionBodyTemplate = (rowData: DomainCategory) => {
        return (
            <React.Fragment >
                <div className="flex flex-row ">
                    <Button icon="pi pi-trash" onClick={() => (vm_category.confirm2(rowData))} rounded outlined severity="danger" />
                </div>
            </React.Fragment>
        );
    };
    const handleDownload = () => {
        if (qrRef.current) {
            const canvas = qrRef.current.querySelector('canvas');
            if (canvas) {
                const pngUrl = canvas
                    .toDataURL('image/png')
                    .replace('image/png', 'image/octet-stream');
                const downloadLink = document.createElement('a');
                downloadLink.href = pngUrl;
                downloadLink.download = `qrcode_${vm_category.meja}.png`;
                document.body.appendChild(downloadLink);
                downloadLink.click();
                document.body.removeChild(downloadLink);
            }
        }
    };

    useEffect(() => {
        console.log(vm_category.tbd)
    }, [vm_category.data, vm_category.tbd])

    useEffect(() => {
    }, [vm_category.showQr])
    return (
        <div className="flex min-h-screen flex-col items-center justify-between pt-20">
            <Toast ref={vm_category.toast} />
            <div className='w-full grid grid-cols-2 gap-4 h-full'>
                <div className="w-full flex flex-col gap-2 p-5 border-r border-neutral-70 h-[80vh]">
                    <span className='font-semibold'>Kategori</span>
                    <div className='w-full flex flex-row items-center justify-end'>
                    
                        <Button
                            label='Add Category'
                            onClick={() => vm_category.setShowCategoryForm(true)}
                        />
                    </div>
                    <DataTable value={vm_category.data?.data} scrollHeight='70vh' scrollable>
                        <Column field="name" header="Name" headerClassName='bg-primary-surface' className='w-44 shrink-0'></Column>
                        <Column headerClassName="bg-primary-surface" body={actionBodyTemplate} className='w-44 shrink-0' exportable={false}></Column>
                    </DataTable>
                </div>
                <div className="w-full flex flex-col gap-2 p-5">
                    <span className='font-semibold'>Hasilkan Kode QR</span>
                    <div className='w-full flex flex-col gap-3'>
                        <span>Nama Meja</span>
                        <div className='w-full flex flex-row gap-4'>
                        <InputText
                        className='w-full'
                        id='meja'
                        value={vm_category.meja}
                        onChange={(e) => (vm_category.setMeja(e.target.value),vm_category.setShowQr(false))}
                        />
                        <Button
                        label='Generate'
                        onClick={()=>vm_category.handleGenerate()}
                        />
                        </div>
                    </div>
                    <div className='w-full h-[60vh] flex flex-col justify-center items-center'>
                        {vm_category.generateLoading && <Loading/>}
                        {vm_category.showQr  &&  
                        <div className='flex flex-col gap-3'>
                        <div ref={qrRef}>
                            <QRCodeCanvas
                                value={`${process.env.NEXT_PUBLIC_CLIENT_URL}/?mode=dine-in&table=${vm_category.meja}`}
                                size={350}
                                bgColor={"#ffffff"}
                                fgColor={"#000000"}
                                level={"L"}
                                includeMargin={false}
                                imageSettings={{
                                    src: "",
                                    x: undefined,
                                    y: undefined,
                                    height: 24,
                                    width: 24,
                                    excavate: true,
                                }}
    
                            />
                        </div>
                            <Button
                            label='Download'
                            onClick={handleDownload}
                            severity='success'
                            />
                        </div>
                        }
                    </div>
                </div>
            </div>
            <Dialog
                draggable={false}
                header="Formulir Kategory"
                visible={vm_category.showCategoryForm}
                onHide={() => vm_category.setShowCategoryForm(false)}
                className='w-1/3'
            >
                <div className='w-full flex flex-col gap-3'>
                    <span>Nama Kategori </span>
                    <TextInput
                        id='name'
                        value={vm_category.categoryForm.name}
                        onChange={(e) => vm_category.setCategoryForm({ ...vm_category.categoryForm, name: e.target.value })}
                    />
                    <Button
                        label="Save"
                        onClick={() => vm_category.handleCreateCategory()}
                    />
                </div>
            </Dialog>
            <ConfirmDialog />

        </div>
    )
}