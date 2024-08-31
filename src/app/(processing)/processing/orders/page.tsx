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
import { Dialog } from 'primereact/dialog';
import { InputText } from "primereact/inputtext";
import { getCookie, parseCookie } from "@/utils/cookies";
import { DomainUserWithProfile } from "@/domain/Users";
export default function page() {
  const animationStore = useAnimationStore();
  const vm = OrderDashboardViewModel();
  const [dates, setDates] = useState<Nullable<(Date | null)[]>>([
    new Date(),
    new Date(),
  ]);
  const [date, setDate] = useState<Nullable<Date | null>>(null);
  const [visible, setVisible] = useState(false);
  const [pengguna, setPengguna] = useState<string>("");
  const [user, setUser] = useState<DomainUserWithProfile | null>(
    parseCookie(getCookie("user")!)
  );
  const dt = useRef<DataTable<any[]>>(null);
  interface ColumnMeta {
    field: string;
    header: string;
  }
  const onRowSelect = async (event: DataTableSelectEvent) => {
    console.log(event.data);
    //  if(!event.data.seen){
    //      await vm.updateSeen(event.data.uuid)
    //  }
    vm.setSelectedOrder(event.data);
  };

  const cols: ColumnMeta[] = [
    { field: "order_id", header: "ID Pesanan" },
    { field: "status", header: "Status" },
    { field: "table", header: "Meja" },
    { field: "total_price", header: "Total Harga" },
  ];

  const exportColumns = cols.map((col) => ({
    title: col.header,
    dataKey: col.field,
  }));
  const exportCSV = (selectionOnly: any) => {
    dt.current?.exportCSV({ selectionOnly });
  };

  const saveAsExcelFile = (buffer: any, fileName: any) => {
    import("file-saver").then((module) => {
      if (module && module.default) {
        let EXCEL_TYPE =
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8";
        let EXCEL_EXTENSION = ".xlsx";
        const data = new Blob([buffer], {
          type: EXCEL_TYPE,
        });

        module.default.saveAs(
          data,
          fileName + "_export_" + new Date().getTime() + EXCEL_EXTENSION
        );
      }
    });
  };

  const exportPdf = (nama: string) => {
    const newData = vm.data?.data.orders.flatMap((v): RowInput[] => {
      const orderRow = [
        v.order_id,
        v.status,
        v.table,
        "", // Kosongkan kolom untuk item pada baris order
        (v.total_price * 1.1).toLocaleString(), // Format harga dengan pemisah ribuan
      ];

      // Buat baris untuk setiap item dalam order
      const itemRows = v.items.map((item) => [
        `     ${item.name} (x${item.quantity})`, // Kosongkan kolom order_id
        "", // Kosongkan kolom status
        "", // Kosongkan kolom table
        (item.total_price * 1.1).toLocaleString("id", {
          currency: "IDR",
          style: "currency",
        }), // Harga total item
      ]);

      return [orderRow, ...itemRows]; // Gabungkan baris order dan item
    });

    import("jspdf").then((jsPDF) => {
      import("jspdf-autotable").then(() => {
        const doc = new jsPDF.default("portrait");
        const title = "Laporan Pesanan"; // Ganti dengan judul yang Anda inginkan
        doc.setFontSize(18); // Mengatur ukuran font untuk judul
        doc.text(title, doc.internal.pageSize.getWidth() / 2, 20, {
          align: "center",
        });

        // Mengatur jarak antara judul dan tabel
        const startY = 30; // Jarak dari atas halaman setelah judul
        console.log(newData);
        const footer = [
          [
            "",
            "",
            "Totals",
            `${((vm.data?.data?.total_price ?? 0) * 1.1).toLocaleString("id", {
              currency: "IDR",
              style: "currency",
            })}`,
          ],
          ["", "", "", ""], // Kosongkan baris sebelum tanda tangan
          [
            "",
            "",
            "",
            `Makassar, ${new Date().toLocaleString("id", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}`,
          ],
          ["", "", "", "Penanggung Jawab"],
          ["", "", "", ""], // Kosongkan baris sebelum tanda tangan
          ["", "", "", ""], // Kosongkan baris sebelum tanda tangan
          ["", "", "", `(${nama})`],
        ];

        autoTable(doc, {
          head: [exportColumns],
          body: newData,
          foot: footer,
          showFoot: "lastPage",
          startY: startY,
          styles: {
            minCellHeight: 9,
            minCellWidth: 20,
            halign: "center",
          },
          footStyles: {
            fillColor: [255, 255, 255], // Default: Putih
            textColor: [0, 0, 0],
            fontStyle: "normal",
          },
          didDrawCell: function (data) {
            // Ganti warna latar belakang "Totals"
            if (data.section === "foot" && data.row.index === 0) {
              data.cell.styles.fillColor = [0, 102, 204]; // Biru
              data.cell.styles.textColor = [255, 255, 255]; // Teks putih
            }
          },
        });

        const pageHeight = doc.internal.pageSize.getHeight();
        const finalY = startY;
        const footerHeight = 40;

        if (finalY + footerHeight > pageHeight) {
          doc.addPage();
        }

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
        total_price: v.total_price,
      };
    });
    import("xlsx").then((xlsx) => {
      const worksheet = xlsx.utils.json_to_sheet(newData ?? []);
      const workbook = { Sheets: { data: worksheet }, SheetNames: ["data"] };
      const excelBuffer = xlsx.write(workbook, {
        bookType: "xlsx",
        type: "array",
      });

      saveAsExcelFile(excelBuffer, vm.date);
    });
  };

  const header = (
    <div className="flex align-items-center justify-content-end gap-2">
      {/* <Button type="button" icon="pi pi-file-excel" severity="success" rounded onClick={exportExcel} data-pr-tooltip="XLS" /> */}
      <Calendar
        value={dates}
        onChange={(e) => (setDates(e.value), vm.setDates(e.value))}
        selectionMode="range"
        dateFormat="dd/mm/yy"
        readOnlyInput
        hideOnRangeSelection
      />
      <Button
        type="button"
        icon="pi pi-file-pdf"
        severity="warning"
        onClick={() => setVisible(true)}
        data-pr-tooltip="PDF"
      />
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

  useEffect(() => {}, [vm.selectedOrder]);

  // useEffect(()=>{
  //   console.log(vm.dates)
  // },[vm.dates])

  return (
    <main className="min-h-screen pt-20">
      <Dialog
        header="Penanggung Jawab"
        visible={visible}
        onHide={() => {
          if (!visible) return;
          setVisible(false);
        }}
      >
        <div className="w-80 flex-shrink-0 flex flex-col gap-3 px-3">
          <span>Nama</span>
          <InputText
            value={pengguna}
            placeholder="Masukkan Nama"
            onChange={(e) => setPengguna(e.target.value)}
          />
          <Button
            label="Export"
            disabled={!pengguna}
            onClick={() => (exportPdf(pengguna), setVisible(false))}
          />
        </div>
      </Dialog>
      <div className="w-full h-full flex gap-4 px-5">
        <div className="w-full flex flex-col gap-3">
          {/* <span>Order List</span> */}
          <div className="card flex justify-content-center"></div>
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
              value={vm.data?.data?.orders.map((v) => {
                return { ...v, total_price: v.total_price };
              })}
              header={header}
              onRowSelect={onRowSelect}
              selectionMode={"single"}
            >
              {cols
                .filter((v) => {
                  if (user?.roles.includes("kitchen")) {
                    return v.field !== "total_price";
                  }
                })
                .map((col, index) => (
                  <Column key={index} field={col.field} header={col.header} />
                ))}
            </DataTable>
            {user?.roles.includes("kitchen") ? null : (
              <div className="w-[40vw] flex flex-col p-5 bg-white shadow-md">
                <div className="w-full flex flex-col gap-4">
                  <span className="font-medium">Ringkasan Pesanan</span>
                  <div className="w-full flex ">
                    <span className="w-44 flex-shrink-0">Total Pesanan</span>
                    <span className="text-neutral-50">
                      {vm.data?.data?.total_orders}
                    </span>
                  </div>
                  <div className="w-full flex ">
                    <span className="w-44 flex-shrink-0">Total Items</span>
                    <span className="text-neutral-50">
                      {vm.data?.data?.total_quantity}
                    </span>
                  </div>
                  <div className="w-full flex ">
                    <span className="w-44 flex-shrink-0">Total PPN</span>
                    <span className="text-neutral-50">
                      {((vm.data?.data?.total_price ?? 0) * 0.1).toLocaleString(
                        "id-ID",
                        { style: "currency", currency: "IDR" }
                      )}
                    </span>
                  </div>
                  <div className="w-full flex ">
                    <span className="w-44 flex-shrink-0">Total Harga</span>
                    <span className="text-neutral-50">
                      {(vm.data?.data?.total_price ?? 0).toLocaleString(
                        "id-ID",
                        {
                          style: "currency",
                          currency: "IDR",
                        }
                      )}
                    </span>
                  </div>
                  <div className="w-full flex ">
                    <span className="w-44 flex-shrink-0">Total </span>
                    <span className="text-neutral-50">
                      {((vm.data?.data?.total_price ?? 0) * 1.1).toLocaleString(
                        "id-ID",
                        { style: "currency", currency: "IDR" }
                      )}
                    </span>
                  </div>
                </div>
              </div>
            )}
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
