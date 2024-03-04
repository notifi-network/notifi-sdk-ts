'use client';

import { InputFields } from '@/components/InputFields';
import { NotifiSignUpButton } from '@/components/NotifiSignUpButton';
import { useNotifiCardContext } from '@/context/notifi/NotifiCardContext';

export default function NotifiSignup() {
  const { cardConfig } = useNotifiCardContext();

  return (
    <div className="h-4/6 w-4/6 bg-notifi-container-bg rounded-2xl flex flex-col items-center justify-between mb-8">
      <div>
        <div className="flex flex-col items-center justify-center">
          <p className="font-semibold text-xs opacity-50 mt-2.5">STEP 1 OF 3</p>
          <p className="font-medium text-lg mt-6">
            How do you want to be notified?
          </p>
        </div>
        <div className="flex flex-col items-center justify-center">
          <p className="text-sm opacity-50 font-medium my-4">
            Select a minimum of one destination
          </p>
          <InputFields
            contactInfo={cardConfig.contactInfo}
            inputDisabled={false}
          />
        </div>
      </div>
      <NotifiSignUpButton data={cardConfig} buttonText="Next" />
    </div>
  );
}
