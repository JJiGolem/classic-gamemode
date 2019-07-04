/// Модуль обновляет время на сервере

setInterval(()=>{

    let date = new Date();

    mp.world.time.hour = date.getHours();
    mp.world.time.minute = date.getMinutes();
    mp.world.time.second = date.getSeconds();

}, 1000);