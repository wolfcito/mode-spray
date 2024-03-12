import Link from 'next/link'
import { useRouter } from 'next/router'
import { HeaderMenuLink } from './header.type'

const menuLinks: HeaderMenuLink[] = [
  {
    label: 'Home',
    href: '/',
  },
]

export function HeaderMenuLinks() {
  const router = useRouter()

  return (
    <>
      {menuLinks.map(({ label, href, icon }) => {
        const isActive = router.pathname === href
        return (
          <li key={href}>
            <Link
              href={href}
              passHref
              className={`${
                isActive ? 'bg-secondary shadow-md' : ''
              } hover:bg-secondary hover:shadow-md focus:!bg-secondary active:!text-neutral py-1.5 px-3 text-sm rounded-sm gap-2 grid grid-flow-col`}
            >
              {icon}
              <span>{label}</span>
            </Link>
          </li>
        )
      })}
    </>
  )
}
