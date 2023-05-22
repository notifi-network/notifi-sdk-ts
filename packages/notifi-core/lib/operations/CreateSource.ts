import { Types } from '@notifi-network/notifi-graphql';

import { Operation } from '../models';

/**
 * Input param for creating a Source
 *
 * @remarks
 * This describes the values to use for Source
 *
 * @property name - Unique friendly name of Source
 * @property blockchainAddress - The Source blockchain address where events are coming from
 * @property type - The Source type of blockchainAddress
 * <br>
 * <br>
 * See [Alert Creation Guide]{@link https://docs.notifi.network} for more information on creating Alerts
 */

// TODO: Finally will be deprecated and replaced with automatically generated types
export type CreateSourceInput = Types.CreateSourceInput;

export type CreateSourceResult = Types.SourceFragmentFragment;

export type CreateSourceService = Readonly<{
  createSource: Operation<Types.CreateSourceInput, CreateSourceResult>;
}>;
