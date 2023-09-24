import {dev} from "$app/environment";

let SERVER_URL = "/api";
if (dev) SERVER_URL = "http://127.0.0.1:5000";

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
    const response = await fetch(url, { cache: "force-cache" });
    return await response.json();
}

export async function getReplayFile(roadnetOption: string, replayOption: string) {
    const url = `${SERVER_URL}/get-replay-file/${roadnetOption}/${replayOption}`;
    const response = await fetch(url, { cache: "force-cache" });
    const resp = await response.text();
    return resp;
}

export async function getDensityFile(roadnetOption: string, replayOption: string) {
    const url = `${SERVER_URL}/get-density-file/${roadnetOption}/${replayOption}`;
    const response = await fetch(url, { cache: "force-cache" });
    const resp = await response.json();
    return resp;
}
