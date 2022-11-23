import {
  collectDependencies,
  makeRequest,
} from '@notifi-network/notifi-axios-utils';
import { DeleteTargetGroupResult } from '@notifi-network/notifi-core';

const DEPENDENCIES: string[] = [];

const MUTATION = `
mutation createSupport {
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

const createSupportImpl = makeRequest<createSupportResult>(
  collectDependencies(...DEPENDENCIES, MUTATION),
  'createSupport',
);

export default createSupportImpl;
