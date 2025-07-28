import React from "react";
import { useLocation, Link } from "react-router-dom";
import { Path } from "@/utils/path";
import { CheckCircleIcon } from '@heroicons/react/24/solid';

const VNPayPaymentSuccessPage: React.FC = () => {
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const orderId = queryParams.get("vnp_TxnRef");
    const amount = queryParams.get("vnp_Amount");
    const transactionNo = queryParams.get("vnp_TransactionNo");

    return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
            <div className="max-w-md w-full bg-white shadow-xl rounded-2xl p-8 text-center">
                <CheckCircleIcon className="w-24 h-24 text-green-500 mx-auto mb-6 animate-pulse" />
                <h1 className="text-3xl font-extrabold text-gray-800 mb-4">Thanh toán thành công!</h1>
                <p className="text-gray-600 mb-8">Cảm ơn bạn đã nâng cấp gói VIP. Tài khoản của bạn đã được kích hoạt.</p>

                <div className="bg-green-50 border border-green-200 rounded-lg p-6 space-y-4 text-left">
                    <div className="flex justify-between">
                        <span className="font-semibold text-gray-700">Mã đơn hàng:</span>
                        <span className="font-mono text-gray-900">{orderId}</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="font-semibold text-gray-700">Mã giao dịch:</span>
                        <span className="font-mono text-gray-900">{transactionNo}</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="font-semibold text-gray-700">Số tiền:</span>
                        <span className="font-bold text-green-600">{amount ? new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(parseInt(amount) / 100) : 'N/A'}</span>
                    </div>
                </div>

                <Link
                    to={Path.user.outlets.dashboard.path}
                    className="mt-8 inline-block w-full bg-blue-600 text-white font-bold py-3 px-6 rounded-lg hover:bg-blue-700 transition-transform transform hover:scale-105"
                >
                    Về trang chủ
                </Link>
            </div>
        </div>
    );
};

export default VNPayPaymentSuccessPage;
