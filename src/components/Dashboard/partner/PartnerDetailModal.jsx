import React, { use, useEffect, useState } from "react";
import { FaTimes } from "react-icons/fa";
import { getAllPartnerTypes } from "@/api/partnerTypeApi";
import { get } from "lodash";

const PartnerDetailModal = ({ isOpen, onClose, partner }) => {
  const [partnerTypes, setPartnerTypes] = useState([]);

  useEffect(() => {
    const fetchPartnersTypes = async () => {
      try {
        const response = await getAllPartnerTypes(0, 100, "id", "asc");
        setPartnerTypes(response.data.content);
      } catch (error) {
        console.error("Error fetching partner types:", error);
      }
    };
    fetchPartnersTypes();
  }, []);

  if (!isOpen || !partner) return null;

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
  };

  const getPartnerTypeName = (partnerTypeId) => {
    const type = partnerTypes.find((type) => type.id === partnerTypeId);
    return type ? type.name : "Unknown";
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 w-full max-w-md shadow-2xl">
        <div className="flex justify-between items-center mb-6 border-b pb-3">
          <h2 className="text-xl font-semibold text-gray-800">
            Chi tiết đối tác
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 transition-colors duration-200"
          >
            <FaTimes className="h-5 w-5" />
          </button>
        </div>

        <div className="space-y-4 text-gray-700">
          <div className="grid grid-cols-3 gap-2 items-start">
            <label className="col-span-1 font-medium text-sm text-gray-600">
              Mã đối tác:
            </label>
            <p className="col-span-2 text-sm font-normal">{partner.id}</p>
          </div>
          <div className="grid grid-cols-3 gap-2 items-start">
            <label className="col-span-1 font-medium text-sm text-gray-600">
              Tên đối tác:
            </label>
            <p className="col-span-2 text-sm font-normal">
              {partner.name || "Không có thông tin"}
            </p>
          </div>
          <div className="grid grid-cols-3 gap-2 items-start">
            <label className="col-span-1 font-medium text-sm text-gray-600">
              Số điện thoại:
            </label>
            <p className="col-span-2 text-sm font-normal">
              {partner.phone || "Không có thông tin"}
            </p>
          </div>
          <div className="grid grid-cols-3 gap-2 items-start">
            <label className="col-span-1 font-medium text-sm text-gray-600">
              Email:
            </label>
            <p className="col-span-2 text-sm font-normal">
              {partner.email || "Không có thông tin"}
            </p>
          </div>
          <div className="grid grid-cols-3 gap-2 items-start">
            <label className="col-span-1 font-medium text-sm text-gray-600">
              Địa chỉ:
            </label>
            <p className="col-span-2 text-sm font-normal">
              {partner.address || "Không có thông tin"}
            </p>
          </div>
          <div className="grid grid-cols-3 gap-2 items-start">
            <label className="col-span-1 font-medium text-sm text-gray-600">
              Tên đơn vị:
            </label>
            <p className="col-span-2 text-sm font-normal">
              {partner.organization || "Không có thông tin"}
            </p>
          </div>
          <div className="grid grid-cols-3 gap-2 items-start">
            <label className="col-span-1 font-medium text-sm text-gray-600">
              Mã số thuế:
            </label>
            <p className="col-span-2 text-sm font-normal">
              {partner.taxCode || "Không có thông tin"}
            </p>
          </div>
          <div className="grid grid-cols-3 gap-2 items-start">
            <label className="col-span-1 font-medium text-sm text-gray-600">
              Loại đối tác:
            </label>
            <p className="col-span-2 text-sm font-normal">
              {getPartnerTypeName(partner.partnerTypeId) ||
                "Không có thông tin"}
            </p>
          </div>
          <div className="grid grid-cols-3 gap-2 items-start">
            <label className="col-span-1 font-medium text-sm text-gray-600">
              Công nợ:
            </label>
            <p className="col-span-2 text-sm font-normal text-green-600">
              {formatCurrency(partner.debt)}
            </p>
          </div>
        </div>

        <div className="flex justify-end mt-6">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
};

export default PartnerDetailModal;
