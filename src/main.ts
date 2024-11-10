// @ts-ignore isolatedModules
//write a script in tampermonkey that can remove redirects in zhihu.com, https://link.zhihu.com/?target=* to * from any buttons or links on zhihu.com

//add a interval to check every 1 second
let prevCnt = 0
setInterval(() => {
  let links = document.querySelectorAll("a")
  let newCnt = links.length
  if (newCnt === prevCnt) {
    prevCnt = newCnt
    return
  }
  prevCnt = newCnt
  links.forEach(link => {
    if (
      link.href.includes("https://link.zhihu.com/?target=") ||
      link.href.includes("http://link.zhihu.com/?target=")
    ) {
      const urlParams = new URLSearchParams(link.href.split("?")[1])
      const newLink = urlParams.get("target")
      if (newLink) {
        link.href = decodeURIComponent(newLink)
      }
    }
  })
}, 1000)
