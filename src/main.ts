const updatedLinks = new WeakSet<HTMLAnchorElement>()

// Cache link patterns
const ZHIHU_PATTERNS = [
  "https://link.zhihu.com/?target=",
  "http://link.zhihu.com/?target=",
] as const

// Debounce utility
function debounce<T extends (...args: any[]) => void>(
  fn: T,
  delay: number
): (...args: Parameters<T>) => void {
  let timeoutId: ReturnType<typeof setTimeout>
  return (...args: Parameters<T>) => {
    clearTimeout(timeoutId)
    timeoutId = setTimeout(() => fn(...args), delay)
  }
}

function updateLinkHref(link: HTMLAnchorElement): string | null {
  try {
    const href = link.href
    if (!ZHIHU_PATTERNS.some(pattern => href.includes(pattern))) {
      return null
    }

    const urlParams = new URLSearchParams(href.split("?")[1])
    const newLink = urlParams.get("target")
    if (!newLink) return null

    const decodedLink = decodeURIComponent(newLink)
    link.href = decodedLink
    return decodedLink
  } catch (error) {
    console.error("Error updating link:", error)
    return null
  }
}

// Batch process links
function updateAllLinks(): void {
  const links = document.getElementsByTagName("a")
  Array.from(links).forEach(link => updateLinkHref(link))
}

// Debounced observer callback
const debouncedObserverCallback = debounce((mutations: MutationRecord[]) => {
  mutations.forEach(mutation => {
    if (mutation.type === "childList") {
      mutation.addedNodes.forEach(node => {
        if (node instanceof HTMLElement) {
          if (node instanceof HTMLAnchorElement) {
            updateLinkHref(node)
          } else {
            const links = node.getElementsByTagName("a")
            Array.from(links).forEach(link => updateLinkHref(link))
          }
        }
      })
    }
  })
}, 100)

// Initialize
document.addEventListener("DOMContentLoaded", updateAllLinks)
const observer = new MutationObserver(debouncedObserverCallback)
observer.observe(document.body, {
  childList: true,
  subtree: true,
})

// Cleanup on page unload
window.addEventListener("unload", () => {
  observer.disconnect()
})

const listenedEvents = ["click", "mouseover"]
// Event listener for clicks to ensure redirection
listenedEvents.forEach(eventName => {
  document.addEventListener(eventName, event => {
    const target = event.target as HTMLElement
    if (target.tagName === "A") {
      const link = target as HTMLAnchorElement
      if (!updatedLinks.has(link)) {
        const newHref = updateLinkHref(link)
        if (newHref) {
          updatedLinks.add(link)
          if (eventName === "click") {
            event.preventDefault()
            window.location.href = newHref
          }
        }
      }
    }
  })
})
