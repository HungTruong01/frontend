import { useEffect } from "react";

const Pagination = ({ currentPage, setCurrentPage, totalPages }) => {
    // Cuộn lên đầu khi đổi trang
    useEffect(() => {
        window.scrollTo({ top: 0, behavior: "smooth" });
    }, [currentPage]);

    return (
        <div className="flex justify-end mt-6">
            {/* Nút Previous */}
            <button
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className={`px-3 py-2 border rounded text-gray-700 mx-1
                    ${currentPage === 1 ? "opacity-50 cursor-not-allowed" : "hover:bg-gray-200"}`}
            >
                {"<"}
            </button>

            {/* Hiển thị danh sách số trang */}
            {Array.from({ length: totalPages }, (_, index) => (
                <button
                    key={index + 1}
                    onClick={() => setCurrentPage(index + 1)}
                    className={`px-3 py-2 border rounded mx-1 
                        ${currentPage === index + 1
                            ? "bg-blue-600 text-white font-bold"  // Trang hiện tại
                            : "hover:bg-gray-200 text-gray-700"}`}
                >
                    {index + 1}
                </button>
            ))}

            {/* Nút Next */}
            <button
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className={`px-3 py-2 border rounded text-gray-700 mx-1
                    ${currentPage === totalPages ? "opacity-50 cursor-not-allowed" : "hover:bg-gray-200"}`}
            >
                {">"}
            </button>
        </div>
    );
};

export default Pagination;
