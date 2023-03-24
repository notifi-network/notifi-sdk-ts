import clsx from 'clsx';
import React, { useEffect, useMemo, useRef, useState } from 'react';

import { DeleteIcon } from '../../assets/DeleteIcon';
import { useNotifiSubscriptionContext } from '../../context';
import { TradingPairEventTypeItem, useNotifiSubscribe } from '../../hooks';
import { DeepPartialReadonly, tradingPairConfiguration } from '../../utils';
import { NotifiTooltip, NotifiTooltipProps } from './NotifiTooltip';
import { resolveStringArrayRef } from './resolveRef';

export type EventTypeTradingPairsRowProps = Readonly<{
  classNames?: DeepPartialReadonly<{
    container: string;
    label: string;
    addPair: string;
    tooltip: NotifiTooltipProps['classNames'];
    tradingPairAlertRow: TradingPairAlertRowProps['classNames'];
    tradingPairSettingsRow: TradingPairSettingsRowProps['classNames'];
  }>;
  config: TradingPairEventTypeItem;
  inputs: Record<string, unknown>;
}>;

export const EventTypeTradingPairsRow: React.FC<
  EventTypeTradingPairsRowProps
> = ({ classNames, config, inputs }: EventTypeTradingPairsRowProps) => {
  const { name, tooltipContent } = config;
  const { alerts } = useNotifiSubscriptionContext();

  const tradingPairAlertNames = useMemo(() => {
    if (alerts === undefined) {
      return [];
    }

    return Object.keys(alerts)
      .filter((alertName) => alertName.indexOf(config.name) >= 0)
      .sort((a, b) => {
        const getTime = (alertName: string) => {
          const [, time] = alertName.split(':;:');
          const date = new Date(time);
          return date.getTime();
        };

        return getTime(a) - getTime(b);
      });
  }, [alerts, config.name]);

  const [showInput, setShowInput] = useState(false);
  const hasSetInput = useRef(false);
  useEffect(() => {
    if (!hasSetInput.current && alerts !== undefined) {
      hasSetInput.current = true;
      setShowInput(tradingPairAlertNames.length === 0);
    }
  }, [alerts, tradingPairAlertNames]);

  return (
    <div
      className={clsx(
        'EventTypeTradingPairsRow__container',
        classNames?.container,
      )}
    >
      <div
        className={clsx('EventTypeTradingPairsRow__label', classNames?.label)}
      >
        {name}
        {tooltipContent !== undefined && tooltipContent.length > 0 ? (
          <NotifiTooltip
            classNames={classNames?.tooltip}
            content={tooltipContent}
          />
        ) : null}
      </div>
      {tradingPairAlertNames.map((alertName) => {
        return (
          <TradingPairAlertRow
            key={alertName}
            classNames={classNames?.tradingPairAlertRow}
            alertName={alertName}
          />
        );
      })}
      {showInput ? (
        <TradingPairSettingsRow
          classNames={classNames?.tradingPairSettingsRow}
          config={config}
          inputs={inputs}
          onSave={() => {
            setShowInput(false);
          }}
        />
      ) : null}
      <button
        className={clsx(
          'EventTypeTradingPairsRow__addPair',
          classNames?.addPair,
        )}
        disabled={showInput}
        onClick={() => {
          setShowInput(true);
        }}
      >
        Add pair
      </button>
    </div>
  );
};

export type TradingPairAlertRowProps = Readonly<{
  classNames?: DeepPartialReadonly<{
    container: string;
    textContainer: string;
    name: string;
    description: string;
    deleteIcon: string;
  }>;
  alertName: string;
}>;

export const TradingPairAlertRow: React.FC<TradingPairAlertRowProps> = ({
  classNames,
  alertName,
}: TradingPairAlertRowProps) => {
  const { instantSubscribe } = useNotifiSubscribe({
    targetGroupName: 'Default',
  });

  const { name, description } = useMemo(() => {
    // const alertName = `${config.name}:;:${now}:;:${selectedPair}:;:${
    //   above ? 'above' : 'below'
    // }:;:${price}`;
    const [, , name, above, price] = alertName.split(':;:');
    const description = `Alert me when trade price is ${above}: ${price}`;
    return {
      name,
      description,
    };
  }, [alertName]);

  return (
    <div
      className={clsx('TradingPairAlertRow__container', classNames?.container)}
    >
      <div
        className={clsx(
          'TradingPairAlertRow__textContainer',
          classNames?.textContainer,
        )}
      >
        <span className={clsx('TradingPairAlertRow__name', classNames?.name)}>
          {name}
        </span>
        <span
          className={clsx(
            'TradingPairAlertRow__description',
            classNames?.description,
          )}
        >
          {description}
        </span>
      </div>
      <div
        className={clsx(
          'TradingPairAlertRow__deleteIcon',
          classNames?.deleteIcon,
        )}
        onClick={() => {
          instantSubscribe({
            alertConfiguration: null,
            alertName,
          });
        }}
      >
        <DeleteIcon />
      </div>
    </div>
  );
};
export type TradingPairSettingsRowProps = Readonly<{
  classNames?: DeepPartialReadonly<{
    buttonContainer: string;
    radioButton: string;
    container: string;
    dropdown: string;
    dropdownContainer: string;
    label: string;
    option: string;
    priceInput: string;
    priceInputContainer: string;
    saveButton: string;
  }>;
  config: TradingPairEventTypeItem;
  inputs: Record<string, unknown>;
  onSave: () => void;
}>;

export const TradingPairSettingsRow: React.FC<TradingPairSettingsRowProps> = ({
  classNames,
  config,
  inputs,
  onSave,
}: TradingPairSettingsRowProps) => {
  const tradingPairs = resolveStringArrayRef(
    config.name,
    config.tradingPairs,
    inputs,
  );

  const [selectedPair, setSelectedPair] = useState<string | undefined>(
    undefined,
  );
  const [above, setAbove] = useState<boolean>(true);
  const [price, setPrice] = useState<number>(0.0);
  const { instantSubscribe } = useNotifiSubscribe({
    targetGroupName: 'Default',
  });

  return (
    <div
      className={clsx(
        'TradingPairSettingsRow__container',
        classNames?.container,
      )}
    >
      <div
        className={clsx(
          'TradingPairSettingsRow__dropdownContainer',
          classNames?.dropdownContainer,
        )}
      >
        <select
          className={clsx(
            'TradingPairSettingsRow__dropdown',
            classNames?.dropdown,
          )}
          onChange={(e) => setSelectedPair(e.target.value)}
          value={selectedPair}
        >
          <option
            className={clsx(
              'TradingPairSettingsRow__option',
              classNames?.option,
            )}
            key="unselected"
            value={undefined}
          >
            Select a trading pair
          </option>
          {tradingPairs.map((pair) => (
            <option
              className={clsx(
                'TradingPairSettingsRow__option',
                classNames?.option,
              )}
              key={pair}
              value={pair}
            >
              {pair}
            </option>
          ))}
        </select>
      </div>
      <div
        className={clsx(
          'TradingPairSettingsRow__buttonContainer',
          classNames?.buttonContainer,
        )}
      >
        <button
          className={clsx(
            'TradingPairSettingsRow__radioButton',
            classNames?.radioButton,
            { TradingPairSettingsRow__radioSelected: above },
          )}
          onClick={() => setAbove(true)}
        >
          Above
        </button>
        <button
          className={clsx(
            'TradingPairSettingsRow__radioButton',
            classNames?.radioButton,
            { TradingPairSettingsRow__radioSelected: !above },
          )}
          onClick={() => setAbove(false)}
        >
          Below
        </button>
      </div>
      <div
        className={clsx(
          'TradingPairSettingsRow__priceInputContainer',
          classNames?.priceInputContainer,
        )}
      >
        <input
          className={clsx(
            'TradingPairSettingsRow__priceInput',
            classNames?.priceInput,
          )}
          name="notifi-tradingpair-price"
          type="number"
          inputMode="decimal"
          value={price}
          onChange={(e) => {
            setPrice(e.target.valueAsNumber);
          }}
        />
      </div>
      <button
        className={clsx(
          'TradingPairSettingsRow__saveButton',
          classNames?.saveButton,
        )}
        disabled={selectedPair === undefined}
        onClick={async () => {
          if (selectedPair !== undefined) {
            const alertConfiguration = tradingPairConfiguration({
              tradingPair: selectedPair,
              above,
              price,
            });

            const now = new Date().toISOString();

            const alertName = `${config.name}:;:${now}:;:${selectedPair}:;:${
              above ? 'above' : 'below'
            }:;:${price}`;

            await instantSubscribe({
              alertName,
              alertConfiguration,
            });

            setSelectedPair(undefined);
            setAbove(true);
            setPrice(0.0);
            onSave();
          }
        }}
      >
        Save
      </button>
    </div>
  );
};
