import {
  collectDependencies,
  makeParameterLessRequest,
} from '@notifi-network/notifi-axios-utils';
import { CreateSupportConversationResult } from '@notifi-network/notifi-core';

const DEPENDENCIES: string[] = [];

const MUTATION = `
mutation createSupportConversation {
  createSupportConversation {
    id
    conversationType
    conversationGates {
       id
    }
    name
    createdDate
    participants {
      conversationParticipantType
      profile {
        id
        preferredAddress
        preferredName
        avatarData
        avatarDataType
      }
      resolvedName
    }
    backgroundImageUrl
  }
}
`.trim();

const createSupportConversationImpl =
  makeParameterLessRequest<CreateSupportConversationResult>(
    collectDependencies(...DEPENDENCIES, MUTATION),
    'createSupportConversation',
  );

export default createSupportConversationImpl;
