import React, { useState, useEffect } from 'react';
import { QrCode, Upload, Trash2, Check, AlertCircle, Save, Eye, ShieldCheck } from 'lucide-react';
import api from '../../services/api';

const PaymentQrManagement = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const [upiId, setUpiId] = useState('');
  const [upiName, setUpiName] = useState('');
  const [paymentInstructions, setPaymentInstructions] = useState('');
  const [qrFile, setQrFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await api.get('/executive/profile');
        if (res.data.success && res.data.profile) {
          const p = res.data.profile;
          setProfile(p);
          setUpiId(p.upiId || '');
          setUpiName(p.upiName || '');
          setPaymentInstructions(p.paymentInstructions || '');
          if (p.qrCode?.url) {
            setPreviewUrl(p.qrCode.url);
          }
        }
      } catch (err) {
        setErrorMsg('Failed to load payment details.');
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setQrFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleUploadOrSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setSuccessMsg('');
    setErrorMsg('');

    try {
      if (qrFile) {
        // Upload new QR file along with updated payment info
        const data = new FormData();
        data.append('qrCode', qrFile);
        data.append('upiId', upiId);
        data.append('upiName', upiName);
        data.append('paymentInstructions', paymentInstructions);

        const res = await api.post('/executive/payment-qr', data, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });

        if (res.data.success) {
          setSuccessMsg('Personal UPI QR code and payment details saved successfully.');
          setQrFile(null);
          setPreviewUrl(res.data.qrCode.url);
        }
      } else {
        // Update payment details without re-uploading image
        const res = await api.put('/executive/payment-info', {
          upiId,
          upiName,
          paymentInstructions,
        });

        if (res.data.success) {
          setSuccessMsg('Payment details updated successfully.');
        }
      }
    } catch (err) {
      setErrorMsg(err.response?.data?.message || 'Failed to save payment information.');
    } finally {
      setSaving(false);
    }
  };

  const handleRemoveQr = async () => {
    if (!window.confirm('Are you sure you want to remove your payment QR code?')) return;
    try {
      const res = await api.delete('/executive/payment-qr');
      if (res.data.success) {
        setPreviewUrl('');
        setQrFile(null);
        setSuccessMsg('Payment QR code removed successfully.');
      }
    } catch (err) {
      setErrorMsg('Failed to remove QR code.');
    }
  };

  if (loading) {
    return (
      <div className="py-20 text-center">
        <div className="w-8 h-8 border-3 border-gold-500 border-t-maroon-700 rounded-full animate-spin mx-auto" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl space-y-6">
      <div>
        <h2 className="text-xl font-serif font-bold text-maroon-900">
          Payment QR Code & UPI Management
        </h2>
        <p className="text-xs text-stone-500">
          Upload and manage your personal UPI QR code. Only your verified QR code is displayed to customers when booking with you.
        </p>
      </div>

      {successMsg && (
        <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2">
          <Check className="w-4 h-4 flex-shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {errorMsg && (
        <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      <form onSubmit={handleUploadOrSave} className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left: QR Code Preview & Upload Area */}
        <div className="lg:col-span-5 bg-white rounded-2xl p-6 border border-stone-200 shadow-xs space-y-5 text-center">
          <div className="space-y-1">
            <h3 className="font-serif font-bold text-base text-maroon-900">
              Personal UPI QR Code
            </h3>
            <p className="text-[11px] text-stone-500">
              Displayed directly on the customer payment portal.
            </p>
          </div>

          <div className="w-64 h-64 mx-auto bg-stone-50 rounded-2xl border-2 border-dashed border-stone-300 flex flex-col items-center justify-center p-4 relative overflow-hidden group">
            {previewUrl ? (
              <img
                src={previewUrl}
                alt="Personal UPI QR Code"
                className="w-full h-full object-contain rounded-lg"
              />
            ) : (
              <div className="text-center space-y-2 text-stone-400">
                <QrCode className="w-16 h-16 mx-auto stroke-1" />
                <span className="text-xs block">No QR code uploaded yet</span>
              </div>
            )}

            <label className="absolute inset-0 bg-charcoal-900/60 text-white opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center cursor-pointer transition-opacity">
              <Upload className="w-8 h-8 mb-1" />
              <span className="text-xs font-semibold">
                {previewUrl ? 'Replace QR Code' : 'Upload QR Code'}
              </span>
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
              />
            </label>
          </div>

          <div className="flex gap-2 justify-center">
            <label className="px-4 py-2 rounded-xl bg-ivory-200 hover:bg-ivory-300 text-maroon-900 font-semibold text-xs cursor-pointer transition-colors">
              <span>{previewUrl ? 'Choose New QR Image' : 'Select QR Image'}</span>
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
              />
            </label>

            {previewUrl && (
              <button
                type="button"
                onClick={handleRemoveQr}
                className="p-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-600 transition-colors"
                title="Remove QR code"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Right: UPI ID & Payment Instructions Form */}
        <div className="lg:col-span-7 bg-white rounded-2xl p-6 sm:p-7 border border-stone-200 shadow-xs space-y-5">
          <h3 className="font-serif font-bold text-base text-maroon-900 pb-3 border-b border-stone-100">
            Payment Account Details
          </h3>

          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">
              Your UPI ID (VPA) *
            </label>
            <input
              type="text"
              required
              value={upiId}
              onChange={(e) => setUpiId(e.target.value)}
              placeholder="e.g. yourname@okhdfcbank or yourphone@upi"
              className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-sm font-mono focus:outline-none focus:border-gold-500"
            />
            <span className="text-[11px] text-stone-500 mt-1 block">
              Shown to customers for manual UPI app transfer if QR scanner is unavailable.
            </span>
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">
              Beneficiary / Account Holder Name
            </label>
            <input
              type="text"
              value={upiName}
              onChange={(e) => setUpiName(e.target.value)}
              placeholder="e.g. Pt. Radheshyam Mishra"
              className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-sm focus:outline-none focus:border-gold-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">
              Custom Payment Instructions for Seekers
            </label>
            <textarea
              rows="4"
              value={paymentInstructions}
              onChange={(e) => setPaymentInstructions(e.target.value)}
              placeholder="e.g. Please scan the QR code above and ensure your 12-digit UTR/Ref number is clearly visible on the receipt..."
              className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-sm focus:outline-none focus:border-gold-500 resize-none leading-relaxed"
            />
          </div>

          <div className="p-3.5 rounded-xl bg-ivory-100 border border-gold-300/60 flex items-start gap-2.5 text-xs text-stone-700">
            <ShieldCheck className="w-4 h-4 text-gold-600 flex-shrink-0 mt-0.5" />
            <div>
              <strong className="block text-maroon-900 font-semibold">Strict Role Isolation:</strong>
              Your uploaded QR code will never be shown for another astrologer’s consultations. Every executive independently receives their own consultation fees directly.
            </div>
          </div>

          <div className="pt-3 border-t border-stone-100 flex justify-end">
            <button
              type="submit"
              disabled={saving}
              className="px-6 py-2.5 rounded-xl bg-maroon-700 hover:bg-maroon-800 text-white font-bold text-xs shadow-md transition-all flex items-center gap-2 disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              <span>{saving ? 'Saving...' : 'Save Payment QR Settings'}</span>
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default PaymentQrManagement;
