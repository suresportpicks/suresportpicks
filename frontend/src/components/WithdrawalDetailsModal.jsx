import React, { useState } from 'react';
import { toast } from 'react-toastify';
import axios from 'axios';

const WithdrawalDetailsModal = ({ isOpen, onClose, withdrawal, onUpdate }) => {
  const [vatCode, setVatCode] = useState('');
  const [botCode, setBotCode] = useState('');
  const [rejectionReason, setRejectionReason] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleConfirmVat = async () => {
    if (!vatCode.trim()) {
      toast.error('Please enter a VAT code');
      return;
    }
    setIsSubmitting(true);

    try {
      const response = await axios.put(`/api/admin/withdrawal-requests/${withdrawal._id}/confirm-vat`, {
        vatCode
      });
      toast.success('VAT code confirmed successfully');
      onUpdate(response.data.withdrawalRequest);
      setVatCode('');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error confirming VAT code');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleConfirmBot = async () => {
    if (!botCode.trim()) {
      toast.error('Please enter a BOT code');
      return;
    }
    setIsSubmitting(true);

    try {
      const response = await axios.put(`/api/admin/withdrawal-requests/${withdrawal._id}/confirm-bot`, {
        botCode
      });
      toast.success('BOT code confirmed successfully');
      onUpdate(response.data.withdrawalRequest);
      setBotCode('');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error confirming BOT code');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRejectVat = async () => {
    if (!rejectionReason.trim()) {
      toast.error('Please provide a rejection reason');
      return;
    }
    setIsSubmitting(true);

    try {
      const response = await axios.put(`/api/admin/withdrawal-requests/${withdrawal._id}/reject-vat`, {
        reason: rejectionReason
      });
      toast.success('VAT code rejected successfully');
      onUpdate(response.data.withdrawalRequest);
      setRejectionReason('');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error rejecting VAT code');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRejectBot = async () => {
    if (!rejectionReason.trim()) {
      toast.error('Please provide a rejection reason');
      return;
    }
    setIsSubmitting(true);

    try {
      const response = await axios.put(`/api/admin/withdrawal-requests/${withdrawal._id}/reject-bot`, {
        reason: rejectionReason
      });
      toast.success('BOT code rejected successfully');
      onUpdate(response.data.withdrawalRequest);
      setRejectionReason('');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error rejecting BOT code');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen || !withdrawal) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
      <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" onClick={onClose}></div>

        <div className="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-2xl sm:w-full sm:p-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
            Withdrawal Request Details
          </h3>

          <div className="bg-gray-50 p-4 rounded-lg mb-4">
            <h4 className="text-sm font-medium text-gray-700 mb-2">Request Information</h4>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500">Amount</p>
                <p className="font-medium">{withdrawal.formattedAmount}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Payment Method</p>
                <p className="font-medium">{withdrawal.paymentMethod}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Status</p>
                <p className="font-medium">{withdrawal.status}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Requested At</p>
                <p className="font-medium">{new Date(withdrawal.createdAt).toLocaleString()}</p>
              </div>
            </div>
          </div>

          {['imf_required', 'vat_pending', 'bot_required', 'bot_pending'].includes(withdrawal.status) && (
            <div className="space-y-4">
              {['imf_required', 'vat_pending'].includes(withdrawal.status) && (
                <div className="bg-white p-4 rounded-lg border">
                  <h4 className="text-sm font-medium text-gray-700 mb-2">VAT Code Verification</h4>
                  <div className="space-y-2">
                    {withdrawal.vatCode?.userSubmitted && (
                      <div>
                        <p className="text-sm text-gray-500">User Submitted Code</p>
                        <p className="font-medium">{withdrawal.vatCode.userSubmitted}</p>
                        <p className="text-xs text-gray-400">Submitted at: {new Date(withdrawal.vatCode.userSubmittedAt).toLocaleString()}</p>
                      </div>
                    )}
                    <div>
                      <label htmlFor="vatCode" className="block text-sm text-gray-700">Admin VAT Code</label>
                      <div className="mt-1 flex space-x-2">
                        <input
                          type="text"
                          id="vatCode"
                          value={vatCode}
                          onChange={(e) => setVatCode(e.target.value)}
                          className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                          placeholder="Enter VAT code"
                        />
                        <button
                          onClick={handleConfirmVat}
                          disabled={isSubmitting}
                          className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
                        >
                          Confirm
                        </button>
                      </div>
                    </div>
                    <div>
                      <label htmlFor="vatRejectionReason" className="block text-sm text-gray-700">Rejection Reason</label>
                      <div className="mt-1 flex space-x-2">
                        <input
                          type="text"
                          id="vatRejectionReason"
                          value={rejectionReason}
                          onChange={(e) => setRejectionReason(e.target.value)}
                          className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                          placeholder="Enter rejection reason"
                        />
                        <button
                          onClick={handleRejectVat}
                          disabled={isSubmitting}
                          className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50"
                        >
                          Reject
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {['bot_required', 'bot_pending'].includes(withdrawal.status) && (
                <div className="bg-white p-4 rounded-lg border">
                  <h4 className="text-sm font-medium text-gray-700 mb-2">BOT Code Verification</h4>
                  <div className="space-y-2">
                    {withdrawal.botCode?.userSubmitted && (
                      <div>
                        <p className="text-sm text-gray-500">User Submitted Code</p>
                        <p className="font-medium">{withdrawal.botCode.userSubmitted}</p>
                        <p className="text-xs text-gray-400">Submitted at: {new Date(withdrawal.botCode.userSubmittedAt).toLocaleString()}</p>
                      </div>
                    )}
                    <div>
                      <label htmlFor="botCode" className="block text-sm text-gray-700">Admin BOT Code</label>
                      <div className="mt-1 flex space-x-2">
                        <input
                          type="text"
                          id="botCode"
                          value={botCode}
                          onChange={(e) => setBotCode(e.target.value)}
                          className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                          placeholder="Enter BOT code"
                        />
                        <button
                          onClick={handleConfirmBot}
                          disabled={isSubmitting}
                          className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
                        >
                          Confirm
                        </button>
                      </div>
                    </div>
                    <div>
                      <label htmlFor="botRejectionReason" className="block text-sm text-gray-700">Rejection Reason</label>
                      <div className="mt-1 flex space-x-2">
                        <input
                          type="text"
                          id="botRejectionReason"
                          value={rejectionReason}
                          onChange={(e) => setRejectionReason(e.target.value)}
                          className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                          placeholder="Enter rejection reason"
                        />
                        <button
                          onClick={handleRejectBot}
                          disabled={isSubmitting}
                          className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50"
                        >
                          Reject
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          <div className="mt-5 sm:mt-6">
            <button
              type="button"
              onClick={onClose}
              className="w-full rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:text-sm"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WithdrawalDetailsModal;