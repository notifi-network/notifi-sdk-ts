import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import type { Types } from '@notifi-network/notifi-graphql';
import { z } from 'zod';

import type { NotifiMcpServerContext } from '../server';
import { redactErrorMessage } from '../utils/errors';

/**
 * All supported blockchain identifiers accepted by the Notifi API.
 * Kept in sync with `Types.BlockchainType` from `@notifi-network/notifi-graphql`.
 *
 * TODO: Replace this local list with a shared runtime export from
 * `@notifi-network/notifi-graphql` (or another shared package) so MCP does not
 * need to maintain its own zod enum source.
 */
const BLOCKCHAIN_VALUES = [
  'ABSTRACT',
  'ACALA',
  'AGORIC',
  'APTOS',
  'ARBITRUM',
  'ARCH',
  'ARCHWAY',
  'AVALANCHE',
  'AXELAR',
  'BASE',
  'BERACHAIN',
  'BINANCE',
  'BITCOIN',
  'BLAST',
  'BOB',
  'BOTANIX',
  'CARDANO',
  'CELESTIA',
  'CELO',
  'CORE_BLOCKCHAIN_MAINNET',
  'COSMOS',
  'DYDX',
  'DYMENSION',
  'ELYS',
  'ETHEREUM',
  'EVMOS',
  'GOAT_NETWORK',
  'HEMI',
  'HYPEREVM',
  'INJECTIVE',
  'INK',
  'KAVA',
  'LINEA',
  'MANTA',
  'MANTLE',
  'MONAD',
  'MOVEMENT',
  'NEAR',
  'NEUTRON',
  'NIBIRU',
  'NIBURU_CATACLYSM1',
  'OFF_CHAIN',
  'OPTIMISM',
  'ORAI',
  'OSMOSIS',
  'PERSISTENCE',
  'POLYGON',
  'ROME',
  'SCROLL',
  'SEI',
  'SOLANA',
  'SONIC',
  'SUI',
  'SWELLCHAIN',
  'THE_ROOT_NETWORK',
  'UNICHAIN',
  'UNSPECIFIED',
  'XION',
  'ZKSYNC',
] as const satisfies readonly Types.BlockchainType[];

const blockchainTypeSchema = z.enum(BLOCKCHAIN_VALUES);

export const registerPublishFusionMessage = (
  server: McpServer,
  context: NotifiMcpServerContext,
): void => {
  server.tool(
    'publish_fusion_message',
    'Publish a notification to Notifi subscribers via a fusion event. The variablesJson payload is passed directly to the Notifi template engine — consult the tenant config or Notifi docs for the expected shape.',
    {
      eventTypeId: z
        .string()
        .describe('The fusion event type ID to publish to'),
      variablesJson: z
        .record(z.unknown())
        .describe(
          'Template variables object passed directly to the Notifi rendering engine. Shape depends on the topic template (e.g. CommunityManagerVariablesJsonPayload).',
        ),
      targetWallets: z
        .array(
          z.object({
            walletPublicKey: z
              .string()
              .describe('Public key or address of the target wallet'),
            walletBlockchain: blockchainTypeSchema.describe(
              'Blockchain identifier for the wallet',
            ),
          }),
        )
        .optional()
        .describe(
          'Optional list of specific wallets to target. If omitted, all subscribers to the event receive the notification.',
        ),
      idempotencyKey: z
        .string()
        .optional()
        .describe(
          'Optional deduplication key. Duplicate messages with the same key are silently dropped. Recommended: use a UUID.',
        ),
    },
    async ({ eventTypeId, variablesJson, targetWallets, idempotencyKey }) => {
      try {
        const fusionMessage = {
          eventTypeId,
          variablesJson,
          ...(idempotencyKey !== undefined && { idempotencyKey }),
          ...(targetWallets !== undefined && {
            specificWallets: targetWallets.map((w) => ({
              walletPublicKey: w.walletPublicKey,
              walletBlockchain: w.walletBlockchain as Types.BlockchainType,
            })),
          }),
        };

        const response = await context.client.runWithAuthRetry(() =>
          context.client.nodeClient.publishFusionMessage([fusionMessage]),
        );

        return {
          content: [
            {
              type: 'text' as const,
              text: JSON.stringify(
                {
                  success: true,
                  indexToResultIdMap: response.indexToResultIdMap,
                },
                null,
                2,
              ),
            },
          ],
        };
      } catch (error) {
        return {
          isError: true,
          content: [
            {
              type: 'text' as const,
              text: `Failed to publish fusion message: ${redactErrorMessage(error)}`,
            },
          ],
        };
      }
    },
  );
};
