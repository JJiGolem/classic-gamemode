exports = (menu) => {
    let our_number;
    mp.events.add('update.player.telephone', (num) => {
      if (!num) return;
      our_number = num;
      menu.execute(`mp.events.call('telePhone', {num: ${our_number}, event: 'setnum' })`);
    })

    mp.events.add('update.telephone.messages', (result) => {
        for (let i = 0; i < result.length; i++) {
          if (result[i].sender_num == our_number) outComingMessage(result[i].id, result[i].creator_num, result[i].text);
          else inComingMessage(result[i].id, result[i].sender_num, result[i].text);
        }
    })

    function outComingMessage(id, num, text) {
        menu.execute(`mp.events.call('telePhone', {data: ${JSON.stringify({ id: id, num: num, text: text })}, event: 'outComingMessage' })`);
    }

    function inComingMessage(id, num, text) {
        menu.execute(`mp.events.call('telePhone', {data: ${JSON.stringify({ id: id, num: num, text: text })}, event: 'inComingMessage' })`);
    }

    mp.events.add('create.telephone.message', (id, text, num, type) => {
      if (type)
          outComingMessage(id, num, text);
      else
          inComingMessage(id, num, text);
    })

    mp.events.add("telephone.enable", (enable) => {
        menu.execute(`mp.events.call('telePhone', {status: ${enable}, event: 'enable' })`);
    });

    mp.events.add("telephone.call", (num) => {
      if (!num) return mp.events.call("nWarning", "Номер не найден!");
      if (num.length < 3) return mp.events.call("nWarning", "Номер не действителен!");
      if (num.length > 8) return mp.events.call("nWarning", "Номер не действителен!");
      mp.events.callRemote('call.player.contact', num)
    });

    mp.events.add("telephone.active", (enable) => {
      if (!our_number) return mp.events.call(`nError`, `Номер телефона не загружен!`);
      mp.enableTelephone = enable;
      if (enable) {
        if (our_number) mp.game.graphics.notify("Ваш номер: ~g~" + our_number);
        mp.game.mobile.createMobilePhone(4);
        mp.game.mobile.setMobilePhoneScale(0);
      } else mp.game.invoke('0x3BC861DF703E5097');
      mp.gui.cursor.show(enable, enable);
    });

    mp.events.add('update.telephone.contacts', (result) => {
        for (let i = 0; i < result.length; i++) {
            menu.execute(`mp.events.call('telePhone', {contacts: ${JSON.stringify({ id: result[i].id, num: result[i].num, name: result[i].name })}, event: 'contacts' })`);
        }
    })

    mp.events.add('change.telephone.contact', (id, name, num) => {
      menu.execute(`mp.events.call('telePhone', {contact: ${JSON.stringify({ id: id, num: num, name: name })}, event: 'contact' })`);
    });

    mp.events.add('delete.telephone.contact', (id) => {
      menu.execute(`mp.events.call('telePhone', {contact: ${id}, event: 'delete' })`);
    });

    mp.events.add('create.telephone.contact', (id, name, num) => {
        menu.execute(`mp.events.call('telePhone', {contacts: ${JSON.stringify({ id: id, num: num, name: name })}, event: 'contacts' })`);
    })

    mp.events.add('selectChangeContact', (id, contactName, contactNumber) => {
      if (!contactName || !contactNumber) return mp.events.call("nWarning", "Заполните поле корректно!");
      if (!contactNumber.match(/[0-9]/g)) return mp.events.call("nWarning", "Заполните поле корректно!");
      if (contactName.length > 25) return mp.events.call("nWarning", "Слишком длинный текст!");
      if (contactNumber.length < 3) return mp.events.call("nWarning", "Слишком короткий номер!");
      if (contactNumber.length > 8) return mp.events.call("nWarning", "Слишком длинный номер!");
      mp.events.callRemote('change.player.contact', id, contactName, contactNumber)
    })

    mp.events.add('deleteContact', (id) => {
        mp.events.callRemote('delete.player.contact', id)
    })

    mp.events.add('sendMessage', (id, textMessage) => {
        if (!textMessage) return mp.events.call("nWarning", "Заполните поле корректно!");
        if (textMessage.length < 1) return mp.events.call("nWarning", "Слишком короткий текст!");
        if (textMessage.length > 250) return mp.events.call("nWarning", "Слишком длинный текст!");
        mp.events.callRemote('send.player.phonemessage', id, textMessage)
    })

    mp.events.add('select.add.contact', (contactName, contactNumber) => {
      if (!contactName || !contactNumber) return mp.events.call("nWarning", "Заполните поле корректно!");
      if (!contactNumber.match(/[0-9]/g)) return mp.events.call("nWarning", "Заполните поле корректно!");
      if (contactName.length > 25) return mp.events.call("nWarning", "Слишком длинный текст!");
      if (contactNumber.length < 3) return mp.events.call("nWarning", "Слишком короткий номер!");
      if (contactNumber.length > 8) return mp.events.call("nWarning", "Слишком длинный номер!");
      mp.events.callRemote('create.player.contact', contactName, contactNumber)
    })
}
