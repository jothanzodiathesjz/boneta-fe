"use client";
import { DataTable, DataTableSelectEvent } from "primereact/datatable";
import { useState } from "react";
import { Column } from "primereact/column";
import { useEffect,useRef } from "react";
import { useAnimationStore } from "@/store/AnimateStore";
import { OrderDashboardViewModel } from "@/viewmodel/OrderDashboard.vm";
import { DomainOrder } from "@/domain/Orders";
import { Calendar } from "primereact/calendar";
import { Nullable } from "primereact/ts-helpers";
import { UnixToDateStringReverse } from "@/utils/date";
import OrderDetailModal from "@/components/orders/OrderDetailModal";
import { Button } from "primereact/button";
import autoTable from "jspdf-autotable";
import { RowInput } from "jspdf-autotable";
export default function page() {
  const animationStore = useAnimationStore();
  const vm = OrderDashboardViewModel();
  const [dates, setDates] = useState<Nullable<(Date | null)[]>>([new Date(), new Date()]);
  const [date,setDate] = useState<Nullable<Date | null>>(null)
  const dt = useRef<DataTable<DomainOrder[]>>(null);
  interface ColumnMeta {
    field: string;
    header: string;
}
  const onRowSelect = async (event: DataTableSelectEvent) => {
       console.log(event.data)
      //  if(!event.data.seen){
      //      await vm.updateSeen(event.data.uuid)
      //  }
       vm.setSelectedOrder(event.data)
  };

  const cols : ColumnMeta[]= [
    { field: 'order_id', header: 'Order Id' },
    { field: 'status', header: 'Status' },
    { field: 'table', header: 'Table' },
    { field: 'total_price', header: 'Total Price' }
];


const exportColumns = cols.map((col) => ({ title: col.header, dataKey: col.field }));
const exportCSV = (selectionOnly:any) => {
  dt.current?.exportCSV({ selectionOnly });
};


const saveAsExcelFile = (buffer:any, fileName:any) => {
  import('file-saver').then((module) => {
      if (module && module.default) {
          let EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
          let EXCEL_EXTENSION = '.xlsx';
          const data = new Blob([buffer], {
              type: EXCEL_TYPE
          });

          module.default.saveAs(data, fileName + '_export_' + new Date().getTime() + EXCEL_EXTENSION);
      }
  });
};



const exportPdf = () => {
  const newData = vm.data?.data.orders.flatMap((v): RowInput[] => {
    const orderRow = [
      v.order_id,
      v.status,
      v.table,
      "", // Kosongkan kolom untuk item pada baris order
      v.total_price.toLocaleString(), // Format harga dengan pemisah ribuan
    ];
  
    // Buat baris untuk setiap item dalam order
    const itemRows = v.items.map(item => [
      `     ${item.name} (x${item.quantity})`, // Kosongkan kolom order_id
      "", // Kosongkan kolom status
      "", // Kosongkan kolom table
      item.total_price.toLocaleString('id',{
        currency: 'IDR',
        style: 'currency',
      }), // Harga total item
    ]);
  
    return [orderRow, ...itemRows]; // Gabungkan baris order dan item
  });
  
  import('jspdf').then((jsPDF) => {
      import('jspdf-autotable').then(() => {
          const doc = new jsPDF.default("portrait");
          // autoTable(doc,{
          //   html:"#dtable",
          // })
          const title = "Laporan Pesanan"; // Ganti dengan judul yang Anda inginkan
          doc.setFontSize(18); // Mengatur ukuran font untuk judul
          doc.text(title, doc.internal.pageSize.getWidth() / 2, 20, { align: 'center' });
      
          // Mengatur jarak antara judul dan tabel
          const startY = 30; // Jarak dari atas halaman setelah judul
        console.log(newData)
        autoTable(doc, {
          head: [exportColumns],
          body: newData,
          foot: [
            ["", "", "Totals", `${vm.data?.data?.total_price.toLocaleString('id',{
              currency: 'IDR',
              style: 'currency',
            })}`],
          ],
          startY: startY, // Mulai tabel di bawah judul
          styles: {
            minCellHeight: 9,
            minCellWidth: 20,
            halign: 'center',
          },
          didParseCell: (data) => {
            if (data.column.dataKey === 0) { // Asumsikan 'order_id' berada di kolom pertama
              data.cell.styles.halign = 'left';
            }
          },
        });

          doc.save(new Date().toISOString() + "orders.pdf");
      });
  });
};

const exportExcel = () => {
  const newData = vm.data?.data.orders.map((v) => {
    return {
      order_id: v.order_id,
      status: v.status,
      table: v.table,
      total_price: v.total_price
    }
  })
  import('xlsx').then((xlsx) => {
      const worksheet = xlsx.utils.json_to_sheet(newData ?? []);
      const workbook = { Sheets: { data: worksheet }, SheetNames: ['data'] };
      const excelBuffer = xlsx.write(workbook, {
          bookType: 'xlsx',
          type: 'array'
      });

      saveAsExcelFile(excelBuffer, vm.date);
  });
};

const header = (
  <div className="flex align-items-center justify-content-end gap-2">
      <Button type="button" icon="pi pi-file-excel" severity="success" rounded onClick={exportExcel} data-pr-tooltip="XLS" />
      <Button type="button" icon="pi pi-file-pdf" severity="warning" rounded onClick={exportPdf}  data-pr-tooltip="PDF" />
  </div>
);
  function convertToISOWithoutOffset(dateString: string) {
    const date = new Date(dateString);
    return date.toISOString().split("T")[0];
  }
  const bodyTambahan = (rowData: DomainOrder) => {
    return (
      <div className="flex flex-row gap-3">
        <span className="w-full">
          {rowData.total_price.toLocaleString("id-ID")}
        </span>
      </div>
    );
  };
  useEffect(() => {
    console.log(convertToISOWithoutOffset("2024/07/29"));
    return animationStore.setIsOpen(true);
  }, [animationStore.isOpen]);
  // useEffect(()=>{
  //     vm.setOrders(vm.data?.data ?? [])
  // },[vm.data])

  useEffect(()=>{

  },[vm.selectedOrder])

  // useEffect(()=>{
  //   console.log(vm.dates)
  // },[vm.dates])



  return (
    <main className="min-h-screen pt-20">
      <div className="w-full h-full flex gap-4 px-5">
        <div className="w-full flex flex-col gap-3">
            {/* <span>Order List</span> */}
          <div className="card flex justify-content-center">
          <Calendar 
          value={dates} 
          onChange={(e) => (setDates(e.value),vm.setDates(e.value))} 
          selectionMode="range" 
          readOnlyInput 
          hideOnRangeSelection />
          </div>
          <div className="w-full flex flex-row  gap-3 border-r  border-neutral-60/30">
          <DataTable 
          id="dtable"
          key={"uuid"}
          ref={dt} 
          className="w-full"
          pt={{
            column: { bodyCell: { className: "scroller" } },
            wrapper: {
              className: "h-[80vh] overflow-y-scroll scroller",
            },
          }}
          value={vm.data?.data?.orders} 
          header={header} 
          onRowSelect={onRowSelect}
              selectionMode={"single"}

          >
                {cols.map((col, index) => (
                    <Column key={index} field={col.field} header={col.header} />
                ))}
            </DataTable>
            <div className="w-[40vw] flex flex-col p-5 bg-white shadow-md">
              <div className="w-full flex flex-col gap-4">
              <span className="font-medium">Order Summary</span>
                    <div className="w-full flex ">
                        <span className="w-44 flex-shrink-0">Total Order</span>
                        <span className="text-neutral-50">{vm.data?.data?.total_orders}</span>
                    </div>
                    <div className="w-full flex ">
                        <span className="w-44 flex-shrink-0">Total Quantity</span>
                        <span className="text-neutral-50">{vm.data?.data?.total_quantity}</span>
                    </div>
                    <div className="w-full flex ">
                        <span className="w-44 flex-shrink-0">Total </span>
                        <span className="text-neutral-50">{vm.data?.data?.total_price.toLocaleString("id-ID",{style:"currency",currency:"IDR"})}</span>
                    </div>
              </div>
        </div>
          </div>
        </div>
        
      </div>
      <OrderDetailModal
      closeModal={() => vm.setSelectedOrder(null)}
      data={vm.selectedOrder}
      />
    </main>
  );
}
