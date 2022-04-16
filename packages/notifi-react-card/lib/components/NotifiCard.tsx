import React from 'react';
import { useNotifiStyleContext } from '../context';

export const NotifiCard: React.FC = ({ children }) => {
  const { card } = useNotifiStyleContext();
  return <div className={card?.container}>{children}</div>;
};
