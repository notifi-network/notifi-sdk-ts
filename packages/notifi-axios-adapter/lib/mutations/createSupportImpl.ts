import {
  collectDependencies,
  makeParameterLessRequest,
} from '@notifi-network/notifi-axios-utils';
import { CreateSupportResult } from '@notifi-network/notifi-core';

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

const createSupportImpl = makeParameterLessRequest<CreateSupportResult>(
  collectDependencies(...DEPENDENCIES, MUTATION),
  'createSupportConversation',
);

export default createSupportImpl;
