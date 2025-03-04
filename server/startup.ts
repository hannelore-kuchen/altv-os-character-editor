/// <reference types="@altv/types-server" />
import * as alt from 'alt-server';

alt.on('character:Edit', handleCharacterEdit);
alt.on('character:Sync', handleCharacterSync);
alt.onClient('character:Done', handleDone);
alt.onClient(`character:AwaitModel`, handleAwaitModel);

function handleCharacterEdit(player:any, oldData = null) {
    alt.log("Starting character edit for: " + player.name);
    if (!player || !player.valid) {
        alt.log("Exiting editor, player not valid");
        return;
    }

    alt.emitClient(player, 'character:Edit', oldData);
}

function handleAwaitModel(player:any, characterSex:any) {
    player.model = characterSex === 0 ? 'mp_f_freemode_01' : 'mp_m_freemode_01';
    alt.emitClient(player, `character:FinishSync`);
}

function handleCharacterSync(player:any, data:any) {
    if (!player || !player.valid) {
        return;
    }

    if (typeof data === 'string') {
        try {
            data = JSON.parse(data);
        } catch(err) {
            throw new Error(`[Character Editor] Failed to sync character. Character data format is not object or JSON string.`);
        }
    }

    if (data.sex === 0) {
        player.model = 'mp_f_freemode_01';
    } else {
        player.model = 'mp_m_freemode_01';
    }

    alt.emitClient(player, 'character:Sync', data);
}

function handleDone(player:any, newData:object) {
    alt.emit('character:Done', player, newData);
}
