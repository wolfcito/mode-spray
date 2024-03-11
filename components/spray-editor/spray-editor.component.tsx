import { SprayEditorProps } from './spray-editor.type'
import clsx from 'clsx'
import { ButtonLink } from '~~/components/button'

export function SprayEditor({ pasteFromClipboard, textareaValue, onChangeValues, cleanValues }: SprayEditorProps) {
  return (
    <>
      <ButtonLink onclick={pasteFromClipboard} label="Paste from Clipboard" className="text-xs text-white" />
      <textarea
        value={textareaValue}
        onChange={onChangeValues}
        placeholder={`0x6a22F6308a9a8D40eb7585F16BBd73913cF98633 0.001\n0x6a22F6308a9a8D40eb7585F16BBd73913cF98633;0.001\n0x6a22F6308a9a8D40eb7585F16BBd73913cF98633,0.001\n0x6a22F6308a9a8D40eb7585F16BBd73913cF98633=0.001\n0x6a22F6308a9a8D40eb7585F16BBd73913cF98633&0.001`}
        className="w-full rounded-sm text-sm textarea textarea-bordered textarea-primary textarea-xs min-h-[135px] font-mono"
      ></textarea>
      <ButtonLink
        onclick={cleanValues}
        label="clear"
        className={clsx(!textareaValue && 'opacity-50 disabled', textareaValue && 'hover:text-neutral-content')}
      />
    </>
  )
}
