import {
  FusionEventTopic,
  TopicMetadata,
  parseTenantConfig,
} from '@notifi-network/notifi-frontend-client';
import { Types } from '@notifi-network/notifi-graphql';
import { CyHttpMessages } from 'cypress/types/net-stubbing';

export type DisplayedTopic = { index: number; value: string };
export const getTopicList = (
  findTenantConfigResponse: CyHttpMessages.IncomingResponse,
): DisplayedTopic[] => {
  const tenantConfig = parseTenantConfig(
    findTenantConfigResponse.body.data.findTenantConfig.dataJson,
  );
  const fusionEventDescriptors =
    findTenantConfigResponse.body.data.findTenantConfig.fusionEvents;
  if (!fusionEventDescriptors)
    throw new Error('No fusion events found in tenant config');

  const fusionEventDescriptorMap = new Map<string, Types.FusionEventDescriptor>(
    fusionEventDescriptors.map((item: any) => [item?.name ?? '', item ?? {}]),
  );

  fusionEventDescriptorMap.delete('');

  const topicMetadatas = tenantConfig.eventTypes
    .map((eventType) => {
      if (eventType.type === 'fusion') {
        const fusionEventDescriptor = fusionEventDescriptorMap.get(
          eventType.name,
        );
        return {
          uiConfig: eventType,
          fusionEventDescriptor,
        };
      }
    })
    .filter((item): item is TopicMetadata | FusionEventTopic => !!item);

  const topicGroupNames: { index: number; value: string }[] = [];
  const topicNames: { index: number; value: string }[] = [];
  topicMetadatas.forEach((topic, id) => {
    if (topic.uiConfig.topicGroupName) {
      if (
        topicGroupNames
          .map((name) => name.value)
          .includes(topic.uiConfig.topicGroupName)
      )
        return;
      topicGroupNames.push({
        index: topic.uiConfig.index ?? id,
        value: topic.uiConfig.topicGroupName,
      });
      return;
    }
    topicNames.push({
      index: topic.uiConfig.index ?? id,
      value: topic.uiConfig.name,
    });
  });
  const topicList = [...topicNames, ...topicGroupNames].sort(
    (a, b) => a.index - b.index,
  );
  return topicList;
};
