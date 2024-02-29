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
  | 'check'
  | 'edit-icon'
  | 'close-icon'
  // TODO: Radial background MVP-4112
  | 'lightbulb-orange'
  | 'email-close'
  | 'bell-red';

/**
 * It takes an icon id and returns an svg element with the corresponding icon defined in /public/icons/sprite.svg.
 */
export const Icon: FunctionComponent<
  SVGAttributes<HTMLOrSVGElement> & {
    id: SpriteIconId;
    // label?: string;
    className?: string;
  }
> = (props) => {
  const { id, /*label,*/ ...rest } = props;
  return (
    <>
      <svg width="24" height="24" {...rest}>
        <use href={`/icons/sprite.svg#${id}`} />
      </svg>
      {/* {label && <span className="sr-only">{label}</span>} */}
    </>
  );
};
