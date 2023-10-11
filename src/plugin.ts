import type { Config } from 'payload/config'

import { onInitExtension } from './onInitExtension'
import type { PluginTypes } from './types'
import { extendWebpackConfig } from './webpack'
import { EditingCheck } from './components/EditingCheck/editingCheck'

export const editingCheck =
  (pluginOptions: PluginTypes) =>
  (incomingConfig: Config): Config => {
    let config = { ...incomingConfig }

    // If you need to add a webpack alias, use this function to extend the webpack config
    const webpack = extendWebpackConfig(incomingConfig)

    config.admin = {
      ...(config.admin || {}),
      // If you extended the webpack config, add it back in here
      // If you did not extend the webpack config, you can remove this line
      webpack,
    }

    // If the plugin is disabled, return the config without modifying it
    // The order of this check is important, we still want any webpack extensions to be applied even if the plugin is disabled
    if (pluginOptions.enabled === false) {
      return config
    }

    const editingCheckField = {
      name: 'editingCheck',
      type: 'ui' as const,
      label: 'Editing Check',
      admin: {
        components: {
          Field: EditingCheck,
          Cell: () => null,
        },
      },
    }

    config.collections = [
      ...(config.collections || []).map(collection => ({
        ...collection,
        fields: [
          ...collection.fields,
          ...(pluginOptions.except?.includes(collection.slug) ? [] : [editingCheckField]),
        ],
      })),
    ]

    config.onInit = async payload => {
      if (incomingConfig.onInit) await incomingConfig.onInit(payload)
      // Add additional onInit code by using the onInitExtension function
      onInitExtension(pluginOptions, payload)
    }

    return config
  }
