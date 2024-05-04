import React from 'react'
import Image from 'next/image'
import { nanoid } from 'nanoid'
import { colophon } from '~~/constants'
import * as ModePush from '~~/mode/mode-push.png'

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

      <div
        className="flex h-9"
        onClick={() =>
          window.open(
            'https://staging.push.org/channels/0x12A2455CCa45D8f6d9149F0e996260Ae49EDA8B4#receive-notifications',
            '_blank',
          )
        }
        aria-hidden="true"
      >
        <Image src={ModePush} className="w-40 h-auto grayscale" alt="mode + push + spray" width={200} height={34} />
      </div>
    </footer>
  )
}
