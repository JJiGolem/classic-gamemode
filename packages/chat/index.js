mp.events.add('playerJoin', player => {
   player.call('chat.load');
});