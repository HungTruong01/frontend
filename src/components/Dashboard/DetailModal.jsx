import React from "react";

const DetailModal = ({
  currentItem,
  formattedColumns,
  handleCloseDetailModal,
}) => {
  return (
    <div className="fixed inset-0 bg-black/20 backdrop-blur-lg flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-2xl mx-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Chi tiết đơn hàng</h2>
          <button
            onClick={handleCloseDetailModal}
            className="text-gray-500 hover:text-gray-700"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        <div className="overflow-y-auto max-h-96">
          <table className="w-full">
            <tbody>
              {formattedColumns.map((column) => (
                <tr key={column.key} className="border-b">
                  <td className="py-2 px-4 font-semibold w-1/3">
                    {column.label}:
                  </td>
                  <td className="py-2 px-4">{currentItem[column.key]}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-6 flex justify-end gap-2">
          <button
            onClick={handleCloseDetailModal}
            className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
};

export default DetailModal;
