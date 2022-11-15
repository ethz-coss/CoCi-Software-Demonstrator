const SERVER_URL = "";

function getRoadnetOptions(callback) {
    const url = `${SERVER_URL}/get-roadnet-options`;
    return fetch(url).then((response) => response.json())
    .then(data => callback(data));
}

function getReplayOptions(roadnetOption, callback) {
    console.log("called")
    if (roadnetOption == null || roadnetOption == '') return;
    const url = `${SERVER_URL}/get-replay-options/${roadnetOption}`;
    fetch(url).then((response) => response.json())
    .then(data => callback(data));
}

async function getRoadnetFile(roadnetOption) {
    console.log("here" + roadnetOption);
    const url = `${SERVER_URL}/get-roadnet-file/${roadnetOption}`;
    const response = await fetch(url);
    return await response.json();
}

async function getReplayFile(roadnetOption, replayOption) {
    console.log("here" + replayOption);
    const url = `${SERVER_URL}/get-replay-file/${roadnetOption}/${replayOption}`;
    const response = await fetch(url);
    resp = await response.text();
    ///console.log("response was: " + resp);
    return resp;
}