# Continuous Deployment Setup Steps for a Notifi Dapp
In order to automate the deployment process of our integrations we make use of a CD pipeline.

The pipeline is responsible for building the dapp, uploading it to S3 and subsequently updating the CDN so that it can be accessed by the users.

## Triggering the CD Pipeline
The pipeline is configured to work on the `development` and `production` environments. Any merges to the `main` branch will trigger a deployment to the `development` environment, while the `production` environment is triggered by the publishing of a new release via the GitHub release workflow.

## Setting up the CD Pipeline in a Forked Repository
We leverage the Github actions [environments](https://docs.github.com/en/actions/managing-workflow-runs-and-deployments/managing-deployments/managing-environments-for-deployment) feature to manage the deployment of the dapp. The CD pipeline requires the `development` and `production` environments to be setup in the repository settings.

Within each environment we need to setup the following variables:

**App Configuration Variables:**
1. `NEXT_PUBLIC_ENV`
2. `NEXT_PUBLIC_CHAIN`
3. `NEXT_PUBLIC_TENANT_ID`
4. `NEXT_PUBLIC_NOTIFI_SUBSCRIPTION_CARD_ID`
5. `NEXT_PUBLIC_HOME_PAGE_TITLE_1`
6. `NEXT_PUBLIC_HOME_PAGE_SUBTITLE`

**AWS Variables:**
7. `AWS_ROLE_TO_ASSUME`
8. `AWS_BUCKET_NAME`
9. `CLOUDFRONT_DISTRIBUTION_ID`

And the following secrets:
1. `SLACK_WEBHOOK_URL`

It's recommended to use a [repository secret](https://docs.github.com/en/actions/security-guides/encrypted-secrets) for the `SLACK_WEBHOOK_URL` secret and any other common variables across the environments to maintain a single source of truth.

Additionally, for the Slack notification to work, you will need to configure the Slack workflow which plumbs the variables into a template and delivers them into a channel of your choosing. For an example, see the [Elixir Deployment Notification workflow](https://slack.com/shortcuts/Ft083UQBAQ8J/c3d950cc680fbcfebce251051048ad33).
