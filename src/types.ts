export interface PluginTypes {
  /**
   * Enable or disable plugin
   * @default false
   */
  enabled?: boolean

  /**
   * Collections to exclude
   * @default []
   */
  except?: string[]

  /**
   * Party Kit URL
   * Got from from deploying partykit.
   */
  partyUrl: string
}

export interface ExamplesCollectionTypes {
  someField: string
}
