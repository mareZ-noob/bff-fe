import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';

const PaymentResult = () => {
    const [searchParams] = useSearchParams();
    const [paymentInfo, setPaymentInfo] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Lấy thông tin từ URL parameters
        const transactionId = searchParams.get('transactionId');
        const status = searchParams.get('status');
        const txnRef = searchParams.get('txnRef');
        const payDate = searchParams.get('payDate');
        const error = searchParams.get('error');
        const reason = searchParams.get('reason');

        // Lấy thông tin thanh toán từ localStorage
        const paymentInProgress = localStorage.getItem('paymentInProgress');
        let paymentData = null;

        if (paymentInProgress) {
            try {
                paymentData = JSON.parse(paymentInProgress);
            } catch (e) {
                console.error('Lỗi parse payment data:', e);
            }
        }

        // Xác định trạng thái thanh toán
        let paymentStatus = 'unknown';
        let message = '';

        if (error) {
            paymentStatus = 'error';
            message = 'Có lỗi xảy ra trong quá trình xử lý thanh toán';
        } else if (reason === 'cancelled') {
            paymentStatus = 'cancelled';
            message = 'Thanh toán đã bị hủy bởi người dùng';
        } else if (status === '00' || status === 'paid') {
            paymentStatus = 'success';
            message = 'Thanh toán thành công! VIP đã được kích hoạt.';
        } else {
            paymentStatus = 'failed';
            message = 'Thanh toán thất bại. Vui lòng thử lại.';
        }

        setPaymentInfo({
            status: paymentStatus,
            message: message,
            transactionId: transactionId,
            referenceId: txnRef,
            paymentDate: payDate,
            amount: paymentData?.amount,
            method: paymentData?.method
        });

        // Xóa thông tin thanh toán đang xử lý
        if (paymentStatus === 'success' || paymentStatus === 'failed') {
            localStorage.removeItem('paymentInProgress');
        }

        setLoading(false);
    }, [searchParams]);

    const handleReturnToDashboard = () => {
        window.location.href = '/dashboard';
    };

    const handleTryAgain = () => {
        window.location.href = '/payment';
    };

    if (loading) {
        return (
            <div className="payment-result loading">
                <div className="spinner"></div>
                <p>Đang xử lý kết quả thanh toán...</p>
            </div>
        );
    }

    return (
        <div className="payment-result">
            <div className={`result-container ${paymentInfo.status}`}>
                <div className="result-icon">
                    {paymentInfo.status === 'success' && '✅'}
                    {paymentInfo.status === 'failed' && '❌'}
                    {paymentInfo.status === 'cancelled' && '⚠️'}
                    {paymentInfo.status === 'error' && '🚫'}
                </div>

                <h2 className="result-title">
                    {paymentInfo.status === 'success' && 'Thanh toán thành công!'}
                    {paymentInfo.status === 'failed' && 'Thanh toán thất bại'}
                    {paymentInfo.status === 'cancelled' && 'Thanh toán đã hủy'}
                    {paymentInfo.status === 'error' && 'Có lỗi xảy ra'}
                </h2>

                <p className="result-message">{paymentInfo.message}</p>

                {paymentInfo.transactionId && (
                    <div className="transaction-details">
                        <h3>Chi tiết giao dịch</h3>
                        <div className="detail-row">
                            <span>Mã giao dịch:</span>
                            <span className="transaction-id">{paymentInfo.transactionId}</span>
                        </div>
                        {paymentInfo.referenceId && (
                            <div className="detail-row">
                                <span>Mã tham chiếu:</span>
                                <span>{paymentInfo.referenceId}</span>
                            </div>
                        )}
                        {paymentInfo.method && (
                            <div className="detail-row">
                                <span>Phương thức:</span>
                                <span>{paymentInfo.method}</span>
                            </div>
                        )}
                        {paymentInfo.amount && (
                            <div className="detail-row">
                                <span>Số tiền:</span>
                                <span className="amount">
                                    {new Intl.NumberFormat('vi-VN', {
                                        style: 'currency',
                                        currency: 'VND'
                                    }).format(parseInt(paymentInfo.amount))}
                                </span>
                            </div>
                        )}
                        {paymentInfo.paymentDate && (
                            <div className="detail-row">
                                <span>Thời gian:</span>
                                <span>{paymentInfo.paymentDate}</span>
                            </div>
                        )}
                    </div>
                )}

                <div className="result-actions">
                    {paymentInfo.status === 'success' && (
                        <button
                            onClick={handleReturnToDashboard}
                            className="primary-button"
                        >
                            Về trang chủ
                        </button>
                    )}

                    {(paymentInfo.status === 'failed' || paymentInfo.status === 'cancelled' || paymentInfo.status === 'error') && (
                        <>
                            <button
                                onClick={handleTryAgain}
                                className="primary-button"
                            >
                                Thử lại
                            </button>
                            <button
                                onClick={handleReturnToDashboard}
                                className="secondary-button"
                            >
                                Về trang chủ
                            </button>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default PaymentResult;
