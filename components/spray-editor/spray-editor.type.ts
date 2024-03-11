import { SetStateAction } from 'react'

export interface SprayEditorProps {
  pasteFromClipboard: () => void
  textareaValue: string
  onChangeValues: (e: { target: { value: SetStateAction<string> } }) => void
  cleanValues: () => void
}
