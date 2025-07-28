import React, { useState } from 'react';
import { CreditCardIcon, ExclamationTriangleIcon, ArrowPathIcon } from '@heroicons/react/24/solid';

// --- Types ---
interface RedirectPaymentProps {
    supportedMethods: string[];
    supportedIntegrations: { [key: string]: string[] };
}

interface Bank {
    value: string;
    label: string;
}

// --- Main Redirect Payment Component ---
const RedirectPayment: React.FC<RedirectPaymentProps> = ({ supportedMethods, supportedIntegrations }) => {
    const [paymentMethod, setPaymentMethod] = useState('VNPAY');
    const [amount, setAmount] = useState('100000');
    const [bankCode, setBankCode] = useState('NCB');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const redirectMethods = supportedMethods.filter(method => supportedIntegrations[method]?.includes('REDIRECT'));
    const bankCodes: Bank[] = [
        { value: 'NCB', label: 'Ngân hàng NCB' },
        { value: 'BIDV', label: 'Ngân hàng BIDV' },
        { value: 'VCB', label: 'Ngân hàng VCB' },
        { value: 'TECHCOMBANK', label: 'Ngân hàng Techcombank' },
        { value: 'VIETINBANK', label: 'Ngân hàng VietinBank' },
        { value: 'MB', label: 'Ngân hàng MB' },
        { value: 'ACB', label: 'Ngân hàng ACB' },
        { value: 'SHB', label: 'Ngân hàng SHB' }
    ];

    const validateForm = (): boolean => {
        if (!amount || parseInt(amount) < 10000) {
            setError('Số tiền tối thiểu là 10,000 VNĐ');
            return false;
        }
        if (paymentMethod === 'VNPAY' && !bankCode) {
            setError('Vui lòng chọn ngân hàng');
            return false;
        }
        setError('');
        return true;
    };

    const handleRedirectPayment = async () => {
        if (!validateForm()) return;

        setLoading(true);

        try {
            const response = await fetch('/api/payment/payments/create', {
                method: 'POST',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                body: new URLSearchParams({
                    method: paymentMethod,
                    integrationType: 'REDIRECT',
                    amount,
                    ...(bankCode && { bankCode })
                })
            });

            if (!response.ok) throw new Error((await response.json()).message || 'Tạo thanh toán thất bại');

            const result = await response.json();
            if (result.status === 'redirect' && result.paymentUrl) {
                localStorage.setItem('paymentInProgress', JSON.stringify({
                    referenceId: result.referenceId, amount, method: paymentMethod, timestamp: new Date().getTime()
                }));
                window.location.href = result.paymentUrl;
            } else {
                throw new Error('Phản hồi không mong đợi');
            }
        } catch (err: any) {
            setError(err.message || 'Có lỗi xảy ra khi tạo thanh toán');
            setLoading(false);
        }
    };

    const formatCurrency = (value: number | string) => {
        const numValue = typeof value === 'string' ? parseInt(value) : value;
        if (isNaN(numValue)) return '';
        return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(numValue);
    };

    return (
        <div className="p-6 border rounded-lg bg-white shadow-sm space-y-6">
            <div>
                <h3 className="text-xl font-bold text-gray-800">Thanh toán chuyển hướng</h3>
                <p className="text-gray-600 mt-1">An toàn và quen thuộc với cổng thanh toán của ngân hàng.</p>
            </div>

            {error && (
                 <div className="flex items-center gap-x-3 p-3 bg-red-50 text-red-700 border border-red-200 rounded-lg">
                    <ExclamationTriangleIcon className="h-5 w-5"/>
                    <span>{error}</span>
                </div>
            )}

            <div className="space-y-4">
                <div>
                    <label htmlFor="paymentMethod" className="block text-sm font-medium text-gray-700">Phương thức</label>
                    <select id="paymentMethod" value={paymentMethod} onChange={(e) => setPaymentMethod(e.target.value)} disabled={loading} className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md">
                        {redirectMethods.map(method => (
                            <option key={method} value={method}>
                                {method === 'VNPAY' ? 'VNPay' : method === 'STRIPE' ? 'Stripe' : method}
                            </option>
                        ))}
                    </select>
                </div>

                <div>
                    <label htmlFor="amount" className="block text-sm font-medium text-gray-700">Số tiền (VNĐ)</label>
                    <input id="amount" type="number" value={amount} onChange={(e) => setAmount(e.target.value)} min="10000" step="1000" disabled={loading} className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"/>
                    {amount && <span className="text-sm text-gray-500 mt-1 block">{formatCurrency(amount)}</span>}
                </div>

                {paymentMethod === 'VNPAY' && (
                    <div>
                        <label htmlFor="bankCode" className="block text-sm font-medium text-gray-700">Ngân hàng</label>
                        <select id="bankCode" value={bankCode} onChange={(e) => setBankCode(e.target.value)} disabled={loading} className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md">
                            <option value="">-- Chọn ngân hàng --</option>
                            {bankCodes.map(bank => <option key={bank.value} value={bank.value}>{bank.label}</option>)}
                        </select>
                    </div>
                )}
            </div>

            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200 space-y-2 text-sm">
                 <div className="flex justify-between font-semibold">
                    <span className="text-gray-600">Tổng cộng:</span>
                    <span className="text-blue-600 text-base">{formatCurrency(amount || 0)}</span>
                </div>
            </div>

            <button
                onClick={handleRedirectPayment}
                disabled={loading || !amount}
                className="w-full flex justify-center items-center gap-x-3 py-3 px-4 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
            >
                {loading ? (
                    <>
                        <ArrowPathIcon className="h-5 w-5 animate-spin" />
                        <span>Đang xử lý...</span>
                    </>
                ) : (
                     <>
                        <CreditCardIcon className="h-5 w-5" />
                        <span>Tiếp tục thanh toán</span>
                    </>
                )}
            </button>
        </div>
    );
};

export default RedirectPayment;
