
var carSpecifications = new Vue({
    el: "#carSpecifications",
    data: {
        show: false,
        body: {
            name: { header: 'Название', value: '0', unit: '' },
            class: { header: 'Класс', value: '0', unit: '' },
            volume: { header: 'Объём бака', value: '0', unit: 'л' },
            consumption: { header: 'Расход топлива', value: '0', unit: 'л' },
            maxSpeed: { header: 'Макс. скорость', value: '0', unit: 'км/ч' },
            count: { header: 'В наличии', value: '0', unit: '' },
        },
        price: 2290000,
    },
    computed: {
        splitPrice () {
            price = this.price + '';
            return price.replace(/(\d)(?=(\d{3})+(\D|$))/g, '$1 ');
        },
    }
})

//for tests

carSpecifications.body.name.value = 'Elegy Retro';
carSpecifications.body.class.value = 'Седан';
carSpecifications.body.volume.value = '50';
carSpecifications.body.consumption.value = '2';
carSpecifications.body.maxSpeed.value = '125';

//carSpecifications.show = true;
