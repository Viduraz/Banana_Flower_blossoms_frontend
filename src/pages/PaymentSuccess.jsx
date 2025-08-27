import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

function PaymentSuccess() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [orderDetails, setOrderDetails] = useState(null);

  useEffect(() => {
    const orderId = searchParams.get('order_id');
    const paymentId = searchParams.get('payment_id');
    
    if (orderId) {
      setOrderDetails({ orderId, paymentId });
      toast.success('Payment completed successfully!');
    }
  }, [searchParams]);

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto bg-white shadow rounded-lg p-6 text-center">
        <div className="text-6xl mb-4">✅</div>
        <h1 className="text-2xl font-bold text-green-600 mb-4">Payment Successful!</h1>
        {orderDetails && (
          <div className="text-left bg-gray-50 p-4 rounded mb-4">
            <p><strong>Order ID:</strong> {orderDetails.orderId}</p>
            {orderDetails.paymentId && (
              <p><strong>Payment ID:</strong> {orderDetails.paymentId}</p>
            )}
          </div>
        )}
        <p className="text-gray-600 mb-6">Thank you for your order! Your payment has been processed successfully.</p>
        <button
          onClick={() => navigate('/orders')}
          className="w-full py-2 px-4 bg-green-600 text-white rounded hover:bg-green-700"
        >
          View Orders
        </button>
      </div>
    </div>
  );
}

export default PaymentSuccess;