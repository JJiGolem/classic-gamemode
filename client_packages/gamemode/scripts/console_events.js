exports = (menu) => {
    mp.events.add("console.push", (type, text) => {
        if (typeof text != "string") text = JSON.stringify(text);
        var types = ['log', 'info', 'warning', 'error', 'debug'];
        var index = types.indexOf(type);
        if (index == -1) return menu.execute(`consoleAPI.error('Тип лога не распознан!')`);
        //menu.execute(`alert('push')`);
        menu.execute(`consoleAPI.${type}('${text.escape()}')`);
    });

    mp.events.add("console.enable", (enable) => {
        menu.execute(`consoleAPI.enable(${enable})`);
    });

    mp.events.add("console.send", (message) => {
        if (!isFlood()) mp.events.callRemote(`console.send`, message);
    });

    mp.events.add("setConsoleActive", (enable) => {
        mp.consoleActive = enable;
    });

    mp.events.add("console.pushReport", (data) => {
        if (!Array.isArray(data)) data = [data];
        for (var i = 0; i < data.length; i++) {
            data[i].messages.forEach((m) => {
                var rec = getPlayerByName(m.name);
                m.playerRemoteId = (rec) ? rec.remoteId : "off";
            });
        }
        menu.execute(`consoleAPI.pushReport('${JSON.stringify(data)}')`);
    });

    mp.events.add("console.removeReport", (sqlId) => {
        menu.execute(`consoleAPI.removeReport(${sqlId})`);
    });

    mp.events.add("console.addReportMessage", (sqlId, messages) => {
        if (!Array.isArray(messages)) messages = [messages];
        messages.forEach((m) => {
            var rec = getPlayerByName(m.name);
            m.playerRemoteId = (rec) ? rec.remoteId : "off";
        });
        menu.execute(`consoleAPI.addReportMessage(${sqlId}, '${JSON.stringify(messages)}')`);
    });

    mp.events.add("console.chat", (player, text) => {
        menu.execute(`consoleAPI.chat('${JSON.stringify(player)}', '${text}')`);
    });

    mp.events.add("console.setReportAdminId", (sqlId, adminId) => {
        menu.execute(`consoleAPI.setReportAdminId(${sqlId}, ${adminId})`);
    });
}
