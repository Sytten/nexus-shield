import { PluginEntrypoint } from 'nexus/plugin';

import { ShieldPluginSettings } from '../schema/config';

export const shield: PluginEntrypoint<ShieldPluginSettings, 'required'> = (
  settings
) => ({
  settings,
  packageJsonPath: require.resolve('../../package.json'),
  runtime: {
    module: require.resolve('./runtime'),
    export: 'plugin',
  },
});
