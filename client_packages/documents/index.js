
mp.events.add('documents.show', (type, data) => {
    mp.game.graphics.transitionToBlurred(1000);
    mp.callCEFV('carPass.show = true');
    mp.events.call("prompt.showByName", 'documents_close');
});

mp.events.add('documents.close', (type, data) => {
    mp.callCEFV('carPass.show = false');
    setTimeout(()=> {
        mp.game.graphics.transitionFromBlurred(1000);
    }, 1000);
    
    mp.events.call("prompt.hide");
});


mp.keys.bind(0x72, true, function () { 
    //mp.game.graphics.transitionToBlurred(1000);
    mp.events.call('documents.show');
});

mp.keys.bind(0x73, true, function () { 
    mp.events.call('documents.close');
});
