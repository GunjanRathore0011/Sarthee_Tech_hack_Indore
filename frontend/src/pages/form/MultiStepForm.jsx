import React, { useState } from 'react';
import AdditionalDetail from './AdditionalDetail';
import SuspectForm from './SuspectForm';

function MultiStepForm() {
  const [step, setStep] = useState(1);

  const handleNext = () => setStep((prev) => prev + 1);
  const handleBack = () => setStep((prev) => prev - 1);

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="flex justify-center space-x-4 mb-6">
        <button className={`px-4 py-2 rounded ${step === 1 ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}>Incident Details</button>
        <button className={`px-4 py-2 rounded ${step === 2 ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}>Suspect Details</button>
      </div>

      {step === 1 && <AdditionalDetail onNext={handleNext} />}
      {step === 2 && <SuspectForm onBack={handleBack} />}
    </div>
  );
}

export default MultiStepForm;
