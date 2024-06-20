import { Icon } from '@/assets/Icon';

const dummyAlerts = [
  'XION Announcements',
  'Alert Example',
  'Alert Example',
  'Alert Example',
  'Alert Example',
  'Alert Example',
];

export const DummyAlertsModal: React.FC = () => {
  return (
    <div className="flex flex-col gap-4 bg-notifi-dummy-alert-card-bg/50 p-8 pb-6 w-11/12 md:max-w-[33.37rem] rounded-3xl mt-2 border border-black">
      <div className="font-medium text-notifi-text">
        Which alerts can I sign up for?
      </div>
      <div className="md:w-[28.37rem] flex flex-col md:flex-row flex-wrap justify-between">
        {dummyAlerts.map((alert) => (
          <div key={alert} className="w-56 flex items-center mb-3">
            <Icon
              id="right-arrow"
              width={11}
              height={11}
              className="text-notifi-tenant-brand-bg mr-2"
            />
            <div className="ml-3 text-sm font-medium text-notifi-grey-text">
              {alert}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
