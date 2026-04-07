/**
 * Ad-hoc test script: Verify that fetchTenantConfig returns the correct config
 * under all v1/v2 scenarios.
 *
 * Usage:
 *   npx tsx packages/notifi-frontend-client/scripts/testTenantConfig.ts
 *
 * Credentials are read from packages/notifi-frontend-client/scripts/.env
 * Copy .env.example to .env and fill in the values before running.
 *
 * Section 0  - Query raw dataJson from DB via tenant admin token; confirm both v1 & v2 are present
 * Scenario 1 - SDK version < 8.0.0 (current 7.x)  → BE returns v1 config
 * Scenario 2 - Spoofed X-Notifi-Client-Version: 8.0.0 → BE returns v2 config (pending BE deploy)
 * Scenario 2b- Missing X-Notifi-Client-Version header → BE returns v1 config
 * Scenario 3 - parseTenantConfig: single v1 object → CardConfigItemV1
 * Scenario 4 - parseTenantConfig: single v2 object → CardConfigItemV2
 * Scenario 5 - parseTenantConfig: [v1, v2] array   → expected throw
 */
import { arrayify } from '@ethersproject/bytes';
import * as dotenv from 'dotenv';
import { ethers } from 'ethers';
import { GraphQLClient, gql } from 'graphql-request';
import * as path from 'path';

import { NotifiFrontendClient } from '../lib/client/NotifiFrontendClient';
import {
  newNotifiService,
  newNotifiStorage,
} from '../lib/client/clientFactory';
import type { NotifiFrontendConfiguration } from '../lib/configuration';
import { envUrl } from '../lib/configuration/Env';
import { TenantConfigV2 } from '../lib/models/TenantConfig';
import { parseTenantConfig } from '../lib/utils/tenant';

dotenv.config({ path: path.resolve(__dirname, '.env') });

// ─── Config (loaded from scripts/.env) ───────────────────────────────────────
const TENANT_ID = process.env.TENANT_ID;
const CARD_ID = process.env.CARD_ID;
const TENANT_SID = process.env.TENANT_SID;
const TENANT_SECRET = process.env.TENANT_SECRET;

if (!TENANT_ID || !CARD_ID || !TENANT_SID || !TENANT_SECRET) {
  console.error(
    '❌  Missing required env vars. Copy scripts/.env.example to scripts/.env and fill in the values.',
  );
  process.exit(1);
}

const ENV = 'Production' as const;
const GQL_URL = envUrl(ENV, 'http'); // https://api.notifi.network/gql

// ─── Helpers ─────────────────────────────────────────────────────────────────
const pass = (msg: string) => console.log(`  ✅ PASS  ${msg}`);
const fail = (msg: string) => {
  console.error(`  ❌ FAIL  ${msg}`);
  process.exitCode = 1;
};
const info = (msg: string) => console.log(`  ℹ️  INFO  ${msg}`);
const warn = (msg: string) => console.log(`  ⚠️  WARN  ${msg}`);
const section = (title: string) =>
  console.log(`\n${'─'.repeat(60)}\n${title}\n${'─'.repeat(60)}`);

function assert(condition: boolean, message: string) {
  if (condition) pass(message);
  else fail(message);
}

// ─── Build a user-level NotifiFrontendClient (optionHeaders optional) ────────
function buildClient(
  walletAddress: string,
  optionHeaders?: Record<string, string>,
): NotifiFrontendClient {
  const config: NotifiFrontendConfiguration = {
    tenantId: TENANT_ID,
    env: ENV,
    walletBlockchain: 'ETHEREUM',
    walletPublicKey: walletAddress.toLowerCase(),
    storageOption: { driverType: 'InMemory' },
  };
  const service = newNotifiService(config, undefined, optionHeaders);
  const storage = newNotifiStorage(config);
  return new NotifiFrontendClient(config, service, storage);
}

// ─── GQL documents for Section 0 ─────────────────────────────────────────────
const LOG_IN_FROM_SERVICE = gql`
  mutation logInFromService($input: ServiceLogInInput!) {
    logInFromService(serviceLogInInput: $input) {
      token
      expiry
    }
  }
`;

const TENANT_CONFIGS_QUERY = gql`
  query CardConfig(
    $first: Int
    $after: String
    $type: TenantConfigType = SUBSCRIPTION_CARD
  ) {
    tenantConfigs(
      first: $first
      after: $after
      getTenantConfigInput: { type: $type }
    ) {
      nodes {
        id
        type
        dataJson
        __typename
      }
      pageInfo {
        hasNextPage
        endCursor
        __typename
      }
      __typename
    }
  }
`;

// ─── Section 0: Query all tenant configs via admin token ──────────────────────
async function checkTenantConfigsInDB(): Promise<void> {
  section('Section 0 │ DB raw dataJson check (tenant admin token)');

  const gqlClient = new GraphQLClient(GQL_URL);

  // Step 1: logInFromService → obtain admin token
  const loginResult: any = await gqlClient.request(LOG_IN_FROM_SERVICE, {
    input: { sid: TENANT_SID, secret: TENANT_SECRET },
  });
  const adminToken: string = loginResult?.logInFromService?.token;
  if (!adminToken)
    throw new Error('Failed to get admin token from logInFromService');
  info(
    `Admin token obtained (expiry: ${loginResult?.logInFromService?.expiry})`,
  );

  // Step 2: Query tenantConfigs with admin token
  gqlClient.setHeader('Authorization', `Bearer ${adminToken}`);
  const configsResult: any = await gqlClient.request(TENANT_CONFIGS_QUERY, {
    type: 'SUBSCRIPTION_CARD',
  });

  const nodes: Array<{ id: string; type: string; dataJson: string }> =
    configsResult?.tenantConfigs?.nodes ?? [];

  console.log(
    `\n  This tenant has ${nodes.length} SUBSCRIPTION_CARD config(s):`,
  );
  for (const node of nodes) {
    let summary = '';
    try {
      const parsed = JSON.parse(node.dataJson);
      if (Array.isArray(parsed)) {
        const versions = parsed.map((x: any) => x.version).join(', ');
        summary = `[Array] length=${parsed.length}, versions=[${versions}]`;
      } else {
        summary = `[Object] version=${parsed.version}`;
      }
    } catch {
      summary = '(unparseable)';
    }
    const marker = node.id === CARD_ID ? ' ← target card' : '';
    console.log(`    - id: ${node.id}${marker}`);
    console.log(`      dataJson: ${summary}`);
  }

  // Step 3: Assert target CARD_ID contains both v1 & v2
  const targetNode = nodes.find((n) => n.id === CARD_ID);
  if (!targetNode) {
    fail(`Target CARD_ID (${CARD_ID}) not found in tenantConfigs`);
    return;
  }

  let targetParsed: any;
  try {
    targetParsed = JSON.parse(targetNode.dataJson);
  } catch {
    fail(`Failed to parse dataJson of target card`);
    return;
  }

  if (Array.isArray(targetParsed)) {
    const versions: string[] = targetParsed.map((x: any) => x.version);
    assert(versions.includes('v1'), `dataJson array contains v1`);
    assert(versions.includes('v2'), `dataJson array contains v2`);
  } else {
    warn(
      `Target card dataJson is a single object (version=${targetParsed.version}). ` +
        `Admin Portal has not saved yet — DB only has one version.`,
    );
  }
}

// ─── Main ─────────────────────────────────────────────────────────────────────
async function main() {
  console.log('🚀 testTenantConfig.ts starting');
  console.log(`   Tenant  : ${TENANT_ID}`);
  console.log(`   CardId  : ${CARD_ID}`);
  console.log(`   Env     : ${ENV}`);
  console.log(`   GQL URL : ${GQL_URL}`);

  // ══════════════════════════════════════════════════════════════════
  // Section 0: Confirm raw dataJson in DB (tenant admin)
  // ══════════════════════════════════════════════════════════════════
  await checkTenantConfigsInDB();

  // Create a random ephemeral EVM wallet (used only for user login)
  const wallet = ethers.Wallet.createRandom();
  console.log(`\n   Wallet  : ${wallet.address} (random, ephemeral)`);

  const signMessage = async (message: Uint8Array): Promise<Uint8Array> => {
    const signature = await wallet.signMessage(message);
    return arrayify(signature);
  };

  // ══════════════════════════════════════════════════════════════════
  // Scenario 1: SDK 7.6.0 (default header) → BE should return v1
  // ══════════════════════════════════════════════════════════════════
  section('Scenario 1 │ X-Notifi-Client-Version: 7.6.0 → expect v1');

  const clientV1 = buildClient(wallet.address);
  await clientV1.auth.logIn({ signMessage, walletBlockchain: 'ETHEREUM' });
  console.log('  Logged in ✓');

  const resultV1 = await clientV1.fetchTenantConfig({
    id: CARD_ID,
    type: 'SUBSCRIPTION_CARD',
  });

  console.log(`\n  cardConfig.version : ${resultV1.cardConfig.version}`);
  console.log(`  cardConfig.id      : ${resultV1.cardConfig.id}`);
  console.log(`  cardConfig.name    : ${resultV1.cardConfig.name}`);
  console.log(
    `  eventTypes.length  : ${resultV1.cardConfig.eventTypes.length}`,
  );
  console.log(
    `  fusionEventTopics  : ${resultV1.fusionEventTopics.length} items`,
  );

  assert(
    resultV1.cardConfig.version === 'v1',
    `cardConfig.version === 'v1' (got: ${resultV1.cardConfig.version})`,
  );
  assert(resultV1.cardConfig.id === CARD_ID, `cardConfig.id is correct`);
  assert(resultV1.cardConfig.eventTypes.length > 0, `eventTypes is not empty`);
  assert(
    resultV1.fusionEventTopics.length > 0,
    `fusionEventTopics is not empty`,
  );

  // v1 fusionEventId must be a ValueOrRef structure: { type: 'value', value: '...' }
  const v1FusionTopic = resultV1.fusionEventTopics.find(
    (t) => t.uiConfig.type === 'fusion',
  );
  if (v1FusionTopic) {
    const feid = (v1FusionTopic.uiConfig as any).fusionEventId;
    assert(
      typeof feid === 'object' && feid?.type === 'value',
      `v1 fusionEventId is a ValueOrRef structure (got: ${JSON.stringify(feid)})`,
    );
  }

  // ══════════════════════════════════════════════════════════════════
  // Scenario 2: Spoofed 8.0.0 header → BE should return v2
  // (Pending BE deployment of version-header routing logic)
  // ══════════════════════════════════════════════════════════════════
  section('Scenario 2 │ X-Notifi-Client-Version: 8.0.0 (spoofed) → expect v2');

  const clientV2 = buildClient(wallet.address, {
    'X-Notifi-Client-Version': '8.0.0',
  });
  await clientV2.auth.logIn({ signMessage, walletBlockchain: 'ETHEREUM' });
  console.log('  Logged in ✓');

  const resultV2 = await clientV2.fetchTenantConfig({
    id: CARD_ID,
    type: 'SUBSCRIPTION_CARD',
  });

  console.log(`\n  cardConfig.version : ${resultV2.cardConfig.version}`);
  console.log(`  cardConfig.id      : ${resultV2.cardConfig.id}`);
  console.log(`  cardConfig.name    : ${resultV2.cardConfig.name}`);
  console.log(
    `  eventTypes.length  : ${resultV2.cardConfig.eventTypes.length}`,
  );
  console.log(
    `  fusionEventTopics  : ${resultV2.fusionEventTopics.length} items`,
  );

  const isV2 = resultV2.cardConfig.version === 'v2';
  assert(
    isV2,
    `cardConfig.version === 'v2' (got: ${resultV2.cardConfig.version})`,
  );
  assert(resultV2.cardConfig.id === CARD_ID, `cardConfig.id is correct`);
  assert(resultV2.cardConfig.eventTypes.length > 0, `eventTypes is not empty`);
  assert(
    resultV2.fusionEventTopics.length > 0,
    `fusionEventTopics is not empty`,
  );

  if (isV2) {
    // v2 fusionEventId must be a plain string
    const v2FusionTopic = (
      resultV2 as TenantConfigV2
    ).cardConfig.eventTypes.find((e) => e.type === 'fusion');
    if (v2FusionTopic && v2FusionTopic.type === 'fusion') {
      assert(
        typeof v2FusionTopic.fusionEventId === 'string',
        `v2 fusionEventId is a plain string (got: ${JSON.stringify(v2FusionTopic.fusionEventId)})`,
      );
    }
  } else {
    info(
      'BE version-header routing not yet deployed (still returning v1); S2 cannot pass yet',
    );
  }

  // ══════════════════════════════════════════════════════════════════
  // Scenario 2b: Missing X-Notifi-Client-Version header → BE should return v1
  //
  // The SDK's NotifiService._requestHeaders() always injects this header, so
  // "missing header" cannot happen through the SDK. This scenario is simulated
  // using a raw graphql-request client with no version header — representing
  // external callers that hit the GQL endpoint directly (e.g. cardIdValidation.ts).
  // ══════════════════════════════════════════════════════════════════
  section('Scenario 2b │ Missing X-Notifi-Client-Version header → expect v1');

  {
    // Reuse the auth token from the already-logged-in clientV1
    const userState = clientV1.auth.userState;
    const userToken =
      userState?.status === 'authenticated' || userState?.status === 'expired'
        ? userState.authorization.token
        : undefined;
    if (!userToken) {
      fail('Could not obtain user token; skipping this scenario');
    } else {
      const FIND_TENANT_CONFIG = gql`
        query findTenantConfig($input: FindTenantConfigInput!) {
          findTenantConfig(findTenantConfigInput: $input) {
            id
            type
            dataJson
          }
        }
      `;

      // Raw GQL client with no X-Notifi-Client-Version header
      const rawClient = new GraphQLClient(GQL_URL, {
        headers: {
          Authorization: `Bearer ${userToken}`,
          // Intentionally omitting X-Notifi-Client-Version
        },
      });

      const rawResult: any = await rawClient.request(FIND_TENANT_CONFIG, {
        input: { id: CARD_ID, type: 'SUBSCRIPTION_CARD', tenant: TENANT_ID },
      });

      const rawDataJson = rawResult?.findTenantConfig?.dataJson ?? '(empty)';
      let rawParsed: any;
      try {
        rawParsed = JSON.parse(rawDataJson);
      } catch {
        fail('Failed to parse raw dataJson');
      }

      if (rawParsed) {
        console.log(
          `\n  raw dataJson structure: ${
            Array.isArray(rawParsed)
              ? `[Array] versions=[${rawParsed.map((x: any) => x.version).join(', ')}]`
              : `[Object] version=${rawParsed.version}`
          }`,
        );
        assert(
          !Array.isArray(rawParsed) && rawParsed.version === 'v1',
          `missing header → BE returns v1 (got: ${Array.isArray(rawParsed) ? '[Array]' : rawParsed.version})`,
        );
      }
    }
  }

  // ══════════════════════════════════════════════════════════════════
  // Scenario 3: parseTenantConfig — single v1 object
  // Simulates: legacy tenant that never saved in AP; BE returns a v1 single object
  // ══════════════════════════════════════════════════════════════════
  section(
    'Scenario 3 │ parseTenantConfig — single v1 object → expect CardConfigItemV1',
  );

  const singleV1Json = JSON.stringify({
    version: 'v1',
    id: CARD_ID,
    name: 'inj-card',
    eventTypes: [
      {
        type: 'fusion',
        name: 'DP fusion prod',
        tooltipContent: '',
        selectedUIType: 'TOGGLE',
        fusionEventId: {
          type: 'value',
          value: '6adcfb7e1a034b7ea40b16adbcbdd59b',
        },
        sourceAddress: { type: 'value', value: '*' },
        useCustomIcon: false,
      },
    ],
    inputs: [],
    contactInfo: {
      email: { active: true },
      sms: { active: false, supportedCountryCodes: [] },
      telegram: { active: true },
      discord: { active: true },
      slack: { active: false },
      wallet: { active: true },
      browser: { active: false },
    },
    titles: { active: false },
    isContactInfoRequired: true,
  });

  try {
    const s3Result = parseTenantConfig(singleV1Json);
    assert(
      s3Result.version === 'v1',
      `version === 'v1' (got: ${s3Result.version})`,
    );
    assert(s3Result.id === CARD_ID, `id is correct`);
    assert(
      typeof (s3Result.eventTypes[0] as any).fusionEventId === 'object',
      `v1 fusionEventId is a ValueOrRef structure`,
    );
  } catch (e) {
    fail(`parseTenantConfig threw an unexpected error: ${e}`);
  }

  // ══════════════════════════════════════════════════════════════════
  // Scenario 4: parseTenantConfig — single v2 object
  // Simulates: after SDK v8, BE returns a single v2 object for tenants with v2 config
  // ══════════════════════════════════════════════════════════════════
  section(
    'Scenario 4 │ parseTenantConfig — single v2 object → expect CardConfigItemV2',
  );

  const singleV2Json = JSON.stringify({
    version: 'v2',
    id: CARD_ID,
    name: 'inj-card',
    eventTypes: [
      {
        type: 'fusion',
        name: 'DP fusion prod',
        tooltipContent: '',
        fusionEventId: '6adcfb7e1a034b7ea40b16adbcbdd59b',
      },
    ],
    contactInfo: {
      email: { active: true },
      sms: { active: false, supportedCountryCodes: [] },
      telegram: { active: true },
      discord: { active: true },
      slack: { active: false },
      wallet: { active: true },
      browser: { active: false },
    },
    isContactInfoRequired: true,
  });

  try {
    const s4Result = parseTenantConfig(singleV2Json);
    assert(
      s4Result.version === 'v2',
      `version === 'v2' (got: ${s4Result.version})`,
    );
    assert(s4Result.id === CARD_ID, `id is correct`);
    assert(
      typeof (s4Result.eventTypes[0] as any).fusionEventId === 'string',
      `v2 fusionEventId is a plain string`,
    );
  } catch (e) {
    fail(`parseTenantConfig threw an unexpected error: ${e}`);
  }

  // ══════════════════════════════════════════════════════════════════
  // Scenario 5: parseTenantConfig — [v1, v2] array (raw DB format)
  //
  // The DB stores [v1, v2] as an array, but the BE's findTenantConfig endpoint
  // selects and returns a single object before handing it to the SDK.
  // Passing an array directly into parseTenantConfig should throw, because
  // an array has no top-level 'version' field.
  // ══════════════════════════════════════════════════════════════════
  section('Scenario 5 │ parseTenantConfig — [v1, v2] array → expect throw');

  const arrayV1V2Json = JSON.stringify([
    {
      version: 'v1',
      id: CARD_ID,
      name: 'inj-card',
      eventTypes: [],
      inputs: [],
      contactInfo: {
        email: { active: true },
        sms: { active: false, supportedCountryCodes: [] },
        telegram: { active: true },
        discord: { active: true },
        slack: { active: false },
        wallet: { active: true },
        browser: { active: false },
      },
      titles: { active: false },
      isContactInfoRequired: true,
    },
    {
      version: 'v2',
      id: CARD_ID,
      name: 'inj-card',
      eventTypes: [],
      contactInfo: {
        email: { active: true },
        sms: { active: false, supportedCountryCodes: [] },
        telegram: { active: true },
        discord: { active: true },
        slack: { active: false },
        wallet: { active: true },
        browser: { active: false },
      },
      isContactInfoRequired: true,
    },
  ]);

  try {
    parseTenantConfig(arrayV1V2Json);
    fail(
      `parseTenantConfig should have thrown but did not (array has no top-level 'version' field)`,
    );
  } catch (e) {
    pass(
      `parseTenantConfig correctly threw (array is not a valid single-object payload)`,
    );
    info(`  error message: ${e}`);
  }

  // ══════════════════════════════════════════════════════════════════
  // Summary
  // ══════════════════════════════════════════════════════════════════
  section('Summary');
  if (process.exitCode === 1) {
    console.log('❌ Some tests failed — see FAIL items above');
  } else {
    console.log('✅ All tests passed');
  }
}

main().catch((err) => {
  console.error('\n💥 Unexpected error:', err);
  process.exit(1);
});
