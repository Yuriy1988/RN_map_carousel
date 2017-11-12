# React Native Storybook

Storybook contains list of components used as common in our projects.

## Get Started

### Requirements

Simply install dependencies through Yarn:

```
$ yarn
```

### Run Storybook (Web Client)

Storybook starts web client which will package all stories for you. After you need to run app on mobile device which will connect to this packager and will be available to communicate with web client through Socket.

Cause of RN Storybook nature you need to specify your host (do it only once):

```
$ touch storybook/settings.js
$ echo "export const HOST = '<MY_INTERNAL_IP_ADDRESS>';" > storybook/settings.js
```

This settings file is ignored by git, so fill free to keep it local.

We're ready to run web client of Storybook:

```
$ yarn run storybook
```

### Run Storybook (App)

Now, we can finally run our app.

Android:

```
$ adb reverse tcp:8081 tcp:8081
$ adb reverse tcp:7007 tcp:7007
$ react-native run-android
```

iOS:

```
$ react-native run-ios
```
