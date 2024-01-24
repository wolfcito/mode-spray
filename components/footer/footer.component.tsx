import React from 'react'
import Image from 'next/image'
import { colophon } from '~~/constants'

export function Footer() {
  return (
    <footer className="bg-black text-white py-4 px-6 h-16 flex justify-between items-center fixed bottom-0 left-0 w-full">
      <div className="flex space-x-2">
        {colophon.map((author, index) => (
          <a
            href={author.link}
            key={index}
            className="hover:text-gray-400 text-[#4B4F52] px-3 py-1 rounded-full border border-[#565A5E]"
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
