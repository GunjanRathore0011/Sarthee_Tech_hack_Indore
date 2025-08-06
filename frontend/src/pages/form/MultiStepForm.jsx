import React from 'react';
import { useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import AdditionalDetail from './AdditionalDetail';
import SuspectForm from './SuspectForm';
import CyberCrimeForm from './CyberCrimeForm';
import HarassmentForm from './HarassmentForm';
import PreviewForm from './PreviewForm';
import OtherCrimeForm from './OtherCrimeForm';
import { setNextStep } from '@/ReduxSlice/formData/formSlice';

function MultiStepForm() {
  const location = useLocation();
  // const categoryKey = useSelector((state) => state.formData.categoryKey.value);
  const categoryKey = useSelector((state) => state.formData.categoryKey?.value || 'other');



  const dispatch = useDispatch();
  // const step = useSelector((state) => state.formData.next.step); 
  const step = useSelector((state) => state.formData?.next?.step || 1);
// ✅ useSelector is now correctly imported

  const handleNext = () => {
    dispatch(setNextStep(step + 1));
  };

  const handleBack = () => {
    if (step > 1) {
      dispatch(setNextStep(step - 1));
    }
  };

  // Render the correct form based on category
  const renderCategoryForm = () => {
    switch (categoryKey) {
      case 'harassment':
        return <HarassmentForm onNext={handleNext} onBack={handleBack} />;
      case 'financial_fraud':
        return <CyberCrimeForm onNext={handleNext} onBack={handleBack} />;
      case 'other':
        return <OtherCrimeForm onNext={handleNext} onBack={handleBack} />;
      default:
        return <OtherCrimeForm onNext={handleNext} onBack={handleBack} />;
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      {/* Step Indicators */}
      <div className="flex justify-center space-x-4 mb-6">
        <button className={`px-4 py-2 rounded ${step === 1 ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}>
          Additional Detail
        </button>
        <button className={`px-4 py-2 rounded ${step === 2 ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}>
          Complaint Form
        </button>
        <button className={`px-4 py-2 rounded ${step === 3 ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}>
          Suspect Details
        </button>
        <button className={`px-4 py-2 rounded ${step === 4 ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}>
          Preview
        </button>
      </div>

      {/* Step-wise rendering */}
      {step === 1 && <AdditionalDetail onNext={handleNext} />}
      {step === 2 && renderCategoryForm()}
      {step === 3 && <SuspectForm onNext={handleNext} onBack={handleBack} />}
      {step === 4 && <PreviewForm onBack={handleBack} />}
    </div>
  );
}

export default MultiStepForm;
