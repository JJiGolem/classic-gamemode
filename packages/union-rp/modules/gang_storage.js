const StorageController = {
    minimal_summa: 1, // Минимальная сумма пополнения|снятия
    maximum_summa: 1000000, // Макисмальная сумма пополнения|снятия
    storages: [],
    max: [150, 3000, 3000],
    drugs: ["Марихуана", "МДМА", "Кокаин", "Метамфетамин"],
    ammo: ["Патроны 9mm", "Патроны 12mm", "Патроны 7.62mm", "Патроны 5.56mm"],
    ranks: ["Оружие доступно", "Наркотики доступны", "Боеприпасы доступны", "Управление доступно"],
    weapons: {
      // [1] Холодное оружие
      65: {
          name: "Старинный кинжал",
          id: 0,
          params: {
              weaponHash: mp.joaat("weapon_dagger"),
          },
      },
      41: {
          name: "Биту",
          id: 1,
          params: {
              weaponHash: mp.joaat("weapon_bat"),
          },
      },
      66: {
          name: "Разбитую бутылку",
          id: 2,
          params: {
              weaponHash: mp.joaat("weapon_bottle"),
          },
      },
      67: {
          name: "Лом",
          id: 3,
          params: {
              weaponHash: mp.joaat("weapon_crowbar"),
          },
      },
      18: {
          name: "Фонарик",
          id: 4,
          params: {
              weaponHash: mp.joaat("weapon_flashlight"),
          },
      },
      68: {
          name: "Клюшка",
          id: 5,
          params: {
              weaponHash: mp.joaat("weapon_golfclub"),
          },
      },
      69: {
          name: "Молоток",
          id: 6,
          params: {
              weaponHash: mp.joaat("weapon_hammer"),
          },
      },
      70: {
         name: "Топор",
         id: 7,
         params: {
             weaponHash: mp.joaat("weapon_hatchet"),
         },
      },
      42: {
          name: "Кастет",
          id: 8,
          params: {
              weaponHash: mp.joaat("weapon_knuckle"),
          },
      },
      43: {
          name: "Нож",
          id: 9,
          params: {
              weaponHash: mp.joaat("weapon_knife"),
          },
      },
      71: {
          name: "Мачете",
          id: 10,
          params: {
              weaponHash: mp.joaat("weapon_machete"),
          },
      },
      72: {
          name: "Складной нож",
          id: 11,
          params: {
              weaponHash: mp.joaat("weapon_switchblade"),
          },
      },
      17: {
          name: "Полицейская дубинка",
          id: 12,
          params: {
              weaponHash: mp.joaat("weapon_nightstick"),
          },
      },
      73: {
          name: "Гаечный ключ",
          id: 13,
          params: {
              weaponHash: mp.joaat("weapon_wrench"),
          },
      },
      74: {
          name: "Боевой топор",
          id: 14,
          params: {
              weaponHash: mp.joaat("weapon_battleaxe"),
          },
      },
      75: {
          name: "Кий",
          id: 15,
          params: {
              weaponHash: mp.joaat("weapon_poolcue"),
          },
      },
      76: {
          name: "Каменный топор",
          id: 16,
          params: {
              weaponHash: mp.joaat("weapon_stone_hatchet"),
          },
      },
      // [2] Пистолеты
      44: {
          name: "Pistol",
          id: 17,
          params: {
              weaponHash: mp.joaat("weapon_pistol"),
          },
      },
      77: {
          name: "Pistol Mk II",
          id: 18,
          params: {
              weaponHash: mp.joaat("weapon_pistol_mk2"),
          },
      },
      20: {
          name: "Combat Pistol",
          id: 19,
          params: {
              weaponHash: mp.joaat("weapon_combatpistol"),
          },
      },
      45: {
          name: "AP Pistol",
          id: 20,
          params: {
              weaponHash: mp.joaat("weapon_appistol"),
          },
      },
      19: {
          name: "Stun Gun",
          id: 21,
          params: {
              weaponHash: mp.joaat("weapon_stungun"),
          },
      },
      125: {
          name: "Pistol 50",
          id: 22,
          params: {
              weaponHash: mp.joaat("weapon_pistol50"),
          },
      },
      78: {
          name: "SNS Pistol",
          id: 23,
          params: {
              weaponHash: mp.joaat("weapon_snspistol"),
          },
      },
      79: {
          name: "SNS Pistol Mk II",
          id: 24,
          params: {
              weaponHash: mp.joaat("weapon_snspistol_mk2"),
          },
      },
      80: {
          name: "Heavy Pistol",
          id: 25,
          params: {
              weaponHash: mp.joaat("weapon_heavypistol"),
          },
      },
      81: {
          name: "Vintage Pistol",
          id: 26,
          params: {
              weaponHash: mp.joaat("weapon_vintagepistol"),
          },
      },
      82: {
          name: "Flare Gun",
          id: 27,
          params: {
              weaponHash: mp.joaat("weapon_flaregun"),
          },
      },
      83: {
          name: "Marksman Pistol",
          id: 28,
          params: {
              weaponHash: mp.joaat("weapon_marksmanpistol"),
          },
      },
      46: {
          name: "Heavy Revolver",
          id: 29,
          params: {
              weaponHash: mp.joaat("weapon_revolver"),
          },
      },
      84: {
          name: "Heavy Revolver Mk II",
          id: 30,
          params: {
              weaponHash: mp.joaat("weapon_revolver_mk2"),
          },
      },
      85: {
          name: "Double Action Revolver",
          id: 31,
          params: {
              weaponHash: mp.joaat("weapon_doubleaction"),
          },
      },
      // [3] Пистолеты-пулеметы
      47: {
          name: "Micro SMG",
          id: 32,
          params: {
              weaponHash: mp.joaat("weapon_microsmg"),
          },
      },
      48: {
          name: "SMG",
          id: 33,
          params: {
              weaponHash: mp.joaat("weapon_smg"),
          },
      },
      86: {
          name: "SMG Mk II",
          id: 34,
          params: {
              weaponHash: mp.joaat("weapon_smg_mk2"),
          },
      },
      87: {
          name: "Assault SMG",
          id: 35,
          params: {
              weaponHash: mp.joaat("weapon_assaultsmg"),
          },
      },
      88: {
          name: "Combat PDW",
          id: 36,
          params: {
              weaponHash: mp.joaat("weapon_combatpdw"),
          },
      },
      89: {
          name: "Machine Pistol",
          id: 37,
          params: {
              weaponHash: mp.joaat("weapon_machinepistol"),
          },
      },
      90: {
          name: "Mini SMG",
          id: 38,
          params: {
              weaponHash: mp.joaat("weapon_minismg"),
          },
      },
      // [4] Ружья
      21: {
          name: "Pump Shotgun",
          id: 39,
          params: {
              weaponHash: mp.joaat("weapon_pumpshotgun"),
          },
      },
      91: {
          name: "Pump Shotgun Mk II",
          id: 40,
          params: {
              weaponHash: mp.joaat("weapon_pumpshotgun_mk2"),
          },
      },
      49: {
          name: "Sawed-Off Shotgun",
          id: 41,
          params: {
              weaponHash: mp.joaat("weapon_sawnoffshotgun"),
          },
      },
      92: {
          name: "Assault Shotgun",
          id: 42,
          params: {
              weaponHash: mp.joaat("weapon_assaultshotgun"),
          },
      },
      93: {
          name: "Bullpup Shotgun",
          id: 43,
          params: {
              weaponHash: mp.joaat("weapon_bullpupshotgun"),
          },
      },
      94: {
          name: "Musket",
          id: 44,
          params: {
              weaponHash: mp.joaat("weapon_musket"),
          },
      },
      95: {
          name: "Heavy Shotgun",
          id: 45,
          params: {
              weaponHash: mp.joaat("weapon_heavyshotgun"),
          },
      },
      96: {
          name: "Double Barrel Shotgun",
          id: 46,
          params: {
              weaponHash: mp.joaat("weapon_dbshotgun"),
          },
      },
      97: {
          name: "Sweeper Shotgun",
          id: 47,
          params: {
              weaponHash: mp.joaat("weapon_autoshotgun"),
          },
      },
      // [5] Штурмовые винтовки
      50: {
          name: "Assault Rifle",
          id: 48,
          params: {
              weaponHash: mp.joaat("weapon_assaultrifle"),
          },
      },
      98: {
          name: "Assault Rifle Mk II",
          id: 49,
          params: {
              weaponHash: mp.joaat("weapon_assaultrifle_mk2"),
          },
      },
      22: {
          name: "Carbine Rifle",
          id: 50,
          params: {
              weaponHash: mp.joaat("weapon_carbinerifle"),
          },
      },
      99: {
          name: "Carbine Rifle Mk II",
          id: 51,
          params: {
              weaponHash: mp.joaat("weapon_carbinerifle_mk2"),
          },
      },
      100: {
          name: "Advanced Rifle",
          id: 52,
          params: {
              weaponHash: mp.joaat("weapon_advancedrifle"),
          },
      },
      101: {
          name: "Special Carbine",
          id: 53,
          params: {
              weaponHash: mp.joaat("weapon_specialcarbine"),
          },
      },
      102: {
          name: "Special Carbine Mk II",
          id: 54,
          params: {
              weaponHash: mp.joaat("weapon_specialcarbine_mk2"),
          },
      },
      51: {
          name: "Bullpup Rifle",
          id: 55,
          params: {
              weaponHash: mp.joaat("weapon_bullpuprifle_mk2"),
          },
      },
      103: {
          name: "Bullpup Rifle Mk II",
          id: 56,
          params: {
              weaponHash: mp.joaat("weapon_bullpuprifle_mk2"),
          },
      },
      52: {
          name: "Compact Rifle",
          id: 57,
          params: {
              weaponHash: mp.joaat("weapon_compactrifle"),
          },
      },
      // [6] Легкие пулеметы
      53: {
          name: "MG",
          id: 58,
          params: {
              weaponHash: mp.joaat("weapon_mg"),
          },
      },
      104: {
          name: "Combat MG",
          id: 59,
          params: {
              weaponHash: mp.joaat("weapon_combatmg"),
          },
      },
      105: {
          name: "Combat MG Mk II",
          id: 60,
          params: {
              weaponHash: mp.joaat("weapon_combatmg_mk2"),
          },
      },
      106: {
          name: "Gusenberg Sweeper",
          id: 61,
          params: {
              weaponHash: mp.joaat("weapon_gusenberg"),
          },
      },
      // [7] Снайперские винтовки
      23: {
          name: "Sniper Rifle",
          id: 62,
          params: {
              weaponHash: mp.joaat("weapon_sniperrifle"),
          },
      },
      107: {
          name: "Heavy Sniper",
          id: 63,
          params: {
              weaponHash: mp.joaat("weapon_heavysniper"),
          },
      },
      108: {
          name: "Heavy Sniper Mk II",
          id: 64,
          params: {
              weaponHash: mp.joaat("weapon_heavysniper_mk2"),
          },
      },
      109: {
          name: "Marksman Rifle",
          id: 65,
          params: {
              weaponHash: mp.joaat("weapon_marksmanrifle"),
          },
      },
      110: {
          name: "Marksman Rifle Mk II",
          id: 66,
          params: {
              weaponHash: mp.joaat("weapon_marksmanrifle_mk2"),
          },
      },
      // [8] Тяжелое оружие
      111: {
          name: "RPG",
          id: 67,
          params: {
              weaponHash: mp.joaat("weapon_rpg"),
          },
      },
      112: {
          name: "Grenade Launcher",
          id: 68,
          params: {
              weaponHash: mp.joaat("weapon_grenadelauncher"),
          },
      },
      113: {
          name: "Minigun",
          id: 69,
          params: {
              weaponHash: mp.joaat("weapon_minigun"),
          },
      },
      114: {
          name: "Firework Launcher",
          id: 70,
          params: {
              weaponHash: mp.joaat("weapon_firework"),
          },
      },
      115: {
          name: "Railgun",
          id: 71,
          params: {
              weaponHash: mp.joaat("weapon_railgun"),
          },
      },
      116: {
          name: "Homing Launcher",
          id: 72,
          params: {
              weaponHash: mp.joaat("weapon_hominglauncher"),
          },
      },
      117: {
          name: "Compact Grenade",
          id: 73,
          params: {
              weaponHash: mp.joaat("weapon_compactlauncher"),
          },
      },
      // [9] Метательное оружие
      118: {
          name: "Осколочную гранату",
          id: 74,
          params: {
              weaponHash: mp.joaat("weapon_grenade"),
          },
      },
      119: {
          name: "Газовую гранату",
          id: 75,
          params: {
              weaponHash: mp.joaat("weapon_bzgas"),
          },
      },
      120: {
          name: "Коктейль молотова",
          id: 76,
          params: {
              weaponHash: mp.joaat("weapon_molotov"),
          },
      },
      121: {
          name: "Дымовую гранату",
          id: 77,
          params: {
              weaponHash: mp.joaat("weapon_smokegrenade"),
          },
      },
      122: {
          name: "Сигнальную гранату",
          id: 78,
          params: {
              weaponHash: mp.joaat("weapon_flare"),
          },
      },
      // [10] Разное
      123: {
          name: "Парашют",
          id: 79,
          params: {
              weaponHash: mp.joaat("gadget_parachute"),
          },
      },
      124: {
          name: "Огнетушитель",
          id: 80,
          params: {
              weaponHash: mp.joaat("weapon_fireextinguisher"),
          },
      },
    },
    functions: {
      getStorage(id) {
        for (let i = 0; i < StorageController.storages.length; i++) if (StorageController.storages[i].id == id) return StorageController.storages[i];
      },
      putBalanceMoney(player, money) {
        if (money < StorageController.minimal_summa) {
          player.utils.warning("Минимальная сумма пополнения $" + StorageController.minimal_summa);
          return;
        }

        if (money > StorageController.maximum_summa) {
          player.utils.warning("Максимальная сумма пополнения $" + StorageController.maximum_summa);
          return;
        }

        if (player.money < money) {
          player.utils.warning("У вас недостаточно денег!");
          return;
        }

        if (!player.gangId) return player.utils.error("Вы слишком далеко от склада!");
        let storage = StorageController.functions.getStorage(player.gangId);
        if (storage.faction != player.faction) return player.utils.error("Вы не можете использовать данный склад!");
        if (player.rank < mp.factionRanks[player.faction].length - 1) return player.utils.error(`Вы не лидер!`);

        player.utils.setMoney(player.money - money);
        storage.setBalance(storage.balance + money);
        player.utils.success(`Вы пополнили сейф на $${money}`);
        player.call("modal.hide");
      },
      takeBalanceMoney(player, money) {
        if (money < StorageController.minimal_summa) {
          player.utils.warning("Минимальная сумма пополнения $" + StorageController.minimal_summa);
          return;
        }

        if (money > StorageController.maximum_summa) {
          player.utils.warning("Максимальная сумма пополнения $" + StorageController.maximum_summa);
          return;
        }

        if (!player.gangId) return player.utils.error("Вы слишком далеко от склада!");
        let storage = StorageController.functions.getStorage(player.gangId);
        if (storage.faction != player.faction) return player.utils.error("Вы не можете использовать данный склад!");
        if (player.rank < mp.factionRanks[player.faction].length - 1) return player.utils.error(`Вы не лидер!`);
        if (storage.balance < money) return player.utils.warning("В сейфе недостаточно денег!");

        player.utils.setMoney(player.money + money);
        storage.setBalance(storage.balance - money);
        player.utils.error(`Вы сняли с сейфа $${money}`);
        player.call("modal.hide");
      },
      putDrugs(player, count, id) {
        if (!player.gangId) return player.utils.error("Вы слишком далеко от склада!");
        let storage = StorageController.functions.getStorage(player.gangId);
        if (storage.faction != player.faction) return player.utils.error("Вы не можете использовать данный склад!");
        if (storage.isLock(player)) return player.utils.error("Склад закрыт!");
        if (count <= 0) return player.utils.error(`Неверный формат!`);
        let items = player.inventory.getArrayByItemId(id + 55);
        player.call("modal.hide");
        let max = 0;
        for (let i = 0; i < storage.drugs.length; i++) max += storage.drugs[i];
        if (max + count > StorageController.max[1]) return player.utils.error("Недостаточно места на складе!");
        let icount = 0;
        for (let key in items) {
          let drug = items[key];
          if (drug.params.count == count) {
            player.inventory.delete(drug.id, (e) => {
                if (e) return player.utils.error(e);
                storage.setDrugs(id, storage.drugs[id] + count);
                player.utils.success(`Вы положили ${StorageController.drugs[id]} - ${count}г.`);
            });
            return;
          } else if (drug.params.count > count) {
            drug.params.count -= count;
            player.inventory.updateParams(drug.id, drug);
            storage.setDrugs(id, storage.drugs[id] + count);
            player.utils.success(`Вы положили ${StorageController.drugs[id]} - ${count}г.`);
            return;
          }
          icount += drug.params.count;
        }

        player.utils.error(`У вас недостаточно наркотиков${icount >= count ? ", соедините все наркотики в инвентаре!" : "!"}`);
      },
      takeDrugs(player, count, id) {
        if (!player.gangId) return player.utils.error("Вы слишком далеко от склада!");
        let storage = StorageController.functions.getStorage(player.gangId);
        if (storage.faction != player.faction) return player.utils.error("Вы не можете использовать данный склад!");
        if (storage.drugs_rank > player.rank) return player.utils.error(`Наркотики доступны с ${storage.drugs_rank} ранга!`);
        if (storage.isLock(player)) return player.utils.error("Склад закрыт!");
        if (count <= 0) return player.utils.error(`Неверный формат!`);
        if (storage.drugs[id] < count) return player.utils.error(`На складе недостаточно наркотиков!`);
        player.inventory.add(id + 55, { count: count }, {}, (e) => {
            if (e) return player.utils.error(e);
            storage.setDrugs(id, storage.drugs[id] - count);
            player.utils.success(`Вы взяли ${StorageController.drugs[id]} - ${count}г.`);
        });
        player.call("modal.hide");
      },
      putWeapons(player, id) {
        if (!player.gangId) return player.utils.error("Вы слишком далеко от склада!");
        let storage = StorageController.functions.getStorage(player.gangId);
        if (storage.faction != player.faction) return player.utils.error("Вы не можете использовать данный склад!");
        if (storage.isLock(player)) return player.utils.error("Склад закрыт!");
        let items = player.inventory.getArrayByItemId(id);
        player.call("modal.hide");
        let max = 0;
        for (let i = 0; i < storage.weapons.length; i++) max += storage.weapons[i];
        if (++max > StorageController.max[0]) return player.utils.error("Недостаточно места на складе!");
        let weapon = StorageController.weapons[id];
        if (!weapon) return player.utils.error("Оружие не найдено!");
        for (let key in items) {
          player.inventory.delete(items[key].id, (e) => {
              if (e) return player.utils.error(e);
              storage.setWeapons(weapon.id, ++storage.weapons[weapon.id]);
              player.utils.success(`Вы положили ${weapon.name}.`);
          });
          return;
        }
        player.utils.error(`У вас нет данного оружия!`);
      },
      takeWeapons(player, id) {
        if (!player.gangId) return player.utils.error("Вы слишком далеко от склада!");
        let storage = StorageController.functions.getStorage(player.gangId);
        if (storage.faction != player.faction) return player.utils.error("Вы не можете использовать данный склад!");
        if (storage.weapon_rank > player.rank) return player.utils.error(`Оружие доступно с ${storage.weapon_rank} ранга!`);
        if (storage.isLock(player)) return player.utils.error("Склад закрыт!");
        let weapon = StorageController.weapons[id];
        if (!weapon) return player.utils.error("Оружие не найдено!");
        if (storage.weapons[weapon.id] < 1) return player.utils.error(`На складе недостаточно оружия данного типа!`);
        player.inventory.add(id, weapon.params, {}, (e) => {
            if (e) return player.utils.error(e);
            storage.setWeapons(weapon.id, --storage.weapons[weapon.id]);
            player.utils.success(`Вы взяли ${weapon.name}.`);
        });
      },
      putAmmo(player, count, id) {
        if (!player.gangId) return player.utils.error("Вы слишком далеко от склада!");
        let storage = StorageController.functions.getStorage(player.gangId);
        if (storage.faction != player.faction) return player.utils.error("Вы не можете использовать данный склад!");
        if (storage.isLock(player)) return player.utils.error("Склад закрыт!");
        if (count <= 0) return player.utils.error(`Неверный формат!`);
        let items = player.inventory.getArrayByItemId(id + 37);
        let icount = 0;
        player.call("modal.hide");
        let max = 0;
        for (let i = 0; i < storage.ammo.length; i++) max += storage.ammo[i];
        if (max + count > StorageController.max[2]) return player.utils.error("Недостаточно места на складе!");
        for (let key in items) {
          let drug = items[key];
          if (drug.params.ammo == count) {
            player.inventory.delete(drug.id, (e) => {
                if (e) return player.utils.error(e);
                storage.setAmmo(id, storage.ammo[id] + count);
                player.utils.success(`Вы положили ${StorageController.ammo[id]} - ${count}пт.`);
            });
            return;
          } else if (drug.params.ammo > count) {
            drug.params.ammo -= count;
            player.inventory.updateParams(drug.id, drug);
            storage.setAmmo(id, storage.ammo[id] + count);
            player.utils.success(`Вы положили ${StorageController.ammo[id]} - ${count}пт.`);
            return;
          }
          icount += drug.params.ammo;
        }

        player.utils.error(`У вас недостаточно боеприпасов${icount >= count ? ", соедините все боеприпасы в инвентаре!" : "!"}`);
      },
      takeAmmo(player, count, id) {
        if (!player.gangId) return player.utils.error("Вы слишком далеко от склада!");
        let storage = StorageController.functions.getStorage(player.gangId);
        if (storage.faction != player.faction) return player.utils.error("Вы не можете использовать данный склад!");
        if (storage.ammo_rank > player.rank) return player.utils.error(`Боеприпасы доступны с ${storage.ammo_rank} ранга!`);
        if (storage.isLock(player)) return player.utils.error("Склад закрыт!");
        if (count <= 0) return player.utils.error(`Неверный формат!`);
        if (storage.ammo[id] < count) return player.utils.error(`На складе недостаточно боеприпасов!`);
        player.inventory.add(id + 37, { ammo: count }, {}, (e) => {
            if (e) return player.utils.error(e);
            storage.setAmmo(id, storage.ammo[id] - count);
            player.utils.success(`Вы взяли ${StorageController.ammo[id]} - ${count}пт.`);
        });
        player.call("modal.hide");
      },
      setLock(player) {
        if (!player.gangId) return player.utils.error("Вы слишком далеко от склада!");
        let storage = StorageController.functions.getStorage(player.gangId);
        if (storage.faction != player.faction) return player.utils.error("Вы не можете использовать данный склад!");
        // if (player.rank < mp.factionRanks[player.faction].length - 1) return player.utils.error(`Вы не лидер!`);

        if (storage.block != 0) {
            player.utils.success("Вы открыли склад!");
            storage.setBlock(false);
        } else {
            player.utils.error("Вы закрыли склад!");
            storage.setBlock(true);
        }
      },
      setAllow(player, id, rank) {
        if (!player.gangId) return player.utils.error("Вы слишком далеко от склада!");
        let storage = StorageController.functions.getStorage(player.gangId);
        if (storage.faction != player.faction) return player.utils.error("Вы не можете использовать данный склад!");
        let leadrank = mp.factionRanks[player.faction].length - 1;
        if (player.rank < leadrank) return player.utils.error(`Вы не лидер!`);
        if (rank < 1 || rank > leadrank) return player.utils.error(`Ранги: от 1 до ${leadrank}`);
        player.call("modal.hide");
        player.utils.success(`${StorageController.ranks[id]} с ${rank} ранга!`);
        storage.setAllow(id, rank);
      },
      getPlayerDrugs(player) {
        let items = player.inventory.getArrayByItemId([55,56,57,58]);
        let args = [0, 0, 0, 0];
        for (let key in items) {
          let drug = items[key];
          let index = drug.itemId - 55;
          args[index] += drug.params.count;
        }
        return args;
      },
      getPlayerAmmo(player) {
        let items = player.inventory.getArrayByItemId([37,38,39,40]);
        let args = [0, 0, 0, 0];
        for (let key in items) {
          let ammo = items[key];
          let index = ammo.itemId - 37;
          args[index] += ammo.params.ammo;
        }
        return args;
      },
      getPlayerWeapons(player) {
        let items = player.inventory.getArrayWeapons();
        let args = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
        for (let key in items) {
           let weapon = items[key];
           let index = StorageController.weapons[weapon.itemId].id;
           args[index]++;
        }
        return args;
      }
    }
}
module.exports = {
    Init: () => {
        DB.Handle.query("SELECT * FROM gang_storage", (e, result) => {
            for (let i = 0; i < result.length; i++) {
              // mp.colshapes.newSphere(result[i].x, result[i].y, result[i].z + 1.0, 1)
              let storage = new GangStorage(result[i].id, result[i].balance, mp.factions.getBySqlId(result[i].faction).warehouse.colshape, result[i].block, result[i].weapon_rank, result[i].ammo_rank, result[i].balance_rank, result[i].drugs_rank, result[i].storage_rank, JSON.parse(result[i].drugs), JSON.parse(result[i].ammo), JSON.parse(result[i].weapons), result[i].faction);
              StorageController.storages.push(storage);
              // mp.markers.new(1, new mp.Vector3(result[i].x, result[i].y, result[i].z), 1, { color: [187, 255, 0, 70]});
            }
            console.log(`[Банды] Загружено ${StorageController.storages.length} складов`);
        });
    }
}
class GangStorage {
    constructor(id, balance, colshape, block, weapon_rank, ammo_rank, balance_rank, drugs_rank, storage_rank, drugs, ammo, weapons, faction) {
        this.id = id;
        this.balance = balance;
        this.colshape = colshape;
        colshape.gangId = id;
        this.block = block;
        this.weapon_rank = weapon_rank;
        this.ammo_rank = ammo_rank;
        this.balance_rank = balance_rank;
        this.drugs_rank = drugs_rank;
        this.storage_rank = storage_rank;
        this.drugs = drugs;
        this.ammo = ammo;
        this.weapons = weapons;
        this.faction = faction;
    }

    setBalance(balance) {
      this.balance = balance;
      DB.Handle.query(`UPDATE gang_storage SET balance=? WHERE id=?`, [balance, this.id]);
    }
    setDrugs(id, drugs) {
      this.drugs[id] = drugs;
      DB.Handle.query(`UPDATE gang_storage SET drugs=? WHERE id=?`, [JSON.stringify(this.drugs), this.id]);
    }
    setAmmo(id, ammo) {
      this.ammo[id] = ammo;
      DB.Handle.query(`UPDATE gang_storage SET ammo=? WHERE id=?`, [JSON.stringify(this.ammo), this.id]);
    }
    setWeapons(id, weapons) {
      this.weapons[id] = weapons;
      DB.Handle.query(`UPDATE gang_storage SET weapons=? WHERE id=?`, [JSON.stringify(this.weapons), this.id]);
    }
    setBlock(status) {
      this.block = status;
      DB.Handle.query(`UPDATE gang_storage SET block=? WHERE id=?`, [status, this.id]);
    }
    setAllow(id, rank) {
      switch (id) {
        case 0:
          this.weapon_rank = rank;
          DB.Handle.query(`UPDATE gang_storage SET weapon_rank=? WHERE id=?`, [rank, this.id]);
          break;
        case 1:
          this.drugs_rank = rank;
          DB.Handle.query(`UPDATE gang_storage SET drugs_rank=? WHERE id=?`, [rank, this.id]);
          break;
        case 2:
          this.ammo_rank = rank;
          DB.Handle.query(`UPDATE gang_storage SET ammo_rank=? WHERE id=?`, [rank, this.id]);
          break;
        case 3:
          this.storage_rank = rank;
          DB.Handle.query(`UPDATE gang_storage SET storage_rank=? WHERE id=?`, [rank, this.id]);
          break;
      }
    }

    isLock(player) {
      if (this.block != 0) if (player.rank < this.storage_rank) return true; // !player.gangId || player.faction != this.faction
      else return false;
    }
}

mp.events.add("gang.take.money", (player, money) => {
   StorageController.functions.takeBalanceMoney(player, money);
});
mp.events.add("gang.put.money", (player, money) => {
   StorageController.functions.putBalanceMoney(player, money);
});
mp.events.add("gang.take.drugs", (player, count, id) => {
   StorageController.functions.takeDrugs(player, count, id);
});
mp.events.add("gang.put.drugs", (player, count, id) => {
   StorageController.functions.putDrugs(player, count, id);
});
mp.events.add("gang.take.ammo", (player, count, id) => {
   StorageController.functions.takeAmmo(player, count, id);
});
mp.events.add("gang.put.ammo", (player, count, id) => {
   StorageController.functions.putAmmo(player, count, id);
});
mp.events.add("gang.take.weapons", (player, id) => {
   StorageController.functions.takeWeapons(player, id);
});
mp.events.add("gang.put.weapons", (player, id) => {
   StorageController.functions.putWeapons(player, id);
});
mp.events.add("gang.set.lock", (player) => {
   StorageController.functions.setLock(player);
});
mp.events.add("gang.control.allow", (player, id, count) => {
   StorageController.functions.setAllow(player, id, count);
});

mp.events.add("playerEnterColshape", function onPlayerEnterColShape(player, shape) {
  if (shape.gangId && !player.vehicle) {
      player.gangId = shape.gangId;
      let storage = StorageController.functions.getStorage(shape.gangId);
      if (storage.faction == player.faction) {
        if (storage.isLock(player)) return player.utils.error("Склад закрыт!");
        player.call("selectMenu.show", ["gang_storage"]);
        player.call("update.gang.storage", [storage.balance, storage.weapon_rank, storage.ammo_rank, storage.storage_rank, storage.drugs_rank, StorageController.functions.getPlayerDrugs(player), storage.drugs, StorageController.functions.getPlayerAmmo(player), storage.ammo, StorageController.functions.getPlayerWeapons(player), storage.weapons, StorageController.max]);
      } else return player.utils.error("Вам недоступен данный склад!");
  }
});
mp.events.add("playerExitColshape", function onPlayerExitColShape(player, shape) {
  if (shape.gangId) player.call("selectMenu.hide");
});
