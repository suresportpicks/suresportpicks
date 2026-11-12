import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import axios from 'axios';

const WithdrawalModal = ({ isOpen, onClose, onWithdrawalSubmitted }) => {
  const [amount, setAmount] = useState('');
  const [withdrawMethod, setWithdrawMethod] = useState('');
  const [paymentDetails, setPaymentDetails] = useState({
    accountName: '',
    accountNumber: '',
    routingNumber: '',
    bankName: '',
    email: '',
    phoneNumber: '',
    walletAddress: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await axios.post('/api/payments/withdraw', {
        amount: parseFloat(amount),
        withdrawMethod,
        paymentDetails
      });

      toast.success('Withdrawal request submitted successfully');
      onWithdrawalSubmitted(response.data.withdrawalRequest);
      onClose();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error submitting withdrawal request');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
      <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" onClick={onClose}></div>

        <div className="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full sm:p-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">Request Withdrawal</h3>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="amount" className="block text-sm font-medium text-gray-700">Amount ($)</label>
              <input
                type="number"
                id="amount"
                min="20"
                step="0.01"
                required
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              />
            </div>

            <div>
              <label htmlFor="withdrawMethod" className="block text-sm font-medium text-gray-700">Payment Method</label>
              <select
                id="withdrawMethod"
                required
                value={withdrawMethod}
                onChange={(e) => setWithdrawMethod(e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              >
                <option value="">Select payment method</option>
                <option value="bank">Bank Transfer</option>
                <option value="paypal">PayPal</option>
                <option value="crypto">Cryptocurrency</option>
                <option value="venmo">Venmo</option>
                <option value="cashapp">Cash App</option>
                <option value="zelle">Zelle</option>
                <option value="skrill">Skrill</option>
              </select>
            </div>

            {withdrawMethod === 'bank' && (
              <div className="space-y-4">
                <div>
                  <label htmlFor="accountName" className="block text-sm font-medium text-gray-700">Account Name</label>
                  <input
                    type="text"
                    id="accountName"
                    required
                    value={paymentDetails.accountName}
                    onChange={(e) => setPaymentDetails({...paymentDetails, accountName: e.target.value})}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  />
                </div>
                <div>
                  <label htmlFor="accountNumber" className="block text-sm font-medium text-gray-700">Account Number</label>
                  <input
                    type="text"
                    id="accountNumber"
                    required
                    value={paymentDetails.accountNumber}
                    onChange={(e) => setPaymentDetails({...paymentDetails, accountNumber: e.target.value})}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  />
                </div>
                <div>
                  <label htmlFor="routingNumber" className="block text-sm font-medium text-gray-700">Routing Number</label>
                  <input
                    type="text"
                    id="routingNumber"
                    required
                    value={paymentDetails.routingNumber}
                    onChange={(e) => setPaymentDetails({...paymentDetails, routingNumber: e.target.value})}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  />
                </div>
                <div>
                  <label htmlFor="bankName" className="block text-sm font-medium text-gray-700">Bank Name</label>
                  <input
                    type="text"
                    id="bankName"
                    value={paymentDetails.bankName}
                    onChange={(e) => setPaymentDetails({...paymentDetails, bankName: e.target.value})}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  />
                </div>
              </div>
            )}

            {(withdrawMethod === 'paypal' || withdrawMethod === 'skrill') && (
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email Address</label>
                <input
                  type="email"
                  id="email"
                  required
                  value={paymentDetails.email}
                  onChange={(e) => setPaymentDetails({...paymentDetails, email: e.target.value})}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                />
              </div>
            )}

            {(withdrawMethod === 'venmo' || withdrawMethod === 'cashapp' || withdrawMethod === 'zelle') && (
              <div>
                <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700">Phone Number</label>
                <input
                  type="tel"
                  id="phoneNumber"
                  required
                  value={paymentDetails.phoneNumber}
                  onChange={(e) => setPaymentDetails({...paymentDetails, phoneNumber: e.target.value})}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                />
              </div>
            )}

            {withdrawMethod === 'crypto' && (
              <div>
                <label htmlFor="walletAddress" className="block text-sm font-medium text-gray-700">Wallet Address</label>
                <input
                  type="text"
                  id="walletAddress"
                  required
                  value={paymentDetails.walletAddress}
                  onChange={(e) => setPaymentDetails({...paymentDetails, walletAddress: e.target.value})}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                />
              </div>
            )}

            <div className="mt-5 sm:mt-6">
              <button
                type="submit"
                disabled={isSubmitting}
                className="inline-flex justify-center w-full rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:text-sm disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? 'Submitting...' : 'Submit Withdrawal Request'}
              </button>
              <button
                type="button"
                onClick={onClose}
                className="mt-3 inline-flex justify-center w-full rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:text-sm"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default WithdrawalModal;