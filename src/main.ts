// @ts-ignore isolatedModules
//write a script in tampermonkey that can remove redirects in zhihu.com, https://link.zhihu.com/?target=* to * from any buttons or links on zhihu.com

//add a interval to check every 1 second

setInterval(() => {
  let links = document.querySelectorAll("a")

  links.forEach(link => {
    if (link.href.includes("https://link.zhihu.com/?target=")) {
      const urlParams = new URLSearchParams(link.href.split("?")[1])
      const newLink = urlParams.get("target")
      if (newLink) {
        link.href = decodeURIComponent(newLink)
      }
    }
  })
}, 1000)
