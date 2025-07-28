import React from "react";
import { useLocation, Link } from "react-router-dom";
import { Path } from "@/utils/path";
import { CheckCircleIcon } from '@heroicons/react/24/solid';

const StripePaymentSuccessPage: React.FC = () => {
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const sessionId = queryParams.get("session_id");

    return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
            <div className="max-w-md w-full bg-white shadow-xl rounded-2xl p-8 text-center">
                <CheckCircleIcon className="w-24 h-24 text-green-500 mx-auto mb-6 animate-pulse" />
                <h1 className="text-3xl font-extrabold text-gray-800 mb-4">Thanh toán thành công!</h1>
                <p className="text-gray-600 mb-8">Cảm ơn bạn đã thanh toán qua Stripe. Tài khoản VIP của bạn đã được kích hoạt.</p>

                <div className="bg-green-50 border border-green-200 rounded-lg p-6 space-y-4 text-left">
                    <div className="flex justify-between items-center">
                        <span className="font-semibold text-gray-700">Session ID:</span>
                        <span className="font-mono text-sm text-gray-900 break-all">{sessionId}</span>
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

export default StripePaymentSuccessPage;
