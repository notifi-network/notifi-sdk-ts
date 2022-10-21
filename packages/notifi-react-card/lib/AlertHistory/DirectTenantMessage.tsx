// import React from 'react';

// import { AlertNotificationRow } from './AlertNotificationRow';

// export type DirectTenantRendererProps = Readonly<{
//   tenantName: string;
//   createdDate: string;
//   destinations: string;
//   targets: string[];
// }>;

// export const DirectTenantMessageRenderer: React.FC<
//   DirectTenantRendererProps
// > = ({ tenantName, createdDate }) => {
//   const getTitle = () => {
//     return `New Message from ${tenantName}`;
//   };

//   const getMessage = () => {
//     return `Destinations notified: ${(targets: string[]) => targets.name}`;
//   };

//   return (
//     <AlertNotificationRow
//       notificationSubject={getTitle()}
//       notificationDate={createdDate}
//       notificationMessage={getMessage()}
//     />
//   );
// };
