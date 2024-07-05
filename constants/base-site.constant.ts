import { enviroment } from '~~/config'

// used on chain icons
export const baseSite = enviroment.debug
  ? 'http://localhost:3000'
  : enviroment.lab
  ? 'https://lab.modespray.xyz'
  : 'https://app.modespray.xyz'

export const labelSite = enviroment.lab ? 'Spray Laboratory' : 'Spray Production'

// switch envs
export const baseSiteLink = enviroment.debug
  ? 'http://localhost:3000'
  : enviroment.lab
  ? 'https://app.modespray.xyz'
  : 'https://lab.modespray.xyz'

export const labeSiteLink = enviroment.lab ? 'Spray Production' : 'Spray Laboratory'
