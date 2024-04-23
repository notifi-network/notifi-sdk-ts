import { Icon } from '@/assets/Icon';

const dummyAlerts = [
  'Developer Notifications',
  'General Updates',
  'Node Operator Notifications',
  'Market Updates',
  'Trader Notifications',
];

export const DummyAlertsModal: React.FC = () => {
  return (
    <div className="flex flex-col gap-4 bg-white/50 p-10 pr-0 w-11/12 md:max-w-[33.37rem] rounded-3xl mt-2">
      <div className="font-medium">Which alerts can I sign up for?</div>
      <div className="md:w-[28.37rem] flex flex-col md:flex-row flex-wrap ">
        {dummyAlerts.map((alert) => (
          <div key={alert} className="w-[14.1rem] flex items-center mb-2">
            <Icon
              id="right-arrow"
              width={11}
              height={11}
              className="text-notifi-primary-text mr-1"
            />
            <div className="ml-2 text-sm font-medium text-gray-800">
              {alert}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
