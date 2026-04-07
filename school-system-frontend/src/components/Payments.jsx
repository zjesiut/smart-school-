import React, { useState, useEffect } from 'react';
import api from '../services/api';

const Payments = () => {
  const [payments, setPayments] = useState([]);

  useEffect(() => {
    fetchPayments();
  }, []);

  const fetchPayments = async () => {
    try {
      const res = await api.get('/payments');
      setPayments(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <h1>Payments</h1>
      <ul>
        {payments.map(payment => (
          <li key={payment._id} style={{ marginBottom: '10px', padding: '10px', border: '1px solid #ccc' }}>
            Student: {payment.student?.user?.name} - Amount: ${payment.amount} - Status: {payment.status}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Payments;