import React from "react";

const recentPosts = [
    "Hướng dẫn sử dụng máy đóng gói thực phẩm tự động",
    "Máy sấy thực phẩm hiệu quả trong ngành xuất nhập khẩu",
    "Quy trình kiểm tra chất lượng thực phẩm nhập khẩu",
    "Giới thiệu máy hút chân không bảo quản thực phẩm",
    "Phương pháp bảo quản thực phẩm tươi trong quá trình vận chuyển",
];

const RecentPosts = () => {
    return (
        <div className="bg-white pt-15 pb-15">
            <h3 className="bg-blue-500 text-white text-2xl font-bold px-3 py-2 mb-3">
                Bài viết mới
            </h3>
            <ul className="space-y-2 text-xl text-gray-700">
                {recentPosts.map((title, index) => (
                    <li key={index} className="hover:text-navy-600 cursor-pointer">
                        <span className="mr-1 text-navy-500">›</span>
                        {title}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default RecentPosts;
