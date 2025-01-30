<div id="top"></div>

[![Contributors][contributors-shield]][contributors-url]
[![Forks][forks-shield]][forks-url]
[![Stargazers][stars-shield]][stars-url]
[![Issues][issues-shield]][issues-url]
[![MIT License][license-shield]][license-url]

<!-- PROJECT LOGO -->
<br />
<div align="center">
  <a href="https://github.com/notifi-network/notifi-sdk-ts">
    <img src="https://github.com/user-attachments/assets/90a98d11-a221-4d61-9cf9-e41c7382e08a" alt="Logo" width="80" height="80">
  </a>

  <h3 align="center">Notifi SDK</h3>

  <p align="center">
    Notifi Typescript based SDK .
    <br />
    <br />
    <strong>Know more about <a href="https://notifi.network/">Notifi.network</a></strong>
    <br />
    <br />
    ·
    <a href="https://github.com/notifi-network/notifi-sdk-ts/issues">Report Bug</a>
    ·
    <a href="https://github.com/notifi-network/notifi-sdk-ts/issues">Request Feature</a>
    ·
    <a href="https://discord.gg/nAqR3mk3rv">Join our Discord</a>
  </p>
</div>

## About Notifi

Notifi is a cross-blockchain notification service that allows dapps to send notifications to their users.

Application owners (Developers) can push notifications to their users in various ways by leveraging Notifi protocol.

- **Community messages**: broadcast messages to the on-chain community by using [Community Manager of Notifi Admin Portal](https://admin.notifi.network/community).

- **On-chain events**: By using Notifi [on-chain parser](https://github.com/notifi-network/notifi-parser-sdk), Dapps can send notifications to their users based on on-chain events.

Register a new account on [Notifi Admin Portal](https://admin.notifi.network) and start sending notifications to your users.

> For more detailed info to get started with Notifi, please check the [official documentation](https://docs.notifi.network/docs/getting-started).

<br/>
<br/>

## About Notifi SDK TS

This monorepo contains the following packages which are used to interact with Notifi services.

- [@notifi-network/notifi-frontend-client](#notifi-frontend-client)
- [@notifi-network/notifi-react](#notifi-react)
- [@notifi-network/notifi-node](#notifi-node)
- [@notifi-network/notifi-graphql](#notifi-graphql)
- [@notifi-network/notifi-web-push-service-worker](#notifi-web-push-service-worker)

![notifi-sdk-ts-overview](https://github.com/user-attachments/assets/f57e06a0-9198-435c-bf06-7f64cce00ea3)

#### Notifi Frontend Client

The [@notifi-network/notifi-frontend-client](https://github.com/notifi-network/notifi-sdk-ts/tree/main/packages/notifi-frontend-client) package is utilized on the frontend (application) side by creating an instance of the NotifiFrontendClient object. This object offers essential client methods to seamlessly interact with Notifi services.

> - This package is framework-agnostic, making it compatible with any frontend application.
> - For an example implementation of @notifi-network/notifi-frontend-client, refer to [@notifi-network/notifi-react](#notifi-react)
> - Type documentation can be found here: [Notifi Frontend Client](https://docs.notifi.network/notifi-sdk-ts/notifi-frontend-client/modules.html)

#### Notifi React

The [@notifi-network/notifi-react](https://github.com/notifi-network/notifi-sdk-ts/tree/main/packages/notifi-react) package is a React library that provides:

- An out-of-the-box UI card modal component, `NotifiCardModal`, enabling developers to seamlessly integrate Notifi services without dealing with the underlying implementation.
- A set of context methods that allow developers to build custom UI components for interacting with Notifi services.

> - This package is specifically designed for [React based applications](https://www.robinwieruch.de/react-starter/) .
> - Example implementation: [@notifi-network/notifi-react-example-v2](https://github.com/notifi-network/notifi-sdk-ts/tree/main/packages/notifi-react-example-v2)
> - This package is built on top of the [@notifi-network/notifi-frontend-client](#notifi-frontend-client) package.
> - Type documentation: [Notifi React](https://docs.notifi.network/notifi-sdk-ts/notifi-react/modules.html)

#### Notifi Node

The [@notifi-network/notifi-node](https://github.com/notifi-network/notifi-sdk-ts/tree/main/packages/notifi-node) package is designed for use on the Node.js server side. It enables dApp owners to implement off-chain log parsing logic and send notifications to their users.

> Example implementation: [@notifi-network/notifi-node-sample](https://github.com/notifi-network/notifi-sdk-ts/tree/main/packages/notifi-node-sample)
> Type documentation: [Notifi Node](https://docs.notifi.network/notifi-sdk-ts/notifi-node/modules.html)

#### Notifi GraphQL

The [@notifi-network/notifi-graphql](https://github.com/notifi-network/notifi-sdk-ts/tree/main/packages/notifi-graphql), powered by [graphql-codegen](https://the-guild.dev/graphql/codegen/docs/getting-started), is a GraphQL client that provides the necessary types and queries for interacting with Notifi services.
This package is particularly useful for developers looking to build custom services (SDKs) on top of Notifi's infrastructure.

> - Example implementation:: [@notifi-network/notifi-frontend-client](#notifi-frontend-client)
> - Type documentation: [Notifi GraphQL](https://docs.notifi.network/notifi-sdk-ts/notifi-graphql/modules.html)

#### Notifi Web Push Service Worker (Coming soon)

The [@notifi-network/notifi-web-push-service-worker](https://github.com/notifi-network/notifi-sdk-ts/tree/main/packages/notifi-web-push-service-worker) package provides a [Service Worker](https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API) to manage browser push notification subscriptions.
This is particularly useful for cross-platform applications that follow the Progressive Web App (PWA) architecture.

> Example implementation: [@notifi-network/notifi-pwa-example](https://github.com/notifi-network/notifi-sdk-ts/tree/main/packages/notifi-pwa-example)

<br/>
<br/>

## Build with Notifi (for repository maintainers or contributors)

### Prerequisites

- Node.js (v18.x or higher with corresponding npm version)

- [NVM (Node Version Manager)](https://www.freecodecamp.org/news/node-version-manager-nvm-install-guide/) is recommended to manage the node versions. Run `nvm use` to adopt supported node version (defined in `.nvmrc`).

- prettier configured in your IDE: in your **vscode** `settings.json`, add the following configuration. If you are using other IDEs, please make sure the `.prettierrc` file is adopted by the IDE.

  ```json
  // ... other settings
  "prettier.configPath": "./.prettierrc"
  // ... other settings
  ```

### Contribute to the repository (for contributors)

Before contributing, please make sure the following steps are followed.

#### Code formatting

Before pushing the change, ensure the formatting is correct by running the following command

```bash
# on the root directory
npm run format
```

> **!IMPORTANT NOTE**:
> A push may be rejected if the code formatting is incorrect, as this repository enforces a pre-push Git hook to maintain consistent formatting.
> If your IDE does not automatically use <u>`"prettier.configPath": "./.prettierrc"`</u> , please run <u>npm run format</u> and commit the changes before pushing.

#### Build packages

After making changes, build all packages to ensure updates are reflected in the compiled files:

```bash
# on the root directory
npm run build
```

#### Unit tests (Jest) & Component tests (Cypress)

1. Component Tests for @notifi-network/notifi-react (Cypress):

   For changes in the `@notifi-network/notifi-react package`, run Cypress tests to verify UI component functionality. Execute these tests locally against the `notifi-react-example-v2` package:
   </br>

   ```bash
   # Run all tests
   npm run test

   # Open Cypress test runner
   npx lerna --scope=@notifi-network/notifi-react-example-v2 run cypress:open

   ```

   Detailed scenarios can be found in the [Cypress test scripts](https://github.com/notifi-network/notifi-sdk-ts/blob/main/packages/notifi-react-example-v2/cypress/component/NotifiCardModal.cy.tsx)

   > IMPORTANT:
   > If you modify test scripts, please run them multiple times (at least 5–10) to confirm stability:
   > `for i in {1..10}; do npm run test; done; `.

   </br>

2. Unit Tests for Other Packages (Jest):
   For non-UI packages, run Jest tests to verify functionality. Before testing, configure the .env file in `packages/notifi-node/`:

   - Copy `.env.example` to `.env` and populate necessary environment variables.
   - Run tests with `npm run test:node && npm run test:frontend-client`

    </br>

> Tip:
> Use `lerna` commands to run scripts for a specific package (`npx lerna --scope=@notifi-network/<package-name> run <script-name>`).
>
> - Start the development server for `notifi-react-example-v2`:
>   `npx lerna --scope=@notifi-network/notifi-react-example-v2 run dev`
> - Open Cypress test runner for `notifi-react-example-v2`:
>   `npx lerna --scope=@notifi-network/notifi-react-example-v2 run cypress:open`

</br>

### Publish packages to npm (for internal maintainers)

1.  Publish canary version to npm
    The following command will publish the all packages with canary version to npm. It will prompt you to select the version with suffix `-alpha.x`.

    **IMPORTANT**: Run `npm run build` before running the following command.
    </br>

    ```bash
    # on the root directory
    npx lerna publish --canary --force-publish
    ```

      </br>

2.  Publish official version to npm

    The following command will publish the updated packages to npm. It will prompt you to select the version for each package.
    **IMPORTANT**: Run `npm run build` before running the following command.
    </br>

    ```bash
    # on the root directory
    npx lerna publish
    ```

### Type documentation

`notifi-sdk-ts` utilizes [typedoc](https://typedoc.org/) to generate the type documentation. We want to ensure that the documentation is always up-to-date by regenerating the documentation when the codebase is updated.

1. Run the command below to generate the updated typedoc.
   </br>

   ```bash
   # on the root directory
   npm run docs
   ```

2. To preview the generated documentation locally, run the following command.
   </br>

   ```bash
   # on the root directory
   npm run serve-docs
   ```

   </br>

This will establish a local server by `light-server` to host the Type documentation page on `http://localhost:4000`.

</br>
</br>

## Advanced

We understand that not all scenarios can be solved with the current state of the SDK. When adding SDK features, we'd like to ensure we're building exactly what developers want. If you need to break out of the SDK features for more advanced interaction with Notifi, please see our Notifi [GraphQL API](https://api.notifi.network/gql/) that you can consume alongside the SDK.
</br>

### Built With ❤️ and ...

- [Lerna.js](https://lerna.js.org/)
- [Cypress](https://www.cypress.io/)
- [Nx](https://nx.dev/)
- [React.js](https://reactjs.org/)
- [Next.js](https://nextjs.org/)
- [GraphQL-Codegen](https://the-guild.dev/graphql/codegen/docs/getting-started)
- [TypeDoc](https://typedoc.org/)
- [husky](https://typicode.github.io/husky/)

<p align="right">(<a href="#top">back to top</a>)</p>

<!-- MARKDOWN LINKS & IMAGES -->
<!-- https://www.markdownguide.org/basic-syntax/#reference-style-links -->

[contributors-shield]: https://img.shields.io/github/contributors/notifi-network/notifi-sdk-ts.svg?style=for-the-badge
[contributors-url]: https://github.com/notifi-network/notifi-sdk-ts/graphs/contributors
[forks-shield]: https://img.shields.io/github/forks/notifi-network/notifi-sdk-ts.svg?style=for-the-badge
[forks-url]: https://github.com/notifi-network/notifi-sdk-ts/network/members
[stars-shield]: https://img.shields.io/github/stars/notifi-network/notifi-sdk-ts.svg?style=for-the-badge
[stars-url]: https://github.com/notifi-network/notifi-sdk-ts/stargazers
[issues-shield]: https://img.shields.io/github/issues/notifi-network/notifi-sdk-ts.svg?style=for-the-badge
[issues-url]: https://github.com/notifi-network/notifi-sdk-ts/issues
[license-shield]: https://img.shields.io/github/license/notifi-network/notifi-sdk-ts.svg?style=for-the-badge
[license-url]: https://github.com/notifi-network/notifi-sdk-ts/blob/main/LICENSE.txt
