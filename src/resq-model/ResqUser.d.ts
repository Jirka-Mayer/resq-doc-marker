export interface ResqUser {
  id: string,

  firstName: string,
  lastName: string,
  title: string,

  settings: ResqUserSettings,
}

export interface ResqUserSettings {
  currentProvider: ResqUserSettingsProvider,
}

/**
 * Provider = hospital
 * (this object is only a subset of all the attributes for a provider)
 */
export interface ResqUserSettingsProvider {
  id: number,
  name: string,
}
