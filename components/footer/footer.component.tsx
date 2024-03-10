import React from 'react'
import Image from 'next/image'
import { colophon } from '~~/constants'

export function Footer() {
  return (
    <footer className="fixed bottom-0 left-0 flex items-center justify-between w-full h-16 px-6 py-4 text-white bg-black">
      <div className="flex space-x-2">
        {colophon.map((author, index) => (
          <a
            href={author.link}
            key={index}
            className="hover:text-gray-400 text-[#4B4F52] px-3 py-1 rounded-sm border border-[#565A5E]"
          >
            {author.name}
          </a>
        ))}
      </div>
      <div>
        <div className="relative flex w-20 h-20">
          <Image alt="logo" className="cursor-pointer" fill src="/logo.svg" />
        </div>
      </div>
    </footer>
  )
}
