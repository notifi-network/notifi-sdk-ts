import { useNotifiStyleContext } from '../context';
import React from 'react';

export const NotifiCard: React.FC = ({ children }) => {
  const { card } = useNotifiStyleContext();
  return <div className={card?.container}>{children}</div>;
};
