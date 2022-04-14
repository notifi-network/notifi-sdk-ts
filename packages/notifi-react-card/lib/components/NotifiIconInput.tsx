import { useNotifiStyleContext } from '../context';
import React from 'react';

type Props = {
  icon: React.ReactNode;
} & React.InputHTMLAttributes<HTMLInputElement>;

export const NotifiIconInput: React.FC<Props> = ({
  icon,
  ...inputProps
}: Props) => {
  const { iconInput: styles } = useNotifiStyleContext();

  return (
    <div className={styles?.container}>
      <span className={styles?.iconSpan}>{icon}</span>
      <input className={styles?.input} {...inputProps} />
    </div>
  );
};
