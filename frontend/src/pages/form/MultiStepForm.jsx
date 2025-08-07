import React from 'react';
import { useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Check } from 'lucide-react';
import AdditionalDetail from './AdditionalDetail';
import SuspectForm from './SuspectForm';
import CyberCrimeForm from './CyberCrimeForm';
import HarassmentForm from './HarassmentForm';
import PreviewForm from './PreviewForm';
import OtherCrimeForm from './OtherCrimeForm';
import { setNextStep } from '@/ReduxSlice/formData/formSlice';

function MultiStepForm() {
  const location = useLocation();
  const dispatch = useDispatch();
  const categoryKey = useSelector((state) => state.formData.categoryKey?.value || 'other');
  const step = useSelector((state) => state.formData?.next?.step || 1);

  const handleNext = () => {
    dispatch(setNextStep(step + 1));
  };

  const handleBack = () => {
    if (step > 1) {
      dispatch(setNextStep(step - 1));
    }
  };

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

  const stepLabels = ['Additional Detail', 'Complaint Form', 'Suspect Details', 'Preview'];

  const progressPercentage = ((step - 1) / (stepLabels.length - 1)) * 100;

  return (
    <div className="p-6 max-w-4xl mx-auto">
      {/* Animated Stepper */}
      <div className="relative flex items-center justify-between mb-12 px-4">
        {/* Gradient Line Background */}
        <div className="absolute top-1/2 left-0 w-full h-1 bg-gray-300 rounded-full -translate-y-1/2 z-0 overflow-hidden" />

        {/* Animated Gradient Fill */}
        <div
          className="absolute top-1/2 left-0 h-1 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 transition-all duration-700 ease-in-out rounded-full -translate-y-1/2 z-10"
          style={{ width: `${progressPercentage}%` }}
        />

        {/* Step Circles */}
        {stepLabels.map((label, index) => {
          const current = index + 1;
          const isActive = step === current;
          const isCompleted = step > current;

          return (
            <div key={label} className="relative z-20 flex flex-col items-center text-center w-1/4">
              <div
                className={`w-10 h-10 flex items-center justify-center rounded-full border-2 text-sm font-semibold transition-all duration-500 ${
                  isCompleted
                    ? 'bg-gradient-to-br from-blue-500 to-purple-500 text-white border-none shadow-md'
                    : isActive
                    ? 'bg-white border-blue-600 text-blue-600 scale-110 shadow-lg'
                    : 'bg-white border-gray-300 text-gray-500'
                }`}
              >
                {isCompleted ? <Check className="w-5 h-5" /> : current}
              </div>
              <span
                className={`mt-2 text-sm ${
                  isCompleted || isActive ? 'text-blue-700 font-medium' : 'text-gray-500'
                }`}
              >
                {label}
              </span>
            </div>
          );
        })}
      </div>

      {/* Step-wise Form Rendering */}
      {step === 1 && <AdditionalDetail onNext={handleNext} />}
      {step === 2 && renderCategoryForm()}
      {step === 3 && <SuspectForm onNext={handleNext} onBack={handleBack} />}
      {step === 4 && <PreviewForm onBack={handleBack} />}
    </div>
  );
}

export default MultiStepForm;
