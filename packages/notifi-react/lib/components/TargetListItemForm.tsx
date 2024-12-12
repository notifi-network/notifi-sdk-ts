// import clsx from 'clsx';
// import React from 'react';

// import { Icon, IconType } from '../assets/Icons';
// import { FormTarget, TargetInfo, useNotifiTargetContext } from '../context';
// import {
//   getTargetValidateRegex,
//   isTargetCta,
//   isTargetVerified,
// } from '../utils';
// import { PostCta, TargetCta, TargetCtaProps } from './TargetCta';
// import { TargetInputField } from './TargetInputField';
// import { TargetListItemProps } from './TargetListItem';

// // TODO: confirm the cross import between this component and TargetListItem causes no issues
// type TargetListItemFormProps = TargetListItemProps;

// export const TargetListItemForm: React.FC<TargetListItemFormProps> = (
//   props,
// ) => {
//   const {
//     targetDocument: { targetData, targetInputs },
//     renewTargetGroup,
//     updateTargetInputs,
//   } = useNotifiTargetContext();
//   return (
//     <div
//       className={clsx(
//         'notifi-target-list-item',
//         props.classNames?.targetListItem,
//         // NOTE: only used when we want to adopt different style for verified items
//         isTargetVerified(props.targetInfo?.infoPrompt) &&
//           props.classNames?.targetListVerifiedItem,
//       )}
//     >
//       <div
//         className={clsx(
//           'notifi-target-list-item-target',
//           props.classNames?.targetListItemTarget,
//         )}
//       >
//         <Icon
//           type={props.iconType}
//           className={clsx('notifi-target-list-icon', props.classNames?.icon)}
//         />
//         <div
//           className={clsx(
//             'notifi-target-list-item-target-id',
//             props.classNames?.targetId,
//           )}
//         >
//           {/** TODO: Move to use memo once the target display id > 1 format */}
//           {targetData[props.target]}
//         </div>
//         {/* TODO */}
//         {!props.targetInfo ? (
//           <>
//             <label>{props.label}</label>{' '}
//             <TargetInputField
//               targetType={props.target}
//               validateRegex={getTargetValidateRegex(props.target)}
//             />
//           </>
//         ) : null}
//       </div>
//       {/* TODO: impl after verify message for form targets */}
//       {props.message?.beforeVerify &&
//       isTargetCta(props.targetInfo?.infoPrompt) ? (
//         <div
//           className={clsx(
//             'notifi-target-list-target-verify-message',
//             props.classNames?.verifyMessage,
//           )}
//         >
//           {props.message.beforeVerify}
//         </div>
//       ) : null}

//       {props.targetInfo ? (
//         <TargetCta
//           type={props.targetCtaType}
//           targetInfoPrompt={props.targetInfo.infoPrompt}
//           classNames={props.classNames?.TargetCta}
//           postCta={props.postCta}
//         />
//       ) : (
//         <>
//           {!targetInputs[props.target].error &&
//           targetInputs[props.target].value ? (
//             <TargetCta {...props.signupCtaProps} />
//           ) : null}
//         </>
//       )}
//       {props.isRemoveButtonAvailable ? (
//         <TargetListItemAction
//           action={async () => {
//             const target = props.target as FormTarget;
//             updateTargetInputs(target, { value: '' });
//             renewTargetGroup({
//               target: target,
//               value: '',
//             });
//           }}
//           classNames={{ removeCta: props.classNames?.removeCta }}
//         />
//       ) : null}
//     </div>
//   );
// };

// // TODO: extract to component, maybe rename to TargetListItemRemoveButton
// type TargetListItemActionProps = {
//   action: () => Promise<void>;
//   classNames?: {
//     removeCta?: string;
//   };
//   actionText?: string;
// };

// export const TargetListItemAction: React.FC<TargetListItemActionProps> = (
//   props,
// ) => {
//   return (
//     <div
//       className={clsx(
//         'notifi-target-list-item-remove',
//         props.classNames?.removeCta,
//       )}
//       onClick={props.action}
//     >
//       {props.actionText ?? 'Remove'}
//     </div>
//   );
// };
