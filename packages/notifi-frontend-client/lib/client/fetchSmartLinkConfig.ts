import { NotifiService } from '@notifi-network/notifi-graphql';

import { SmartLinkConfig, isSmartLinkConfig } from '../models/SmartLinkConfig';

export type SmartLinkConfigWithIsActive = {
  smartLinkConfig: SmartLinkConfig;
  isActive: boolean;
};

export const fetchSmartLinkConfigImpl = async (
  service: NotifiService,
  id: string,
): Promise<SmartLinkConfigWithIsActive> => {
  const smartLinkConfigRaw = (
    await service.getSmartLinkConfig({
      input: {
        id: id,
      },
    })
  ).smartLinkConfig;
  const smartLinkConfigJsonString = smartLinkConfigRaw.smartLinkConfig;
  if (!smartLinkConfigRaw) {
    throw new Error('SmartLinkConfig is undefined');
  }
  const parsed = JSON.parse(smartLinkConfigJsonString);
  if (!isSmartLinkConfig(parsed)) {
    const errMsg = `.fetchSmartLinkConfig: Invalid SmartLinkConfig - ${parsed}`;
    console.error(errMsg);
    throw new Error(errMsg);
  }

  return { smartLinkConfig: parsed, isActive: smartLinkConfigRaw.isActive };
};
