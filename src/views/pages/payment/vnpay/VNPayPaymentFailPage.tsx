import React from "react";
import { useLocation, Link } from "react-router-dom";
import { Path } from "@/utils/path";
import { XCircleIcon } from '@heroicons/react/24/solid';

const VNPayPaymentFailPage: React.FC = () => {
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const orderId = queryParams.get("vnp_TxnRef");
    const responseCode = queryParams.get("vnp_ResponseCode");

    return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
            <div className="max-w-md w-full bg-white shadow-xl rounded-2xl p-8 text-center">
                <XCircleIcon className="w-24 h-24 text-red-500 mx-auto mb-6" />
                <h1 className="text-3xl font-extrabold text-gray-800 mb-4">Thanh toán thất bại</h1>
                <p className="text-gray-600 mb-8">Đã có lỗi xảy ra trong quá trình xử lý thanh toán. Vui lòng thử lại.</p>

                <div className="bg-red-50 border border-red-200 rounded-lg p-6 space-y-4 text-left">
                    <div className="flex justify-between">
                        <span className="font-semibold text-gray-700">Mã đơn hàng:</span>
                        <span className="font-mono text-gray-900">{orderId || 'Không có'}</span>
                    </div>
                     <div className="flex justify-between">
                        <span className="font-semibold text-gray-700">Mã lỗi:</span>
                        <span className="font-mono text-red-600">{responseCode || 'Không rõ'}</span>
                    </div>
                </div>

                <Link
                    to={Path.payment.path}
                    className="mt-8 inline-block w-full bg-gray-800 text-white font-bold py-3 px-6 rounded-lg hover:bg-gray-900 transition-colors"
                >
                    Thử lại
                </Link>
            </div>
        </div>
    );
};

export default VNPayPaymentFailPage;
