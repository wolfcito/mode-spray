import React from 'react'
import { nanoid } from 'nanoid'
import { colophon } from '~~/constants'
import { ModeIcon, PushIcon } from '~~/icons'

export function Footer() {
  return (
    <footer className="fixed bottom-0 left-0 flex items-center justify-between w-full h-16 px-6 py-4 text-white bg-black">
      <div className="flex space-x-2">
        {colophon.map(author => (
          <a
            href={author.link}
            key={nanoid()}
            className="hover:text-gray-400 text-[#4B4F52] px-3 py-1 rounded-sm border border-[#565A5E]"
          >
            {author.name}
          </a>
        ))}
      </div>

      <div className="flex h-20">
        <PushIcon className="w-20 p-0 mr-5" />
        <ModeIcon className="w-20 p-0" />
      </div>
    </footer>
  )
}
