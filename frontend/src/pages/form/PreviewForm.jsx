import React, { useMemo, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { resetFormDataExceptAdditional } from '@/ReduxSlice/formData/formSlice';
import { ShieldAlert, UserRound, ScanFace, FileImage } from 'lucide-react';

// --------------------------------------
// Helpers
// --------------------------------------
const cx = (...classes) => classes.filter(Boolean).join(' ');

const formatDateTime = (value) => {
  if (!value) return '-';
  const d = new Date(value);
  return isNaN(d.getTime()) ? value : d.toLocaleString();
};

const formatCurrency = (n) => {
  if (n == null || n === '') return '-';
  const num = Number(n);
  if (Number.isNaN(num)) return n;
  return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(num);
};

// Show first N words with toggle
const ReadMore = ({ text = '', words = 200 }) => {
  const [expanded, setExpanded] = useState(false);
  const tokens = useMemo(() => (text || '').trim().split(/\s+/), [text]);
  const needsClamp = tokens.length > words;
  const display = !needsClamp || expanded ? text : tokens.slice(0, words).join(' ') + '…';
  if (!text) return <span className="text-slate-500">-</span>;
  return (
    <div className="space-y-2">
      <p className="leading-relaxed break-words text-slate-900">{display}</p>
      {needsClamp && (
        <button
          type="button"
          onClick={() => setExpanded((v) => !v)}
          className="text-blue-600 hover:underline font-medium"
        >
          {expanded ? 'Read less' : 'Read more'}
        </button>
      )}
    </div>
  );
};

// Horizontal image strip; supports FileList, File[], or single File
const ImageStrip = ({ files }) => {
  // Normalize to array
  const arr = useMemo(() => {
    if (!files) return [];
    if (Array.isArray(files)) return files;
    if (files instanceof FileList) return Array.from(files);
    if (files instanceof File) return [files];
    // Some forms store as Array-like
    try { return Array.from(files); } catch { return []; }
  }, [files]);

  if (!arr.length) return <p className="text-slate-500">No files uploaded.</p>;

  const images = arr.filter((f) => f && f.type && f.type.startsWith('image/'));

  return (
    <div className="w-full">
      {images.length > 1 && <div className="h-px bg-slate-200 mb-3" />}
      <div className="flex gap-4 overflow-x-auto pb-2">
        {images.map((file, idx) => {
          const url = URL.createObjectURL(file);
          return (
            <div key={idx} className="min-w-[140px]">
              <div className="aspect-square w-[140px] rounded-xl border border-blue-100 overflow-hidden shadow-sm">
                <img src={url} alt={`uploaded-${idx + 1}`} className="w-full h-full object-cover" />
              </div>
              <div className="mt-2 text-xs text-slate-600 line-clamp-1" title={file.name}>
                {file.name || `Image ${idx + 1}`}
              </div>
            </div>
          );
        })}
      </div>
      {images.length > 1 && <div className="h-px bg-slate-200 mt-3" />}
    </div>
  );
};

// Simple key-value row
const KV = ({ label, value }) => (
  <div className="grid grid-cols-[180px_1fr] gap-2 py-2">
    <div className="text-black font-medium">{label}</div>
    <div className="text-slate-900">{value || <span className="text-slate-500">-</span>}</div>
  </div>
);

// Section wrapper with blue header
const SectionCard = ({ title, icon: Icon, children, rightEl, subtitle }) => (
  <section className="bg-white rounded-2xl border border-blue-100 shadow-md overflow-hidden">
    <div className="bg-gradient-to-r from-blue-600 to-blue-500 text-white px-5 py-3 flex items-center justify-between">
      <div className="flex items-center gap-2">
        {Icon && <Icon className="w-5 h-5" />}
        <h3 className="text-lg font-semibold">{title}</h3>
      </div>
      {rightEl}
    </div>
    {subtitle && <div className="px-5 pt-3 text-slate-600">{subtitle}</div>}
    <div className="p-5">{children}</div>
  </section>
);

// --------------------------------------
// Crime Details Variants
// --------------------------------------
const HarassmentDetails = ({ harassment }) => (
  <div className="divide-y divide-slate-1">
    <KV label="Subcategory" value={harassment?.subCategory} />
    <div>
      <div className="text-black font-medium mb-1">Description</div>
      <ReadMore text={harassment?.description} />
    </div>
    <KV label="Date & Time" value={formatDateTime(harassment?.incident_datetime)} />
    <KV label="Delay in report" value={harassment?.delay_in_report ? 'Yes' : 'No'} />
    {harassment?.reson_of_delay && <KV label="Reason for delay" value={harassment?.reson_of_delay} />}

    <div className="mt-2">
      <div className="flex items-center gap-2 mb-2 text-black font-medium">
        <FileImage className="w-4 h-4" /> Uploaded Files
      </div>
      <ImageStrip files={harassment?.files} />
    </div>
  </div>
);

const FinancialFraudDetails = ({ fraud, acc }) => (
  <div className="divide-y divide-slate-1">
    <KV label="Subcategory" value={fraud?.subCategory} />
    <div>
      <div className="text-black font-medium mb-1">Description</div>
      <ReadMore text={fraud?.description} />
    </div>
    <KV label="Lost Money" value={formatCurrency(fraud?.lost_money)} />
    <KV label="Date & Time" value={formatDateTime(fraud?.incident_datetime)} />
    <KV label="Delay in report" value={fraud?.delay_in_report ? 'Yes' : 'No'} />
    {fraud?.reson_of_delay && <KV label="Reason for delay" value={fraud?.reson_of_delay} />}

    {(acc?.accountNumber || acc?.bankName || acc?.transactionId || acc?.transactionDate || acc?.ifscCode || acc?.lost_money) && (
      <div className="pt-2">
        <div className="text-black font-semibold mb-2">Bank Transaction Details</div>
        <div className="rounded-xl border border-blue-100 p-3 bg-slate-50">
          {acc?.accountNumber && <KV label="Account Number" value={acc.accountNumber} />}
          {acc?.bankName && <KV label="Bank Name" value={acc.bankName} />}
          {acc?.ifscCode && <KV label="IFSC Code" value={acc.ifscCode} />}
          {acc?.transactionId && <KV label="Transaction ID" value={acc.transactionId} />}
          {acc?.transactionDate && <KV label="Transaction Date" value={formatDateTime(acc.transactionDate)} />}
          {acc?.lost_money && <KV label="Lost Amount (via Bank)" value={formatCurrency(acc.lost_money)} />}
        </div>
      </div>
    )}

    <div className="mt-2">
      <div className="flex items-center gap-2 mb-2 text-black font-medium">
        <FileImage className="w-4 h-4" /> Uploaded Files
      </div>
      <ImageStrip files={fraud?.files} />
    </div>
  </div>
);

const OtherCrimeDetails = ({ other }) => (
  <div className="divide-y divide-slate-1">
    <KV label="Subcategory" value={other?.subCategory} />
    <div>
      <div className="text-black font-medium mb-1">Description</div>
      <ReadMore text={other?.description} />
    </div>
    <KV label="Date & Time" value={formatDateTime(other?.incident_datetime)} />
    <KV label="Delay in report" value={other?.delay_in_report ? 'Yes' : 'No'} />
    {other?.reson_of_delay && <KV label="Reason for delay" value={other?.reson_of_delay} />}
  </div>
);

const CrimeDetailsSwitch = ({ category, harassment, fraud, acc, other }) => {
  switch (category) {
    case 'harassment':
      return <HarassmentDetails harassment={harassment} />;
    case 'financial_fraud':
      return <FinancialFraudDetails fraud={fraud} acc={acc} />;
    case 'other':
      return <OtherCrimeDetails other={other} />;
    default:
      return <p className="text-slate-600">No crime data available.</p>;
  }
};

// --------------------------------------
// Main Component
// --------------------------------------
export default function PreviewForm({ onBack }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const additionalDetail = useSelector((state) => state.formData.additionDetail);
  const suspectData = useSelector((state) => state.formData.suspectData);
  const harassment = useSelector((state) => state.formData.harassment);
  const financialFraud = useSelector((state) => state.formData.financialFraud.formData);
  const financialAcc = useSelector((state) => state.formData.financialFraud.accData);
  const otherCrime = useSelector((state) => state.formData.otherCrime);
  const category = useSelector((state) => state.formData.categoryKey.value);

  const submithandler = async () => {
    try {
      let payload = {};
      let formData = null;
      let useFormData = false;

      if (category === 'financial_fraud') {
        const { files, ...restFinancialFraud } = financialFraud || {};
        const { suspectedFile, ...restSuspect } = suspectData || {};
        payload = {
          ...restFinancialFraud,
          ...financialAcc,
          ...restSuspect,
        };
        formData = new FormData();
        formData.append('data', JSON.stringify(payload));
        if (files && Array.isArray(files)) {
          files.forEach((file) => formData.append('file', file));
          useFormData = true;
        }
        if (suspectData?.suspectedFile) {
          formData.append('suspect_file', suspectData.suspectedFile);
          useFormData = true;
        }
      } else if (category === 'harassment') {
        const { files, ...restHarassment } = harassment || {};
        const { suspectedFile, ...restSuspect } = suspectData || {};
        payload = { ...restHarassment, ...restSuspect };
        formData = new FormData();
        formData.append('data', JSON.stringify(payload));
        if (files) { formData.append('file', files); useFormData = true; }
        if (suspectData?.suspectedFile) {
          formData.append('suspect_file', suspectData.suspectedFile);
          useFormData = true;
        }
      } else if (category === 'other') {
        const { files, ...restOther } = otherCrime || {};
        const { suspectedFile, ...restSuspect } = suspectData || {};
        payload = { ...restOther, ...restSuspect };
        formData = new FormData();
        formData.append('data', JSON.stringify(payload));
        if (files) { formData.append('file', files); useFormData = true; }
        if (suspectData?.suspectedFile) {
          formData.append('suspect_file', suspectData.suspectedFile);
          useFormData = true;
        }
      }

      const { data } = await axios.post(
        'http://localhost:4000/api/v1/auth/complaintInformation',
        useFormData ? formData : payload,
        {
          headers: useFormData ? {} : { 'Content-Type': 'application/json' },
          withCredentials: true,
        }
      );

      if (data.success) {
        // toast or alert
        // eslint-disable-next-line no-alert
        alert('✅ Form submitted successfully!');
        dispatch(resetFormDataExceptAdditional());
        navigate('/submitedcomplaint', { state: { responseData: data } });
      } else {
        // eslint-disable-next-line no-alert
        alert('⚠️ Error submitting form: ' + data.message);
      }
    } catch (error) {
      console.error('❌ Axios submission error:', error);
      // eslint-disable-next-line no-alert
      alert('❌ Network/server error while submitting form.');
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-2 space-y-1">
      {/* Page title */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-blue-700">Preview Your Submission</h2>
          <p className="text-slate-600 mt-1">Review all details below before submitting your complaint.</p>
        </div>
        {category && (
          <span className="px-3 py-1 rounded-full text-sm bg-blue-50 text-blue-700 border border-blue-200">
            Category: <span className="font-semibold capitalize">{String(category).replace('_', ' ')}</span>
          </span>
        )}
      </div>

      {/* 3 sections */}
      {/* <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
       */}
       <div className="flex flex-col gap-4">

        {/* Additional Details */}
        <SectionCard title="Additional Details" icon={UserRound}>
          <div className="divide-y divide-slate-1">
            <KV label="Name" value={additionalDetail?.fullName} />
            <KV label="DOB" value={formatDateTime(additionalDetail?.dob)} />
            <KV label="Gender" value={additionalDetail?.gender} />
            <KV label="Address" value={[additionalDetail?.house, additionalDetail?.street, additionalDetail?.colony].filter(Boolean).join(', ')} />
            <KV label="District" value={additionalDetail?.district} />
            <KV label="Police Station" value={additionalDetail?.policeStation} />
            <KV label="Pincode" value={additionalDetail?.pincode} />
          </div>
        </SectionCard>

        {/* Cyber Crime Details */}
        <SectionCard title="Cyber Crime Details" icon={ShieldAlert}>
          <CrimeDetailsSwitch
            category={category}
            harassment={harassment}
            fraud={financialFraud}
            acc={financialAcc}
            other={otherCrime}
          />
        </SectionCard>

        {/* Suspect Details */}
        <SectionCard title="Suspect Details" icon={ScanFace}>
          <div className="divide-y divide-slate-1">
            <KV label="Name" value={suspectData?.suspectedName} />
            <KV label="Card Type" value={suspectData?.suspectedCard} />
            <KV label="Card Number" value={suspectData?.suspectedCardNumber} />
            <div>
              <div className="text-black font-medium mb-1">Details</div>
              <ReadMore text={suspectData?.details} />
            </div>

            {suspectData?.suspectedFile instanceof File && (
              <div className="pt-2">
                <div className="flex items-center gap-2 mb-2 text-black font-medium">
                  <FileImage className="w-4 h-4" /> Suspect Image
                </div>
                <ImageStrip files={suspectData.suspectedFile} />
              </div>
            )}
          </div>
        </SectionCard>
      </div>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row items-center justify-end gap-3 pt-2">
        <button
          type="button"
          onClick={onBack}
          className={cx(
            'px-4 py-2 rounded-xl border border-slate-300 text-slate-800 hover:bg-slate-50',
            'transition-colors shadow-sm w-full sm:w-auto'
          )}
        >
          Back
        </button>
        <button
          type="button"
          onClick={submithandler}
          className={cx(
            'px-5 py-2 rounded-xl text-white bg-gradient-to-r from-blue-600 to-blue-500',
            'hover:from-blue-700 hover:to-blue-600 transition-colors shadow-md w-full sm:w-auto'
          )}
        >
          Submit
        </button>
      </div>
    </div>
  );
}
