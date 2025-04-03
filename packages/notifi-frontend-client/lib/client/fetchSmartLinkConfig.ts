import { NotifiService } from '@notifi-network/notifi-graphql';

import { isSmartLinkConfig } from '../models/SmartLink';

export const fetchSmartLinkConfigImpl = async (
  service: NotifiService,
  id: string,
) => {
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
  if (!isSmartLinkConfig(parsed))
    throw new Error(
      `.fetchSmartLinkConfig: Invalid SmartLinkConfig - ${parsed}`,
    );
  // NOTE: Make sure the isActive field is consistent
  return { ...parsed, isActive: smartLinkConfigRaw.isActive };
};
