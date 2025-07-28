import React, { useState, useEffect } from 'react';
import RedirectPayment from './RedirectPayment';
import IntegratedPayment from './IntegratedPayment';

const PaymentPage: React.FC = () => {
    const [paymentFlow, setPaymentFlow] = useState('redirect');
    const [supportedMethods, setSupportedMethods] = useState([]);
    const [supportedIntegrations, setSupportedIntegrations] = useState({});
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchSupportedOptions = async () => {
            try {
                setLoading(true);
                const methodsResponse = await fetch('/api/payment/payments/supported-methods');
                const methods = await methodsResponse.json();
                setSupportedMethods(methods);

                const integrationsResponse = await fetch('/api/payment/payments/supported-integrations');
                const integrations = await integrationsResponse.json();
                setSupportedIntegrations(integrations);
            } catch (error) {
                console.error('Lỗi khi lấy thông tin hỗ trợ:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchSupportedOptions();
    }, []);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gray-100">
                <div className="w-16 h-16 border-4 border-blue-500 border-dashed rounded-full animate-spin"></div>
                <p className="ml-4 text-lg font-semibold text-gray-700">Đang tải...</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
            <div className="max-w-2xl w-full bg-white shadow-lg rounded-xl overflow-hidden">
                <div className="p-8">
                    <h2 className="text-3xl font-bold text-gray-800 text-center mb-4">Nâng cấp tài khoản VIP</h2>
                    <p className="text-center text-gray-600 mb-8">Mở khóa toàn bộ tính năng cao cấp và tận hưởng trải nghiệm không giới hạn.</p>

                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8 text-center">
                        <p className="text-lg font-semibold text-gray-700">Gói VIP 1 tháng</p>
                        <div className="my-4">
                            <span className="text-5xl font-extrabold text-blue-600">100,000</span>
                            <span className="text-xl font-medium text-gray-500"> VNĐ</span>
                        </div>
                    </div>

                    <div className="mb-8">
                        <h3 className="text-xl font-semibold text-gray-800 mb-4 text-center">Chọn phương thức thanh toán</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <label className={`p-6 border rounded-lg cursor-pointer transition-all duration-300 ${paymentFlow === 'redirect' ? 'bg-blue-500 text-white shadow-xl scale-105' : 'bg-white hover:shadow-md'}`}>
                                <input
                                    type="radio"
                                    value="redirect"
                                    checked={paymentFlow === 'redirect'}
                                    onChange={(e) => setPaymentFlow(e.target.value)}
                                    className="hidden"
                                />
                                <div className="flex flex-col items-center text-center">
                                    <span className="text-lg font-bold">Thanh toán chuyển hướng</span>
                                    <span className={`mt-2 text-sm ${paymentFlow === 'redirect' ? 'text-blue-100' : 'text-gray-500'}`}>An toàn & Nhanh chóng. Chuyển đến cổng thanh toán để hoàn tất.</span>
                                </div>
                            </label>
                            <label className={`p-6 border rounded-lg cursor-pointer transition-all duration-300 ${paymentFlow === 'integrated' ? 'bg-blue-500 text-white shadow-xl scale-105' : 'bg-white hover:shadow-md'}`}>
                                <input
                                    type="radio"
                                    value="integrated"
                                    checked={paymentFlow === 'integrated'}
                                    onChange={(e) => setPaymentFlow(e.target.value)}
                                    className="hidden"
                                />
                                <div className="flex flex-col items-center text-center">
                                    <span className="text-lg font-bold">Thanh toán tích hợp</span>
                                    <span className={`mt-2 text-sm ${paymentFlow === 'integrated' ? 'text-blue-100' : 'text-gray-500'}`}>Tiện lợi & Bảo mật. Nhập thông tin thẻ ngay tại đây.</span>
                                </div>
                            </label>
                        </div>
                    </div>

                    <div>
                        {paymentFlow === 'redirect' ? (
                            <RedirectPayment
                                supportedMethods={supportedMethods}
                                supportedIntegrations={supportedIntegrations}
                            />
                        ) : (
                            <IntegratedPayment
                                supportedMethods={supportedMethods}
                                supportedIntegrations={supportedIntegrations}
                            />
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PaymentPage;
