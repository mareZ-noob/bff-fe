import React from "react";
import { useLocation } from "react-router-dom";

const PaymentFailPage: React.FC = () => {
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const status = queryParams.get("status");
    const orderId = queryParams.get("orderId");

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold text-red-600 mb-4">Payment Failed</h1>
            <p>There was an issue with your payment.</p>
            <p>Order ID: {orderId}</p>
            <p>Status: {status}</p>
        </div>
    );
};

export default PaymentFailPage;
