import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';

import type { NotifiMcpServerContext } from '../server';
import { redactErrorMessage } from '../utils/errors';

export const registerGetActiveAlerts = (
  server: McpServer,
  context: NotifiMcpServerContext,
): void => {
  server.tool(
    'get_active_alerts',
    'Retrieve a paginated list of active alert subscriptions for a given fusion event. Returns subscriber wallet info, filter options, and pagination cursors.',
    {
      fusionEventId: z
        .string()
        .describe('The fusion event ID to query alerts for'),
      first: z
        .number()
        .int()
        .positive()
        .optional()
        .describe('Maximum number of alerts to return (page size)'),
      after: z
        .string()
        .optional()
        .describe(
          'Pagination cursor — pass the endCursor from a previous page to fetch the next page',
        ),
    },
    async ({ fusionEventId, first, after }) => {
      try {
        const connection = await context.client.runWithAuthRetry(() =>
          context.client.nodeClient.getActiveAlerts({
            fusionEventId,
            first: first ?? undefined,
            after: after ?? undefined,
          }),
        );

        const alerts = (connection?.nodes ?? [])
          .filter((n): n is NonNullable<typeof n> => n !== undefined)
          .map((alert) => ({
            id: alert.id ?? null,
            fusionEventId: alert.fusionEventId ?? null,
            subscriptionValue: alert.subscriptionValue ?? null,
            filterOptionsJson: alert.filterOptionsJson ?? null,
            user: {
              id: alert.user.id,
              connectedWallets: (alert.user.connectedWallets ?? [])
                .filter((w): w is NonNullable<typeof w> => w !== undefined)
                .map((w) => ({
                  address: w.address ?? null,
                  walletBlockchain: w.walletBlockchain,
                })),
            },
          }));

        const pageInfo = connection?.pageInfo ?? {
          hasNextPage: false,
          endCursor: null,
        };

        return {
          content: [
            {
              type: 'text' as const,
              text: JSON.stringify(
                {
                  alerts,
                  pageInfo: {
                    hasNextPage: pageInfo.hasNextPage,
                    endCursor: pageInfo.endCursor ?? null,
                  },
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
              text: `Failed to fetch active alerts: ${redactErrorMessage(error)}`,
            },
          ],
        };
      }
    },
  );
};
