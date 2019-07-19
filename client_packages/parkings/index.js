var defaultMenu = {
    header: "Парковка",
    items: [{
            text: "Забрать автомобиль",
        },
        {
            text: "Закрыть меню",
        }
    ],
    i: 0,
    j: 0, 
}
mp.events.add('parkings.menu.show', () => {
    mp.callCEFVN({ "selectMenu.menu": defaultMenu });
    mp.callCEFVN({ "selectMenu.show": "true" });
});