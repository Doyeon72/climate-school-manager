'use client'

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'

const DEFAULT_SCHOOL_PATH = '%EC%A3%BD%EC%A0%84%EC%A4%91%ED%95%99%EA%B5%90'
const LAST_DEV_SCHOOL_KEY = 'lastDevNavigatorSchoolPath'

function getSchoolPathFromPathname(pathname) {
  const schoolMatch = pathname.match(/^\/invite\/([^/]+)(?:\/join)?$/)
  return schoolMatch?.[1] || ''
}

function getFlow(pathname, rememberedSchoolPath) {
  const schoolPath = getSchoolPathFromPathname(pathname) || rememberedSchoolPath || DEFAULT_SCHOOL_PATH

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
  const [rememberedSchoolPath, setRememberedSchoolPath] = useState(DEFAULT_SCHOOL_PATH)
  const flow = useMemo(() => getFlow(pathname, rememberedSchoolPath), [pathname, rememberedSchoolPath])
  const flowIndex = useMemo(() => getFlowIndex(pathname, flow), [pathname, flow])

  useEffect(() => {
    const savedSchoolPath = window.localStorage.getItem(LAST_DEV_SCHOOL_KEY)
    if (savedSchoolPath) {
      setRememberedSchoolPath(savedSchoolPath)
    }
  }, [])

  useEffect(() => {
    const schoolPath = getSchoolPathFromPathname(pathname)
    if (!schoolPath) return

    window.localStorage.setItem(LAST_DEV_SCHOOL_KEY, schoolPath)
    setRememberedSchoolPath(schoolPath)
  }, [pathname])

  const currentLabel = useMemo(() => {
    const current = flow[flowIndex]
    return current?.label || 'Page'
  }, [flow, flowIndex])

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
