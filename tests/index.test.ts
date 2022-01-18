import {AsyncMqttClient, connectAsync} from 'async-mqtt';
import {Chance} from 'chance';
import {closeSync, openSync, unlinkSync, writeFileSync} from 'fs';
import {Server} from 'mosca';

import {createServerAsync} from './utils/moscaHelper';

import Mqtt from '../src/types/Mqtt';

import {start, stop} from '../src';

const chance = new Chance();

describe('index', () => {
    const optionsFilePath = `${__dirname}/options.json`;
    const mqtt = {
        host: 'localhost',
        password: chance.string(),
        port: chance.natural({
            max: 9999,
            min: 1000,
        }),
        username: chance.string(),
    };

    let server: Server,
        client: AsyncMqttClient;

    beforeEach(async (done: () => void) => {
        server = await createServerAsync(mqtt);
        const {host, username, password, port}: Mqtt = mqtt;
        client = await connectAsync(`tcp://${host}:${port}`, {username, password});
        closeSync(openSync(optionsFilePath, 'w'));
        done();
    });

    afterEach(async (done: () => void) => {
        await stop();
        unlinkSync(optionsFilePath);
        await client.end();
        server.close();
        process.env.OPTIONS = undefined;
        done();
    });

    it('should', async (done: () => void) => {
        const room = {
            name: chance.string(),
            targetTemperatureCommandTopic: chance.string(),
            temperatureStateTopic: chance.string(),
            vents: [
                {
                    closePayload: chance.string(),
                    closedState: chance.string(),
                    name: chance.string(),
                    openPayload: chance.string(),
                    openedState: chance.string(),
                    ventCommandTopic: chance.string(),
                    ventStateTopic: chance.string(),
                },
            ],
        };
        const options = {
            config: {
                rooms: [
                    room,
                ],
            },
            log: false,
            mqtt,
        };

        await start(options);
    });
});
