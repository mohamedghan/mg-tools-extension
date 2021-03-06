console.log("extension Enabled!");

browser.tabs.onUpdated.addListener(async (id,_2,{url:pgurl}) => {
    const url = new URL(pgurl);
    const {hostname} = url;
    const {[hostname]: muted} = await browser.storage.local.get({[hostname]:100});
    if (muted === 100) return;
    console.log(pgurl)
    browser.tabs.update(id, {muted});
})

browser.menus.create({
    id: "mute-tab-enhanced",
    type: "normal",
    title: "Mute Site",
    contexts: ["tab"]
})

browser.menus.onClicked.addListener(async ({pageUrl},_) => {
    const url = new URL(pageUrl);
    const {hostname} = url;
    if (!hostname) return;
    const {[hostname]: initMuted} = await browser.storage.local.get({[hostname]:false});
    await browser.storage.local.set({[hostname]: !initMuted})
})

browser.storage.onChanged.addListener(async (changes,_) => {
    const tabs = await browser.tabs.query({});
    tabs.forEach((tab) => {
        const hostname = new URL(tab.url).hostname;
        if (!hostname) return;
        const muted = changes[hostname]?.newValue
        if(muted === undefined) return;
        browser.tabs.update(tab.id, {muted});
    })
})