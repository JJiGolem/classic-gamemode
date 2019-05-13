/*
	10.11.2018 created by Carter.

	События для обработки и показа/скрытия меню.
*/

function playFocusSound() {
    mp.game.audio.playSoundFrontend(-1, "NAV_UP_DOWN", "HUD_FRONTEND_DEFAULT_SOUNDSET", true);
}

function playBackSound() {
    mp.game.audio.playSoundFrontend(-1, "CANCEL", "HUD_FRONTEND_DEFAULT_SOUNDSET", true);
}

function playSelectSound() {
    mp.game.audio.playSoundFrontend(-1, "SELECT", "HUD_FRONTEND_DEFAULT_SOUNDSET", true);
}

exports = (menu) => {
    var prevMenuName = "";

    var showHandlers = {
        "enter_biz_3": () => {
            var counts = getArrayClothesCounts();
            mp.events.callRemote(`requestClothes`, JSON.stringify(counts));
        },
        "biz_3_top": () => {
            var clothes = mp.storage.data.clothes.top[mp.clientStorage.sex];
            var items = clothesConvertToMenuItems(clothes);
            items.push({
                text: "Вернуться"
            });
            menu.execute(`selectMenuAPI.setSpecialItems('biz_3_top', '${JSON.stringify(items)}')`);
        },
        "biz_3_legs": () => {
            var clothes = mp.storage.data.clothes.legs[mp.clientStorage.sex];
            var items = clothesConvertToMenuItems(clothes);
            items.push({
                text: "Вернуться"
            });
            menu.execute(`selectMenuAPI.setSpecialItems('biz_3_legs', '${JSON.stringify(items)}')`);
        },
        "biz_3_feets": () => {
            var clothes = mp.storage.data.clothes.feets[mp.clientStorage.sex];
            var items = clothesConvertToMenuItems(clothes);
            items.push({
                text: "Вернуться"
            });
            menu.execute(`selectMenuAPI.setSpecialItems('biz_3_feets', '${JSON.stringify(items)}')`);
        },
        "biz_3_hats": () => {
            var clothes = mp.storage.data.clothes.hats[mp.clientStorage.sex];
            var items = clothesConvertToMenuItems(clothes);
            items.push({
                text: "Вернуться"
            });
            menu.execute(`selectMenuAPI.setSpecialItems('biz_3_hats', '${JSON.stringify(items)}')`);
        },
        "biz_3_glasses": () => {
            var clothes = mp.storage.data.clothes.glasses[mp.clientStorage.sex];
            var items = clothesConvertToMenuItems(clothes);
            items.push({
                text: "Вернуться"
            });
            menu.execute(`selectMenuAPI.setSpecialItems('biz_3_glasses', '${JSON.stringify(items)}')`);
        },
        "biz_3_bracelets": () => {
            var clothes = mp.storage.data.clothes.bracelets[mp.clientStorage.sex];
            var items = clothesConvertToMenuItems(clothes);
            items.push({
                text: "Вернуться"
            });
            menu.execute(`selectMenuAPI.setSpecialItems('biz_3_bracelets', '${JSON.stringify(items)}')`);
        },
        "biz_3_ears": () => {
            var clothes = mp.storage.data.clothes.ears[mp.clientStorage.sex];
            var items = clothesConvertToMenuItems(clothes);
            items.push({
                text: "Вернуться"
            });
            menu.execute(`selectMenuAPI.setSpecialItems('biz_3_ears', '${JSON.stringify(items)}')`);
        },
        "biz_3_masks": () => {
            var clothes = mp.storage.data.clothes.masks[mp.clientStorage.sex];
            var items = clothesConvertToMenuItems(clothes);
            items.push({
                text: "Вернуться"
            });
            menu.execute(`selectMenuAPI.setSpecialItems('biz_3_masks', '${JSON.stringify(items)}')`);
        },
        "biz_3_ties": () => {
            var clothes = mp.storage.data.clothes.ties[mp.clientStorage.sex];
            var items = clothesConvertToMenuItems(clothes);
            items.push({
                text: "Вернуться"
            });
            menu.execute(`selectMenuAPI.setSpecialItems('biz_3_ties', '${JSON.stringify(items)}')`);
        },
        "biz_3_watches": () => {
            var clothes = mp.storage.data.clothes.watches[mp.clientStorage.sex];
            var items = clothesConvertToMenuItems(clothes);
            items.push({
                text: "Вернуться"
            });
            menu.execute(`selectMenuAPI.setSpecialItems('biz_3_watches', '${JSON.stringify(items)}')`);
        },
    };
    mp.events.add("selectMenu.show", (menuName, selectedIndex = 0, values = null) => {
        // if (mp.players.local.vehicle) return;
        if (values) values = JSON.stringify(values);
        if (showHandlers[menuName]) showHandlers[menuName]();
        menu.execute(`selectMenuAPI.show('${menuName}', ${selectedIndex}, '${values}')`);
    });

    mp.events.add("selectMenu.hide", () => {
        menu.execute(`selectMenuAPI.hide()`);
    });

    mp.events.add("selectMenu.clearState", (menuName) => {
        menu.execute(`selectMenuAPI.clearState('${menuName}')`);
    });

    mp.events.add("selectMenu.setItems", (menuName, itemsName) => {
        menu.execute(`selectMenuAPI.setItems('${menuName}', '${itemsName}')`);
    });

    mp.events.add("selectMenu.setSpecialItems", (menuName, items) => {
        menu.execute(`selectMenuAPI.setSpecialItems('${menuName}', '${JSON.stringify(items)}')`);
    });

    mp.events.add("selectMenu.setHeader", (menuName, header) => {
        menu.execute(`selectMenuAPI.setHeader('${menuName}', '${header}')`);
    });

    mp.events.add("selectMenu.setPrompt", (menuName, text) => {
        menu.execute(`selectMenuAPI.setPrompt('${menuName}', '${text}')`);
    });

    mp.events.add("selectMenu.setItemValueIndex", (menuName, itemIndex, index) => {
        menu.execute(`selectMenuAPI.setItemValueIndex('${menuName}', ${itemIndex}, ${index})`);
    });

    mp.events.add("selectMenu.setItemName", (menuName, index, newName) => {
        menu.execute(`selectMenuAPI.setItemName('${menuName}', ${index}, ${newName})`);
    });

    var menuHandlers = {
        /* "character_main": {
            "Наследственность": () => {
                mp.events.call('selectMenu.show', 'character_parents');
                mp.events.call('showCharacterSkills');
                mp.events.call("focusOnHead", mp.players.local.position, -10);
            },
            "Внешность": () => {
                mp.events.call('selectMenu.show', 'character_look');
                mp.events.call("focusOnHead", mp.players.local.position, -10);
            },
            "Одежда": () => {
                mp.events.call('selectMenu.show', 'character_clothes');
                mp.events.call("focusOnBody", mp.players.local.position, -10);
            },
            "Далее": () => {
                if (!isFlood()) menu.execute(`regCharacterHandler()`);
                //mp.events.call("selectMenu.hide");
                //mp.events.call("modal.show", "character_reg");
                //setCursor(true);
            }
        },
        "character_parents": {
            "Вернуться": () => {
                mp.events.call('selectMenu.show', 'character_main', 2);
                hideWindow(".infoTable");
                mp.events.call("focusOnPlayer", mp.players.local.position, -10);
            }
        },
        "character_look": {
            "Вернуться": () => {
                mp.events.call('selectMenu.show', 'character_main', 3);
                mp.events.call("focusOnPlayer", mp.players.local.position, -10);
            }
        },
        "character_clothes": {
            "Вернуться": () => {
                mp.events.call('selectMenu.show', 'character_main', 4);
                mp.events.call("focusOnPlayer", mp.players.local.position, -10);
            }
        }, */
        /*"!enter_house": {
        	"Войти в дом": () => {
        		if (!isFlood()) mp.events.callRemote("enterHouse");
        	},
        	"Позвонить в звонок": () => {

        	},
        	"Информация о доме": () => {
        		if (!isFlood()) {
        			mp.events.callRemote("getHouseInfo");
        			mp.events.call("selectMenu.hide");
        		}
        	},
        },*/
        /*"!exit_house": {
        	"Выйти на улицу": () => {
        		if (!isFlood()) mp.events.callRemote(`goEnterStreet`);
        	},
        },*/
        /*"enter_garage": {
        	"Войти в гараж": () => {
        		if (!isFlood()) mp.events.callRemote("goEnterGarage");
        	},
        	"Постучать в дверь гаража": () => {

        	},
        	"Информация о гараже": () => {
        		if (!isFlood()) {
        			mp.events.callRemote("getGarageInfo");
        			mp.events.call("selectMenu.hide");
        		}
        	}
        },*/
        /*"exit_garage": {
        	"Выйти в дом": () => {
        		if (!isFlood()) mp.events.callRemote(`goExitGarage`);
        	},
        	"Выйти на улицу": () => {
        		if (!isFlood()) mp.events.callRemote(`goEnterStreetFromGarage`);
        	}
        },*/
        "enter_biz_1": {
            "Купить бизнес": () => {
                if (!isFlood()) {
                    mp.events.callRemote("biz.show", "biz_buy");
                    mp.events.call("selectMenu.hide");
                }
            },
            "Панель управления": () => {
                prevMenuName = "enter_biz_1";
                mp.events.call("selectMenu.show", "biz_panel");
            }
        },
        "sell_car": {
            "Продать автомобиль": () => {
                if (!isFlood()) {
                    mp.events.callRemote("sellCar");
                    mp.events.call("selectMenu.hide");
                }
            }
        },
        "enter_biz_2": {
            "Купить бизнес": () => {
                if (!isFlood()) {
                    mp.events.callRemote("biz.show", "biz_buy");
                    mp.events.call("selectMenu.hide");
                }
            },
            "Панель управления": () => {
                prevMenuName = "enter_biz_2";
                mp.events.call("selectMenu.show", "biz_panel");
            }
        },
        "enter_biz_3": {
            "Примерочная": () => {
                mp.events.callRemote("biz_3.clearItems", mp.helpers.interior.getCurrent());
								// mp.events.call("selectMenu.show", "biz_3_clothes");
            },
            "Купить бизнес": () => {
                if (!isFlood()) {
                    mp.events.callRemote("biz.show", "biz_buy");
                    mp.events.call("selectMenu.hide");
                }
            },
            "Панель управления": () => {
                prevMenuName = "enter_biz_3";
                mp.events.call("selectMenu.show", "biz_panel");
            }
        },
        "biz_3_clothes": {
            "Верхняя одежда": (itemValue, itemIndex) => {
                var comp = mp.storage.data.clothes.top[mp.clientStorage.sex][0];
                mp.players.local.setComponentVariation(3, comp.torso, 0, 0);
                mp.players.local.setComponentVariation(11, comp.variation, comp.textures[0], 0);
								mp.events.call("clothes_shop::resetView", "body", { name: "biz_3_top" });
            },
            "Нижняя одежда": () => {
                var comp = mp.storage.data.clothes.legs[mp.clientStorage.sex][0];
                mp.players.local.setComponentVariation(4, comp.variation, comp.textures[0], 0);
								mp.events.call("clothes_shop::resetView", "legs", { name: "biz_3_legs" });
            },
            "Обувь": () => {
                var comp = mp.storage.data.clothes.feets[mp.clientStorage.sex][0];
                mp.players.local.setComponentVariation(6, comp.variation, comp.textures[0], 0);
								mp.events.call("clothes_shop::resetView", "feet", { name: "biz_3_feets" });
            },
            "Головные уборы": () => {
                var comp = mp.storage.data.clothes.hats[mp.clientStorage.sex][0];
                mp.players.local.setPropIndex(0, comp.variation, comp.textures[0], true);
								mp.events.call("clothes_shop::resetView", "head", { name: "biz_3_hats" });
            },
            "Очки": () => {
                var comp = mp.storage.data.clothes.glasses[mp.clientStorage.sex][0];
                mp.players.local.setPropIndex(1, comp.variation, comp.textures[0], true);
								mp.events.call("clothes_shop::resetView", "head", { name: "biz_3_glasses" });
            },
            "Браслеты": (itemValue, itemIndex) => {
                var comp = mp.storage.data.clothes.bracelets[mp.clientStorage.sex][0];
                mp.players.local.setPropIndex(7, comp.variation, comp.textures[0], true);
								mp.events.call("clothes_shop::resetView", "body", { name: "biz_3_bracelets" });
            },
            "Серьги": (itemValue, itemIndex) => {
                var comp = mp.storage.data.clothes.ears[mp.clientStorage.sex][0];
                mp.players.local.setPropIndex(2, comp.variation, comp.textures[0], true);
								mp.events.call("clothes_shop::resetView", "head", { name: "biz_3_ears" });
            },
            "Маски": (itemValue, itemIndex) => {
                var comp = mp.storage.data.clothes.masks[mp.clientStorage.sex][0];
                mp.players.local.setComponentVariation(1, comp.variation, comp.textures[0], 0);
								mp.events.call("clothes_shop::resetView", "head", { name: "biz_3_masks" });
            },
            "Аксессуары": (itemValue, itemIndex) => {
                var comp = mp.storage.data.clothes.ties[mp.clientStorage.sex][0];
                mp.players.local.setComponentVariation(7, comp.variation, comp.textures[0], 0);
								mp.events.call("clothes_shop::resetView", "body", { name: "biz_3_ties" });
            },
            "Часы": (itemValue, itemIndex) => {
                var comp = mp.storage.data.clothes.watches[mp.clientStorage.sex][0];
                mp.players.local.setPropIndex(6, comp.variation, comp.textures[0], true);
								mp.events.call("clothes_shop::resetView", "body", { name: "biz_3_watches" });
            },
            "Завершить": () => {
								mp.events.call("selectMenu.hide");
								mp.events.callRemote("clothes_shop::stopDressing");
            },
        },
        "biz_3_top": {
            "Вернуться": () => {
								mp.events.call("clothes_shop::resetView", "full", { name: "biz_3_clothes", index: 0 });
            }
        },
        "biz_3_legs": {
            "Вернуться": () => {
								mp.events.call("clothes_shop::resetView", "full", { name: "biz_3_clothes", index: 1 });
            }
        },
        "biz_3_feets": {
            "Вернуться": () => {
								mp.events.call("clothes_shop::resetView", "full", { name: "biz_3_clothes", index: 2 });
            }
        },
        "biz_3_hats": {
            "Вернуться": () => {
								mp.events.call("clothes_shop::resetView", "full", { name: "biz_3_clothes", index: 3 });
            }
        },
        "biz_3_glasses": {
            "Вернуться": () => {
								mp.events.call("clothes_shop::resetView", "full", { name: "biz_3_clothes", index: 4 });
            }
        },
        "biz_3_bracelets": {
            "Вернуться": () => {
								mp.events.call("clothes_shop::resetView", "full", { name: "biz_3_clothes", index: 5 });
            }
        },
        "biz_3_ears": {
            "Вернуться": () => {
								mp.events.call("clothes_shop::resetView", "full", { name: "biz_3_clothes", index: 6 });
            }
        },
        "biz_3_masks": {
            "Вернуться": () => {
								mp.events.call("clothes_shop::resetView", "full", { name: "biz_3_clothes", index: 7 });
            }
        },
        "biz_3_ties": {
            "Вернуться": () => {
								mp.events.call("clothes_shop::resetView", "full", { name: "biz_3_clothes", index: 8 });
            }
        },
        "biz_3_watches": {
            "Вернуться": () => {
								mp.events.call("clothes_shop::resetView", "full", { name: "biz_3_clothes", index: 9 });
            }
        },
        "enter_biz_4": {
            "Купить бизнес": () => {
                if (!isFlood()) {
                    mp.events.callRemote("biz.show", "biz_buy");
                    mp.events.call("selectMenu.hide");
                }
            },
            "Панель управления": () => {
                prevMenuName = "enter_biz_4";
                mp.events.call("selectMenu.show", "biz_panel");
            }
        },
        "enter_biz_5": {
            "Топливо": () => {
                mp.events.call('selectMenu.show', 'biz_5_items');
            },
            "Купить бизнес": () => {
                if (!isFlood()) {
                    mp.events.callRemote("biz.show", "biz_buy");
                    mp.events.call("selectMenu.hide");
                }
            },
            "Панель управления": () => {
                prevMenuName = "enter_biz_5";
                mp.events.call("selectMenu.show", "biz_panel");
            }
        },
        "biz_5_items": {
            "Заправить": (value) => {
                mp.events.callRemote("biz_5.buyItem", 0, parseInt(value));
            },
            "Пополнить канистру": (value) => {
                mp.events.callRemote("biz_5.buyItem", 1);
            },
            "Вернуться": () => {
                mp.events.call("selectMenu.show", "enter_biz_5");
            },
        },
        "enter_biz_6": {
            "Магазин": () => {
                mp.events.call('selectMenu.show', 'biz_6_items');
            },
            "Купить бизнес": () => {
                if (!isFlood()) {
                    mp.events.callRemote("biz.show", "biz_buy");
                    mp.events.call("selectMenu.hide");
                }
            },
            "Панель управления": () => {
                prevMenuName = "enter_biz_6";
                mp.events.call("selectMenu.show", "biz_panel");
            }
        },
        "biz_6_items": {
            0: () => {
                mp.events.callRemote("biz_6.buyItem", 30);
            },
            1: () => {
                mp.events.callRemote("biz_6.buyItem", 31);
            },
            2: () => {
                mp.events.callRemote("biz_6.buyItem", 32);
            },
            3: () => {
                mp.events.callRemote("biz_6.buyItem", 33);
            },
            4: () => {
                mp.events.callRemote("biz_6.buyItem", 34);
            },
            5: () => {
                mp.events.callRemote("biz_6.buyItem", 35);
            },
            6: () => {
                mp.events.callRemote("biz_6.buyItem", 15);
            },
            7: () => {
                mp.events.callRemote("biz_6.buyItem", 13);
            },
            8: () => {
                mp.events.callRemote("biz_6.buyItem", 36);
            },
            9: () => {
                mp.events.callRemote("biz_6.buyItem", 25);
            },
            10: () => {
                mp.events.call("selectMenu.show", "enter_biz_6");
            },
        },
        "enter_biz_7": {
            "Купить бизнес": () => {
                if (!isFlood()) {
                    mp.events.callRemote("biz.show", "biz_buy");
                    mp.events.call("selectMenu.hide");
                }
            },
            "Панель управления": () => {
                prevMenuName = "enter_biz_7";
                mp.events.call("selectMenu.show", "biz_panel");
            }
        },
        "enter_biz_8": {
            "Оружия": () => {
                mp.events.call("selectMenu.show", "biz_8_guns");
            },
            "Патроны": () => {
                mp.events.call("selectMenu.show", "biz_8_ammo");
            },
            "Купить бизнес": () => {
                if (!isFlood()) {
                    mp.events.callRemote("biz.show", "biz_buy");
                    mp.events.call("selectMenu.hide");
                }
            },
            "Панель управления": () => {
                prevMenuName = "enter_biz_8";
                mp.events.call("selectMenu.show", "biz_panel");
            }
        },
        "biz_8_guns": {
            "Ближний бой": () => {
                mp.events.call("selectMenu.show", "biz_8_melee");
            },
            "Пистолеты": () => {
                mp.events.call("selectMenu.show", "biz_8_handguns");
            },
            "Пистолеты-пулеметы": () => {
                mp.events.call("selectMenu.show", "biz_8_submachine_guns");
            },
            "Ружья": () => {
                mp.events.call("selectMenu.show", "biz_8_shotguns");
            },
            "Вернуться": () => {
                mp.events.call("selectMenu.show", "enter_biz_8");
            },
        },
        "biz_8_melee": {
            0: () => {
                mp.events.callRemote(`biz_8.buyItem`, 41);
            },
            1: () => {
                mp.events.callRemote(`biz_8.buyItem`, 42);
            },
            2: () => {
                mp.events.callRemote(`biz_8.buyItem`, 43);
            },
            3: () => {
                mp.events.call("selectMenu.show", `biz_8_guns`);
            },
        },
        "biz_8_handguns": {
            0: () => {
                mp.events.callRemote(`biz_8.buyItem`, 44);
            },
            1: () => {
                mp.events.callRemote(`biz_8.buyItem`, 45);
            },
            2: () => {
                mp.events.call("selectMenu.show", `biz_8_guns`, 1);
            },
        },
        "biz_8_submachine_guns": {
            0: () => {
                mp.events.callRemote(`biz_8.buyItem`, 47);
            },
            1: () => {
                mp.events.callRemote(`biz_8.buyItem`, 48);
            },
            2: () => {
                mp.events.call("selectMenu.show", `biz_8_guns`, 2);
            },
        },
        "biz_8_shotguns": {
            0: () => {
                mp.events.callRemote(`biz_8.buyItem`, 49);
            },
            1: () => {
                mp.events.call("selectMenu.show", `biz_8_guns`, 3);
            },
        },
        "biz_8_ammo": {
            0: (value) => {
                if (!isFlood()) mp.events.callRemote(`biz_8.buyAmmo`, 0, parseInt(value));
            },
            1: (value) => {
                if (!isFlood()) mp.events.callRemote(`biz_8.buyAmmo`, 1, parseInt(value));
            },
            2: (value) => {
                if (!isFlood()) mp.events.callRemote(`biz_8.buyAmmo`, 2, parseInt(value));
            },
            3: (value) => {
                if (!isFlood()) mp.events.callRemote(`biz_8.buyAmmo`, 3, parseInt(value));
            },
            4: () => {
                mp.events.call(`selectMenu.show`, `enter_biz_8`, 1);
            },
        },
        "enter_biz_9": {
            "Купить авто": () => {
                mp.events.callRemote(`autoSaloon.openBuyerMenu`);
            }
            /*,
            "Купить бизнес": () => {
                if (!isFlood()) {
                    mp.events.callRemote("biz.show", "biz_buy");
                    mp.events.call("selectMenu.hide");
                }
            },
            "Панель управления": () => {
                prevMenuName = "enter_biz_9";
                mp.events.call("selectMenu.show", "biz_panel");
            }*/
        },
        "enter_biz_10": {
            "Купить бизнес": () => {
                if (!isFlood()) {
                    mp.events.callRemote("biz.show", "biz_buy");
                    mp.events.call("selectMenu.hide");
                }
            },
            "Панель управления": () => {
                prevMenuName = "enter_biz_10";
                mp.events.call("selectMenu.show", "biz_panel");
            }
        },
        "enter_biz_11": {
            "Купить бизнес": () => {
                if (!isFlood()) {
                    mp.events.callRemote("biz.show", "biz_buy");
                    mp.events.call("selectMenu.hide");
                }
            },
            "Панель управления": () => {
                prevMenuName = "enter_biz_11";
                mp.events.call("selectMenu.show", "biz_panel");
            }
        },
        "biz_panel": {
            "Информация о бизнесе": () => {
                if (!isFlood()) {
                    mp.events.callRemote("getBizInfo");
                    mp.events.call("selectMenu.hide");
                }
            },
            "Касса": () => {
                mp.events.call("selectMenu.show", "biz_cashbox");
            },
            "Доходы и расходы": () => {
                mp.events.call("selectMenu.show", "biz_stats");
            },
            "Товар": () => {
                mp.events.call("selectMenu.show", "biz_products");
            },
            "Персонал": () => {
                mp.events.call("selectMenu.show", "biz_staff");
            },
            "Улучшения для бизнеса": () => {
                mp.events.call("selectMenu.show", "biz_rise");
            },
            "Статус бизнеса": () => {
                mp.events.call("selectMenu.show", "biz_status");
            },
            "Продать бизнес": () => {
                mp.events.call("selectMenu.show", "biz_sell");
            },
            "Вернуться": () => {
                mp.events.call("selectMenu.show", prevMenuName);
            },
        },
        "biz_cashbox": {
            "Баланс кассы": () => {
                if (!isFlood()) {
                    mp.events.callRemote("biz.balance.get");
                    mp.events.call("selectMenu.hide");
                }
            },
            "Вывести с кассы": () => {
                mp.events.call("modal.show", "biz_balance_take");
                mp.events.call("selectMenu.hide");
            },
            "Пополнить кассу": () => {
                mp.events.call("modal.show", "biz_balance_add");
                mp.events.call("selectMenu.hide");
            },
            "Вернуться": () => {
                mp.events.call("selectMenu.show", "biz_panel", 1);
            }
        },
        "biz_stats": {
            "История кассы": () => {
                if (!isFlood()) {
                    mp.events.call("setLocalVar", "bizLogsOffset", 0);
                    mp.events.callRemote("biz.getStats", mp.clientStorage["bizLogsOffset"]);
                    mp.events.call("selectMenu.hide");
                }
            },
            "Вернуться": () => {
                mp.events.call("selectMenu.show", "biz_panel", 2);
            }
        },
        "biz_products": {
            "Закупить товар": () => {
                if (!isFlood()) {
                    mp.events.callRemote("biz.show", "biz_products_buy");
                    mp.events.call("selectMenu.hide");
                }
            },
            "Списать товар": () => {
                if (!isFlood()) {
                    mp.events.callRemote("biz.show", "biz_products_sell");
                    mp.events.call("selectMenu.hide");
                }
            },
            "Цена товара": () => {
                if (!isFlood()) {
                    mp.events.callRemote("biz.show", "biz_products_price");
                    mp.events.call("selectMenu.hide");
                }
            },
            "Вернуться": () => {
                mp.events.call("selectMenu.show", "biz_panel", 3);
            }
        },
        "biz_staff": {
            "Вернуться": () => {
                mp.events.call("selectMenu.show", "biz_panel", 4);
            }
        },
        "biz_rise": {
            "Вернуться": () => {
                mp.events.call("selectMenu.show", "biz_panel", 5);
            }
        },
        "biz_status": {
            "Открыть бизнес": () => {
                if (!isFlood()) {
                    mp.events.callRemote("biz.setStatus", 1);
                    mp.events.call("selectMenu.hide");
                }
            },
            "Закрыть бизнес": () => {
                if (!isFlood()) {
                    mp.events.callRemote("biz.setStatus", 0);
                    mp.events.call("selectMenu.hide");
                }
            },
            "Вернуться": () => {
                mp.events.call("selectMenu.show", "biz_panel", 6);
            }
        },
        "biz_sell": {
            "Гражданину": () => {
                if (!isFlood()) {
                    mp.events.callRemote("biz.show", "biz_sell_to_player");
                    mp.events.call("selectMenu.hide");
                }
            },
            "Государству": () => {
                if (!isFlood()) {
                    mp.events.callRemote("biz.show", "biz_sell_to_gov");
                    mp.events.call("selectMenu.hide");
                }
            },
            "Вернуться": () => {
                mp.events.call("selectMenu.show", "biz_panel", 7);
            }
        },

        "police_storage": {
            "Служебное вооружение": () => {
                mp.events.call("selectMenu.show", "police_guns");
            },
            "Гардероб": () => {
                mp.events.call("selectMenu.show", "police_clothes");
            },
            "Спец. предметы": () => {
                mp.events.call("selectMenu.show", "police_items");
            },
            "Патроны": () => {
                mp.events.call("selectMenu.show", "police_ammo");
            },
        },
        "police_guns": {
            "Nightstick": () => {
                if (!isFlood()) mp.events.callRemote(`policeStorage.takeGun`, 0);
            },
            "Flashlight": () => {
                if (!isFlood()) mp.events.callRemote(`policeStorage.takeGun`, 1);
            },
            "Stun Gun": () => {
                if (!isFlood()) mp.events.callRemote(`policeStorage.takeGun`, 2);
            },
            "Combat Pistol": () => {
                if (!isFlood()) mp.events.callRemote(`policeStorage.takeGun`, 3);
            },
            "Pump Shotgun": () => {
                if (!isFlood()) mp.events.callRemote(`policeStorage.takeGun`, 4);
            },
            "Carbine Rifle": () => {
                if (!isFlood()) mp.events.callRemote(`policeStorage.takeGun`, 5);
            },
            "Sniper Rifle": () => {
                if (!isFlood()) mp.events.callRemote(`policeStorage.takeGun`, 6);
            },
            "Вернуться": () => {
                mp.events.call("selectMenu.show", "police_storage");
            }
        },
        "police_items": {
            "Удостоверение PD": () => {
                if (!isFlood()) mp.events.callRemote(`policeStorage.takeItem`, 0);
            },
            "Рация": () => {
                if (!isFlood()) mp.events.callRemote(`policeStorage.takeItem`, 1);
            },
            "Наручники": () => {
                if (!isFlood()) mp.events.callRemote(`policeStorage.takeItem`, 2);
            },
            "Вернуться": () => {
                mp.events.call("selectMenu.show", "police_storage", 2);
            }
        },
        "police_ammo": {
            "Combat Pistol - 9mm": (value) => {
                if (!isFlood()) mp.events.callRemote(`policeStorage.takeAmmo`, 0, parseInt(value));
            },
            "Pump Shotgun - 12mm": (value) => {
                if (!isFlood()) mp.events.callRemote(`policeStorage.takeAmmo`, 1, parseInt(value));
            },
            "Carbine Rifle - 5.56mm": (value) => {
                if (!isFlood()) mp.events.callRemote(`policeStorage.takeAmmo`, 2, parseInt(value));
            },
            "Sniper Rifle - 7.62mm": (value) => {
                if (!isFlood()) mp.events.callRemote(`policeStorage.takeAmmo`, 3, parseInt(value));
            },
            "Вернуться": (value) => {
                mp.events.call("selectMenu.show", "police_storage", 3);
            }
        },
        "police_clothes": {
            "Форма офицера №1": () => {
                if (!isFlood()) mp.events.callRemote(`policeStorage.takeClothes`, 0);
            },
            "Форма SWAT": () => {
                if (!isFlood()) mp.events.callRemote(`policeStorage.takeClothes`, 1);
            },
            "Форма офицера №2": () => {
                if (!isFlood()) mp.events.callRemote(`policeStorage.takeClothes`, 2);
            },
            "Бронежилет": () => {
                if (!isFlood()) mp.events.callRemote(`policeStorage.takeArmour`);
            },
            "Вернуться": () => {
                mp.events.call("selectMenu.show", "police_storage", 1);
            }
        },
        "police_service": {
            "Восстановление вещей": () => {
                mp.events.call("selectMenu.show", "police_service_recovery");
            },
            "Оплата штрафа": () => {
                mp.events.callRemote("policeService.showClearFine");
                mp.events.call("selectMenu.hide");
            },
        },
        "police_service_recovery": {
            "Документы": () => {
                mp.events.callRemote("policeService.recovery.documents");
            },
            "Ключи от авто": () => {
                mp.events.callRemote("policeService.recovery.carKeys");
            },
            "Ключи от дома": (value) => {
                if (!value) return mp.events.call(`nError`, `У Вас нет дома!`);
                mp.events.callRemote("policeService.recovery.houseKeys", parseInt(value.substr(1)));
            },
            "Вернуться": () => {
                mp.events.call("selectMenu.show", "police_service");
            }
        },

        "gang_storage": {
            "Сейф": () => {
                mp.events.call("choose.gang.safe.menu");
            },
            "Оружейный арсенал": () => {
                mp.events.call("choose.gang.weapon.menu");
            },
            "Наркотики": () => {
                mp.events.call("choose.gang.drugs.menu");
            },
            "Боеприпасы": () => {
                mp.events.call("choose.gang.ammo.menu");
            },
            "Управление": () => {
                mp.events.call("choose.gang.control.menu");
            },
        },
        "gang_storage_1": {
            "Пополнить сейф": () => {
                mp.events.call("choose.gang.safe.money", true);
            },
            "Снять с сейфа": () => {
                mp.events.call("choose.gang.safe.money", false);
            },
            "Вернуться": () => {
                mp.events.call("selectMenu.show", "gang_storage");
            },
        },
        "gang_storage_2": {
            "Положить наркотики": () => {
                mp.events.call("put.gang.drugs.menu");
            },
            "Взять наркотики": () => {
                mp.events.call("put.gang.drugs_in.menu");
            },
            "Вернуться": () => {
                mp.events.call("selectMenu.show", "gang_storage");
            },
        },

        "gang_storage_3": {
            0: () => {
               mp.events.call("choose.gang.safe.drugs", 0, true);
            },
            1: () => {
               mp.events.call("choose.gang.safe.drugs", 1, true);
            },
            2: () => {
               mp.events.call("choose.gang.safe.drugs", 2, true);
            },
            3: () => {
               mp.events.call("choose.gang.safe.drugs", 3, true);
            },
            4: () => { mp.events.call("selectMenu.show", "gang_storage_2"); },
        },
        "gang_storage_4": {
            0: () => {
               mp.events.call("choose.gang.safe.drugs", 0, false);
            },
            1: () => {
               mp.events.call("choose.gang.safe.drugs", 1, false);
            },
            2: () => {
               mp.events.call("choose.gang.safe.drugs", 2, false);
            },
            3: () => {
               mp.events.call("choose.gang.safe.drugs", 3, false);
            },
            4: () => { mp.events.call("selectMenu.show", "gang_storage_2"); },
        },
        "gang_storage_5": {
            "Положить боеприпасы": () => {
                mp.events.call("put.gang.ammo.menu");
            },
            "Взять боеприпасы": () => {
                mp.events.call("put.gang.ammo_in.menu");
            },
            "Вернуться": () => {
                mp.events.call("selectMenu.show", "gang_storage");
            },
        },
        "gang_storage_6": {
          0: () => {
             mp.events.call("choose.gang.safe.ammo", 0, true);
          },
          1: () => {
             mp.events.call("choose.gang.safe.ammo", 1, true);
          },
          2: () => {
             mp.events.call("choose.gang.safe.ammo", 2, true);
          },
          3: () => {
             mp.events.call("choose.gang.safe.ammo", 3, true);
          },
          4: () => { mp.events.call("selectMenu.show", "gang_storage_5"); },
        },
        "gang_storage_7": {
          0: () => {
             mp.events.call("choose.gang.safe.ammo", 0, false);
          },
          1: () => {
             mp.events.call("choose.gang.safe.ammo", 1, false);
          },
          2: () => {
             mp.events.call("choose.gang.safe.ammo", 2, false);
          },
          3: () => {
             mp.events.call("choose.gang.safe.ammo", 3, false);
          },
          4: () => { mp.events.call("selectMenu.show", "gang_storage_5"); },
        },
        "gang_storage_8": {
            "Открыть / Закрыть склад": () => {
                mp.events.call("gang.set.lock");
            },
            "Установить ранговые ограничения": () => {
                mp.events.call("choose.gang.ranks.menu");
            },
            "Вернуться": () => {
                mp.events.call("selectMenu.show", "gang_storage");
            },
        },

        "gang_storage_9": {
          "Доступ к оружию": () => {
              mp.events.call("send.gang.allow.menu", 0);
          },
          "Доступ к наркотикам": () => {
              mp.events.call("send.gang.allow.menu", 1);
          },
          "Доступ к боеприпасам": () => {
              mp.events.call("send.gang.allow.menu", 2);
          },
          "Доступ к управлению": () => {
              mp.events.call("send.gang.allow.menu", 3);
          },
          "Вернуться": () => {
              mp.events.call("selectMenu.show", "gang_storage_8");
          },
        },
        "gang_storage_10": {
            "Положить оружие": () => {
                mp.events.call("put.gang.weapon.menu");
            },
            "Взять оружие": () => {
                mp.events.call("put.gang.weapon_in.menu");
            },
            "Вернуться": () => {
                mp.events.call("selectMenu.show", "gang_storage");
            },
        },
        "gang_storage_11": {
            "Холодное оружие": () => {
                mp.events.call("selectMenu.show", "gang_storage_11_1");
            },
            "Пистолеты": () => {
                mp.events.call("selectMenu.show", "gang_storage_11_2");
            },
            "Пистолеты-пулеметы": () => {
                mp.events.call("selectMenu.show", "gang_storage_11_3");
            },
            "Ружья": () => {
                mp.events.call("selectMenu.show", "gang_storage_11_4");
            },
            "Штурмовые винтовки": () => {
                mp.events.call("selectMenu.show", "gang_storage_11_5");
            },
            "Легкие пулеметы": () => {
                mp.events.call("selectMenu.show", "gang_storage_11_6");
            },
            "Снайперские винтовки": () => {
                mp.events.call("selectMenu.show", "gang_storage_11_7");
            },
            "Тяжелое оружие": () => {
                mp.events.call("selectMenu.show", "gang_storage_11_8");
            },
            "Метательное оружие": () => {
                mp.events.call("selectMenu.show", "gang_storage_11_9");
            },
            "Разное": () => {
                mp.events.call("selectMenu.show", "gang_storage_11_10");
            },
            "Вернуться": () => {
                mp.events.call("selectMenu.show", "gang_storage_10");
            },
        },
        "gang_storage_12": {
          "Холодное оружие": () => {
              mp.events.call("selectMenu.show", "gang_storage_12_1");
          },
          "Пистолеты": () => {
              mp.events.call("selectMenu.show", "gang_storage_12_2");
          },
          "Пистолеты-пулеметы": () => {
              mp.events.call("selectMenu.show", "gang_storage_12_3");
          },
          "Ружья": () => {
              mp.events.call("selectMenu.show", "gang_storage_12_4");
          },
          "Штурмовые винтовки": () => {
              mp.events.call("selectMenu.show", "gang_storage_12_5");
          },
          "Легкие пулеметы": () => {
              mp.events.call("selectMenu.show", "gang_storage_12_6");
          },
          "Снайперские винтовки": () => {
              mp.events.call("selectMenu.show", "gang_storage_12_7");
          },
          "Тяжелое оружие": () => {
              mp.events.call("selectMenu.show", "gang_storage_12_8");
          },
          "Метательное оружие": () => {
              mp.events.call("selectMenu.show", "gang_storage_12_9");
          },
          "Разное": () => {
              mp.events.call("selectMenu.show", "gang_storage_12_10");
          },
          "Вернуться": () => {
              mp.events.call("selectMenu.show", "gang_storage_10");
          },
        },
        "gang_storage_11_1": {
          0: () => { mp.events.call("take.gang.weapons.safe", 65, false); },
          1: () => { mp.events.call("take.gang.weapons.safe", 41, false); },
          2: () => { mp.events.call("take.gang.weapons.safe", 66, false); },
          3: () => { mp.events.call("take.gang.weapons.safe", 67, false); },
          4: () => { mp.events.call("take.gang.weapons.safe", 18, false); },
          5: () => { mp.events.call("take.gang.weapons.safe", 68, false); },
          6: () => { mp.events.call("take.gang.weapons.safe", 69, false); },
          7: () => { mp.events.call("take.gang.weapons.safe", 70, false); },
          8: () => { mp.events.call("take.gang.weapons.safe", 42, false); },
          9: () => { mp.events.call("take.gang.weapons.safe", 43, false); },
          10: () => { mp.events.call("take.gang.weapons.safe", 71, false); },
          11: () => { mp.events.call("take.gang.weapons.safe", 72, false); },
          12: () => { mp.events.call("take.gang.weapons.safe", 17, false); },
          13: () => { mp.events.call("take.gang.weapons.safe", 73, false); },
          14: () => { mp.events.call("take.gang.weapons.safe", 74, false); },
          15: () => { mp.events.call("take.gang.weapons.safe", 75, false); },
          16: () => { mp.events.call("take.gang.weapons.safe", 76, false); },
          17: () => { mp.events.call("selectMenu.show", "gang_storage_11"); },
    		},
        "gang_storage_12_1": {
          0: () => { mp.events.call("take.gang.weapons.safe", 65, true); },
          1: () => { mp.events.call("take.gang.weapons.safe", 41, true); },
          2: () => { mp.events.call("take.gang.weapons.safe", 66, true); },
          3: () => { mp.events.call("take.gang.weapons.safe", 67, true); },
          4: () => { mp.events.call("take.gang.weapons.safe", 18, true); },
          5: () => { mp.events.call("take.gang.weapons.safe", 68, true); },
          6: () => { mp.events.call("take.gang.weapons.safe", 69, true); },
          7: () => { mp.events.call("take.gang.weapons.safe", 70, true); },
          8: () => { mp.events.call("take.gang.weapons.safe", 42, true); },
          9: () => { mp.events.call("take.gang.weapons.safe", 43, true); },
          10: () => { mp.events.call("take.gang.weapons.safe", 71, true); },
          11: () => { mp.events.call("take.gang.weapons.safe", 72, true); },
          12: () => { mp.events.call("take.gang.weapons.safe", 17, true); },
          13: () => { mp.events.call("take.gang.weapons.safe", 73, true); },
          14: () => { mp.events.call("take.gang.weapons.safe", 74, true); },
          15: () => { mp.events.call("take.gang.weapons.safe", 75, true); },
          16: () => { mp.events.call("take.gang.weapons.safe", 76, true); },
          17: () => { mp.events.call("selectMenu.show", "gang_storage_12"); },
    		},
        "gang_storage_11_2": {
          0: () => { mp.events.call("take.gang.weapons.safe", 44, false); },
          1: () => { mp.events.call("take.gang.weapons.safe", 77, false); },
          2: () => { mp.events.call("take.gang.weapons.safe", 20, false); },
          3: () => { mp.events.call("take.gang.weapons.safe", 45, false); },
          4: () => { mp.events.call("take.gang.weapons.safe", 19, false); },
          5: () => { mp.events.call("take.gang.weapons.safe", 125, false); },
          6: () => { mp.events.call("take.gang.weapons.safe", 78, false); },
          7: () => { mp.events.call("take.gang.weapons.safe", 79, false); },
          8: () => { mp.events.call("take.gang.weapons.safe", 80, false); },
          9: () => { mp.events.call("take.gang.weapons.safe", 81, false); },
          10: () => { mp.events.call("take.gang.weapons.safe", 82, false); },
          11: () => { mp.events.call("take.gang.weapons.safe", 83, false); },
          12: () => { mp.events.call("take.gang.weapons.safe", 46, false); },
          13: () => { mp.events.call("take.gang.weapons.safe", 84, false); },
          14: () => { mp.events.call("take.gang.weapons.safe", 85, false); },
          15: () => { mp.events.call("selectMenu.show", "gang_storage_11"); },
        },
        "gang_storage_12_2": {
          0: () => { mp.events.call("take.gang.weapons.safe", 44, true); },
          1: () => { mp.events.call("take.gang.weapons.safe", 77, true); },
          2: () => { mp.events.call("take.gang.weapons.safe", 20, true); },
          3: () => { mp.events.call("take.gang.weapons.safe", 45, true); },
          4: () => { mp.events.call("take.gang.weapons.safe", 19, true); },
          5: () => { mp.events.call("take.gang.weapons.safe", 125, true); },
          6: () => { mp.events.call("take.gang.weapons.safe", 78, true); },
          7: () => { mp.events.call("take.gang.weapons.safe", 79, true); },
          8: () => { mp.events.call("take.gang.weapons.safe", 80, true); },
          9: () => { mp.events.call("take.gang.weapons.safe", 81, true); },
          10: () => { mp.events.call("take.gang.weapons.safe", 82, true); },
          11: () => { mp.events.call("take.gang.weapons.safe", 83, true); },
          12: () => { mp.events.call("take.gang.weapons.safe", 46, true); },
          13: () => { mp.events.call("take.gang.weapons.safe", 84, true); },
          14: () => { mp.events.call("take.gang.weapons.safe", 85, true); },
          15: () => { mp.events.call("selectMenu.show", "gang_storage_12"); },
        },
        "gang_storage_11_3": {
          0: () => { mp.events.call("take.gang.weapons.safe", 47, false); },
          1: () => { mp.events.call("take.gang.weapons.safe", 48, false); },
          2: () => { mp.events.call("take.gang.weapons.safe", 86, false); },
          3: () => { mp.events.call("take.gang.weapons.safe", 87, false); },
          4: () => { mp.events.call("take.gang.weapons.safe", 88, false); },
          5: () => { mp.events.call("take.gang.weapons.safe", 89, false); },
          6: () => { mp.events.call("take.gang.weapons.safe", 90, false); },
          7: () => { mp.events.call("selectMenu.show", "gang_storage_11"); },
        },
        "gang_storage_12_3": {
          0: () => { mp.events.call("take.gang.weapons.safe", 47, true); },
          1: () => { mp.events.call("take.gang.weapons.safe", 48, true); },
          2: () => { mp.events.call("take.gang.weapons.safe", 86, true); },
          3: () => { mp.events.call("take.gang.weapons.safe", 87, true); },
          4: () => { mp.events.call("take.gang.weapons.safe", 88, true); },
          5: () => { mp.events.call("take.gang.weapons.safe", 89, true); },
          6: () => { mp.events.call("take.gang.weapons.safe", 90, true); },
          7: () => { mp.events.call("selectMenu.show", "gang_storage_12"); },
        },
        "gang_storage_11_4": {
          0: () => { mp.events.call("take.gang.weapons.safe", 21, false); },
          1: () => { mp.events.call("take.gang.weapons.safe", 91, false); },
          2: () => { mp.events.call("take.gang.weapons.safe", 49, false); },
          3: () => { mp.events.call("take.gang.weapons.safe", 92, false); },
          4: () => { mp.events.call("take.gang.weapons.safe", 93, false); },
          5: () => { mp.events.call("take.gang.weapons.safe", 94, false); },
          6: () => { mp.events.call("take.gang.weapons.safe", 95, false); },
          7: () => { mp.events.call("take.gang.weapons.safe", 96, false); },
          8: () => { mp.events.call("take.gang.weapons.safe", 97, false); },
          9: () => { mp.events.call("selectMenu.show", "gang_storage_11"); },
        },
        "gang_storage_12_4": {
          0: () => { mp.events.call("take.gang.weapons.safe", 21, true); },
          1: () => { mp.events.call("take.gang.weapons.safe", 91, true); },
          2: () => { mp.events.call("take.gang.weapons.safe", 49, true); },
          3: () => { mp.events.call("take.gang.weapons.safe", 92, true); },
          4: () => { mp.events.call("take.gang.weapons.safe", 93, true); },
          5: () => { mp.events.call("take.gang.weapons.safe", 94, true); },
          6: () => { mp.events.call("take.gang.weapons.safe", 95, true); },
          7: () => { mp.events.call("take.gang.weapons.safe", 96, true); },
          8: () => { mp.events.call("take.gang.weapons.safe", 97, true); },
          9: () => { mp.events.call("selectMenu.show", "gang_storage_12"); },
        },
        "gang_storage_11_5": {
          0: () => { mp.events.call("take.gang.weapons.safe", 50, false); },
          1: () => { mp.events.call("take.gang.weapons.safe", 98, false); },
          2: () => { mp.events.call("take.gang.weapons.safe", 22, false); },
          3: () => { mp.events.call("take.gang.weapons.safe", 99, false); },
          4: () => { mp.events.call("take.gang.weapons.safe", 100, false); },
          5: () => { mp.events.call("take.gang.weapons.safe", 101, false); },
          6: () => { mp.events.call("take.gang.weapons.safe", 102, false); },
          7: () => { mp.events.call("take.gang.weapons.safe", 51, false); },
          8: () => { mp.events.call("take.gang.weapons.safe", 103, false); },
          9: () => { mp.events.call("take.gang.weapons.safe", 52, false); },
          10: () => { mp.events.call("selectMenu.show", "gang_storage_11"); },
        },
        "gang_storage_12_5": {
          0: () => { mp.events.call("take.gang.weapons.safe", 50, true); },
          1: () => { mp.events.call("take.gang.weapons.safe", 98, true); },
          2: () => { mp.events.call("take.gang.weapons.safe", 22, true); },
          3: () => { mp.events.call("take.gang.weapons.safe", 99, true); },
          4: () => { mp.events.call("take.gang.weapons.safe", 100, true); },
          5: () => { mp.events.call("take.gang.weapons.safe", 101, true); },
          6: () => { mp.events.call("take.gang.weapons.safe", 102, true); },
          7: () => { mp.events.call("take.gang.weapons.safe", 51, true); },
          8: () => { mp.events.call("take.gang.weapons.safe", 103, true); },
          9: () => { mp.events.call("take.gang.weapons.safe", 52, true); },
          10: () => { mp.events.call("selectMenu.show", "gang_storage_12"); },
        },
        "gang_storage_11_6": {
          0: () => { mp.events.call("take.gang.weapons.safe", 53, false); },
          1: () => { mp.events.call("take.gang.weapons.safe", 104, false); },
          2: () => { mp.events.call("take.gang.weapons.safe", 105, false); },
          3: () => { mp.events.call("take.gang.weapons.safe", 106, false); },
          4: () => { mp.events.call("selectMenu.show", "gang_storage_11"); },
        },
        "gang_storage_12_6": {
          0: () => { mp.events.call("take.gang.weapons.safe", 53, true); },
          1: () => { mp.events.call("take.gang.weapons.safe", 104, true); },
          2: () => { mp.events.call("take.gang.weapons.safe", 105, true); },
          3: () => { mp.events.call("take.gang.weapons.safe", 106, true); },
          4: () => { mp.events.call("selectMenu.show", "gang_storage_12"); },
        },
        "gang_storage_11_7": {
          0: () => { mp.events.call("take.gang.weapons.safe", 23, false); },
          1: () => { mp.events.call("take.gang.weapons.safe", 107, false); },
          2: () => { mp.events.call("take.gang.weapons.safe", 108, false); },
          3: () => { mp.events.call("take.gang.weapons.safe", 109, false); },
          4: () => { mp.events.call("take.gang.weapons.safe", 110, false); },
          5: () => { mp.events.call("selectMenu.show", "gang_storage_11"); },
        },
        "gang_storage_12_7": {
          0: () => { mp.events.call("take.gang.weapons.safe", 23, true); },
          1: () => { mp.events.call("take.gang.weapons.safe", 107, true); },
          2: () => { mp.events.call("take.gang.weapons.safe", 108, true); },
          3: () => { mp.events.call("take.gang.weapons.safe", 109, true); },
          4: () => { mp.events.call("take.gang.weapons.safe", 110, true); },
          5: () => { mp.events.call("selectMenu.show", "gang_storage_12"); },
        },
        "gang_storage_11_8": {
          0: () => { mp.events.call("take.gang.weapons.safe", 111, false); },
          1: () => { mp.events.call("take.gang.weapons.safe", 112, false); },
          2: () => { mp.events.call("take.gang.weapons.safe", 113, false); },
          3: () => { mp.events.call("take.gang.weapons.safe", 114, false); },
          4: () => { mp.events.call("take.gang.weapons.safe", 115, false); },
          5: () => { mp.events.call("take.gang.weapons.safe", 116, false); },
          6: () => { mp.events.call("take.gang.weapons.safe", 117, false); },
          7: () => { mp.events.call("selectMenu.show", "gang_storage_11"); },
        },
        "gang_storage_12_8": {
          0: () => { mp.events.call("take.gang.weapons.safe", 111, true); },
          1: () => { mp.events.call("take.gang.weapons.safe", 112, true); },
          2: () => { mp.events.call("take.gang.weapons.safe", 113, true); },
          3: () => { mp.events.call("take.gang.weapons.safe", 114, true); },
          4: () => { mp.events.call("take.gang.weapons.safe", 115, true); },
          5: () => { mp.events.call("take.gang.weapons.safe", 116, true); },
          6: () => { mp.events.call("take.gang.weapons.safe", 117, true); },
          7: () => { mp.events.call("selectMenu.show", "gang_storage_12"); },
        },
        "gang_storage_11_9": {
          0: () => { mp.events.call("take.gang.weapons.safe", 118, false); },
          1: () => { mp.events.call("take.gang.weapons.safe", 119, false); },
          2: () => { mp.events.call("take.gang.weapons.safe", 120, false); },
          3: () => { mp.events.call("take.gang.weapons.safe", 121, false); },
          4: () => { mp.events.call("take.gang.weapons.safe", 122, false); },
          5: () => { mp.events.call("selectMenu.show", "gang_storage_11"); },
        },
        "gang_storage_12_9": {
          0: () => { mp.events.call("take.gang.weapons.safe", 118, true); },
          1: () => { mp.events.call("take.gang.weapons.safe", 119, true); },
          2: () => { mp.events.call("take.gang.weapons.safe", 120, true); },
          3: () => { mp.events.call("take.gang.weapons.safe", 121, true); },
          4: () => { mp.events.call("take.gang.weapons.safe", 122, true); },
          5: () => { mp.events.call("selectMenu.show", "gang_storage_12"); },
        },
        "gang_storage_11_10": {
          0: () => { mp.events.call("take.gang.weapons.safe", 123, false); },
          1: () => { mp.events.call("take.gang.weapons.safe", 124, false); },
          2: () => { mp.events.call("selectMenu.show", "gang_storage_11"); },
        },
        "gang_storage_12_10": {
          0: () => { mp.events.call("take.gang.weapons.safe", 123, true); },
          1: () => { mp.events.call("take.gang.weapons.safe", 124, true); },
          2: () => { mp.events.call("selectMenu.show", "gang_storage_12"); },
        },

        "gang_storage_11_1111": {
          0: () => { mp.events.call("take.gang.weapons.safe", 65, false); },
          1: () => { mp.events.call("take.gang.weapons.safe", 9999999999999, false); },
          2: () => { mp.events.call("take.gang.weapons.safe", 9999999999999, false); },
          3: () => { mp.events.call("take.gang.weapons.safe", 9999999999999, false); },
          4: () => { mp.events.call("take.gang.weapons.safe", 9999999999999, false); },
          5: () => { mp.events.call("take.gang.weapons.safe", 9999999999999, false); },
          6: () => { mp.events.call("take.gang.weapons.safe", 9999999999999, false); },
          7: () => { mp.events.call("take.gang.weapons.safe", 9999999999999, false); },
          8: () => { mp.events.call("take.gang.weapons.safe", 9999999999999, false); },
          9: () => { mp.events.call("take.gang.weapons.safe", 9999999999999, false); },
          10: () => { mp.events.call("take.gang.weapons.safe", 9999999999999, false); },
          11: () => { mp.events.call("take.gang.weapons.safe", 9999999999999, false); },
          12: () => { mp.events.call("take.gang.weapons.safe", 9999999999999, false); },
          13: () => { mp.events.call("take.gang.weapons.safe", 9999999999999, false); },
          14: () => { mp.events.call("take.gang.weapons.safe", 9999999999999, false); },
          15: () => { mp.events.call("take.gang.weapons.safe", 9999999999999, false); },
          16: () => { mp.events.call("take.gang.weapons.safe", 9999999999999, false); },
          17: () => { mp.events.call("selectMenu.show", "gang_storage_5"); },
    		},

        "police_storage_2": {
            "Служебное вооружение": () => {
                mp.events.call("selectMenu.show", "police_guns_2");
            },
            "Гардероб": () => {
                mp.events.call("selectMenu.show", "police_clothes_2");
            },
            "Спец. предметы": () => {
                mp.events.call("selectMenu.show", "police_items_2");
            },
            "Патроны": () => {
                mp.events.call("selectMenu.show", "police_ammo_2");
            },
        },
        "police_guns_2": {
            "Nightstick": () => {
                if (!isFlood()) mp.events.callRemote(`policeStorage.takeGun`, 0);
            },
            "Flashlight": () => {
                if (!isFlood()) mp.events.callRemote(`policeStorage.takeGun`, 1);
            },
            "Stun Gun": () => {
                if (!isFlood()) mp.events.callRemote(`policeStorage.takeGun`, 2);
            },
            "Combat Pistol": () => {
                if (!isFlood()) mp.events.callRemote(`policeStorage.takeGun`, 3);
            },
            "Pump Shotgun": () => {
                if (!isFlood()) mp.events.callRemote(`policeStorage.takeGun`, 4);
            },
            "Carbine Rifle": () => {
                if (!isFlood()) mp.events.callRemote(`policeStorage.takeGun`, 5);
            },
            "Sniper Rifle": () => {
                if (!isFlood()) mp.events.callRemote(`policeStorage.takeGun`, 6);
            },
            "Вернуться": () => {
                mp.events.call("selectMenu.show", "police_storage_2");
            }
        },
        "police_items_2": {
            "Удостоверение LSSD": () => {
                if (!isFlood()) mp.events.callRemote(`policeStorage.takeItem`, 0);
            },
            "Рация": () => {
                if (!isFlood()) mp.events.callRemote(`policeStorage.takeItem`, 1);
            },
            "Наручники": () => {
                if (!isFlood()) mp.events.callRemote(`policeStorage.takeItem`, 2);
            },
            "Вернуться": () => {
                mp.events.call("selectMenu.show", "police_storage_2", 2);
            }
        },
        "police_ammo_2": {
            "Combat Pistol - 9mm": (value) => {
                if (!isFlood()) mp.events.callRemote(`policeStorage.takeAmmo`, 0, parseInt(value));
            },
            "Pump Shotgun - 12mm": (value) => {
                if (!isFlood()) mp.events.callRemote(`policeStorage.takeAmmo`, 1, parseInt(value));
            },
            "Carbine Rifle - 5.56mm": (value) => {
                if (!isFlood()) mp.events.callRemote(`policeStorage.takeAmmo`, 2, parseInt(value));
            },
            "Sniper Rifle - 7.62mm": (value) => {
                if (!isFlood()) mp.events.callRemote(`policeStorage.takeAmmo`, 3, parseInt(value));
            },
            "Вернуться": (value) => {
                mp.events.call("selectMenu.show", "police_storage_2", 3);
            }
        },
        "police_clothes_2": {
            "Спец. форма №1": () => {
                if (!isFlood()) mp.events.callRemote(`policeStorage.takeClothes`, 0);
            },
            "Форма Кадета": () => {
                if (!isFlood()) mp.events.callRemote(`policeStorage.takeClothes`, 1);
            },
            "Форма Помощника Шерифа": () => {
                if (!isFlood()) mp.events.callRemote(`policeStorage.takeClothes`, 2);
            },
            "Форма Сержанта": () => {
                if (!isFlood()) mp.events.callRemote(`policeStorage.takeClothes`, 3);
            },
            "Форма Лейтенанта": () => {
                if (!isFlood()) mp.events.callRemote(`policeStorage.takeClothes`, 4);
            },
            "Форма Капитана": () => {
                if (!isFlood()) mp.events.callRemote(`policeStorage.takeClothes`, 5);
            },
            "Форма Шерифа": () => {
                if (!isFlood()) mp.events.callRemote(`policeStorage.takeClothes`, 6);
            },
            "Бронежилет": () => {
                if (!isFlood()) mp.events.callRemote(`policeStorage.takeArmour`);
            },
            "Вернуться": () => {
                mp.events.call("selectMenu.show", "police_storage", 1);
            }
        },
        "police_service_2": {
            "Восстановление вещей": () => {
                mp.events.call("selectMenu.show", "police_service_recovery_2");
            },
            "Оплата штрафа": () => {
                mp.events.callRemote("policeService.showClearFine");
                mp.events.call("selectMenu.hide");
            },
        },
        "police_service_recovery_2": {
            "Документы": () => {
                mp.events.callRemote("policeService.recovery.documents");
            },
            "Ключи от авто": () => {
                mp.events.callRemote("policeService.recovery.carKeys");
            },
            "Ключи от дома": (value) => {
                if (!value) return mp.events.call(`nError`, `У Вас нет дома!`);
                mp.events.callRemote("policeService.recovery.houseKeys", parseInt(value.substr(1)));
            },
            "Вернуться": () => {
                mp.events.call("selectMenu.show", "police_service_2");
            }
        },

        "army_storage": {
            "Служебное вооружение": () => {
                mp.events.call("selectMenu.show", "army_guns");
            },
            "Гардероб": () => {
                mp.events.call("selectMenu.show", "army_clothes");
            },
            "Спец. предметы": () => {
                mp.events.call("selectMenu.show", "army_items");
            },
            "Патроны": () => {
                mp.events.call("selectMenu.show", "army_ammo");
            },
        },
        "army_guns": {
            "Combat Pistol": () => {
                if (!isFlood()) mp.events.callRemote(`armyStorage.takeGun`, 0);
            },
            "Pump Shotgun": () => {
                if (!isFlood()) mp.events.callRemote(`armyStorage.takeGun`, 1);
            },
            "Carbine Rifle": () => {
                if (!isFlood()) mp.events.callRemote(`armyStorage.takeGun`, 2);
            },
            "Sniper Rifle": () => {
                if (!isFlood()) mp.events.callRemote(`armyStorage.takeGun`, 3);
            },
            "Вернуться": () => {
                mp.events.call("selectMenu.show", "army_storage");
            }
        },
        "army_items": {
            "Удостоверение Army": () => {
                if (!isFlood()) mp.events.callRemote(`armyStorage.takeItem`, 0);
            },
            "Рация": () => {
                if (!isFlood()) mp.events.callRemote(`armyStorage.takeItem`, 1);
            },
            "Вернуться": () => {
                mp.events.call("selectMenu.show", "army_storage", 2);
            }
        },
        "army_clothes": {
            "Форма рекрута": () => {
                if (!isFlood()) mp.events.callRemote(`armyStorage.takeClothes`, 0);
            },
            "Тактический набор №1": () => {
                if (!isFlood()) mp.events.callRemote(`armyStorage.takeClothes`, 1);
            },
            "Отдел IB": () => {
                if (!isFlood()) mp.events.callRemote(`armyStorage.takeClothes`, 2);
            },
            "Отдел FZA": () => {
                if (!isFlood()) mp.events.callRemote(`armyStorage.takeClothes`, 3);
            },
            "Боевая форма TFB": () => {
                if (!isFlood()) mp.events.callRemote(`armyStorage.takeClothes`, 4);
            },
            "Отдел MLG": () => {
                if (!isFlood()) mp.events.callRemote(`armyStorage.takeClothes`, 5);
            },
            "Армейская форма №1": () => {
                if (!isFlood()) mp.events.callRemote(`armyStorage.takeClothes`, 6);
            },
            "Армейская форма №2": () => {
                if (!isFlood()) mp.events.callRemote(`armyStorage.takeClothes`, 7);
            },
            "Бронежилет": () => {
                if (!isFlood()) mp.events.callRemote(`armyStorage.takeArmour`);
            },
            "Вернуться": () => {
                mp.events.call("selectMenu.show", "army_storage", 1);
            }
        },
        "army_ammo": {
            "Combat Pistol - 9mm": (value) => {
                if (!isFlood()) mp.events.callRemote(`armyStorage.takeAmmo`, 0, parseInt(value));
            },
            "Pump Shotgun - 12mm": (value) => {
                if (!isFlood()) mp.events.callRemote(`armyStorage.takeAmmo`, 1, parseInt(value));
            },
            "Carbine Rifle - 5.56mm": (value) => {
                if (!isFlood()) mp.events.callRemote(`armyStorage.takeAmmo`, 2, parseInt(value));
            },
            "Sniper Rifle - 7.62mm": (value) => {
                if (!isFlood()) mp.events.callRemote(`armyStorage.takeAmmo`, 3, parseInt(value));
            },
            "Вернуться": (value) => {
                mp.events.call("selectMenu.show", "army_storage", 2);
            }
        },

        "news_storage": {
            "Гардероб": () => {
                mp.events.call("selectMenu.show", "news_storage_1");
            },
            "Спец. предметы": () => {
                mp.events.call("selectMenu.show", "news_storage_2");
            },
        },
        "news_storage_1": {
            "Бронежилет": () => {
                if (!isFlood()) mp.events.callRemote(`newsStorage.takeArmour`);
            },
            "Вернуться": () => {
                mp.events.call("selectMenu.show", "news_storage");
            },
        },
        "news_storage_2": {
            "Рация": () => {
                if (!isFlood()) mp.events.callRemote(`newsStorage.takeRation`);
            },
            "Вернуться": () => {
                mp.events.call("selectMenu.show", "news_storage");
            },
        },

        "army_storage_2": {
            "Служебное вооружение": () => {
                mp.events.call("selectMenu.show", "army_guns_2");
            },
            "Гардероб": () => {
                mp.events.call("selectMenu.show", "army_clothes_2");
            },
            "Спец. предметы": () => {
                mp.events.call("selectMenu.show", "army_items_2");
            },
            "Патроны": () => {
                mp.events.call("selectMenu.show", "army_ammo_2");
            },
        },
        "army_guns_2": {
            "Combat Pistol": () => {
                if (!isFlood()) mp.events.callRemote(`armyStorage.takeGun`, 0);
            },
            "Pump Shotgun": () => {
                if (!isFlood()) mp.events.callRemote(`armyStorage.takeGun`, 1);
            },
            "Carbine Rifle": () => {
                if (!isFlood()) mp.events.callRemote(`armyStorage.takeGun`, 2);
            },
            "Sniper Rifle": () => {
                if (!isFlood()) mp.events.callRemote(`armyStorage.takeGun`, 3);
            },
            "Вернуться": () => {
                mp.events.call("selectMenu.show", "army_storage_2");
            }
        },
        "army_items_2": {
            "Удостоверение Army": () => {
                if (!isFlood()) mp.events.callRemote(`armyStorage.takeItem`, 0);
            },
            "Рация": () => {
                if (!isFlood()) mp.events.callRemote(`armyStorage.takeItem`, 1);
            },
            "Вернуться": () => {
                mp.events.call("selectMenu.show", "army_storage_2", 2);
            }
        },
        "army_clothes_2": {
            "Отряд - GRS": () => {
                if (!isFlood()) mp.events.callRemote(`armyStorage.takeClothes`, 0);
            },
            "Отряд - TLS": () => {
                if (!isFlood()) mp.events.callRemote(`armyStorage.takeClothes`, 1);
            },
            "Отряд - FHS": () => {
                if (!isFlood()) mp.events.callRemote(`armyStorage.takeClothes`, 2);
            },
            "Армейская форма": () => {
                if (!isFlood()) mp.events.callRemote(`armyStorage.takeClothes`, 3);
            },
            "Спец. форма": () => {
                if (!isFlood()) mp.events.callRemote(`armyStorage.takeClothes`, 4);
            },
            "Бронежилет": () => {
                if (!isFlood()) mp.events.callRemote(`armyStorage.takeArmour`);
            },
            "Вернуться": () => {
                mp.events.call("selectMenu.show", "army_storage_2", 1);
            }
        },
        "army_ammo_2": {
            "Combat Pistol - 9mm": (value) => {
                if (!isFlood()) mp.events.callRemote(`armyStorage.takeAmmo`, 0, parseInt(value));
            },
            "Pump Shotgun - 12mm": (value) => {
                if (!isFlood()) mp.events.callRemote(`armyStorage.takeAmmo`, 1, parseInt(value));
            },
            "Carbine Rifle - 5.56mm": (value) => {
                if (!isFlood()) mp.events.callRemote(`armyStorage.takeAmmo`, 2, parseInt(value));
            },
            "Sniper Rifle - 7.62mm": (value) => {
                if (!isFlood()) mp.events.callRemote(`armyStorage.takeAmmo`, 3, parseInt(value));
            },
            "Вернуться": (value) => {
                mp.events.call("selectMenu.show", "army_storage_2", 2);
            }
        },

        "fib_storage": {
            "Служебное вооружение": () => {
                mp.events.call("selectMenu.show", "fib_guns");
            },
            "Гардероб": () => {
                mp.events.call("selectMenu.show", "fib_clothes");
            },
            "Спец. предметы": () => {
                mp.events.call("selectMenu.show", "fib_items");
            },
            "Патроны": () => {
                mp.events.call("selectMenu.show", "fib_ammo");
            },
        },
        "fib_guns": {
            "Nightstick": () => {
                if (!isFlood()) mp.events.callRemote(`fibStorage.takeGun`, 0);
            },
            "Flashlight": () => {
                if (!isFlood()) mp.events.callRemote(`fibStorage.takeGun`, 1);
            },
            "Stun Gun": () => {
                if (!isFlood()) mp.events.callRemote(`fibStorage.takeGun`, 2);
            },
            "Combat Pistol": () => {
                if (!isFlood()) mp.events.callRemote(`fibStorage.takeGun`, 3);
            },
            "Pump Shotgun": () => {
                if (!isFlood()) mp.events.callRemote(`fibStorage.takeGun`, 4);
            },
            "Carbine Rifle": () => {
                if (!isFlood()) mp.events.callRemote(`fibStorage.takeGun`, 5);
            },
            "Sniper Rifle": () => {
                if (!isFlood()) mp.events.callRemote(`fibStorage.takeGun`, 6);
            },
            "Вернуться": () => {
                mp.events.call("selectMenu.show", "fib_storage");
            }
        },
        "fib_items": {
            "Удостоверение FIB": () => {
                if (!isFlood()) mp.events.callRemote(`fibStorage.takeItem`, 0);
            },
            "Рация": () => {
                if (!isFlood()) mp.events.callRemote(`fibStorage.takeItem`, 1);
            },
            "Наручники": () => {
                if (!isFlood()) mp.events.callRemote(`fibStorage.takeItem`, 2);
            },
            "Вернуться": () => {
                mp.events.call("selectMenu.show", "fib_storage", 2);
            }
        },
        "fib_ammo": {
            "Combat Pistol - 9mm": (value) => {
                if (!isFlood()) mp.events.callRemote(`fibStorage.takeAmmo`, 0, parseInt(value));
            },
            "Pump Shotgun - 12mm": (value) => {
                if (!isFlood()) mp.events.callRemote(`fibStorage.takeAmmo`, 1, parseInt(value));
            },
            "Carbine Rifle - 5.56mm": (value) => {
                if (!isFlood()) mp.events.callRemote(`fibStorage.takeAmmo`, 2, parseInt(value));
            },
            "Sniper Rifle - 7.62mm": (value) => {
                if (!isFlood()) mp.events.callRemote(`fibStorage.takeAmmo`, 3, parseInt(value));
            },
            "Вернуться": (value) => {
                mp.events.call("selectMenu.show", "fib_storage", 3);
            }
        },
        "fib_clothes": {
            "Стажер": () => {
                if (!isFlood()) mp.events.callRemote(`fibStorage.takeClothes`, 0);
            },
            "Агент": () => {
                if (!isFlood()) mp.events.callRemote(`fibStorage.takeClothes`, 1);
            },
            "Тактический набор №1": () => {
                if (!isFlood()) mp.events.callRemote(`fibStorage.takeClothes`, 2);
            },
            "Тактический набор №2": () => {
                if (!isFlood()) mp.events.callRemote(`fibStorage.takeClothes`, 3);
            },
            "Форма снайпера": () => {
                if (!isFlood()) mp.events.callRemote(`fibStorage.takeClothes`, 4);
            },
            "Бронежилет": () => {
                if (!isFlood()) mp.events.callRemote(`fibStorage.takeArmour`);
            },
            "Вернуться": () => {
                mp.events.call("selectMenu.show", "fib_storage", 1);
            }
        },

        "hospital_storage": {
            "Служебные принадлежности": () => {
                mp.events.call("selectMenu.show", "hospital_items");
            },
            "Гардероб": () => {
                mp.events.call("selectMenu.show", "hospital_clothes");
            }
        },
        "hospital_items": {
            "Аптечка": (value) => {
                if (!isFlood()) mp.events.callRemote(`hospitalStorage.takeItem`, 0, parseInt(value));
            },
            "Пластырь": (value) => {
                if (!isFlood()) mp.events.callRemote(`hospitalStorage.takeItem`, 1, parseInt(value));
            },
            "Удостоверение Hospital": (value) => {
                if (!isFlood()) mp.events.callRemote(`hospitalStorage.takeItem`, 2);
            },
            "Рация": (value) => {
                if (!isFlood()) mp.events.callRemote(`hospitalStorage.takeItem`, 3);
            },
            "Вернуться": () => {
                mp.events.call("selectMenu.show", "hospital_storage");
            }
        },
        "hospital_clothes": {
            "Форма парамедика №1": () => {
                if (!isFlood()) mp.events.callRemote(`hospitalStorage.takeClothes`, 0);
            },
            "Форма парамедика №2": () => {
                if (!isFlood()) mp.events.callRemote(`hospitalStorage.takeClothes`, 1);
            },
            "Вернуться": () => {
                mp.events.call("selectMenu.show", "hospital_storage", 1);
            }
        },

        "band_dealer_menu": {
            "Оружия": () => {
                mp.events.call("selectMenu.show", "band_dealer_menu_guns");
            },
            "Патроны": () => {
                mp.events.call("selectMenu.show", "band_dealer_menu_ammo");
            },
            "Наркотики": () => {
                mp.events.call("selectMenu.show", "band_dealer_menu_drugs");
            },
            "Предметы": () => {
                mp.events.call("selectMenu.show", "band_dealer_menu_items");
            },
        },
        "band_dealer_menu_guns": {
            "Холодное оружие": () => {
                mp.events.call("selectMenu.show", "band_dealer_menu_melee");
            },
            "Пистолеты": () => {
                mp.events.call("selectMenu.show", "band_dealer_menu_handguns");
            },
            "Пистолеты-пулеметы": () => {
                mp.events.call("selectMenu.show", "band_dealer_menu_submachine_guns");
            },
            "Ружья": () => {
                mp.events.call("selectMenu.show", "band_dealer_menu_shotguns");
            },
            "Штурмовые винтовки": () => {
                mp.events.call("selectMenu.show", "band_dealer_menu_assault_rifles");
            },
            "Легкие пулеметы": () => {
                mp.events.call("selectMenu.show", "band_dealer_menu_light_machine_guns");
            },
            "Снайперские винтовки": () => {
                mp.events.call("selectMenu.show", "band_dealer_menu_sniper_rifles");
            },
            "Вернуться": () => {
                mp.events.call("selectMenu.show", "band_dealer_menu");
            },
        },
        "band_dealer_menu_melee": {
            "Бейсбольная бита | $200": () => {
                mp.events.callRemote(`bandDealer.buyGun`, 41);
            },
            "Кастет | $75": () => {
                mp.events.callRemote(`bandDealer.buyGun`, 42);
            },
            "Нож | $300": () => {
                mp.events.callRemote(`bandDealer.buyGun`, 43);
            },
            "Вернуться": () => {
                mp.events.call("selectMenu.show", `band_dealer_menu_guns`);
            },
        },
        "band_dealer_menu_handguns": {
            "Pistol | $800": () => {
                mp.events.callRemote(`bandDealer.buyGun`, 44);
            },
            "AP Pistol | $1200": () => {
                mp.events.callRemote(`bandDealer.buyGun`, 45);
            },
            "Heavy Revolver | $1400": () => {
                mp.events.callRemote(`bandDealer.buyGun`, 46);
            },
            "Вернуться": () => {
                mp.events.call("selectMenu.show", `band_dealer_menu_guns`, 1);
            },
        },
        "band_dealer_menu_submachine_guns": {
            "Micro SMG | $1800": () => {
                mp.events.callRemote(`bandDealer.buyGun`, 47);
            },
            "SMG | $1950": () => {
                mp.events.callRemote(`bandDealer.buyGun`, 48);
            },
            "Вернуться": () => {
                mp.events.call("selectMenu.show", `band_dealer_menu_guns`, 2);
            },
        },
        "band_dealer_menu_shotguns": {
            "Pump Shotgun | $2400": () => {
                mp.events.callRemote(`bandDealer.buyGun`, 21);
            },
            "Sawed-Off Shotgun | $2700": () => {
                mp.events.callRemote(`bandDealer.buyGun`, 49);
            },
            "Вернуться": () => {
                mp.events.call("selectMenu.show", `band_dealer_menu_guns`, 3);
            },
        },
        "band_dealer_menu_assault_rifles": {
            "Assault Rifle | $2800": () => {
                mp.events.callRemote(`bandDealer.buyGun`, 50);
            },
            "Bullpup Rifle | $3000": () => {
                mp.events.callRemote(`bandDealer.buyGun`, 51);
            },
            "Compact Rifle | $3000": () => {
                mp.events.callRemote(`bandDealer.buyGun`, 52);
            },
            "Вернуться": () => {
                mp.events.call("selectMenu.show", `band_dealer_menu_guns`, 4);
            },
        },
        "band_dealer_menu_ammo": {
            "Патроны - 9mm | $6": (value) => {
                if (!isFlood()) mp.events.callRemote(`bandDealer.buyAmmo`, 0, parseInt(value));
            },
            "Патроны - 12mm | $7": (value) => {
                if (!isFlood()) mp.events.callRemote(`bandDealer.buyAmmo`, 1, parseInt(value));
            },
            "Патроны - 5.56mm | $7": (value) => {
                if (!isFlood()) mp.events.callRemote(`bandDealer.buyAmmo`, 2, parseInt(value));
            },
            "Патроны - 7.62mm | $6": (value) => {
                if (!isFlood()) mp.events.callRemote(`bandDealer.buyAmmo`, 3, parseInt(value));
            },
            "Вернуться": () => {
                mp.events.call(`selectMenu.show`, `band_dealer_menu`, 1);
            },
        },
        "band_dealer_menu_drugs": {
            "Марихуана | $6": (value) => {
                if (!isFlood()) mp.events.callRemote(`bandDealer.buyDrgus`, 0, parseInt(value));
            },
            "МДМА | $10": (value) => {
                if (!isFlood()) mp.events.callRemote(`bandDealer.buyDrgus`, 1, parseInt(value));
            },
            "Кокаин | $8": (value) => {
                if (!isFlood()) mp.events.callRemote(`bandDealer.buyDrgus`, 2, parseInt(value));
            },
            "Метамфетамин | $9": (value) => {
                if (!isFlood()) mp.events.callRemote(`bandDealer.buyDrgus`, 3, parseInt(value));
            },
            "Вернуться": () => {
                mp.events.call(`selectMenu.show`, `band_dealer_menu`, 2);
            },
        },
        "band_dealer_menu_items": {
            "Стяжки | $150": () => {
                if (!isFlood()) mp.events.callRemote(`bandDealer.buyItems`, 0);
            },
            "Вернуться": () => {
                mp.events.call(`selectMenu.show`, `band_dealer_menu`, 3);
            },
        },

        "enter_driving_school": {
            "Лицензии": () => {
                mp.events.call("selectMenu.show", "driving_school_licenses");
            },
        },
        "driving_school_licenses": {
            "Водитель": () => {
                mp.events.call("selectMenu.show", "driving_school_car");
            },
            "Водный транспорт": () => {
                mp.events.call("selectMenu.show", "driving_school_water");
            },
            "Пилот": () => {
                mp.events.call("selectMenu.show", "driving_school_fly");
            },
            "Вернуться": () => {
                mp.events.call("selectMenu.show", "enter_driving_school");
            },
        },
        "driving_school_car": {
            "Автомобиль": () => {
                mp.events.callRemote("drivingSchool.buyLic", 1);
            },
            "Мототехника": () => {
                mp.events.callRemote("drivingSchool.buyLic", 2);
            },
            "Вернуться": () => {
                mp.events.call("selectMenu.show", "driving_school_licenses");
            }
        },
        "driving_school_water": {
            "Лодки": () => {
                mp.events.callRemote("drivingSchool.buyLic", 3);
            },
            "Яхты": () => {
                mp.events.callRemote("drivingSchool.buyLic", 4);
            },
            "Вернуться": () => {
                mp.events.call("selectMenu.show", "driving_school_licenses", 1);
            }
        },
        "driving_school_fly": {
            "Вертолёты": () => {
                mp.events.callRemote("drivingSchool.buyLic", 11);
            },
            "Самолёты": () => {
                mp.events.callRemote("drivingSchool.buyLic", 12);
            },
            "Вернуться": () => {
                mp.events.call("selectMenu.show", "driving_school_licenses", 2);
            }
        },

        "trucker_load": {
            "Загрузить": (value) => {
                if (!isFlood()) mp.events.callRemote(`trucker.buyTrailer`, parseInt(value));
                mp.events.call("selectMenu.hide");
            },
        },

        "enter_farm": {
            "Работа": () => {
                mp.events.call("selectMenu.show", "enter_farm_job");
            },
            "Информация": () => {

            },
            "Помощь": () => {

            },
        },
        "enter_farm_job": {
            "Рабочий": () => {
                mp.events.callRemote("farm.startJob", 0);
                mp.events.call("selectMenu.hide");
            },
            "Фермер": () => {
                mp.events.callRemote("farm.startJob", 1);
                mp.events.call("selectMenu.hide");
            },
            "Тракторист": () => {
                mp.events.callRemote("farm.startJob", 2);
                mp.events.call("selectMenu.hide");
            },
            "Пилот": () => {
                mp.events.callRemote("farm.startJob", 3);
                mp.events.call("selectMenu.hide");
            },
            "Уволиться": () => {
                mp.events.callRemote("farm.stopJob");
                mp.events.call("selectMenu.hide");
            },
            "Вернуться": () => {
                mp.events.call("selectMenu.show", "enter_farm");
            }
        },
        "farm_warehouse": {
            "Посев зерна": () => {
                mp.events.call("selectMenu.show", "farm_warehouse_fill_field");
            },
            "Покупка урожая": () => {
                mp.events.call("selectMenu.show", "farm_warehouse_buy_crop");
            },
            "Продажа зерна": () => {
                mp.events.call("selectMenu.show", "farm_warehouse_sell_grain");
            },
            "Выгрузка урожая": () => {
                mp.events.callRemote(`farm.warehouse.unloadCrop`);
                mp.events.call("selectMenu.hide");
            },
        },
        "farm_warehouse_fill_field": {
            "Загрузить": () => {

            },
            "Вернуться": () => {
                mp.events.call("selectMenu.show", "farm_warehouse");
            }
        },
        "farm_warehouse_buy_crop": {
            "Закупить": () => {

            },
            "Вернуться": () => {
                mp.events.call("selectMenu.show", "farm_warehouse", 1);
            }
        },
        "farm_warehouse_sell_grain": {
            "Продажа": () => {

            },
            "Вернуться": () => {
                mp.events.call("selectMenu.show", "farm_warehouse", 2);
            }
        },
    };
    for (var key in menuHandlers) {
        menuHandlers[key]["Закрыть"] = () => {
            mp.events.call(`selectMenu.hide`);
        }
    }

    let index_menu = [
      "biz_8_melee",
      "biz_8_handguns",
      "biz_8_submachine_guns",
      "biz_8_shotguns",
      "biz_8_ammo",
      "biz_6_items",
      "gang_storage_3",
      "gang_storage_4",
      "gang_storage_6",
      "gang_storage_7",
      "gang_storage_11_1",
      "gang_storage_12_1",
      "gang_storage_11_2",
      "gang_storage_12_2",
      "gang_storage_11_3",
      "gang_storage_12_3",
      "gang_storage_11_4",
      "gang_storage_12_4",
      "gang_storage_11_5",
      "gang_storage_12_5",
      "gang_storage_11_6",
      "gang_storage_12_6",
      "gang_storage_11_7",
      "gang_storage_12_7",
      "gang_storage_11_8",
      "gang_storage_12_8",
      "gang_storage_11_9",
      "gang_storage_12_9",
      "gang_storage_11_10",
      "gang_storage_12_10"
    ];

    mp.events.add("selectMenu.itemSelected", (menuName, itemName, itemValue, itemIndex) => {
        // debug(`itemSelected: ${menuName} ${itemName} ${itemValue} ${itemIndex}`);

        playSelectSound();

        if (menuHandlers[menuName] !== undefined) {
          if (menuHandlers[menuName][itemName] || menuHandlers[menuName][itemIndex]) {
            if (index_menu.includes(menuName))
                menuHandlers[menuName][itemIndex](itemValue, itemIndex);
            else
                menuHandlers[menuName][itemName](itemValue, itemIndex);
          }
        }

        if (menuName == "biz_3_top") {
            if (itemIndex >= mp.storage.data.clothes.top[mp.clientStorage.sex].length) return;
            itemIndex = Math.clamp(itemIndex, 0, mp.storage.data.clothes.top[mp.clientStorage.sex].length - 1);
            var comp = mp.storage.data.clothes.top[mp.clientStorage.sex][itemIndex];
            var texture = comp.textures.indexOf(itemValue);
            if (texture == -1) return mp.events.call("nError", "Текстура не найдена!");
            mp.events.callRemote("biz_3.buyItem", "top", itemIndex, texture);
        } else if (menuName == "biz_3_legs") {
            if (itemIndex >= mp.storage.data.clothes.legs[mp.clientStorage.sex].length) return;
            itemIndex = Math.clamp(itemIndex, 0, mp.storage.data.clothes.legs[mp.clientStorage.sex].length - 1);
            var comp = mp.storage.data.clothes.legs[mp.clientStorage.sex][itemIndex];
            var texture = comp.textures.indexOf(itemValue);
            if (texture == -1) return mp.events.call("nError", "Текстура не найдена!");
            mp.events.callRemote("biz_3.buyItem", "legs", itemIndex, texture);
        } else if (menuName == "biz_3_feets") {
            if (itemIndex >= mp.storage.data.clothes.feets[mp.clientStorage.sex].length) return;
            itemIndex = Math.clamp(itemIndex, 0, mp.storage.data.clothes.feets[mp.clientStorage.sex].length - 1);
            var comp = mp.storage.data.clothes.feets[mp.clientStorage.sex][itemIndex];
            var texture = comp.textures.indexOf(itemValue);
            if (texture == -1) return mp.events.call("nError", "Текстура не найдена!");
            mp.events.callRemote("biz_3.buyItem", "feets", itemIndex, texture);
        } else if (menuName == "biz_3_hats") {
            if (itemIndex >= mp.storage.data.clothes.hats[mp.clientStorage.sex].length) return;
            itemIndex = Math.clamp(itemIndex, 0, mp.storage.data.clothes.hats[mp.clientStorage.sex].length - 1);
            var comp = mp.storage.data.clothes.hats[mp.clientStorage.sex][itemIndex];
            var texture = comp.textures.indexOf(itemValue);
            if (texture == -1) return mp.events.call("nError", "Текстура не найдена!");
            mp.events.callRemote("biz_3.buyItem", "hats", itemIndex, texture);
        } else if (menuName == "biz_3_glasses") {
            if (itemIndex >= mp.storage.data.clothes.glasses[mp.clientStorage.sex].length) return;
            itemIndex = Math.clamp(itemIndex, 0, mp.storage.data.clothes.glasses[mp.clientStorage.sex].length - 1);
            var comp = mp.storage.data.clothes.glasses[mp.clientStorage.sex][itemIndex];
            var texture = comp.textures.indexOf(itemValue);
            if (texture == -1) return mp.events.call("nError", "Текстура не найдена!");
            mp.events.callRemote("biz_3.buyItem", "glasses", itemIndex, texture);
        } else if (menuName == "biz_3_bracelets") {
            if (itemIndex >= mp.storage.data.clothes.bracelets[mp.clientStorage.sex].length) return;
            itemIndex = Math.clamp(itemIndex, 0, mp.storage.data.clothes.bracelets[mp.clientStorage.sex].length - 1);
            var comp = mp.storage.data.clothes.bracelets[mp.clientStorage.sex][itemIndex];
            var texture = comp.textures.indexOf(itemValue);
            if (texture == -1) return mp.events.call("nError", "Текстура не найдена!");
            mp.events.callRemote("biz_3.buyItem", "bracelets", itemIndex, texture);
        } else if (menuName == "biz_3_ears") {
            if (itemIndex >= mp.storage.data.clothes.ears[mp.clientStorage.sex].length) return;
            itemIndex = Math.clamp(itemIndex, 0, mp.storage.data.clothes.ears[mp.clientStorage.sex].length - 1);
            var comp = mp.storage.data.clothes.ears[mp.clientStorage.sex][itemIndex];
            var texture = comp.textures.indexOf(itemValue);
            if (texture == -1) return mp.events.call("nError", "Текстура не найдена!");
            mp.events.callRemote("biz_3.buyItem", "ears", itemIndex, texture);
        } else if (menuName == "biz_3_masks") {
            if (itemIndex >= mp.storage.data.clothes.masks[mp.clientStorage.sex].length) return;
            itemIndex = Math.clamp(itemIndex, 0, mp.storage.data.clothes.masks[mp.clientStorage.sex].length - 1);
            var comp = mp.storage.data.clothes.masks[mp.clientStorage.sex][itemIndex];
            var texture = comp.textures.indexOf(itemValue);
            if (texture == -1) return mp.events.call("nError", "Текстура не найдена!");
            mp.events.callRemote("biz_3.buyItem", "masks", itemIndex, texture);
        } else if (menuName == "biz_3_ties") {
            if (itemIndex >= mp.storage.data.clothes.ties[mp.clientStorage.sex].length) return;
            itemIndex = Math.clamp(itemIndex, 0, mp.storage.data.clothes.ties[mp.clientStorage.sex].length - 1);
            var comp = mp.storage.data.clothes.ties[mp.clientStorage.sex][itemIndex];
            var texture = comp.textures.indexOf(itemValue);
            if (texture == -1) return mp.events.call("nError", "Текстура не найдена!");
            mp.events.callRemote("biz_3.buyItem", "ties", itemIndex, texture);
        } else if (menuName == "biz_3_watches") {
            if (itemIndex >= mp.storage.data.clothes.watches[mp.clientStorage.sex].length) return;
            itemIndex = Math.clamp(itemIndex, 0, mp.storage.data.clothes.watches[mp.clientStorage.sex].length - 1);
            var comp = mp.storage.data.clothes.watches[mp.clientStorage.sex][itemIndex];
            var texture = comp.textures.indexOf(itemValue);
            if (texture == -1) return mp.events.call("nError", "Текстура не найдена!");
            mp.events.callRemote("biz_3.buyItem", "watches", itemIndex, texture);
        }
    });

    mp.events.add("selectMenu.itemValueChanged", (menuName, itemName, itemValue, itemIndex, valueIndex) => {
        //debug(`itemValueChanged: ${menuName} ${itemName} ${itemValue}`);
        var menuHandlers = {};

        if (menuHandlers[menuName] && menuHandlers[menuName][itemName])
            menuHandlers[menuName][itemName](itemValue);
        if (menuName == "biz_3_top") {
            itemIndex = Math.clamp(itemIndex, 0, mp.storage.data.clothes.top[mp.clientStorage.sex].length - 1);
            var comp = mp.storage.data.clothes.top[mp.clientStorage.sex][itemIndex];
            mp.players.local.setComponentVariation(11, comp.variation, comp.textures[valueIndex], 0);
        } else if (menuName == "biz_3_legs") {
            itemIndex = Math.clamp(itemIndex, 0, mp.storage.data.clothes.legs[mp.clientStorage.sex].length - 1);
            var comp = mp.storage.data.clothes.legs[mp.clientStorage.sex][itemIndex];
            mp.players.local.setComponentVariation(4, comp.variation, comp.textures[valueIndex], 0);
        } else if (menuName == "biz_3_feets") {
            itemIndex = Math.clamp(itemIndex, 0, mp.storage.data.clothes.feets[mp.clientStorage.sex].length - 1);
            var comp = mp.storage.data.clothes.feets[mp.clientStorage.sex][itemIndex];
            mp.players.local.setComponentVariation(6, comp.variation, comp.textures[valueIndex], 0);
        } else if (menuName == "biz_3_hats") {
            itemIndex = Math.clamp(itemIndex, 0, mp.storage.data.clothes.hats[mp.clientStorage.sex].length - 1);
            var comp = mp.storage.data.clothes.hats[mp.clientStorage.sex][itemIndex];
            mp.players.local.setPropIndex(0, comp.variation, comp.textures[valueIndex], true);
        } else if (menuName == "biz_3_glasses") {
            itemIndex = Math.clamp(itemIndex, 0, mp.storage.data.clothes.glasses[mp.clientStorage.sex].length - 1);
            var comp = mp.storage.data.clothes.glasses[mp.clientStorage.sex][itemIndex];
            mp.players.local.setPropIndex(1, comp.variation, comp.textures[valueIndex], true);
        } else if (menuName == "biz_3_bracelets") {
            itemIndex = Math.clamp(itemIndex, 0, mp.storage.data.clothes.bracelets[mp.clientStorage.sex].length - 1);
            var comp = mp.storage.data.clothes.bracelets[mp.clientStorage.sex][itemIndex];
            mp.players.local.setPropIndex(7, comp.variation, comp.textures[valueIndex], true);
        } else if (menuName == "biz_3_ears") {
            itemIndex = Math.clamp(itemIndex, 0, mp.storage.data.clothes.ears[mp.clientStorage.sex].length - 1);
            var comp = mp.storage.data.clothes.ears[mp.clientStorage.sex][itemIndex];
            mp.players.local.setPropIndex(2, comp.variation, comp.textures[valueIndex], true);
        } else if (menuName == "biz_3_masks") {
            itemIndex = Math.clamp(itemIndex, 0, mp.storage.data.clothes.masks[mp.clientStorage.sex].length - 1);
            var comp = mp.storage.data.clothes.masks[mp.clientStorage.sex][itemIndex];
            mp.players.local.setComponentVariation(1, comp.variation, comp.textures[valueIndex], 0);
        } else if (menuName == "biz_3_ties") {
            itemIndex = Math.clamp(itemIndex, 0, mp.storage.data.clothes.ties[mp.clientStorage.sex].length - 1);
            var comp = mp.storage.data.clothes.ties[mp.clientStorage.sex][itemIndex];
            mp.players.local.setComponentVariation(7, comp.variation, comp.textures[valueIndex], 0);
        } else if (menuName == "biz_3_watches") {
            itemIndex = Math.clamp(itemIndex, 0, mp.storage.data.clothes.watches[mp.clientStorage.sex].length - 1);
            var comp = mp.storage.data.clothes.watches[mp.clientStorage.sex][itemIndex];
            mp.players.local.setPropIndex(6, comp.variation, comp.textures[valueIndex], true);
        }
        //menuHandlers[menuName][itemName][itemValue]();
    });

    mp.events.add("selectMenu.itemFocusChanged", (menuName, itemName, itemValue, itemIndex, valueIndex) => {
        playFocusSound();
        //menu.execute(`alert('itemFocusChanged: ${menuName} ${itemName} ${itemValue}')`);
        var menuHandlers = { };
        if (menuHandlers[menuName] && menuHandlers[menuName][itemName]) menuHandlers[menuName][itemName](itemValue, itemIndex);
        if (menuName == "biz_3_top") {
            itemIndex = Math.clamp(itemIndex, 0, mp.storage.data.clothes.top[mp.clientStorage.sex].length - 1);
            var comp = mp.storage.data.clothes.top[mp.clientStorage.sex][itemIndex];
            mp.players.local.setComponentVariation(3, comp.torso, 0, 0);
            mp.players.local.setComponentVariation(11, comp.variation, comp.textures[valueIndex], 0);
        } else if (menuName == "biz_3_legs") {
            itemIndex = Math.clamp(itemIndex, 0, mp.storage.data.clothes.legs[mp.clientStorage.sex].length - 1);
            var comp = mp.storage.data.clothes.legs[mp.clientStorage.sex][itemIndex];
            mp.players.local.setComponentVariation(4, comp.variation, comp.textures[valueIndex], 0);
        } else if (menuName == "biz_3_feets") {
            itemIndex = Math.clamp(itemIndex, 0, mp.storage.data.clothes.feets[mp.clientStorage.sex].length - 1);
            var comp = mp.storage.data.clothes.feets[mp.clientStorage.sex][itemIndex];
            mp.players.local.setComponentVariation(6, comp.variation, comp.textures[valueIndex], 0);
        } else if (menuName == "biz_3_hats") {
            itemIndex = Math.clamp(itemIndex, 0, mp.storage.data.clothes.hats[mp.clientStorage.sex].length - 1);
            var comp = mp.storage.data.clothes.hats[mp.clientStorage.sex][itemIndex];
            mp.players.local.setPropIndex(0, comp.variation, comp.textures[valueIndex], true);
        } else if (menuName == "biz_3_glasses") {
            itemIndex = Math.clamp(itemIndex, 0, mp.storage.data.clothes.glasses[mp.clientStorage.sex].length - 1);
            var comp = mp.storage.data.clothes.glasses[mp.clientStorage.sex][itemIndex];
            mp.players.local.setPropIndex(1, comp.variation, comp.textures[valueIndex], true);
        } else if (menuName == "biz_3_bracelets") {
            itemIndex = Math.clamp(itemIndex, 0, mp.storage.data.clothes.bracelets[mp.clientStorage.sex].length - 1);
            var comp = mp.storage.data.clothes.bracelets[mp.clientStorage.sex][itemIndex];
            mp.players.local.setPropIndex(7, comp.variation, comp.textures[valueIndex], true);
        } else if (menuName == "biz_3_ears") {
            itemIndex = Math.clamp(itemIndex, 0, mp.storage.data.clothes.ears[mp.clientStorage.sex].length - 1);
            var comp = mp.storage.data.clothes.ears[mp.clientStorage.sex][itemIndex];
            mp.players.local.setPropIndex(2, comp.variation, comp.textures[valueIndex], true);
        } else if (menuName == "biz_3_masks") {
            itemIndex = Math.clamp(itemIndex, 0, mp.storage.data.clothes.masks[mp.clientStorage.sex].length - 1);
            var comp = mp.storage.data.clothes.masks[mp.clientStorage.sex][itemIndex];
            mp.players.local.setComponentVariation(1, comp.variation, comp.textures[valueIndex], 0);
        } else if (menuName == "biz_3_ties") {
            itemIndex = Math.clamp(itemIndex, 0, mp.storage.data.clothes.ties[mp.clientStorage.sex].length - 1);
            var comp = mp.storage.data.clothes.ties[mp.clientStorage.sex][itemIndex];
            mp.players.local.setComponentVariation(7, comp.variation, comp.textures[valueIndex], 0);
        } else if (menuName == "biz_3_watches") {
            itemIndex = Math.clamp(itemIndex, 0, mp.storage.data.clothes.watches[mp.clientStorage.sex].length - 1);
            var comp = mp.storage.data.clothes.watches[mp.clientStorage.sex][itemIndex];
            mp.players.local.setPropIndex(6, comp.variation, comp.textures[valueIndex], true);
        }
    });

    mp.events.add("selectMenu.backspacePressed", (menuName, itemName, itemValue, itemIndex) => {
        playBackSound();
        //menu.execute(`alert('backspacePressed: ${menuName} ${itemName} ${itemValue}')`);
        var menuHandlers = {
            "!enter_house": (itemName, itemValue) => {
                mp.events.call(`selectMenu.hide`);
            },
            "!exit_house": (itemName, itemValue) => {
                mp.events.call(`selectMenu.hide`);
            },
            "enter_garage": (itemName, itemValue) => {
                mp.events.call(`selectMenu.hide`);
            },
            /*"exit_garage": (itemName, itemValue) => {
            	mp.events.call(`selectMenu.hide`);
            },*/
            "biz_panel": (itemName, itemValue) => {
                mp.events.call(`selectMenu.show`, prevMenuName);
            },
            "biz_cashbox": (itemName, itemValue) => {
                mp.events.call(`selectMenu.show`, "biz_panel", 1);
            },
            "biz_stats": (itemName, itemValue) => {
                mp.events.call(`selectMenu.show`, "biz_panel", 2);
            },
            "biz_products": (itemName, itemValue) => {
                mp.events.call(`selectMenu.show`, "biz_panel", 3);
            },
            "biz_staff": (itemName, itemValue) => {
                mp.events.call(`selectMenu.show`, "biz_panel", 4);
            },
            "biz_rise": (itemName, itemValue) => {
                mp.events.call(`selectMenu.show`, "biz_panel", 5);
            },
            "biz_status": (itemName, itemValue) => {
                mp.events.call(`selectMenu.show`, "biz_panel", 6);
            },
            "biz_sell": (itemName, itemValue) => {
                mp.events.call(`selectMenu.show`, "biz_panel", 7);
            },
            "biz_3_clothes": () => {
                //mp.events.call("selectMenu.show", "enter_biz_3");
            },
            "biz_3_top": () => {
								mp.events.call("clothes_shop::resetView", "full", { name: "biz_3_clothes", index: 0 });
            },
            "biz_3_legs": () => {
								mp.events.call("clothes_shop::resetView", "full", { name: "biz_3_clothes", index: 1 });
            },
            "biz_3_feets": () => {
								mp.events.call("clothes_shop::resetView", "full", { name: "biz_3_clothes", index: 2 });
            },
            "biz_3_hats": () => {
								mp.events.call("clothes_shop::resetView", "full", { name: "biz_3_clothes", index: 3 });
            },
            "biz_3_glasses": () => {
								mp.events.call("clothes_shop::resetView", "full", { name: "biz_3_clothes", index: 4 });
            },
            "biz_3_bracelets": () => {
								mp.events.call("clothes_shop::resetView", "full", { name: "biz_3_clothes", index: 5 });
            },
            "biz_3_ears": () => {
								mp.events.call("clothes_shop::resetView", "full", { name: "biz_3_clothes", index: 6 });
            },
            "biz_3_masks": () => {
								mp.events.call("clothes_shop::resetView", "full", { name: "biz_3_clothes", index: 7 });
            },
            "biz_3_ties": () => {
								mp.events.call("clothes_shop::resetView", "full", { name: "biz_3_clothes", index: 8 });
            },
            "biz_3_watches": () => {
								mp.events.call("clothes_shop::resetView", "full", { name: "biz_3_clothes", index: 9 });
            },
            "biz_5_items": () => {
                mp.events.call("selectMenu.show", "enter_biz_5", 0);
            },
            "biz_6_items": () => {
                mp.events.call("selectMenu.show", "enter_biz_6");
            },
            "biz_8_guns": () => {
                mp.events.call("selectMenu.show", "enter_biz_8");
            },
            "biz_8_melee": () => {
                mp.events.call("selectMenu.show", "biz_8_guns");
            },
            "biz_8_handguns": () => {
                mp.events.call("selectMenu.show", "biz_8_guns", 1);
            },
            "biz_8_submachine_guns": () => {
                mp.events.call("selectMenu.show", "biz_8_guns", 2);
            },
            "biz_8_shotguns": () => {
                mp.events.call("selectMenu.show", "biz_8_guns", 3);
            },
            "biz_8_assault_rifles": () => {
                mp.events.call("selectMenu.show", "biz_8_guns", 4);
            },
            "biz_8_light_machine_guns": () => {
                mp.events.call("selectMenu.show", "biz_8_guns", 5);
            },
            "biz_8_sniper_rifles": () => {
                mp.events.call("selectMenu.show", "biz_8_guns", 6);
            },
            "biz_8_ammo": () => {
                mp.events.call("selectMenu.show", "enter_biz_8", 1);
            },
            "police_storage": () => {
                mp.events.call(`selectMenu.hide`);
            },
            "police_guns": () => {
                mp.events.call("selectMenu.show", "police_storage");
            },
            "police_clothes": () => {
                mp.events.call("selectMenu.show", "police_storage", 1);
            },
            "police_items": () => {
                mp.events.call("selectMenu.show", "police_storage", 2);
            },
            "police_ammo": () => {
                mp.events.call("selectMenu.show", "police_storage", 3);
            },
            "police_service_recovery": () => {
                mp.events.call("selectMenu.show", "police_service");
            },

            "police_storage_2": () => {
                mp.events.call(`selectMenu.hide`);
            },
            "police_guns_2": () => {
                mp.events.call("selectMenu.show", "police_storage_2");
            },
            "police_clothes_2": () => {
                mp.events.call("selectMenu.show", "police_storage_2", 1);
            },
            "police_items_2": () => {
                mp.events.call("selectMenu.show", "police_storage_2", 2);
            },
            "police_ammo_2": () => {
                mp.events.call("selectMenu.show", "police_storage_2", 3);
            },
            "police_service_recovery_2": () => {
                mp.events.call("selectMenu.show", "police_service_2");
            },

            "army_storage": () => {
                mp.events.call(`selectMenu.hide`);
            },
            "army_guns": () => {
                mp.events.call("selectMenu.show", "army_storage");
            },
            "army_clothes": () => {
                mp.events.call("selectMenu.show", "army_storage", 1);
            },
            "army_items": () => {
                mp.events.call("selectMenu.show", "army_storage", 2);
            },
            "army_ammo": () => {
                mp.events.call("selectMenu.show", "army_storage", 2);
            },

            "army_storage_2": () => {
                mp.events.call(`selectMenu.hide`);
            },
            "army_guns_2": () => {
                mp.events.call("selectMenu.show", "army_storage_2");
            },
            "army_clothes_2": () => {
                mp.events.call("selectMenu.show", "army_storage_2", 1);
            },
            "army_items_2": () => {
                mp.events.call("selectMenu.show", "army_storage_2", 2);
            },
            "army_ammo_2": () => {
                mp.events.call("selectMenu.show", "army_storage_2", 2);
            },

            "fib_storage": () => {
                mp.events.call(`selectMenu.hide`);
            },
            "fib_guns": () => {
                mp.events.call("selectMenu.show", "fib_storage");
            },
            "fib_clothes": () => {
                mp.events.call("selectMenu.show", "fib_storage", 1);
            },
            "fib_items": () => {
                mp.events.call("selectMenu.show", "fib_storage", 2);
            },
            "fib_ammo": () => {
                mp.events.call("selectMenu.show", "fib_storage", 3);
            },

            "hospital_storage": () => {
                mp.events.call(`selectMenu.hide`);
            },
            "hospital_items": () => {
                mp.events.call("selectMenu.show", "hospital_storage");
            },
            "hospital_clothes": () => {
                mp.events.call("selectMenu.show", "hospital_storage", 1);
            },
            "driving_school_licenses": () => {
                mp.events.call("selectMenu.show", "enter_driving_school");
            },
            "driving_school_car": () => {
                mp.events.call("selectMenu.show", "driving_school_licenses");
            },
            "driving_school_water": () => {
                mp.events.call("selectMenu.show", "driving_school_licenses", 1);
            },
            "driving_school_fly": () => {
                mp.events.call("selectMenu.show", "driving_school_licenses", 2);
            },
            "band_dealer_menu_guns": () => {
                mp.events.call("selectMenu.show", "band_dealer_menu");
            },
            "band_dealer_menu_melee": () => {
                mp.events.call("selectMenu.show", "band_dealer_menu_guns");
            },
            "band_dealer_menu_handguns": () => {
                mp.events.call("selectMenu.show", "band_dealer_menu_guns", 1);
            },
            "band_dealer_menu_submachine_guns": () => {
                mp.events.call("selectMenu.show", "band_dealer_menu_guns", 2);
            },
            "band_dealer_menu_shotguns": () => {
                mp.events.call("selectMenu.show", "band_dealer_menu_guns", 3);
            },
            "band_dealer_menu_assault_rifles": () => {
                mp.events.call("selectMenu.show", "band_dealer_menu_guns", 4);
            },
            "band_dealer_menu_ammo": () => {
                mp.events.call("selectMenu.show", "band_dealer_menu", 1);
            },
            "band_dealer_menu_drugs": () => {
                mp.events.call("selectMenu.show", "band_dealer_menu", 2);
            },
            "band_dealer_menu_items": () => {
                mp.events.call("selectMenu.show", "band_dealer_menu", 3);
            },
            "enter_farm_job": () => {
                mp.events.call("selectMenu.show", "enter_farm");
            },
            "farm_warehouse_fill_field": () => {
                mp.events.call("selectMenu.show", "farm_warehouse", 0);
            },
            "farm_warehouse_buy_crop": () => {
                mp.events.call("selectMenu.show", "farm_warehouse", 1);
            },
            "farm_warehouse_sell_grain": () => {
                mp.events.call("selectMenu.show", "farm_warehouse", 2);
            },
        };

        if (menuHandlers[menuName])
            menuHandlers[menuName](itemName, itemValue);
    });

    mp.events.add("setSelectMenuActive", (enable) => {
        mp.selectMenuActive = enable;
    });

    function clothesConvertToMenuItems(clothes) {
        var items = [];
        for (var i = 0; i < clothes.length; i++) {
            items.push({
                text: `Шмотка <i>${clothes[i].price}$</i> ID: ${clothes[i].id}`,
                values: clothes[i].textures
            });
        }
        return items;
    }

    // Custom events
    mp.events.add("weapon.shop.setAmmoShopName", (args, price) => {
        menu.execute(`selectMenuAPI.setItemName('biz_8_melee', 0, {text: "Бейсбольная бита | $${args[0]}"})`);
        menu.execute(`selectMenuAPI.setItemName('biz_8_melee', 1, {text: "Кастет | $${args[1]}"})`);
        menu.execute(`selectMenuAPI.setItemName('biz_8_melee', 2, {text: "Нож | $${args[2]}"})`);

        menu.execute(`selectMenuAPI.setItemName('biz_8_handguns', 0, {text: "Pistol | $${args[3]}"})`);
        menu.execute(`selectMenuAPI.setItemName('biz_8_handguns', 1, {text: "AP Pistol | $${args[4]}"})`);

        menu.execute(`selectMenuAPI.setItemName('biz_8_submachine_guns', 0, {text: "Micro SMG | $${args[5]}"})`);
        menu.execute(`selectMenuAPI.setItemName('biz_8_submachine_guns', 1, {text: "SMG | $${args[6]}"})`);

        menu.execute(`selectMenuAPI.setItemName('biz_8_shotguns', 0, {text: "Sawed-Off Shotgun | $${args[7]}"})`);

        menu.execute(`selectMenuAPI.setItemName('biz_8_ammo', 0, {text: "Патроны - 9mm | $${price}", values: ["10 шт.", "20 шт.", "40 шт.", "80 шт."]})`);
        menu.execute(`selectMenuAPI.setItemName('biz_8_ammo', 1, {text: "Патроны - 12mm | $${price}", values: ["10 шт.", "20 шт.", "40 шт.", "80 шт."]})`);
        menu.execute(`selectMenuAPI.setItemName('biz_8_ammo', 2, {text: "Патроны - 5.56mm | $${price}", values: ["10 шт.", "20 шт.", "40 шт.", "80 шт."]})`);
        menu.execute(`selectMenuAPI.setItemName('biz_8_ammo', 3, {text: "Патроны - 7.62mm | $${price}", values: ["10 шт.", "20 шт.", "40 шт.", "80 шт."]})`);
    });
    mp.events.add("food.shop.setFoodShopName", (args) => {
        menu.execute(`selectMenuAPI.setItemName('biz_6_items', 0, {text: "eCola | $${args[0]}"})`);
        menu.execute(`selectMenuAPI.setItemName('biz_6_items', 1, {text: "EgoChaser | $${args[1]}"})`);
        menu.execute(`selectMenuAPI.setItemName('biz_6_items', 2, {text: "Meteorite | $${args[2]}"})`);
        menu.execute(`selectMenuAPI.setItemName('biz_6_items', 3, {text: "P's & Q's | $${args[3]}"})`);
        menu.execute(`selectMenuAPI.setItemName('biz_6_items', 4, {text: "Пачка Redwood | $${args[4]}"})`);
        menu.execute(`selectMenuAPI.setItemName('biz_6_items', 5, {text: "Pisswasser | $${args[5]}"})`);
        menu.execute(`selectMenuAPI.setItemName('biz_6_items', 6, {text: "iUnion | $${args[6]}"})`);
        menu.execute(`selectMenuAPI.setItemName('biz_6_items', 7, {text: "Сумка | $${args[7]}"})`);
        menu.execute(`selectMenuAPI.setItemName('biz_6_items', 8, {text: "Канистра | $${args[8]}"})`);
        menu.execute(`selectMenuAPI.setItemName('biz_6_items', 9, {text: "Пластырь | $${args[9]}"})`);
    });
}
