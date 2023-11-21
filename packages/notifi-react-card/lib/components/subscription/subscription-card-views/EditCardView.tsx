import { CardConfigItem } from '@notifi-network/notifi-frontend-client';
import clsx from 'clsx';
import { DeepPartialReadonly } from 'notifi-react-card/lib/utils';
import React from 'react';

import { useNotifiSubscriptionContext } from '../../../context/NotifiSubscriptionContext';
import Spinner from '../../common/Spinner';
import {
  NotifiSubscribeButton,
  NotifiSubscribeButtonProps,
} from '../NotifiSubscribeButton';
import {
  NotifiInputFieldsText,
  NotifiInputSeparators,
} from '../NotifiSubscriptionCard';
import { NotifiSubscribeButtonV2 } from '../v2/NotifiSubscribeButtonV2';
import { TopicListPreview } from '../v2/TopicListPreview';
import { AlertListPreview, AlertListPreviewProps } from './AlertListPreview';
import { InputFields, InputFieldsProps } from './InputFields';

export type EditCardViewProps = Readonly<{
  buttonText: string;
  data: CardConfigItem;
  inputDisabled: boolean;
  showPreview?: boolean;
  copy?: Readonly<{
    AlertListPreview?: AlertListPreviewProps['copy'];
  }>;
  classNames?: Readonly<{
    AlertListPreview?: AlertListPreviewProps['classNames'];
    NotifiInputContainer?: string;
    InputFields?: DeepPartialReadonly<InputFieldsProps['classNames']>;
    NotifiSubscribeButton?: NotifiSubscribeButtonProps['classNames'];
    NotifiInputHeading?: string;
  }>;
  inputSeparators?: NotifiInputSeparators;
  inputTextFields?: NotifiInputFieldsText;
  allowedCountryCodes: string[];
  inputs: Record<string, unknown>;
}>;

export const EditCardView: React.FC<EditCardViewProps> = ({
  allowedCountryCodes,
  buttonText,
  copy,
  classNames,
  showPreview,
  data,
  inputDisabled,
  inputSeparators,
  inputTextFields,
  inputs,
}) => {
  const { loading } = useNotifiSubscriptionContext();

  return (
    <div
      className={clsx('NotifiInputContainer', classNames?.NotifiInputContainer)}
    >
      {/* TODO: Refactor */}
      {showPreview && data.version === 'v1' ? (
        <AlertListPreview
          copy={copy?.AlertListPreview}
          classNames={classNames?.AlertListPreview}
          eventTypes={data.eventTypes}
        />
      ) : null}
      {showPreview && data.version === 'v2' ? (
        <TopicListPreview
          copy={copy?.AlertListPreview}
          classNames={classNames?.AlertListPreview}
          eventTypes={data.topicTypes}
        />
      ) : null}
      {loading ? (
        <div className="NotifiInputContainer__LoadingSpinner">
          <Spinner size="70px" />
        </div>
      ) : (
        <InputFields
          hideContactInputs={showPreview && !data.isContactInfoRequired}
          data={data}
          allowedCountryCodes={allowedCountryCodes}
          inputDisabled={inputDisabled}
          inputSeparators={inputSeparators}
          inputTextFields={inputTextFields}
        />
      )}
      {data.version === 'v1' ? (
        <NotifiSubscribeButton
          buttonText={buttonText}
          data={data}
          classNames={classNames?.NotifiSubscribeButton}
          inputs={inputs}
        />
      ) : null}
      {data.version === 'v2' ? (
        <NotifiSubscribeButtonV2
          buttonText={buttonText}
          data={data}
          classNames={classNames?.NotifiSubscribeButton}
          inputs={inputs}
        />
      ) : null}
    </div>
  );
};
