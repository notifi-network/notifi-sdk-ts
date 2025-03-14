import { Types } from '@notifi-network/notifi-graphql';
import { FunctionComponent, SVGAttributes } from 'react';

// eslint-disable-line no-restricted-imports

// TODO: Create auto generated types for all the icons in the sprite.svg
export type SpriteIconId =
  | Types.GenericEventIconHint
  | 'warning'
  | 'inbox'
  | 'destinations'
  | 'config'
  | 'user-protrait'
  | 'loading'
  | 'left-arrow'
  | 'right-arrow'
  | 'email-icon'
  | 'slack-icon'
  | 'telegram-icon'
  | 'discord-icon'
  | 'wallet-icon'
  | 'check'
  | 'info'
  | 'edit-icon'
  | 'close-icon'
  | 'btn-nav'
  | 'leave'
  | 'copy-btn'
  | 'trash-btn'
  | 'dropdown-arrow'
  | 'banner-bell';

/**
 * It takes an icon id and returns an svg element with the corresponding icon defined in /public/icons/sprite.svg.
 */
export const Icon: FunctionComponent<
  SVGAttributes<HTMLOrSVGElement> & {
    id: SpriteIconId;
    className?: string;
  }
> = (props) => {
  const { id, ...rest } = props;
  return (
    <svg width="24" height="24" {...rest}>
      <use href={`/icons/sprite.svg#${id}`} />
    </svg>
  );
};
