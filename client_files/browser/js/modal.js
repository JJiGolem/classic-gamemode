var modal = new Vue({
    el: "#modal",
    data: {
        show: false,
        modals: {
            "farm_help": {
                header: "Как начать играть на ферме",
                content: `
                    <h3>1. Общая Информация</h3>
                    <p>
                        Начать работу на ферме можно, если у нее есть владелец. Владелец выставляет цены на закупку зерна, продажу урожая, покупку удобрения, а также заработные платы всем рабочим, включая премии. Также владелец должен иметь на балансе фермы некую сумму для выплаты зарплат рабочим и для закупок зерна, удобрений. Помимо этого владелец обязан выплачивать налог за ферму, который списывается каждый PayDay.
                    </p>
                    У фермы имеется четыре поля.
                    <img src="img/modal/farm_help/1.png" />
                    <br/>
                    <h4>Существует три вида урожая: А, Б, С.</h4>
                    <ul>
                        <li>А - капуста.</li>
                        <li>Б - тыква.</li>
                        <li>С - конопля.</li>
                    </ul>
                    <h4>В распоряжении фермы имеются:</h4>
                    Пикапы для загрузки урожая.<br/>
                    <img src="img/modal/farm_help/2.png" /><br/>
                    Трактор для посева полей.<br/>
                    <img src="img/modal/farm_help/3.png" /><br/>
                    Самолёт для удобрения полей.<br/>
                    <img src="img/modal/farm_help/4.png" />
                    <h3>2. Задачи рабочего</h3>
                    <p>
                        Задача рабочего заключается только в сборе урожая и складывании его в машину. Для начала работы вам надо устроиться на ферме рабочим и пойти на одно из четырёх полей. Придя на поле, вы должны удостовериться, что на нём стоит машина для загрузки. Если машина уже стоит, то нужно подойти к выросшему урожаю и нажать клавишу “E”. После нажатия должен начаться сбор урожая. По окончании сбора у вас в руках появится один из трёх видов урожая, который вы должны отнести к багажнику пикапа, стоящего рядом с полем.
                    </p>
                    <h3>3. Задачи фермера</h3>
                    <p>
                        Работа фермера состоит в том, что он обязан следить за пикапами, вовремя поставлять их на созревшее поле для дальнейшей загрузки урожаем и следить, чтобы загруженные пикапы были вовремя доставлены к элеватору для разгрузки.
                    </p>
                    <h3>4. Задачи тракториста</h3>
                    <p>Тракторист занимается засеванием полей. Чтоб начать посев, трактористу требуется:</p>
                    <ol>
                        <li>Сесть в трактор и доехать до элеватора.</li>
                        <li>В элеваторе выбрать пункт “Зерно” -> “Загрузка”.</li>
                        <li>Выбрав пункт “Загрузка”, вы должны выбрать, какое поле засевать.</li>
                        <li>Выбрав поле, вы выбираете тип зерна (A, B или C).</li>
                        <li>После этого нужно нажать “Загрузиться” и в трактор загрузится 600 единиц зерна. Если на складе меньше 600 единиц зерна, то трактор не загрузится. После загрузки нужно ехать к тому полю, которое выбрали в “Загрузке” и двигаться по маркерам. На маркер можно заезжать только капотом.</li>
                    </ol>
                    <h3>5. Задачи пилота</h3>
                    <p>
                        Задача пилота заключается в удобрении полей. Ему требуется взять самолёт, который находится на ближайшем аэродроме в ангаре. После этого нужно заправиться удобрением (в самолет можно заправить 200 единиц удобрения) и дальше следовать по маркерам.
                    </p>
                `
            }
        },
        modal: null,
    },
});

// for tests
// modal.modal = modal.modals["farm_help"];
// modal.show = true;