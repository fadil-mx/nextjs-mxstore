'use client'
import { cn } from '@/lib/utils'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import React from 'react'

const Adminnav = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLElement>) => {
  const link = [
    {
      title: 'Overview',
      href: '/admin/overview',
    },
    {
      title: 'Users',
      href: '/admin/users',
    },
    {
      title: 'Products',
      href: '/admin/products',
    },
    {
      title: 'Orders',
      href: '/admin/orders',
    },
    {
      title: 'Settings',
      href: '/admin/settings',
    },

    {
      title: 'Carousel',
      href: '/admin/carousels',
    },
  ]
  const pathname = usePathname()
  return (
    <nav
      className={cn(
        'flex flex-wrap items-center  overflow-hidden gap-2 md:gap-4',
        className
      )}
      {...props}
    >
      {link.map((items) => (
        <Link
          href={items.href}
          key={items.href}
          className={cn(
            '',
            pathname.includes(items.href) ? '' : 'text-muted-foreground'
          )}
        >
          {items.title}
        </Link>
      ))}
    </nav>
  )
}

export default Adminnav
