'use client'

import { useMemo, useState } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'

const DEFAULT_SCHOOL_PATH = '%EC%A3%BD%EC%A0%84%EC%A4%91%ED%95%99%EA%B5%90'

const QUICK_LINKS = [
  { href: '/', label: 'Main' },
  { href: '/invite', label: 'Schools' },
  { href: `/invite/${DEFAULT_SCHOOL_PATH}`, label: 'Invite' },
  { href: `/invite/${DEFAULT_SCHOOL_PATH}/join`, label: 'Join' },
]

function getFlow(pathname) {
  const schoolMatch = pathname.match(/^\/invite\/([^/]+)(?:\/join)?$/)
  const schoolPath = schoolMatch?.[1] || DEFAULT_SCHOOL_PATH

  return [
    { href: '/invite', label: 'Schools' },
    { href: `/invite/${schoolPath}`, label: 'Invite' },
    { href: `/invite/${schoolPath}/join`, label: 'Join' },
    { href: '/', label: 'Main' },
  ]
}

function getFlowIndex(pathname, flow) {
  if (pathname === '/invite') return 0
  if (/^\/invite\/[^/]+$/.test(pathname)) return 1
  if (/^\/invite\/[^/]+\/join$/.test(pathname)) return 2
  if (pathname === '/') return 3
  return 0
}

export default function DevNavigator() {
  const router = useRouter()
  const pathname = usePathname()
  const [open, setOpen] = useState(false)
  const flow = useMemo(() => getFlow(pathname), [pathname])
  const flowIndex = useMemo(() => getFlowIndex(pathname, flow), [pathname, flow])

  const currentLabel = useMemo(() => {
    const current = flow[flowIndex] || QUICK_LINKS.find((link) => link.href === pathname)
    return current?.label || 'Page'
  }, [flow, flowIndex, pathname])

  function goStep(direction) {
    const nextIndex = (flowIndex + direction + flow.length) % flow.length
    router.push(flow[nextIndex].href)
    setOpen(false)
  }

  return (
    <div className="dev-navigator" aria-label="Development page navigation">
      <button
        className="dev-nav-button"
        type="button"
        aria-label="Previous app page"
        title="Previous app page"
        onClick={() => goStep(-1)}
      >
        <span aria-hidden="true">‹</span>
      </button>
      <button
        className="dev-nav-button"
        type="button"
        aria-label="Next app page"
        title="Next app page"
        onClick={() => goStep(1)}
      >
        <span aria-hidden="true">›</span>
      </button>
      <button
        className="dev-nav-button dev-nav-menu-button"
        type="button"
        aria-expanded={open}
        aria-label="Open quick page links"
        title="Quick page links"
        onClick={() => setOpen((value) => !value)}
      >
        <span aria-hidden="true">⋯</span>
      </button>

      {open && (
        <div className="dev-nav-panel">
          <span>{currentLabel}</span>
          {flow.map((link) => (
            <Link key={link.href} href={link.href} onClick={() => setOpen(false)}>
              {link.label}
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
