# `notifi-node-sample`

> express.js sample showing usage of `@notifi-network/notifi-node`

## Usage

Start the demo with `npm run dev`

```typescript
import {
  NotifiClient,
  NotifiEnvironment,
  createAxiosInstance,
} from '@notifi-network/notifi-node';
import axios from 'axios';

...

const env: NotifiEnvironment = 'Development';
const axiosInstance = createAxiosInstance(axios, env);
const client = new NotifiClient(axiosInstance);

const {
  token,
  expiry
} = await client.logIn({ sid: 'some-id', secret: 'some-secret' });
```
