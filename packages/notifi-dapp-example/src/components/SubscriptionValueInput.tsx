import { LabelWithSubTopicsEventTypeItem } from '@notifi-network/notifi-react';

type SubscriptionValueInputProps = {
  labelWithSubTopics?: LabelWithSubTopicsEventTypeItem;
};

export const SubscriptionValueInput: React.FC<SubscriptionValueInputProps> = ({
  labelWithSubTopics,
}) => {
  const dummyList = [
    'ETH / USDC - Chain',
    'ETH / USDC - Chain',
    'ETH / USDC - Chain',
  ];

  return (
    <select className="ml-14 w-60 h-12 bg-notifi-card-bg rounded-md mb-3 text-notifi-text p-2 border-0 focus:border-0 focus-visible:border-0">
      {dummyList.map((item) => (
        <option
          key={item}
          value={item}
          className="ml-14 w-60 h-12 bg-notifi-card-bg rounded-md mb-3 text-notifi-text p-2"
        >
          {item}
        </option>
      ))}
    </select>
  );
};
