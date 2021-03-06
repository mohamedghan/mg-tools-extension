console.log("extension Enabled!");

browser.tabs.onCreated.addListener(({id}) => {
    browser.tabs.update(id, {'muted': true});
})