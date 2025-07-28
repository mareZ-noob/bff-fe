import React from "react";
import { useLocation } from "react-router-dom";

const PaymentSuccessPage: React.FC = () => {
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const status = queryParams.get("status");
    const orderId = queryParams.get("txnRef");

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold text-green-600 mb-4">Payment Successful!</h1>
            <p>Your payment has been processed successfully.</p>
            <p>Order ID: {orderId}</p>
            <p>Status: {status}</p>
        </div>
    );
};

export default PaymentSuccessPage;
