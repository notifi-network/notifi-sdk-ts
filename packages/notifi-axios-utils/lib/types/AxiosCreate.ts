import { AxiosStatic } from 'axios';

export type AxiosCreate = Readonly<{
  create: AxiosStatic['create'];
}>;
