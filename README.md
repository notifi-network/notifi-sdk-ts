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

![notifi-sdk-ts-overview](https://github.com/user-attachments/assets/b3011861-068f-4144-99a9-7e18175a9054)

#### Notifi Frontend Client

[@notifi-network/notifi-frontend-client](https://github.com/notifi-network/notifi-sdk-ts/tree/main/packages/notifi-frontend-client) package is used from the frontend (Application) side by instantiating a `NotifiFrontendClient` object which provides the necessary client methods to interact with Notifi services.

> - This package is not framework-specific, so it can be used in any frontend application.
> - The implementation of `@notifi-network/notifi-front-client`: [@notifi-network/notifi-react](#notifi-react)
> - Type documentation: [Notifi Frontend Client](https://docs.notifi.network/notifi-sdk-ts/notifi-frontend-client/modules.html)

#### Notifi React

[@notifi-network/notifi-react](https://github.com/notifi-network/notifi-sdk-ts/tree/main/packages/notifi-react) package is a React library that provides:

- An out-of-the-box UI card modal component, `NotifiCardModal` by which developers can easily integrate with Notifi services without worrying about the underlying implementation.
- A set of context methods by which allows developers to build their custom UI components to interact with Notifi services.

> - This package is specifically designed for [React based applications](https://www.robinwieruch.de/react-starter/) .
> - Respective example package: [@notifi-network/notifi-react-example-v2](https://github.com/notifi-network/notifi-sdk-ts/tree/main/packages/notifi-react-example-v2)
> - This package is a implementation of the [@notifi-network/notifi-frontend-client](#notifi-frontend-client) package.
> - Type documentation: [Notifi React](https://docs.notifi.network/notifi-sdk-ts/notifi-react/modules.html)

#### Notifi Node

[@notifi-network/notifi-node](https://github.com/notifi-network/notifi-sdk-ts/tree/main/packages/notifi-node) package is used from a NodeJS server side. Dapp owners can implement the off-chain parsing logics and send notifications to their users.

> Respective example packages: [@notifi-network/notifi-node-sample](https://github.com/notifi-network/notifi-sdk-ts/tree/main/packages/notifi-node-sample)
> Type documentation: [Notifi Node](https://docs.notifi.network/notifi-sdk-ts/notifi-node/modules.html)

#### Notifi GraphQL

[@notifi-network/notifi-graphql](https://github.com/notifi-network/notifi-sdk-ts/tree/main/packages/notifi-graphql), powered by [graphql-codegen](https://the-guild.dev/graphql/codegen/docs/getting-started), serves as a GraphQL client that provides the necessary types and queries to interact with Notifi services.
This is particularly useful for developers who want to build their services (SDK) on top of Notifi services.

> The implementation of `@notifi-network/notifi-graphql`: [@notifi-network/notifi-frontend-client](#notifi-frontend-client)
> Type documentation: [Notifi GraphQL](https://docs.notifi.network/notifi-sdk-ts/notifi-graphql/modules.html)

#### Notifi Web Push Service Worker (Coming soon)

[@notifi-network/notifi-web-push-service-worker](https://github.com/notifi-network/notifi-sdk-ts/tree/main/packages/notifi-web-push-service-worker) package introduces a [Service Worker](https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API) that handles the browser push notification subscription.
This is useful for the cross platform applications which adopt the Progressive Web App (PWA) architecture.

> Respective example packages: [@notifi-network/notifi-pwa-example](https://github.com/notifi-network/notifi-sdk-ts/tree/main/packages/notifi-pwa-example)

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

1.  Before pushing the change, ensure the formatting is correct by running the following command.

    ```bash
    # on the root directory
    npm run format
    ```

    > **!IMPORTANT NOTE**:
    > <u>`git push`</u> could be rejected if the formatting is not correct since this repository implements the pre-push git hook to ensure the code formatting
    > If you DO NOT adopt the <u>`"prettier.configPath": "./.prettierrc"`</u> in your IDE settings, please run the <u>`npm run format`</u> command and commit the formatted changes before pushing the changes.

2.  Run headless cypress tests locally

    You can run the cypress tests locally against the `notifi-react-example-v2` package by using the following command.
    </br>

    ```bash
    # on the root directory
    npm run test

    # To run the cypress open test runner
    npx lerna --scope=@notifi-network/notifi-react-example-v2 run cypress:open

    ```

    For the detailed test scenarios, please check out the [Cypress test scripts](https://github.com/notifi-network/notifi-sdk-ts/blob/main/packages/notifi-react-example-v2/cypress/component/NotifiCardModal.cy.tsx)

    > IMPORTANT: if you change the test script, make sure run test script multiple times (at least 5~10) to ensure the test is stable - `for i in {1..10}; do npm run test; done; `.

    </br>

3.  Make sure to build all packages after making changes.

    After making changes, make sure to build all packages to ensure the changes are reflected in the built files.

    ```bash
    # on the root directory
    npm run build
    ```

     </br>

> NOTE: You can run npm scripts against a specific package by utilizing `lerna` command `npx lerna --scope=@notifi-network/<package-name> run <script-name>`. Please check on the following examples (make sure you are on the root directory):
>
> - run dev server on the notifi-react-example-v2 package: `npx lerna --scope=@notifi-network/notifi-react-example-v2 run dev`
> - run open cypress test runner on the notifi-react-example-v2 package: `npx lerna --scope=@notifi-network/notifi-react-example-v2 run cypress:open`

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
