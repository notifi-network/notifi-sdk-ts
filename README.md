# notifi-sdk

## Steps to deploy canary
npx lerna exec -- npx rimraf dist

npx lerna exec -- npx rimraf node_modules

npx lerna bootstrap

npx lerna run build


npx lerna publish --canary

