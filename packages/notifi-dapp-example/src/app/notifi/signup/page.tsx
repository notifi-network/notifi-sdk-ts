'use client';

import { InputFields } from '@/components/InputFields';
import { UserDestinationsInfoPanel } from '@/components/UserDestinationsInfoPanel';
import { useNotifiCardContext } from '@/context/notifi/NotifiCardContext';
import {
  useFrontendClientLogin,
  useNotifiClientContext,
} from '@notifi-network/notifi-react-card';
import { useState } from 'react';

export default function NotifiSignup() {
  const [step, setStep] = useState<number>(1);
  const {
    frontendClientStatus: { isAuthenticated, isInitialized },
  } = useNotifiClientContext();
  const login = useFrontendClientLogin();

  const { cardConfig } = useNotifiCardContext();

  if (!isInitialized) return null;

  return (
    <div className="h-4/6 w-4/6 bg-notifi-container-bg rounded-2xl flex flex-col items-center justify-between mb-8 shadow-container">
      <div>
        <div className="flex flex-col items-center justify-center">
          <p className="font-bold text-xs opacity-50 mt-2.5">
            Step {step} of 3
          </p>
          <p className="font-bold text-2xl mt-6">
            {step !== 3
              ? 'How do you want to be notified?'
              : 'Select alerts you want to receive'}
          </p>
        </div>
        <div className="flex flex-col items-center justify-center">
          <p className="text-sm opacity-50 font-semibold my-4">
            Select a minimum of one destination
          </p>
          {step === 2 ? (
            <UserDestinationsInfoPanel contactInfo={cardConfig.contactInfo} />
          ) : (
            <InputFields
              // hideContactInputs={showPreview && !data.isContactInfoRequired}
              data={cardConfig}
              inputDisabled={false}
            />
          )}
        </div>
      </div>
      {/* Dummy Signup Page {JSON.stringify({ isAuthenticated, isInitialized })} */}
      <button
        className="rounded bg-notifi-button-primary-blueish-bg text-notifi-button-primary-text w-72 h-11 mb-6"
        onClick={() => {
          // login();
          setStep(step + 1);
        }}
      >
        Next
      </button>
    </div>
  );
}
