import { enviroment } from '~~/config'

export const baseSite = enviroment.debug
  ? 'http://localhost:3000'
  : enviroment.lab
  ? 'https://lab.modespray.xyz'
  : 'https://modespray.xyz'

export const labelSite = enviroment.lab ? 'Spray Laboratory' : 'Spray Production'

export const baseSiteLink = enviroment.debug
  ? 'http://localhost:3000'
  : enviroment.lab
  ? 'https://modespray.xyz'
  : 'https://lab.modespray.xyz'

export const labeSiteLink = enviroment.lab ? 'Spray Production' : 'Spray Laboratory'
