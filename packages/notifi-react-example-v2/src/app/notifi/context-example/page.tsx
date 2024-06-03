'use client';

import {
  useNotifiFrontendClientContext,
  useNotifiTargetContext,
  useNotifiTenantConfigContext,
} from '@notifi-network/notifi-react';

const NotifiContextExample = () => {
  const { frontendClientStatus, login } = useNotifiFrontendClientContext();
  const { fusionEventTopics } = useNotifiTenantConfigContext();
  const { targetDocument, updateTargetInputs, renewTargetGroup } =
    useNotifiTargetContext();
  return (
    <div>
      <h1>Notifi Context Example</h1>
      <h2>NotifiFrontendClientContext</h2>
      <div>- FrontendClientStatus: {JSON.stringify(frontendClientStatus)}</div>
      {frontendClientStatus.isAuthenticated ? (
        <div>- Logged in</div>
      ) : (
        <button onClick={() => login()}>Login</button>
      )}
      <h1>NotifiTenantConfigContext</h1>
      <h2>Topics </h2>
      <div style={{ paddingLeft: '20px' }}>
        {fusionEventTopics.map((topic) => (
          <div key={topic.uiConfig.name}>
            - {topic.fusionEventDescriptor.name}
          </div>
        ))}
      </div>
      <h1>NotifiTargetContext</h1>
      <h2>TargetDocument: </h2>
      <div style={{ paddingLeft: '20px' }}>
        {JSON.stringify(targetDocument)}
      </div>
      <button
        onClick={() => {
          updateTargetInputs('email', {
            value: `${Math.round(
              Math.random() * 100,
            ).toString()}@notifi.network`,
          });
        }}
      >
        Input email target
      </button>
      <br />
      <button
        onClick={() => {
          renewTargetGroup();
        }}
      >
        Save input email
      </button>
    </div>
  );
};
export default NotifiContextExample;
