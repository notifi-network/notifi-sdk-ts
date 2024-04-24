'use client';

import { InputFields } from '@/components/InputFields';
import { SignUpButton } from '@/components/SignUpButton';
import { useNotifiFrontendClientContext } from '@/context/NotifiFrontendClientContext';
import { useNotifiTenantConfig } from '@/context/NotifiTenantConfigContext';
import { useNotifiUserSettingContext } from '@/context/NotifiUserSettingContext';

export default function NotifiSignup() {
  const { cardConfig } = useNotifiTenantConfig();
  const { frontendClientStatus } = useNotifiFrontendClientContext();
  const { isLoading: isLoadingFtu } = useNotifiUserSettingContext();

  if (!frontendClientStatus.isAuthenticated || isLoadingFtu) return null;

  return (
    <div className="w-full md:h-4/6 sm:w-4/6 bg-notifi-card-bg rounded-2xl flex flex-col items-center justify-between mb-8 px-4">
      <div className="w-full">
        <div className="flex flex-col items-center justify-center">
          <p className="font-semibold text-xs opacity-50 mt-2.5 text-notifi-text-medium">
            STEP 1 OF 3
          </p>
          <p className="font-medium text-lg md:mt-6 mt-2 text-notifi-text">
            How do you want to be notified?
          </p>
        </div>
        <div className="flex flex-col items-center justify-center w-full mb-6 sm:mb-0">
          <p className="text-sm opacity-50 font-medium md:my-4 mt-2 mb-6 text-notifi-text-medium">
            Select a minimum of one destination
          </p>
          <InputFields
            contactInfo={cardConfig.contactInfo}
            inputDisabled={false}
          />
        </div>
      </div>
      <SignUpButton data={cardConfig} buttonText="Next" />
    </div>
  );
}
