import Vent from './Vent';

export default interface Room {
    actualTemperatureStateTopic: string;
    name: string;
    targetTemperatureCommandTopic: string;
    targetTemperatureStateTopic: string;
    vents: Vent[];
}
