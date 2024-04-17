import React from 'react';

import { useGlobalStateContext } from '../context/GlobalStateContext';

export type ErrorGlobalProps = {
  copy?: {
    header: string;
  };
};

export const ErrorGlobal: React.FC<ErrorGlobalProps> = ({ copy }) => {
  const { globalError } = useGlobalStateContext();
  // TODO: Confirm style and impl
  return (
    <div>
      {copy?.header ? <h1>{copy.header}</h1> : null}
      <h1>Error ...</h1>
      <div>{globalError?.errorData ? globalError?.errorData : null}</div>
    </div>
  );
};
