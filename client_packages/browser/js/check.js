
var check = new Vue({
    el: "#check",
    data: {
        show: false,
        checkName: 'Счет за ремонт',
        logo: 'repairLogo.svg',
        //totalPrice: '1 000',
        records: [
            //{ header: "", price: 0 } // Тело чека - массив обектов с заголовком и стоймостью.
        ],
    },
    computed: {
        pathToLogo () {
            return 'img/check/' + this.logo;
        },
        totalPrice () {
            let sum = 0;
            this.records.forEach((record) => {
                sum += record.price;
            });
            return sum;
        },
    },
    methods: {
        hide () {
            this.show = false;
            mp.trigger("callRemote", "carservice.check.accept", 0);
            mp.trigger('carservice.check.close');
        },
        pay () {
            mp.trigger("callRemote", "carservice.check.accept", 1);
            mp.trigger('carservice.check.close');
        },
        refuse () {
            mp.trigger("callRemote", "carservice.check.accept", 0);
            mp.trigger('carservice.check.close');
        },
    },
    filters: {
      split: function (value) {
          value = value + '';
          return value.replace(/(\d)(?=(\d{3})+(\D|$))/g, '$1 ');
      }
    }
});

//for tests
check.records.push({ header: "Ремонт ротора", price: 2500 });
// check.records.push({ header: "Ремонт рулевой колонки", price: 2500 });
// check.records.push({ header: "Ремонт контактов свечей зажигания", price: 2500 });
// check.records.push({ header: "Ремонт ротора", price: 2500 });
// check.records.push({ header: "Ремонт рулевой колонки", price: 2500 });