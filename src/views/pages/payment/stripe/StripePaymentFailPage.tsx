import React from "react";
import { Link } from "react-router-dom";
import { Path } from "@/utils/path";
import { XCircleIcon } from '@heroicons/react/24/solid';

const StripePaymentFailPage: React.FC = () => {
    return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
            <div className="max-w-md w-full bg-white shadow-xl rounded-2xl p-8 text-center">
                <XCircleIcon className="w-24 h-24 text-red-500 mx-auto mb-6" />
                <h1 className="text-3xl font-extrabold text-gray-800 mb-4">Thanh toán bị hủy</h1>
                <p className="text-gray-600 mb-8">Giao dịch đã không được hoàn tất. Bạn có thể thử lại bất cứ lúc nào.</p>

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

export default StripePaymentFailPage;
