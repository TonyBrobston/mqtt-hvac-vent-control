import {AsyncMqttClient, connect} from 'async-mqtt';

import Options from './types/Options';
import Room from './types/Room';
import Vent from './types/Vent';

import {setupLogging} from './services/logService';
import {getOptionsFromEnvironmentOrFile} from './services/optionService';

let client: AsyncMqttClient;

export const start = async (
    options: Options = getOptionsFromEnvironmentOrFile(),
): Promise<void> => {
    const {
        configuration: {
            rooms,
        },
        log,
        mqtt: {
            host,
            password,
            port,
            username,
        },
    }: Options = options;

    client = connect(`tcp://${host}:${port}`, {username, password});

    const promises = rooms.map((room: Room) => {
        const ventStateTopics = room.vents.reduce((acc: string[], obj: Vent) => {
            return [
                ...acc,
                obj.openedState,
                obj.closedState,
            ];
        }, []);
        return client.subscribe([
            ...ventStateTopics,
            room.actualTemperatureStateTopic,
            room.targetTemperatureCommandTopic,
        ]);
    });

    await Promise.all(promises);

    if (log) {
        setupLogging(client);
    }
};

export const stop = async (): Promise<void> => {
    await client.end();
};
