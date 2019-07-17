mp.events.add('carshow.list.show', (list)=>{

    for (var i = 0; i < list.length; i++) {
        mp.chat.debug(`Модель: ${list[i].vehiclePropertyModel} Количество: ${list[i].count} ${list[i].properties.maxFuel}`);
    }
    // list.forEach((current)=>{
    //     mp.chat.debug(`Модель: ${current.vehiclePropertyModel} Количество: ${current.count} ${current.a}`);
    //     //mp.chat.debug(`MaxFuel: ${current.maxFuel}`);
    // });
    // for (var i = 0; i < list.length; i++) {
    //     mp.chat.debug(`${list[i].properties.maxFuel}`);
    // }
    //mp.chat.debug(`q: ${ list[0].properties.maxFuel}`);
});