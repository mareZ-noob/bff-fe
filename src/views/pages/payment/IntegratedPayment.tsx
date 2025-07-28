import React, { useState, useEffect } from 'react';
import { loadStripe, type Stripe, type StripeError, type PaymentIntent } from '@stripe/stripe-js';
import {
    Elements,
    CardElement,
    useStripe,
    useElements
} from '@stripe/react-stripe-js';
import { CreditCardIcon, LockClosedIcon, ExclamationTriangleIcon, InformationCircleIcon, CheckCircleIcon, ArrowPathIcon } from '@heroicons/react/24/solid';

// --- Types ---
interface StripePaymentFormProps {
    clientSecret: string;
    referenceId: string;
    amount: string;
    onSuccess: (paymentIntent: PaymentIntent) => void;
    onError: (errorMessage: string) => void;
    onRequiresAction: (paymentIntent: PaymentIntent) => void;
}

interface IntegratedPaymentProps {
    supportedMethods: string[];
    supportedIntegrations: { [key: string]: string[] };
}

interface PaymentInProgress {
    referenceId: string;
    amount: string;
    method: string;
    type: 'INTEGRATED' | 'REDIRECT';
    timestamp: number;
}


// --- Stripe Payment Form Component ---
const StripePaymentForm: React.FC<StripePaymentFormProps> = ({
    clientSecret,
    referenceId,
    amount,
    onSuccess,
    onError,
    onRequiresAction
}) => {
    const stripe = useStripe();
    const elements = useElements();
    const [loading, setLoading] = useState(false);
    const [cardComplete, setCardComplete] = useState(false);
    const [cardError, setCardError] = useState<string | null>(null);

    const handleCardChange = (event: { complete: boolean; error?: StripeError }) => {
        setCardComplete(event.complete);
        setCardError(event.error ? event.error.message : null);
    };

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        if (!stripe || !elements || !cardComplete) {
            return;
        }

        setLoading(true);
        setCardError(null);

        const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
            payment_method: {
                card: elements.getElement(CardElement)!,
                billing_details: {
                    name: 'Khách hàng VIP',
                    email: 'customer@example.com',
                },
            }
        });

        setLoading(false);

        if (error) {
            if (error.type === 'validation_error' || error.type === 'card_error') {
                 onError(error.message || 'Lỗi thẻ không hợp lệ.');
            } else {
                 onError(error.message || 'Đã xảy ra lỗi không mong muốn.');
            }
        } else if (paymentIntent) {
            if (paymentIntent.status === 'succeeded') {
                onSuccess(paymentIntent);
            } else if (paymentIntent.status === 'requires_action') {
                onRequiresAction(paymentIntent);
            } else {
                onError(`Trạng thái thanh toán không mong đợi: ${paymentIntent.status}`);
            }
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                <h4 className="text-lg font-semibold text-gray-800 mb-3">Tóm tắt đơn hàng</h4>
                <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                        <span className="text-gray-600">Mã giao dịch:</span>
                        <span className="font-mono text-gray-800">{referenceId}</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-gray-600">Gói dịch vụ:</span>
                        <span className="font-semibold text-gray-800">VIP - 1 tháng</span>
                    </div>
                    <hr className="my-2"/>
                    <div className="flex justify-between text-base">
                        <span className="font-semibold text-gray-800">Tổng cộng:</span>
                        <span className="font-bold text-blue-600">
                            {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(parseInt(amount))}
                        </span>
                    </div>
                </div>
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Thông tin thẻ:</label>
                <div className="p-3 border-2 border-gray-300 rounded-lg focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500 bg-white">
                    <CardElement
                        options={{
                            style: {
                                base: { fontSize: '16px', color: '#424770', '::placeholder': { color: '#aab7c4' } },
                                invalid: { color: '#fa755a' }
                            },
                            hidePostalCode: true,
                        }}
                        onChange={handleCardChange}
                    />
                </div>
                {cardError && (
                    <div className="flex items-center text-red-600 mt-2 text-sm">
                        <ExclamationTriangleIcon className="h-4 w-4 mr-1"/>
                        {cardError}
                    </div>
                )}
            </div>

            <button
                type="submit"
                disabled={!stripe || !cardComplete || loading}
                className="w-full flex justify-center items-center gap-x-3 py-3 px-4 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
            >
                {loading ? (
                    <>
                        <ArrowPathIcon className="h-5 w-5 animate-spin" />
                        <span>Đang xử lý...</span>
                    </>
                ) : (
                    <>
                        <LockClosedIcon className="h-5 w-5" />
                        <span>Xác nhận thanh toán</span>
                    </>
                )}
            </button>

            <div className="text-center text-xs text-gray-500">
                <p>Thông tin của bạn được xử lý bảo mật bởi Stripe. Chúng tôi không lưu trữ thông tin thẻ.</p>
                <div className="flex justify-center items-center gap-x-4 mt-2">
                    <span className="font-bold">🔒 SSL</span>
                    <span className="font-bold">🛡️ PCI DSS</span>
                </div>
            </div>
        </form>
    );
};


// --- Main Integrated Payment Component ---
const IntegratedPayment: React.FC<IntegratedPaymentProps> = ({ supportedMethods, supportedIntegrations }) => {
    const [stripePromise, setStripePromise] = useState<Promise<Stripe | null> | null>(null);
    const [clientSecret, setClientSecret] = useState<string | null>(null);
    const [referenceId, setReferenceId] = useState('');
    const [amount, setAmount] = useState('100000');
    const [status, setStatus] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const integratedMethods = supportedMethods.filter(method => supportedIntegrations[method]?.includes('INTEGRATED'));

    useEffect(() => {
        const paymentInProgress = localStorage.getItem('paymentInProgress');
        if (paymentInProgress) {
            try {
                const paymentData: PaymentInProgress = JSON.parse(paymentInProgress);
                if ((new Date().getTime() - paymentData.timestamp < 30 * 60 * 1000) && paymentData.type === 'INTEGRATED') {
                     setStatus('Bạn có một thanh toán đang chờ xử lý.');
                } else {
                    localStorage.removeItem('paymentInProgress');
                }
            } catch {
                localStorage.removeItem('paymentInProgress');
            }
        }
    }, []);

    const createPaymentIntent = async () => {
        if (!amount || parseInt(amount) < 10000) {
            setError('Số tiền tối thiểu là 10,000 VNĐ');
            return;
        }

        setLoading(true);
        setError('');
        setStatus('');

        try {
            const response = await fetch('/api/payment/payments/create', {
                method: 'POST',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                body: new URLSearchParams({ method: 'STRIPE', integrationType: 'INTEGRATED', amount })
            });

            if (!response.ok) throw new Error((await response.json()).message || 'Tạo PaymentIntent thất bại');

            const result = await response.json();
            if (result.status === 'pending') {
                setClientSecret(result.clientSecret);
                setReferenceId(result.referenceId);
                setStripePromise(loadStripe(result.publicKey));
                localStorage.setItem('paymentInProgress', JSON.stringify({
                    referenceId: result.referenceId, amount, method: 'STRIPE', type: 'INTEGRATED', timestamp: new Date().getTime()
                } as PaymentInProgress));
                setStatus('Sẵn sàng để thanh toán');
            } else {
                throw new Error('Phản hồi không mong đợi');
            }
        } catch (err: any) {
            setError(err.message || 'Lỗi khi tạo thanh toán');
        } finally {
            setLoading(false);
        }
    };

    const handlePaymentSuccess = async (paymentIntent: PaymentIntent) => {
        setStatus('Thanh toán thành công! VIP đã được kích hoạt. 🎉');
        localStorage.removeItem('paymentInProgress');

        try {
            await fetch('/api/payment/payments/stripe/payment-confirm', {
                method: 'POST',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                body: new URLSearchParams({ paymentIntentId: paymentIntent.id })
            });
            setTimeout(() => { window.location.href = '/dashboard'; }, 3000);
        } catch (err) {
            console.error('Lỗi confirm payment:', err);
        }
    };

    const handlePaymentError = (errorMessage: string) => {
        setStatus('');
        setError(`Thanh toán thất bại: ${errorMessage}`);
    };

    const handleRequiresAction = () => {
        setStatus('Vui lòng hoàn thành xác thực bổ sung...');
    };

    const resetPayment = () => {
        setClientSecret(null);
        setReferenceId('');
        setStripePromise(null);
        setStatus('');
        setError('');
        localStorage.removeItem('paymentInProgress');
    };

    if (integratedMethods.length === 0) {
        return (
            <div className="text-center p-6 bg-gray-50 rounded-lg">
                 <InformationCircleIcon className="h-12 w-12 mx-auto text-gray-400 mb-4"/>
                <h3 className="text-lg font-semibold text-gray-700">Không có phương thức tích hợp</h3>
                <p className="text-gray-500 mt-2">Vui lòng chọn phương thức thanh toán chuyển hướng.</p>
            </div>
        );
    }

    return (
        <div className="p-6 border rounded-lg bg-white shadow-sm">
            <h3 className="text-xl font-bold text-gray-800 mb-2">Thanh toán tích hợp</h3>
            <p className="text-gray-600 mb-6">Nhập thông tin thẻ để thanh toán an toàn và nhanh chóng.</p>

            {error && (
                <div className="flex items-center gap-x-3 p-3 mb-4 bg-red-50 text-red-700 border border-red-200 rounded-lg">
                    <ExclamationTriangleIcon className="h-5 w-5"/>
                    <span className="flex-1">{error}</span>
                    <button onClick={() => setError('')} className="font-bold text-xl">&times;</button>
                </div>
            )}
            {status && (
                <div className={`flex items-center gap-x-3 p-3 mb-4 rounded-lg ${status.includes('thành công') ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-blue-50 text-blue-700 border border-blue-200'}`}>
                    {status.includes('thành công') ? <CheckCircleIcon className="h-5 w-5"/> : <InformationCircleIcon className="h-5 w-5"/>}
                    <span>{status}</span>
                </div>
            )}

            {!clientSecret ? (
                <div className="space-y-6">
                    <div>
                        <label htmlFor="integratedAmount" className="block text-sm font-medium text-gray-700">Số tiền (VNĐ)</label>
                        <input
                            id="integratedAmount"
                            type="number"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            min="10000"
                            step="1000"
                            disabled={loading}
                            className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        />
                         {amount && parseInt(amount) > 0 && <span className="text-sm text-gray-500 mt-1 block">{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(parseInt(amount))}</span>}
                    </div>
                     <div className="flex items-center gap-x-2">
                        <p className="text-sm font-medium text-gray-700">Hỗ trợ:</p>
                        {integratedMethods.map(method => (
                            <span key={method} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                                {method === 'STRIPE' ? '💳 Stripe' : method}
                            </span>
                        ))}
                    </div>
                    <button onClick={createPaymentIntent} disabled={loading || !amount} className="w-full flex justify-center items-center gap-x-2 py-2.5 px-4 bg-gray-800 text-white font-semibold rounded-lg hover:bg-gray-900 disabled:bg-gray-400 transition-colors">
                        {loading ? <><ArrowPathIcon className="h-5 w-5 animate-spin"/> Đang tạo...</> : <>Tạo thanh toán</>}
                    </button>
                </div>
            ) : (
                <div className="space-y-4">
                    {stripePromise && (
                        <Elements stripe={stripePromise}>
                            <StripePaymentForm clientSecret={clientSecret} referenceId={referenceId} amount={amount} onSuccess={handlePaymentSuccess} onError={handlePaymentError} onRequiresAction={handleRequiresAction}/>
                        </Elements>
                    )}
                    <button onClick={resetPayment} type="button" className="w-full text-sm text-center text-blue-600 hover:underline">
                        Tạo thanh toán mới
                    </button>
                </div>
            )}
        </div>
    );
};

export default IntegratedPayment;
