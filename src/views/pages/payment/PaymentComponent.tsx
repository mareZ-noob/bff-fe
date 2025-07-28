import React, { useState, useEffect } from 'react';
import RedirectPayment from './RedirectPayment';
import IntegratedPayment from './IntegratedPayment';

const PaymentComponent = () => {
    const [paymentFlow, setPaymentFlow] = useState('redirect');
    const [supportedMethods, setSupportedMethods] = useState([]);
    const [supportedIntegrations, setSupportedIntegrations] = useState({});
    const [loading, setLoading] = useState(true);

    // Lấy thông tin về các phương thức thanh toán được hỗ trợ
    useEffect(() => {
        const fetchSupportedOptions = async () => {
            try {
                setLoading(true);

                // Lấy phương thức thanh toán được hỗ trợ
                const methodsResponse = await fetch('/api/payment/payments/supported-methods');
                const methods = await methodsResponse.json();
                setSupportedMethods(methods);

                // Lấy integration types được hỗ trợ
                const integrationsResponse = await fetch('/api/payment/payments/supported-integrations');
                const integrations = await integrationsResponse.json();
                setSupportedIntegrations(integrations);

                console.log('Phương thức thanh toán được hỗ trợ:', methods);
                console.log('Integration types được hỗ trợ:', integrations);

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
            <div className="payment-component loading">
                <div className="spinner">Đang tải...</div>
            </div>
        );
    }

    return (
        <div className="payment-component">
            <h2>Thanh toán gói VIP</h2>

            <div className="payment-info">
                <p>Nâng cấp tài khoản VIP để sử dụng các tính năng cao cấp</p>
                <div className="price-info">
                    <span className="price">100,000 VNĐ</span>
                    <span className="duration">/ 1 tháng</span>
                </div>
            </div>

            <div className="payment-flow-selector">
                <h3>Chọn phương thức thanh toán:</h3>

                <div className="flow-options">
                    <label className="flow-option">
                        <input
                            type="radio"
                            value="redirect"
                            checked={paymentFlow === 'redirect'}
                            onChange={(e) => setPaymentFlow(e.target.value)}
                        />
                        <div className="option-content">
                            <span className="option-title">Thanh toán chuyển hướng</span>
                            <span className="option-desc">Chuyển đến trang thanh toán của ngân hàng/gateway</span>
                        </div>
                    </label>

                    <label className="flow-option">
                        <input
                            type="radio"
                            value="integrated"
                            checked={paymentFlow === 'integrated'}
                            onChange={(e) => setPaymentFlow(e.target.value)}
                        />
                        <div className="option-content">
                            <span className="option-title">Thanh toán tích hợp</span>
                            <span className="option-desc">Nhập thông tin thẻ trực tiếp trên trang web</span>
                        </div>
                    </label>
                </div>
            </div>

            <div className="payment-form">
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
    );
};

export default PaymentComponent;
