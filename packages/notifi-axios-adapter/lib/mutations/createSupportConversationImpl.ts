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
       }
       resolvedName
     }
  }
}
`.trim();

const createSupportConversationImpl =
  makeParameterLessRequest<CreateSupportConversationResult>(
    collectDependencies(...DEPENDENCIES, MUTATION),
    'createSupportConversation',
  );

export default createSupportConversationImpl;
