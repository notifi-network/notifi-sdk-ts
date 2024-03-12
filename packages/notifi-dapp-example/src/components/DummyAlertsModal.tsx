import { Icon } from '@/assets/Icon';

const dummyAlerts = [
  'Developer Alerts',
  'Node Operator Alerts',
  'Market Updates',
  'Trader Alerts',
];

export const DummyAlertsModal: React.FC = () => {
  return (
    <div className="flex flex-col gap-4 bg-white/50 p-10 max-w-[33.37rem] rounded-3xl mt-2">
      <div className="font-medium">Which alerts can I sign up for?</div>
      <div className="w-[28.37rem] flex flex-wrap ">
        {dummyAlerts.map((alert) => (
          <div key={alert} className="w-52 flex items-center">
            <Icon
              id="right-arrow"
              width={11}
              height={11}
              className="text-notifi-primary-text mr-2"
            />
            <div className="ml-3 text-sm font-medium text-gray-800">
              {alert}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
