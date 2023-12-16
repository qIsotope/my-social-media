import { useEffect, useState } from "react"

export function useIntersectionObserver(
  elementRef,
  freezeOnceVisible = false,
) {
  const [entry, setEntry] = useState()

  const frozen = entry?.isIntersecting && freezeOnceVisible

  const updateEntry = ([entry]) => {
    setEntry(entry)
  }

  useEffect(() => {
    const node = elementRef?.current // DOM Ref
    const hasIOSupport = !!window.IntersectionObserver

    if (!hasIOSupport || frozen || !node) return

    const observer = new IntersectionObserver(updateEntry)

    observer.observe(node)

    return () => observer.disconnect()

  }, [elementRef?.current, frozen])

  return entry
}