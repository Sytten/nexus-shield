import { RuntimePlugin } from 'nexus/plugin';

import { nexusShield } from '../schema';
import { ShieldPluginSettings } from '../schema/config';

export const plugin: RuntimePlugin<ShieldPluginSettings, 'required'> = (
  settings
) => (_project) => {
  return {
    schema: {
      plugins: [nexusShield(settings)],
    },
  };
};
