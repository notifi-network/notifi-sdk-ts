'use client';

import { InputFields } from '@/components/InputFields';
import { NotifiSignUpButton } from '@/components/NotifiSignUpButton';
import { useNotifiCardContext } from '@/context/notifi/NotifiCardContext';
import { useNotifiClientContext } from '@notifi-network/notifi-react-card';

export default function NotifiSignup() {
  const {
    frontendClientStatus: { isInitialized },
  } = useNotifiClientContext();

  const { cardConfig } = useNotifiCardContext();

  if (!isInitialized) return null;

  return (
    <div className="h-4/6 w-4/6 bg-notifi-container-bg rounded-2xl flex flex-col items-center justify-between mb-8 shadow-container">
      <div>
        <div className="flex flex-col items-center justify-center">
          <p className="font-bold text-xs opacity-50 mt-2.5">Step 1 of 3</p>
          <p className="font-bold text-2xl mt-6">
            How do you want to be notified?
          </p>
        </div>
        <div className="flex flex-col items-center justify-center">
          {' '}
          <p className="text-sm opacity-50 font-semibold my-4">
            Select a minimum of one destination
          </p>
          <InputFields
            // hideContactInputs={showPreview && !data.isContactInfoRequired}
            data={cardConfig}
            inputDisabled={false}
          />
        </div>
      </div>
      <NotifiSignUpButton data={cardConfig} buttonText="Next" />
    </div>
  );
}
