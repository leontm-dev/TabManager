function alphabeticalOrder(arr) {
    return arr.sort((a, b) => a < b ? -1 : 1)
};
function removeDuplicates(arr) {
    let s = new Set(arr);
    let it = s.values();
    return Array.from(it);
};
window.addEventListener("load", (ev) => {
    switch (localStorage.getItem("tabManager")) {
        case "url":
            document.getElementById("checker-1").checked = true;
            break;
        case "title":
            document.getElementById("checker-2").checked = true;
            break;
        case "audio":
            document.getElementById("checker-3").checked = true;
            break;
    };
})
document.getElementById("switch-1").addEventListener("change", (ev) => {
    if (document.getElementById("checker-1").checked == true) {
        document.getElementById("checker-2").checked = false;
        document.getElementById("checker-3").checked = false;
        localStorage.setItem("tabManager", "url");
        chrome.tabs.query({}, (tab) => {
            for (let i = 0; i < tab.length; i++) {
                let tabURL = String(tab[i].url).replace("https://", "");
                if (!String(tab[i].url).startsWith("chrome://")) {
                    tabURL = tabURL.split("/")[0];
                    chrome.tabGroups.query({}, (tabGroup) => {
                        tabGroup.some((i) => {
                            if (i.title == tabURL) {
                                chrome.tabs.group(i.id, String(tab[i].id), (group) => {
                                    if (!typeof group === Number) {
                                        console.log(`Fehler bei Tab ${tab[i].title}: Tab konnte keiner Gruppe hinzugefügt werden!`);
                                    };
                                })
                            } else {
                                chrome.tabs.group(String(tab[i].id), (group) => {
                                    if (typeof group === Number) {
                                        chrome.tabGroups.update(group, { "title": tabURL }, (group2) => {
                                            if (!typeof group2.id === Number) {
                                                console.log(`Fehler bei Tab ${tab[i].title}: Tab-Gruppe konnte nicht bearbeitet werden!`);
                                            };
                                        });
                                    } else {
                                        console.log(`Fehler bei Tab ${tab[i].title}: Tab konnte keiner Gruppe hinzugefügt werden!`)
                                    }
                                })
                            }
                        })
                    })
                } else {
                    chrome.tabGroups.query({}, (tabGroup) => {
                        tabGroup.some((i) => {
                            if (i.title == tabURL) {
                                chrome.tabs.group(i.id, [ String(tab[i].id) ], (group) => {
                                    if (!typeof group === Number) {
                                        console.log(`Fehler bei Tab ${tab[i].title}: Tab konnte keiner Gruppe hinzugefügt werden!`);
                                    };
                                })
                            } else {
                                chrome.tabs.group([ String(tab[i].id) ], (group) => {
                                    if (typeof group === Number) {
                                        chrome.tabGroups.update(group, { "title": tabURL }, (group2) => {
                                            if (!typeof group2.id === Number) {
                                                console.log(`Fehler bei Tab ${tab[i].title}: Tab-Gruppe konnte nicht bearbeitet werden!`);
                                            };
                                        });
                                    } else {
                                        console.log(`Fehler bei Tab ${tab[i].title}: Tab konnte keiner Gruppe hinzugefügt werden!`)
                                    }
                                })
                            }
                        })
                    })
                };
            }
        });
    } else {
        chrome.tabs.query({}, (tab) => {
            let tabs = [];
            for (let i = 0; i < tab.length; i++) {
                tabs.push(tab[i].id);
            };
            chrome.tabs.ungroup(tabs, () => {});
        });
        localStorage.setItem("tabManager", "none");
    }
});
document.getElementById("switch-2").addEventListener("change", (ev) => {
    if (document.getElementById("checker-2").checked == true) {
        document.getElementById("checker-1").checked = false;
        document.getElementById("checker-3").checked = false;
        localStorage.setItem("tabManager", "title");
        chrome.tabs.query({}, (tab) => {
            if (tab.length == 1) {
                chrome.tabs.group({ "tabIds": tab[0].id }, (groupId) => {
                    chrome.tabGroups.update(groupId, { "title": String(tab[0].title)[0].toUpperCase() }, (group) => {
                        if (group.title == String(tab[0].title)[0].toUpperCase()) {
                            console.log(`Tab ${tab[0].title} wurde Gruppe ${String(tab[0].title)[0].toUpperCase()} hinzugefügt!`);
                        } else {
                            console.log("Fehler Tab Title: Gruppe konnte nicht umbenannt werden!");
                        };
                    })
                })
            } else if (tab.length > 1) {
                for (let i = 0; i < tab.length; i++) {
                    chrome.tabGroups.query({ "title": String(tab[i].title)[0].toUpperCase() }, (result) => {
                        if (result.length > 0) {
                            chrome.tabs.group({ "groupId": result[0].id, "tabIds": tab[i].id }, (groupId) => {
                                if (typeof groupId == Number) {
                                    console.log(`Tab ${tab[i].title} wurde seiner Gruppe ${String(tab[i].title)[0].toUpperCase()} hinzugefügt!`);
                                } else {
                                    console.log(`Fehler Tab Title: Tab ${tab[i].title} konnte seiner Gruppe nicht hinzugefügt werden!`);
                                }
                            });
                        } else if (result.length == 0) {
                            chrome.tabs.group({ "tabIds": tab[i].id }, (groupId) => {
                                chrome.tabGroups.update(groupId, { "title": String(tab[i].title)[0].toUpperCase() }, (group) => {
                                    if (group.title == String(tab[i].title)[0].toUpperCase()) {
                                        console.log(`Tab ${tab[i].title} wurde seiner Gruppe ${String(tab[i].title)[0].toUpperCase()} hinzugefügt!`);
                                    } else {
                                        console.log("Fehler Tab Title: Gruppe konnte nicht umbenannt werden!");
                                    }
                                })
                            })
                        }
                    })
                }
            }
        });
    } else {
        chrome.tabs.query({}, (tab) => {
            let tabs = [];
            for (let i = 0; i < tab.length; i++) {
                tabs.push(tab[i].id);
            };
            chrome.tabs.ungroup(tabs, () => {});
        });
        localStorage.setItem("tabManager", "none");
    }
});
// Sort by Audio
document.getElementById("switch-3").addEventListener("change", (ev) => {
    if (document.getElementById("checker-3").checked == true) {
        document.getElementById("checker-1").checked = false;
        document.getElementById("checker-2").checked = false;
        localStorage.setItem("tabManager", "audio");
        chrome.tabs.query({ "audible": true }, (tab) => {
            if (tab.length == 1) {
                chrome.tabs.group({ "tabIds": tab[0].id }, (groupId) => {
                    chrome.tabGroups.update(groupId, { "title": "Audio Playing"}, (group) => {
                        if (group.title == "Audio Playing") {
                            console.log("Gruppe Audio Playing fertig!");
                        } else {
                            console.log("Fehler!");
                        }
                    })
                })
            } else if (tab.length > 1) {
                chrome.tabs.group({ "tabIds": tab[0].id }, (groupId) => {
                    chrome.tabGroups.update(groupId, { "title": "Audio Playing"}, (group) => {
                        if (group.title == "Audio Playing") {
                            console.log(`Tab ${tab[0].title} zu Gruppe Audio Playing hinzugefügt!`);
                            for (let i = 1; i < tab.length; i++) {
                                chrome.tabs.group({ "groupId": groupId, "tabIds": tab[i].id }, (group2) => {
                                    if (group2.title == "Audio Playing") {
                                        console.log(`Tab ${tab[i].title} zu Gruppe Audio Playing hinzugefügt!`);
                                    } else {
                                        console.log("Fehler!");
                                    };
                                })
                            }
                        } else {
                            console.log("Fehler!");
                        }
                    })
                });
            }
        });
        chrome.tabs.query({ "audible": false }, (tab) => {
            if (tab.length == 1) {
                chrome.tabs.group({ "tabIds": tab[0].id }, (groupId) => {
                    chrome.tabGroups.update(groupId, { "title": "Muted"}, (group) => {
                        if (group.title == "Muted") {
                            console.log("Gruppe Muted fertig!");
                        } else {
                            console.log("Fehler!");
                        }
                    })
                })
            } else if (tab.length > 1) {
                chrome.tabs.group({ "tabIds": tab[0].id }, (groupId) => {
                    chrome.tabGroups.update(groupId, { "title": "Muted"}, (group) => {
                        if (group.title == "Muted") {
                            console.log(`Tab ${tab[0].title} zu Gruppe Muted hinzugefügt!`);
                            for (let i = 1; i < tab.length; i++) {
                                chrome.tabs.group({ "groupId": groupId, "tabIds": tab[i].id }, (group2) => {
                                    if (group2.title == "Muted") {
                                        console.log(`Tab ${tab[i].title} zu Gruppe Muted hinzugefügt!`);
                                    } else {
                                        console.log("Fehler!");
                                    };
                                })
                            }
                        } else {
                            console.log("Fehler!");
                        }
                    })
                });
            }
        });
    } else {
        chrome.tabs.query({}, (tab) => {
            let tabs = [];
            for (let i = 0; i < tab.length; i++) {
                tabs.push(tab[i].id);
            };
            chrome.tabs.ungroup(tabs, () => {});
        });
        localStorage.setItem("tabManager", "none");
    }
});