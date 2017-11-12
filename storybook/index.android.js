import { AppRegistry } from 'react-native';
import { getStorybookUI, configure } from '@kadira/react-native-storybook';

import { HOST } from './settings';

// import stories
configure(() => {
  require('./stories');
}, module);

const StorybookUI = getStorybookUI({ port: 7007, host: HOST });
AppRegistry.registerComponent('ReactNativeStorybook', () => StorybookUI);
