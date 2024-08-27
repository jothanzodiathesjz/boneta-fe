"use client";
import { Column } from "primereact/column";
import { DataTable,DataTableFilterMeta } from "primereact/datatable";
import { DomainMenu } from "@/domain/Menu";
import { FilterMatchMode } from 'primereact/api';
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { InputNumber } from "primereact/inputnumber";
import MenuViewModel from "@/viewmodel/Menu.vm";
import React, { useState, useEffect, useRef } from 'react';
import { FileUpload } from 'primereact/fileupload';
import { Dropdown,DropdownChangeEvent } from "primereact/dropdown";
import { CategoryViewModel } from "@/viewmodel/Category";
import { InputSwitch } from "primereact/inputswitch";
import { Toast } from "primereact/toast";
import { IconField } from 'primereact/iconfield';
import { InputIcon } from 'primereact/inputicon';
import { Dialog } from "primereact/dialog";
export default function Menus() {
  const vm = MenuViewModel()
  const vmCategory = CategoryViewModel()
  const [filters, setFilters] = useState<DataTableFilterMeta>({
    global: { value: null, matchMode: FilterMatchMode.CONTAINS },
    name: { value: null, matchMode: FilterMatchMode.STARTS_WITH }
});
const [globalFilterValue, setGlobalFilterValue] = useState<string>('');
const renderHeader = () => {
  return (
      <div className="flex justify-between items-center">
        <span>Data Menu</span>
          <IconField iconPosition="left">
              <InputIcon className="pi pi-search" />
              <InputText value={globalFilterValue} onChange={onGlobalFilterChange} placeholder="Keyword Search" />
          </IconField>
      </div>
  );
};
const onGlobalFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  const value = e.target.value;
  let _filters = { ...filters };

  // @ts-ignore
  _filters['global'].value = value;

  setFilters(_filters);
  setGlobalFilterValue(value);
};

  const imageBodyTemplate = (menu: DomainMenu) => {
    return (
      <img
        src={`${process.env.NEXT_PUBLIC_BASE_URL}/${menu.image}`}
        alt={menu.image}
        className="w-24 shrink-0 shadow-2 border-round"
      />
    );
  };
  const deleteProductDialogFooter = (
    <React.Fragment>
        <Button label="No" icon="pi pi-times" outlined onClick={()=>vm.setTbd(null)} />
        <Button label="Yes" icon="pi pi-check" severity="danger" onClick={()=>vm.handleDelete()} />
    </React.Fragment>
);
  const actionBodyTemplate = (rowData: DomainMenu) => {
    return (
        <React.Fragment >
          <div className="flex flex-row ">
            <Button 
            icon="pi pi-pencil" 
            rounded 
            outlined 
            className="mr-2" 
            onClick={() => (
              vm.setMenuForm(rowData),
              vm.setUpdating(true),
              vmCategory.setSelectedCategory(rowData.category)
              )} />
            <Button icon="pi pi-trash" rounded outlined severity="danger" onClick={() => vm.setTbd(rowData)} />
          </div>
        </React.Fragment>
    );
};
  
  const handleFileChange = (e: File[]) => {
    vm.setFile(e[0]);
    console.log(vm.file)
  };
useEffect(() => {
  // console.log(vmCategory.selectedCategory)
  // console.log(vm.menuForm)
},[vmCategory.selectedCategory,vm.tbd])


  // vm.getData()
  useEffect(() => {
   vm.setMenu(vm.data?.data || [])
   console.log(vm.dataSuccess)
  },[vm.data])

  const header = renderHeader();
  return (
    <div className="flex min-h-screen flex-col items-center justify-between pt-20">
      <Toast ref={vm.toast} />
      <Dialog 
      visible={vm.tbd ? true : false} 
      style={{ width: '32rem' }} 
      breakpoints={{ '960px': '75vw', '641px': '90vw' }} 
      header="Confirm" modal 
      footer={deleteProductDialogFooter} 
      onHide={() => vm.setTbd(null)}>
                <div className="confirmation-content">
                    <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                    {vm.tbd && (
                        <span>
                            Apakah Anda yakin ingin menghapus? <b>{vm.tbd.name}</b>?
                        </span>
                    )}
                </div>
            </Dialog>
      <div className="flex flex-row gap-2 w-full">
        <div className="w-[40vw] flex-shrink-0 h-full p-3 gap-3 flex flex-col border-r border-neutral-60/30">
          <span className="font-semibold text-lg mb-2">Formulir Tambah Menu</span>
          <div className="grid grid-cols-2 gap-4">
            <div className="w-full flex flex-col gap-2">
              <span className="text-neutral-600">Nama Item</span>
              <InputText 
              placeholder="Masukkan nama menu"
              value={vm.menuForm.name}
              onChange={(e) => vm.setMenuForm({...vm.menuForm,name:e.target.value})}
              />
            </div>
            <div className="w-full flex flex-col gap-2">
              <span className="text-neutral-600">Harga</span>
              <InputNumber 
              placeholder="Masukkan harga menu"
              value={vm.menuForm.price}
              onChange={(e) => vm.setMenuForm({...vm.menuForm,price:e.value!})}
              currency="IDR"/>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="w-full flex flex-col gap-2">
              <span className="text-neutral-600">Kategori</span>
              <Dropdown 
              dataKey="uuid"
              value={vmCategory.selectedCategory} 
              onChange={(e: DropdownChangeEvent) => [vmCategory.setSelectedCategory(e.value),vm.setMenuForm({...vm.menuForm,category:e.value})]} 
              options={vmCategory.data?.data} optionLabel="name" 
                placeholder="Select a Category" className="w-full "
                
                />
            </div>
            <div className="w-full flex flex-col gap-2">
            <span className="text-neutral-600">Tersedia</span>
            <InputSwitch className="mt-3"   checked={vm.menuForm.availability} onChange={(e) =>vm.setMenuForm({...vm.menuForm,availability:e.value}) } />
          </div>
          </div>
          
          <div className="w-full flex flex-col gap-2">
              <span className="text-neutral-600">Gambar</span>
              <FileUpload 
              id="image"
              mode="advanced"
              uploadOptions={{
                style: { display: 'none' },
              }}
              name="image" 
              url={'/api/upload'} 
              accept="image/*" 
              onClear={() => vm.setFile(null)}
              onSelect={(e) => handleFileChange(e.files)}
              maxFileSize={1000000} 
              emptyTemplate={<p className="m-0">Unggah Gambar Di Sini</p>} 
              />
            </div>
            <div className="w-full flex flex-row justify-end gap-2">
            <Button
            label={vm.updating ? "Update Data" : "Save Data"}
            loading={vm.onLoading}
            loadingIcon="pi pi-spin pi-spinner"
            onClick={() => (vm.updating ? vm.handleUpdate() : vm.handleSendData())}
            />
            <Button
            label={"Clear Form"}
            severity="secondary"
            onClick={() => (
              vm.setMenuForm({uuid:"",name: "", price: 0, availability: true, image: ""}),
              vmCategory.setSelectedCategory(null),
              vm.setFile(null),
              vm.setUpdating(false)
            )}
            />
            </div>
        </div>
        <div className="w-full h-full flex flex-col border-r border-neutral-60/30">
          <DataTable 
          dataKey="uuid"
          filters={filters}
          value={vm.menu} 
          paginator rows={5} 
          scrollable
          rowsPerPageOptions={[5, 10, 25, 50]} 
          scrollHeight="65vh" 
          tableStyle={{ minWidth: "45rem" }}
           globalFilterFields={['name', 'category.name']} header={header} emptyMessage="No customers found."
          >
            <Column
              headerClassName="bg-primary-surface"
              field="name"
              style={{ minWidth: "12rem" }}
              header="Nama"
              sortable
            ></Column>
            <Column
              headerClassName="bg-primary-surface"
              field="category.name"
              className="w-full"
              header="Nama"
              sortable
            ></Column>
            <Column
            headerClassName="bg-primary-surface"
              field="price"
              className="w-full"
              header="Harga"
              sortable
            ></Column>
            <Column
            headerClassName="bg-primary-surface"
              field="availability"
              className="w-full"
              header="Tersedia "
              sortable
            ></Column>
            <Column
            headerClassName="bg-primary-surface"
              field="image"
              className="w-full"
              body={imageBodyTemplate}
              header="Gambar"
              sortable
            ></Column>
            <Column headerClassName="bg-primary-surface" body={actionBodyTemplate} exportable={false}></Column>
          </DataTable>
        </div>
      </div>
    </div>
  );
}
