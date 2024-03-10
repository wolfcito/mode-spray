import { enviroment } from '~~/config'

export const logger = {
  log: (message?: any, ...optionalParams: any[]) => enviroment.debug && console.log(message, ...optionalParams),
  info: (message?: any, ...optionalParams: any[]) => enviroment.debug && console.info(message, ...optionalParams),
  error: (message?: any, ...optionalParams: any[]) => enviroment.debug && console.error(message, ...optionalParams),
}
