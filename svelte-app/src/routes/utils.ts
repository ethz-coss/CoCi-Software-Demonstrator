//const SERVER_URL = "http://127.0.0.1:8134";
const SERVER_URL = "/api";

let roadnetOptions: string[];
let replayOptions = {};

export async function getRoadnetOptions() {
    if (roadnetOptions != undefined) {
        return roadnetOptions;
    }
    const url = `${SERVER_URL}/get-roadnet-options`;
    const response = await fetch(url);
    roadnetOptions = await response.json();
    return roadnetOptions;
}

export async function getReplayOptions(roadnetOption: string) {
    if (Object.keys(replayOptions).length != 0 && replayOptions[roadnetOption]) {
        return replayOptions[roadnetOption];
    }
    if (roadnetOption == null || roadnetOption == '') return;
    const url = `${SERVER_URL}/get-replay-options/${roadnetOption}`;
    const response = await fetch(url);
    replayOptions[roadnetOption] = await response.json();
    return replayOptions[roadnetOption]
}

export async function getRoadnetFile(roadnetOption: string) {
    const url = `${SERVER_URL}/get-roadnet-file/${roadnetOption}`;
    const response = await fetch(url);
    return await response.json();
}

export async function getReplayFile(roadnetOption: string, replayOption: string) {
    const url = `${SERVER_URL}/get-replay-file/${roadnetOption}/${replayOption}`;
    const response = await fetch(url);
    const resp = await response.text();
    ///console.log("response was: " + resp);
    return resp;
}