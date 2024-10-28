"use client";
import { DataTable, DataTableSelectEvent } from "primereact/datatable";
import { useRef, useState } from "react";
import { Column } from "primereact/column";
import { useEffect } from "react";
import { useAnimationStore } from "@/store/AnimateStore";
import { Button } from "primereact/button";
import { ConfirmDialog } from "primereact/confirmdialog";
import { Toast } from "primereact/toast";
import { UsersViewModel } from "@/viewmodel/User.vm";
import { DomainUserWithProfile } from "@/domain/Users";
import UserModalForm from "@/components/user/UserModalForm";
export default function page() {
  const animationStore = useAnimationStore();
  const vm = UsersViewModel();
  const toast = useRef<Toast>(null);
  const [uuid, _] = useState("");
  const onRowSelect = async (event: DataTableSelectEvent) => {
    console.log(event.data);
    vm.setSelectedUser(event.data);
    vm.setIsOpen(true);
    vm.setUpdating(true);
  };

  const bodyTambahan1 = (rowData: DomainUserWithProfile) => {
    return (
      <span>
        {rowData.profile.firstName + " - " + rowData.profile.lastName}
      </span>
    );
  };
  const bodyTambahan2 = (rowData: DomainUserWithProfile) => {
    return <span>{rowData.roles.join()}</span>;
  };
  const bodyTambahan = (rowData: DomainUserWithProfile) => {
    return (
      <div className="flex flex-row gap-3">
        <Button
          icon="pi pi-trash"
          className="p-button-danger"
          onClick={() => vm.deleteUser(rowData)}
        />
      </div>
    );
  };

  useEffect(() => {
    return animationStore.setIsOpen(true);
  }, [animationStore.isOpen]);

  useEffect(() => {}, [vm.data]);

  return (
    <main className="min-h-screen pt-20">
      <Toast ref={toast} />
      <ConfirmDialog />
      <div className="w-full h-full flex gap-4 px-5">
        <div className="w-full flex flex-col gap-3 bg-white rounded-sm ">
          <div className="w-full flex justify-between items-center">
            <span>Users</span>
            <Button
              size="small"
              label="Add user"
              onClick={() => vm.setIsOpen(true)}
            />
          </div>
          <div className="w-full flex flex-row  gap-3 border-r  border-neutral-60/30">
            <DataTable
              key={"uuid"}
              className="w-full"
              value={vm.data.data?.data ?? []}
              emptyMessage="No Orders found."
              scrollable
              pt={{
                column: { bodyCell: { className: "scroller" } },
                wrapper: {
                  className: "h-[75vh] overflow-y-scroll scroller",
                },
              }}
              // selection={vm.selectedOrder}
              onRowSelect={onRowSelect}
              selectionMode={"single"}
            >
              <Column
                field="username"
                header="Nama Pengguna"
                headerClassName="bg-primary-surface py-2 px-4 font-normal "
                sortable
              ></Column>
              <Column
                field=""
                body={bodyTambahan1}
                header="Nama Lengkap"
                headerClassName="bg-primary-surface py-2 px-4 font-normal"
                sortable
              ></Column>
              <Column
                field="email"
                header="Email"
                headerClassName="bg-primary-surface p-2 font-normal"
                sortable
              ></Column>
              <Column
                field=""
                body={bodyTambahan2}
                header="Peran"
                headerClassName="bg-primary-surface p-2 font-normal"
                sortable
              ></Column>
              <Column
                field=""
                body={bodyTambahan}
                header=""
                headerClassName="bg-primary-surface py-2 px-4 font-normal"
              ></Column>
            </DataTable>
          </div>
        </div>
      </div>
      <UserModalForm
        visible={vm.isOpen}
        selected={vm.selectedUser}
        updating={vm.updating}
        closeModal={() => (
          vm.setIsOpen(false),
          vm.setUpdating(false),
          vm.setSelectedUser(null),
          vm.data.mutate()
        )}
        submit={() => vm.data.mutate()}
        uuid={uuid}
        errorMessage={(s) =>
          toast.current?.show({
            severity: "error",
            summary: "Error Message",
            detail: s,
            life: 3000,
          })
        }
        successMessage={(s) =>
          toast.current?.show({
            severity: "success",
            summary: "Success Message",
            detail: s,
            life: 3000,
          })
        }
      />
    </main>
  );
}
