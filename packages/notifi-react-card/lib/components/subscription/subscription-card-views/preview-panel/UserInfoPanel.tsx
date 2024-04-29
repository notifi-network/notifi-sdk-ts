import clsx from 'clsx';
import { PenIcon } from 'notifi-react-card/lib/assets/PenIcon';
import React, { useCallback, useMemo, useState } from 'react';

import {
  useNotifiClientContext,
  useNotifiSubscriptionContext,
} from '../../../../context';
import { CardConfigItemV1 } from '../../../../hooks';
import { DeepPartialReadonly } from '../../../../utils';
import { DestinationErrorMessage } from './DestinationErrorMessage';

export type UserInfoSection = {
  container: string;
  label: string;
  confirmationLink: string;
  confirmationLabel: string;
  errorMessageContainer: string;
  errorMessage: string;
  tooltipContent: string;
};

export type UserInfoPanelProps = {
  classNames?: DeepPartialReadonly<{
    alertHistory: string;
    container: string;
    email?: UserInfoSection;
    telegram?: UserInfoSection;
    discord?: UserInfoSection;
    sms?: UserInfoSection;
    EditButton: string;
    myWallet?: UserInfoSection;
    web3?: UserInfoSection;
  }>;
  contactInfo: CardConfigItemV1['contactInfo'];
  confirmationLabels?: {
    email?: string;
    telegram?: string;
  };
};
export const UserInfoPanel: React.FC<UserInfoPanelProps> = ({
  classNames,
  contactInfo,
  confirmationLabels,
}) => {
  const [isEmailConfirmationSent, setIsEmailConfirmationSent] =
    useState<boolean>(false);

  const {
    phoneNumber,
    email,
    telegramId,
    setCardView,
    destinationErrorMessages,
    useDiscord,
    useWeb3,
    discordTargetData,
  } = useNotifiSubscriptionContext();

  const {
    params: { multiWallet },
  } = useNotifiClientContext();

  const handleEditClick = useCallback(() => {
    setCardView({ state: 'edit' });
  }, [setCardView, phoneNumber, email, telegramId]);

  const {
    telegram: telegramErrorMessage,
    email: emailErrorMessage,
    phoneNumber: phoneNumberErrorMessage,
    discord: discordErrrorMessage,
    web3: web3ErrorMessage,
  } = destinationErrorMessages;

  const handleResendEmailVerificationClick = useCallback(() => {
    if (emailErrorMessage?.type !== 'recoverableError') return;
    setIsEmailConfirmationSent(true);
    emailErrorMessage.onClick();
    setTimeout(() => setIsEmailConfirmationSent(false), 3000);
  }, [emailErrorMessage]);

  const discordUserName = useMemo(() => {
    const { username, discriminator } = discordTargetData || {};

    return discriminator === '0' ? username : `${username}#${discriminator}`;
  }, [discordTargetData]);

  return (
    <div
      className={clsx('NotifiUserInfoPanelContainer', classNames?.container)}
    >
      {contactInfo.email.active && email ? (
        <div
          className={clsx(
            'NotifiUserInfoPanel__email',
            classNames?.email?.container,
          )}
        >
          <label
            className={clsx(
              'NotifiUserInfoPanel__emailLabel',
              classNames?.email?.label,
            )}
          >
            {email}
          </label>
          {emailErrorMessage?.type === 'recoverableError' ? (
            <DestinationErrorMessage
              classNames={{
                errorMessage: clsx(classNames?.email?.errorMessage, {
                  DestinationError__emailConfirmationSent:
                    isEmailConfirmationSent,
                }),
                errorMessageContainer: classNames?.email?.errorMessageContainer,
                tooltipContent: classNames?.email?.tooltipContent,
              }}
              onClick={() => handleResendEmailVerificationClick()}
              errorMessage={
                isEmailConfirmationSent ? 'Sent' : emailErrorMessage.message
              }
              tooltipContent={emailErrorMessage?.tooltip}
            />
          ) : null}
        </div>
      ) : null}
      {contactInfo.sms.active && phoneNumber ? (
        <div
          className={clsx(
            'NotifiUserInfoPanel__sms',
            classNames?.sms?.container,
          )}
        >
          <label
            className={clsx(
              'NotifiUserInfoPanel__smsLabel',
              classNames?.sms?.label,
            )}
          >
            {phoneNumber}
          </label>

          {phoneNumberErrorMessage?.type !== undefined ? (
            <DestinationErrorMessage
              classNames={{
                errorMessage: classNames?.sms?.errorMessage,
                errorMessageContainer: classNames?.sms?.errorMessageContainer,
                tooltipContent: classNames?.sms?.tooltipContent,
              }}
              errorMessage={phoneNumberErrorMessage?.message}
              tooltipContent={phoneNumberErrorMessage?.tooltip}
            />
          ) : null}
        </div>
      ) : null}
      {contactInfo.telegram.active && telegramId ? (
        <div
          className={clsx(
            'NotifiUserInfoPanel__telegram',
            classNames?.telegram?.container,
          )}
        >
          <label
            className={clsx(
              'NotifiUserInfoPanel__telegramLabel',
              classNames?.telegram?.label,
            )}
          >
            {telegramId}
          </label>
          {telegramErrorMessage?.type === 'recoverableError' ? (
            <DestinationErrorMessage
              classNames={{
                errorMessage: clsx(
                  classNames?.telegram?.errorMessage,
                  classNames?.telegram?.confirmationLink,
                ),
                errorMessageContainer:
                  classNames?.telegram?.errorMessageContainer,
                tooltipContent: classNames?.telegram?.tooltipContent,
              }}
              onClick={() => {
                telegramErrorMessage?.onClick();
              }}
              errorMessage={
                telegramErrorMessage?.message ??
                confirmationLabels?.telegram ??
                ''
              }
              tooltipContent={destinationErrorMessages?.telegram?.tooltip}
            />
          ) : null}
        </div>
      ) : null}
      {contactInfo?.discord?.active && useDiscord ? (
        <div
          className={clsx(
            'NotifiUserInfoPanel__discord',
            classNames?.discord?.container,
          )}
        >
          <label
            className={clsx(
              'NotifiUserInfoPanel__discordLabel',
              classNames?.discord?.label,
            )}
          >
            {discordTargetData?.isConfirmed === true
              ? discordUserName
              : 'Discord'}
          </label>
          {discordErrrorMessage?.type === 'recoverableError' ? (
            <DestinationErrorMessage
              classNames={{
                errorMessage: clsx(
                  classNames?.discord?.errorMessage,
                  classNames?.discord?.confirmationLink,
                ),
                errorMessageContainer:
                  classNames?.discord?.errorMessageContainer,
                tooltipContent: classNames?.discord?.tooltipContent,
              }}
              onClick={() => {
                discordErrrorMessage?.onClick();
              }}
              errorMessage={
                discordErrrorMessage?.message ??
                confirmationLabels?.telegram ??
                ''
              }
              tooltipContent={destinationErrorMessages?.discord?.tooltip}
            />
          ) : null}
        </div>
      ) : null}
      {useWeb3 ? (
        <div
          className={clsx(
            'NotifiUserInfoPanel__discord',
            classNames?.web3?.container,
          )}
        >
          <label
            className={clsx(
              'NotifiUserInfoPanel__discordLabel',
              classNames?.web3?.label,
            )}
          >
            CBW
          </label>
          {web3ErrorMessage?.type === 'recoverableError' ? (
            <DestinationErrorMessage
              classNames={{
                errorMessage: clsx(
                  classNames?.web3?.errorMessage
                ),
                errorMessageContainer:
                  classNames?.web3?.errorMessageContainer,
                tooltipContent: classNames?.web3?.tooltipContent,
              }}
              onClick={() => {
                web3ErrorMessage?.onClick();
              }}
              errorMessage={
                web3ErrorMessage?.message ??
                ''
              }
              tooltipContent={destinationErrorMessages?.web3?.tooltip}
            />
          ) : null}
        </div>
      ) : null}

      {multiWallet !== undefined && multiWallet.ownedWallets.length > 0 ? (
        <div
          className={clsx(
            'NotifiUserInfoPanel__myWallet',
            classNames?.myWallet?.container,
          )}
        >
          <label
            className={clsx(
              'NotifiUserInfoPanel__myWalletLabel',
              classNames?.myWallet?.label,
            )}
          >
            My wallets
          </label>
          <button
            className={clsx(
              'NotifiUserInfoPanel__myWalletConfirmation',
              classNames?.myWallet?.confirmationLink,
            )}
            onClick={() => {
              setCardView({ state: 'verify' });
            }}
          >
            Edit
          </button>
        </div>
      ) : null}
      <button
        className={clsx(
          'NotifiPreviewCard__editButton',
          classNames?.EditButton,
        )}
        onClick={handleEditClick}
      >
        <PenIcon />
        Edit
      </button>
    </div>
  );
};
