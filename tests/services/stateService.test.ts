import {Chance} from 'chance';

import {getState, initializeState, updateState} from '../../src/services/stateService';

const chance = new Chance();

describe('stateService', () => {
    const vent = {
        closePositionPayload: chance.word(),
        closedStatePayload: chance.word(),
        name: chance.word(),
        openPositionPayload: chance.word(),
        openedStatePayload: chance.word(),
        positionCommandTopic: chance.word(),
        positionStateTopic: chance.word(),
    };
    const room = {
        actualTemperatureStateTopic: chance.word(),
        name: chance.word(),
        targetTemperatureCommandTopic: chance.word(),
        targetTemperatureStateTopic: chance.word(),
        vents: [vent],
    };
    const thermostat = {
        actualTemperatureStateTopic: chance.word(),
        coolModePayload: chance.word(),
        heatModePayload: chance.word(),
        modeStateTopic: chance.word(),
        name: chance.word(),
        targetTemperatureCommandTopic: chance.word(),
        targetTemperatureStateTopic: chance.word(),
    };
    const house = {
        rooms: [room],
        thermostat,
    };

    it('should initialize and then update state', () => {
        initializeState(house);

        expect(getState()).toEqual({
            rooms: {
                [room.name]: {
                    actualTemperature: null,
                    targetTemperature: null,
                    vents: {
                        [vent.name]: {
                            position: null,
                        },
                    },
                },
            },
            thermostat: {
                actualTemperature: null,
                mode: null,
                name: thermostat.name,
                targetTemperature: null,
            },
        });

        const roomActualTemperature = chance.natural();
        updateState(room.actualTemperatureStateTopic, roomActualTemperature.toString());
        const roomTargetTemperature = chance.natural();
        updateState(room.targetTemperatureStateTopic, roomTargetTemperature.toString());
        const ventPosition = chance.natural();
        updateState(vent.positionStateTopic, ventPosition.toString());
        const thermostatActualTemperature = chance.natural();
        updateState(thermostat.actualTemperatureStateTopic, thermostatActualTemperature.toString());
        updateState(thermostat.modeStateTopic, thermostat.heatModePayload);
        const thermostatTargetTemperature = chance.natural();
        updateState(thermostat.targetTemperatureStateTopic, thermostatTargetTemperature.toString());

        expect(getState()).toEqual({
            rooms: {
                [room.name]: {
                    actualTemperature: roomActualTemperature,
                    targetTemperature: roomTargetTemperature,
                    vents: {
                        [vent.name]: {
                            position: ventPosition,
                        },
                    },
                },
            },
            thermostat: {
                actualTemperature: thermostatActualTemperature,
                mode: thermostat.heatModePayload,
                name: thermostat.name,
                targetTemperature: thermostatTargetTemperature,
            },
        });
    });
});
