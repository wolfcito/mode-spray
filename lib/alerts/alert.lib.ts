import { showAlertProps } from './alert.type'
// @ts-ignore
import Swal from 'sweetalert2/dist/sweetalert2'
import { logger } from '~~/lib'

export const showSuccessModal = ({ blockhash, infotxns }: showAlertProps) => {
  if (!blockhash || !infotxns) {
    logger.info(`blockhash ${blockhash}`)
    logger.info(`infotxns ${infotxns}`)
    return
  }

  if (blockhash && infotxns) {
    Swal.fire({
      icon: 'success',
      title: 'Successful Spray!',
      html: `Check out details👇👇👇 <br/><br/><a href=${blockhash} target="_blank" class="break-words ml-1.5 text-base font-normal font-mono  underline underline-offset-2 text-neutral-content" rel="noopener noreferrer">${infotxns}</a>`,
      showCloseButton: true,
      showConfirmButton: false,
    })
  }
}
