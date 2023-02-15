# @notifi/notifi-react-example

## 🙋🏻‍♀️ Introduction

This example app is a ReactJS test site that can consume other Notifi packages such as `notifi-react-hooks`.

With this example project, a developer making changes in the SDK (e.g. `notifi-react-hooks`) should be able to immediately see changes while running the test site after running the build command

The following is an example of modifying `notifi-react-hooks` and updating the test app.

## 📥 For SDK Development

### Make some changes in the SDK

```jsx
// hooks/useYourHook.ts
export const useYourHook = () => {
  return 'This is a new hook!';
};
```

Run the lerna build command to see your sdk changes reflected in the example app

```zsh
npx lerna run build
```

### Hook up the SDK

Load the Notifi React Hooks SDK into your component.

```tsx
import { useYourHook } from '@notifi-network/notifi-react-hooks';
```

```tsx
const message = useYourHook();
console.log(message); // 'This is a new hook!'
```
