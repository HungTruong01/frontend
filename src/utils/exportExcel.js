import ExcelJS from "exceljs";
import { saveAs } from "file-saver";

export const exportExcel = async (options) => {
  const {
    data = [],
    fileName = "exported_data",
    sheetName = "Sheet1",
    header = {
      backgroundColor: "4472C4",
      fontColor: "FFFFFF",
      bold: true,
      height: 25,
    },
    columnConfig = {},
    style = {
      zebraPattern: false,
      zebraColor: "F2F2F2",
      rowHeight: 20,
    },
    headerMapping = {},
    enableFilter = true,
    autoWidth = false,
    freezePanes = true,
  } = options;

  if (!Array.isArray(data) || data.length === 0) {
    alert("Không có dữ liệu để xuất");
    return;
  }

  // Tạo workbook mới
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet(sheetName);

  // Xác định các cột từ dữ liệu hoặc từ headerMapping
  const dataKeys = Object.keys(data[0]);
  const columns = dataKeys.map((key) => {
    // Sử dụng headerMapping nếu được cung cấp, nếu không thì sử dụng key gốc
    const headerText = headerMapping[key] || key;

    // Lấy cấu hình cột cụ thể nếu có
    const colConfig = columnConfig[key] || {};

    return {
      header: headerText,
      key: key,
      width: colConfig.width || 15, // Độ rộng mặc định là 15
    };
  });

  // Thiết lập cột cho worksheet
  worksheet.columns = columns;

  // Thêm dữ liệu vào worksheet
  worksheet.addRows(data);

  // Định dạng header (dòng đầu tiên)
  const headerRow = worksheet.getRow(1);
  headerRow.height = header.height;

  headerRow.eachCell((cell) => {
    // Định dạng nền
    cell.fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: header.backgroundColor },
    };

    // Định dạng font chữ
    cell.font = {
      bold: header.bold,
      color: { argb: header.fontColor },
      size: 11,
    };

    // Căn lề
    cell.alignment = {
      vertical: "middle",
      horizontal: "center",
      wrapText: true,
    };

    // Viền
    cell.border = {
      top: { style: "thin" },
      left: { style: "thin" },
      bottom: { style: "thin" },
      right: { style: "thin" },
    };
  });

  // Định dạng các ô dữ liệu
  worksheet.eachRow((row, rowNumber) => {
    if (rowNumber > 1) {
      // Bỏ qua dòng header
      // Thiết lập chiều cao dòng
      row.height = style.rowHeight;

      row.eachCell((cell, colNumber) => {
        const currentKey = dataKeys[colNumber - 1];
        const colConfig = columnConfig[currentKey] || {};

        // Định dạng viền cho tất cả các ô
        cell.border = {
          top: { style: "thin" },
          left: { style: "thin" },
          bottom: { style: "thin" },
          right: { style: "thin" },
        };

        // Định dạng căn lề dựa trên cấu hình hoặc loại dữ liệu
        const horizontalAlignment =
          colConfig.alignment ||
          (typeof cell.value === "number" ? "right" : "left");

        cell.alignment = {
          vertical: "middle",
          horizontal: horizontalAlignment,
          wrapText: colConfig.wrapText || false,
        };

        // Định dạng số cho các cột số
        if (typeof cell.value === "number") {
          // Định dạng số dựa trên cấu hình hoặc mặc định
          cell.numFmt = colConfig.numberFormat || "#,##0.0";
        }

        // Nếu có định dạng tùy chỉnh cho cột hiện tại
        if (colConfig.format) {
          // Áp dụng định dạng tùy chỉnh (ví dụ: định dạng ngày tháng)
          cell.numFmt = colConfig.format;
        }

        // Màu nền cho các dòng chẵn nếu sử dụng mẫu ngựa vằn
        if (style.zebraPattern && rowNumber % 2 === 0) {
          cell.fill = {
            type: "pattern",
            pattern: "solid",
            fgColor: { argb: style.zebraColor },
          };
        }

        // Áp dụng màu sắc tùy chỉnh nếu có điều kiện
        if (
          colConfig.conditionalFormat &&
          typeof colConfig.conditionalFormat === "function"
        ) {
          const formatResult = colConfig.conditionalFormat(
            cell.value,
            row.values
          );
          if (formatResult) {
            if (formatResult.fillColor) {
              cell.fill = {
                type: "pattern",
                pattern: "solid",
                fgColor: { argb: formatResult.fillColor },
              };
            }
            if (formatResult.fontColor) {
              cell.font = Object.assign({}, cell.font || {}, {
                color: { argb: formatResult.fontColor },
              });
            }
            if (formatResult.bold !== undefined) {
              cell.font = Object.assign({}, cell.font || {}, {
                bold: formatResult.bold,
              });
            }
          }
        }
      });
    }
  });

  // Tự động điều chỉnh độ rộng cột nếu yêu cầu
  if (autoWidth) {
    worksheet.columns.forEach((column) => {
      let maxLength = 0;
      column.eachCell({ includeEmpty: true }, (cell) => {
        const columnLength = cell.value ? cell.value.toString().length : 10;
        if (columnLength > maxLength) {
          maxLength = columnLength;
        }
      });
      column.width = maxLength < 10 ? 10 : maxLength + 2;
    });
  }

  // Bật tính năng lọc (Filter) và sắp xếp
  if (enableFilter && data.length > 0) {
    // Xác định phạm vi dữ liệu để áp dụng AutoFilter
    const filterRange = {
      from: { row: 1, column: 1 },
      to: { row: data.length + 1, column: dataKeys.length },
    };
    worksheet.autoFilter = filterRange;
  }

  // Cố định dòng tiêu đề (Freeze Panes)
  if (freezePanes && data.length > 1) {
    worksheet.views = [
      {
        state: "frozen",
        xSplit: 0,
        ySplit: 1,
        topLeftCell: "A2",
        activeCell: "A2",
      },
    ];
  }

  // Xuất file Excel
  const buffer = await workbook.xlsx.writeBuffer();
  const blob = new Blob([buffer], {
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  });
  saveAs(blob, `${fileName}.xlsx`);
};
