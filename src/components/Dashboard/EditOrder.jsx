import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { FaArrowLeft, FaPlus, FaTrash } from "react-icons/fa";
import AddPartnerModal from "@/components/Dashboard/partner/AddPartnerModal";
import ProductSelectionModal from "@/components/Dashboard/ProductSelectionModal";

const EditOrder = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [orderItems, setOrderItems] = useState([]);
  const [isPartnerModalOpen, setIsPartnerModalOpen] = useState(false);
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [selectedPartner, setSelectedPartner] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");
  const [orderType, setOrderType] = useState("import");

  // Dữ liệu mẫu cho đối tác và trạng thái
  const partners = [
    { id: 1, name: "Nguyễn Văn A", phone: "0123456789" },
    { id: 2, name: "Nguyễn Văn B", phone: "0987654321" },
    { id: 3, name: "Nguyễn Văn C", phone: "0369852147" },
    { id: 4, name: "Nguyễn Văn D", phone: "0147852369" },
  ];

  const orderStatuses = [
    "Chờ xác nhận",
    "Chờ thanh toán",
    "Đã thanh toán",
    "Đã hủy",
  ];

  useEffect(() => {
    // Dữ liệu mẫu
    const mockOrder = {
      id: id,
      partnerId: "1",
      type: "import",
      status: "Chờ xác nhận",
      items: [
        {
          id: 1,
          product: "Sản phẩm A",
          quantity: 2,
          price: 180000,
        },
        {
          id: 2,
          product: "Sản phẩm B",
          quantity: 1,
          price: 250000,
        },
      ],
    };

    setSelectedPartner(mockOrder.partnerId);
    setOrderType(mockOrder.type);
    setSelectedStatus(mockOrder.status);
    setOrderItems(mockOrder.items);
  }, [id]);

  const handleAddItem = () => {
    setIsProductModalOpen(true);
  };

  const handleProductSelect = (product) => {
    const isProductSelected = orderItems.some((item) => item.id === product.id);

    if (!isProductSelected) {
      setOrderItems([
        ...orderItems,
        {
          id: product.id,
          product: product.name,
          quantity: 1,
          price: product.price,
        },
      ]);
    }
  };

  const handleRemoveItem = (id) => {
    setOrderItems(orderItems.filter((item) => item.id !== id));
  };

  const handleQuantityChange = (id, value) => {
    setOrderItems(
      orderItems.map((item) =>
        item.id === id ? { ...item, quantity: parseInt(value) || 1 } : item
      )
    );
  };

  const handlePriceChange = (id, value) => {
    setOrderItems(
      orderItems.map((item) =>
        item.id === id ? { ...item, price: parseInt(value) || 0 } : item
      )
    );
  };

  const calculateTotal = () => {
    return orderItems.reduce(
      (total, item) => total + item.quantity * item.price,
      0
    );
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Cập nhật đơn hàng:", {
      id,
      partnerId: selectedPartner,
      type: orderType,
      status: selectedStatus,
      items: orderItems,
    });
    navigate("/dashboard/business/order-management");
  };

  const handleAddPartner = (partnerData) => {
    console.log("Đối tác mới:", partnerData);
  };

  return (
    <div className="w-full bg-white shadow-lg rounded-lg overflow-hidden">
      <div className="p-6">
        <div className="flex items-center mb-6">
          <button
            onClick={() => navigate("/dashboard/business/order-management")}
            className="flex items-center text-gray-600 border border-gray-300 rounded-md p-1 hover:text-gray-800 mr-2"
          >
            <FaArrowLeft className="" />
          </button>
          <h1 className="text-2xl font-bold text-gray-800">
            Chỉnh sửa đơn hàng #{id}
          </h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Đối tác
              </label>
              <div className="flex flex-col space-y-2">
                <div className="flex">
                  <select
                    value={selectedPartner}
                    onChange={(e) => setSelectedPartner(e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Chọn đối tác</option>
                    {partners.map((partner) => (
                      <option key={partner.id} value={partner.id}>
                        {partner.name} - {partner.phone}
                      </option>
                    ))}
                  </select>
                </div>
                <button
                  type="button"
                  onClick={() => setIsPartnerModalOpen(true)}
                  className="flex items-center text-blue-600 hover:text-blue-800 text-sm mt-2"
                >
                  <FaPlus className="mr-1" />
                  Thêm mới đối tác
                </button>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Loại đơn hàng
              </label>
              <select
                value={orderType}
                onChange={(e) => setOrderType(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="import">Đơn hàng nhập</option>
                <option value="export">Đơn hàng xuất</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Trạng thái đơn hàng
              </label>
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Chọn trạng thái</option>
                {orderStatuses.map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Danh sách sản phẩm */}
          <div className="mt-8">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold text-gray-800">
                Danh sách sản phẩm
              </h2>
              <button
                type="button"
                onClick={handleAddItem}
                className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                <FaPlus className="mr-2" />
                Thêm sản phẩm
              </button>
            </div>

            {orderItems.length > 0 ? (
              <div className="bg-white rounded-lg shadow overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Sản phẩm
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Số lượng
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Đơn giá
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Thành tiền
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Thao tác
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {orderItems.map((item) => (
                      <tr
                        key={item.id}
                        className="hover:bg-gray-50 transition-colors"
                      >
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">
                            {item.product}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <input
                            type="number"
                            value={item.quantity}
                            onChange={(e) =>
                              handleQuantityChange(item.id, e.target.value)
                            }
                            min="1"
                            className="w-24 px-3 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                          />
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <input
                            type="number"
                            value={item.price}
                            onChange={(e) =>
                              handlePriceChange(item.id, e.target.value)
                            }
                            className="w-32 px-3 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                          />
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-blue-600">
                            {(item.quantity * item.price).toLocaleString()} VNĐ
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right">
                          <button
                            type="button"
                            onClick={() => handleRemoveItem(item.id)}
                            className="text-red-500 hover:text-red-700 transition-colors"
                          >
                            <FaTrash className="h-5 w-5" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
                <FaPlus className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900">
                  Chưa có sản phẩm nào
                </h3>
                <p className="mt-1 text-sm text-gray-500">
                  Bấm nút "Thêm sản phẩm" để bắt đầu
                </p>
              </div>
            )}
          </div>

          {/* Tổng tiền và nút lưu */}
          <div className="flex justify-between items-center mt-6">
            <div className="text-lg font-semibold">
              Tổng tiền:{" "}
              <span className="text-blue-600">
                {calculateTotal().toLocaleString()} VNĐ
              </span>
            </div>
            <div className="space-x-4">
              <button
                type="button"
                onClick={() => navigate("/dashboard/business/order-management")}
                className="px-6 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
              >
                Hủy
              </button>
              <button
                type="submit"
                className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Cập nhật đơn hàng
              </button>
            </div>
          </div>
        </form>
      </div>

      {/* Modal thêm đối tác */}
      <AddPartnerModal
        isOpen={isPartnerModalOpen}
        onClose={() => setIsPartnerModalOpen(false)}
        onSubmit={handleAddPartner}
      />

      {/* Modal chọn sản phẩm */}
      <ProductSelectionModal
        isOpen={isProductModalOpen}
        onClose={() => setIsProductModalOpen(false)}
        onSelect={handleProductSelect}
        selectedProducts={orderItems}
      />
    </div>
  );
};

export default EditOrder;
