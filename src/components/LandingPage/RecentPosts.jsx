import React from "react";

const recentPosts = [
    "Máy hàn miệng túi Hualian FRM-980II",
    "Máy ép cos thủy lực dùng pin mini Changyou CM-300",
    "Hbs-380d Máy đánh dấu DOT Peen di động",
    "Máy giũa Marathon M3 3500 RPM",
    "Thước đo điện tử Dasqua 0-300mmx0.01",
    "Đầm rung khí nén FP-100-M",
    "Búa rung khí nén GT8",
    "Máy khoan taro SWJ-12",
    "Kìm hàn đa năng N1WP50",
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
