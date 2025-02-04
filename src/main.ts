const updatedLinks = new WeakSet<HTMLAnchorElement>()

function updateLinkHref(link: HTMLAnchorElement): string | null {
  if (
    link.href.includes("https://link.zhihu.com/?target=") ||
    link.href.includes("http://link.zhihu.com/?target=")
  ) {
    const urlParams = new URLSearchParams(link.href.split("?")[1])
    const newLink = urlParams.get("target")
    if (newLink) {
      link.href = decodeURIComponent(newLink)
      return link.href
    }
  }
  return null
}

function updateAllLinks() {
  const links = document.querySelectorAll("a")
  links.forEach(link => updateLinkHref(link as HTMLAnchorElement))
}

// Initial update of all links on page load
updateAllLinks()

// Observe changes in the DOM to update links dynamically
const observer = new MutationObserver(mutations => {
  mutations.forEach(mutation => {
    if (mutation.type === "childList") {
      mutation.addedNodes.forEach(node => {
        if (node.nodeType === Node.ELEMENT_NODE) {
          const element = node as HTMLElement
          if (element.tagName === "A") {
            updateLinkHref(element as HTMLAnchorElement)
          } else {
            const links = element.querySelectorAll("a")
            links.forEach(link => updateLinkHref(link as HTMLAnchorElement))
          }
        }
      })
    }
  })
})

observer.observe(document.body, {
  childList: true,
  subtree: true,
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
