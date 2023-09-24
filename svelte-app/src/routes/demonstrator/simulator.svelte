<script lang="ts">
import { Gradient } from "./color-gradient.js";
import {Point} from "./Point.js";
import * as PIXI from 'pixi.js-legacy';
import * as Viewport from 'pixi-viewport'
import {onMount} from 'svelte';
import * as utils from './utils.js';
import {selectedParams, debugMode, controls, infoDOM, startSimulation, globalCount, selectedEntity, numThreadsStarted} from './stores';
export let id: number;

const BACKGROUND_COLOR = 0xe8ebed;
const LANE_COLOR = 0x586970;
const LANE_BORDER_WIDTH = 1;
const LANE_BORDER_COLOR = 0x82a8ba;
const LANE_INNER_COLOR = 0xbed8e8;
const LANE_DASH = 10;
const LANE_GAP = 12;
const TRAFFIC_LIGHT_WIDTH = 3;
const MAX_TRAFFIC_LIGHT_NUM = 100000;
const ROTATE = 90;

const CAR_LENGTH = 5;
const CAR_WIDTH = 2;
const CAR_COLOR = 0xe8bed4;

const CAR_COLORS = [0xf2bfd7, // pink
            0xb7ebe4,   // cyan
            0xdbebb7,   // blue
            0xf5ddb5, 
            0xd4b5f5];
const CAR_COLORS_NUM = CAR_COLORS.length;

const NUM_CAR_POOL = 150000;

const LIGHT_RED = 0xdb635e;
const LIGHT_GREEN = 0x85ee00;

const TURN_SIGNAL_COLOR = 0xFFFFFF;
let TURN_SIGNAL_WIDTH   = 1;
let TURN_SIGNAL_LENGTH  = 5;

var simulation: { static: any; }, roadnet, steps;
var nodes = {};
var edges = {};
let edges_copy: { [x: string]: any; };
let edgeIdtoEdgeGraphics = {};
var logs: any[];
var gettingLog = false;

var trafficLightsG = {};

var app, viewport, renderer, simulatorContainer, carContainer, trafficLightContainer;
var turnSignalContainer;
var carPool;

var cnt = 0;
var frameElapsed = 0;
var totalStep: number;

let carNum = 0;
let progressPercentage = "0%";
var totalStepNum = 0;
var currentStepNum = 0;

var SPEED = 3, SCALE_SPEED = 1.01;
var LEFT = 37, UP = 38, RIGHT = 39, DOWN = 40;
var MINUS = 189, EQUAL = 187, P = 80;
var LEFT_BRACKET = 219, RIGHT_BRACKET = 221; 
var ONE = 49, TWO = 50;
var SPACE = 32;

var keyDown = new Set();

var turnSignalTextures: any[] = [];

let nodeCanvas: HTMLDivElement;
let guideDomElem: HTMLDivElement;
let spinnerDomElem: HTMLDivElement;


let loading = false;
function infoAppend(msg:string) {
    $infoDOM.innerText += "- " + msg + "\n";
}

function infoReset() {
    $infoDOM.innerText = "";
}


const gradientArray = new Gradient()
  .setColorGradient("#00FFFF", "#00FF00", "#FFFF00", "#FF0000")
  .setMidpoint(100)
  .getColors();

/**
 * Upload files
 */
let ready = false;

let roadnetData = [];
let densityData = [];
let replayData = [];

async function downloadRoadnetFile(v, callback) {
    infoAppend("Downloading roadnet..");
    hideCanvas();
    v[0] = await utils.getRoadnetFile($selectedParams[id].roadnetOption);
    infoAppend("Finished downloading roadnet!");
    showCanvas();
    callback();
}

async function downloadReplayFile(v, callback) {
    infoAppend("Downloading replay..");
    hideCanvas();
    v[0] = await utils.getReplayFile($selectedParams[id].roadnetOption, $selectedParams[id].replayOption);
    infoAppend("Finished downloading replay!");
    showCanvas();
    callback();
}

async function downloadDensityFile(v, callback) {
    infoAppend("Downloading density..");
    hideCanvas();
    v[0] = await utils.getDensityFile($selectedParams[id].roadnetOption, $selectedParams[id].replayOption);
    infoAppend("Finished downloading density!");
    showCanvas();
    callback();
}

let density = {};
let isStarted = false;

async function start() {
    isStarted = true;
    if (loading) return;
    loading = true;
    infoReset();
    await downloadRoadnetFile(roadnetData, async function(){
    await downloadDensityFile(densityData, async function(){
    await downloadReplayFile(replayData, function(){
        let after_update = async function() {
            infoAppend("Drawing roadnet");
            ready = false;
            guideDomElem.classList.add("d-none");
            hideCanvas();
            try {
                simulation = (roadnetData[0]);
                density = densityData[0];
            } catch (e) {
                infoAppend("Parsing roadnet file failed");
                loading = false;
                return;
            }
            try {
                //console.log(replayData[0]);
                logs = replayData[0].split('\n');
                console.log("length replay log: ", logs.length);
                logs.pop();
            } catch (e) {
                infoAppend("Reading replay file failed");
                loading = false;
                return;
            }

            totalStep = logs.length;

            $controls.paused = false;
            cnt = 0;
            console.log(`[${id}]: init: `, $globalCount);
            setTimeout(function () {
                try {
                    drawRoadnet();
                } catch (e) {
                    infoAppend("Drawing roadnet failed");
                    console.error(e);
                    loading = false;
                    return;
                }
                ready = true;
                loading = false;
                infoAppend("Start replaying");
            }, 200);
        };

        after_update();

    }); // replay callback
    }); // density callback
    }); // roadnet callback
}

let isMounted = false;

onMount(() => {
    function updateReplaySpeed(speed: number){
        speed = Math.min(speed, 1);
        speed = Math.max(speed, 0);
        $controls.replaySpeed = speed;
    }

    updateReplaySpeed(0.5);
    initCanvas();

    isMounted = true;

});

$: {
    if (isMounted && $startSimulation) {
        start();
    }
}


function initCanvas() {
    app = new PIXI.Application({
        width: nodeCanvas.offsetWidth,
        height: nodeCanvas.offsetHeight,
        backgroundColor: BACKGROUND_COLOR
    });

    nodeCanvas.appendChild(app.view);
    app.view.classList.add("d-none");

    renderer = app.renderer;
    renderer.interactive = true;
    renderer.autoResize = true;

    renderer.resize(nodeCanvas.offsetWidth, nodeCanvas.offsetHeight);
    app.ticker.add(run);
}
$: {
    if (nodeCanvas && nodeCanvas.offsetHeight) {
        console.log(`[${id}]: changed`, nodeCanvas.offsetWidth, nodeCanvas.offsetHeight);
        renderer.resize(nodeCanvas.offsetWidth, nodeCanvas.offsetHeight);
    }
}
function showCanvas() {
    spinnerDomElem.classList.add("d-none");
    app.view.classList.remove("d-none");
}

function hideCanvas() {
    spinnerDomElem.classList.remove("d-none");
    app.view.classList.add("d-none");
}

function drawRoadnet() {
    if (simulatorContainer) {
        simulatorContainer.destroy(true);
    }
    renderer.resize(nodeCanvas.offsetWidth, nodeCanvas.offsetHeight);
    console.log(`[${id}] drawing roadnet: `, nodeCanvas.offsetWidth, nodeCanvas.offsetHeight);
    app.stage.removeChildren();
    viewport = new Viewport.Viewport({
        screenWidth: nodeCanvas.offsetWidth,
        screenHeight: nodeCanvas.offsetHeight,
        worldWidth: nodeCanvas.offsetWidth,
        worldHeight: nodeCanvas.offsetHeight,
        interaction: app.renderer.plugins.interaction
    });
    viewport
        .drag()
        .pinch()
        .wheel()
        .decelerate();
    app.stage.addChild(viewport);
    simulatorContainer = new PIXI.Container();
    viewport.addChild(simulatorContainer);
    viewport.setZoom(0.75,true);
    roadnet = simulation.static;
    nodes = [];
    edges = [];
    trafficLightsG = {};

    for (let i = 0, len = roadnet.nodes.length;i < len;++i) {
        let node = roadnet.nodes[i];
        node.point = new Point(transCoord(node.point));
        nodes[node.id] = node;
    }

    for (let i = 0, len = roadnet.edges.length;i < len;++i) {
        let edge = roadnet.edges[i];
        edge.from = nodes[edge.from];
        edge.to = nodes[edge.to];
        for (let j = 0, len = edge.points.length;j < len;++j) {
            edge.points[j] = new Point(transCoord(edge.points[j]));
        }
        edges[edge.id] = edge;
    }
    edges_copy = structuredClone(edges)
    console.log("in drawRoadnet: ", edges, edges_copy)
    /**
     * Draw Map
     */
    trafficLightContainer = new PIXI.ParticleContainer(MAX_TRAFFIC_LIGHT_NUM, {tint: true});
    let mapContainer, mapGraphics;
    if ($debugMode) {
        mapContainer = new PIXI.Container();
        simulatorContainer.addChild(mapContainer);
    }else {
        mapGraphics = new PIXI.Graphics();
        simulatorContainer.addChild(mapGraphics);
    }

    for (let nodeId in nodes) {
        if (!nodes[nodeId].virtual) {
            let nodeGraphics;
            if ($debugMode) {
                nodeGraphics = new PIXI.Graphics();
                mapContainer.addChild(nodeGraphics);
            } else {
                nodeGraphics = mapGraphics;
            }
            drawNode(nodes[nodeId], nodeGraphics);
        }
    }
    for (let edgeId in edges) {
        let edgeGraphics;
        if ($debugMode) {
            edgeGraphics = new PIXI.Graphics();
            edgeGraphics.name = edgeId
            mapContainer.addChild(edgeGraphics);
        } else {
            edgeGraphics = mapGraphics;
        }
        //edgeGraphics.name = edgeId;
        edgeIdtoEdgeGraphics[edgeId] = edgeGraphics;
        drawEdge(edges[edgeId], edgeGraphics);
    }
    let bounds = simulatorContainer.getBounds();
    simulatorContainer.pivot.set(bounds.x + bounds.width / 2, bounds.y + bounds.height / 2);
    simulatorContainer.position.set(renderer.width / 2, renderer.height / 2);
    simulatorContainer.addChild(trafficLightContainer);

    /**
     * Settings for Cars
     */
    TURN_SIGNAL_LENGTH = CAR_LENGTH;
    TURN_SIGNAL_WIDTH  = CAR_WIDTH / 2;

    var carG = new PIXI.Graphics();
    carG.lineStyle(0);
    carG.beginFill(0xFFFFFF, 0.8);
    carG.drawRect(0, 0, CAR_LENGTH, CAR_WIDTH);

    let carTexture = renderer.generateTexture(carG);

    let signalG = new PIXI.Graphics();
    signalG.beginFill(TURN_SIGNAL_COLOR, 0.7).drawRect(0,0, TURN_SIGNAL_LENGTH, TURN_SIGNAL_WIDTH)
           .drawRect(0, 3 * CAR_WIDTH - TURN_SIGNAL_WIDTH, TURN_SIGNAL_LENGTH, TURN_SIGNAL_WIDTH).endFill();
    let turnSignalTexture = renderer.generateTexture(signalG);

    let signalLeft = new PIXI.Texture(turnSignalTexture, new PIXI.Rectangle(0, 0, TURN_SIGNAL_LENGTH, CAR_WIDTH));
    let signalStraight = new PIXI.Texture(turnSignalTexture, new PIXI.Rectangle(0, CAR_WIDTH, TURN_SIGNAL_LENGTH, CAR_WIDTH));
    let signalRight = new PIXI.Texture(turnSignalTexture, new PIXI.Rectangle(0, CAR_WIDTH * 2, TURN_SIGNAL_LENGTH, CAR_WIDTH));
    turnSignalTextures = [signalLeft, signalStraight, signalRight];


    carPool = [];
    if ($debugMode)
        carContainer = new PIXI.Container();
    else
        carContainer = new PIXI.ParticleContainer(NUM_CAR_POOL, {rotation: true, tint: true});


    turnSignalContainer = new PIXI.ParticleContainer(NUM_CAR_POOL, {rotation: true, tint: true});
    simulatorContainer.addChild(carContainer);
    simulatorContainer.addChild(turnSignalContainer);
    for (let i = 0, len = NUM_CAR_POOL;i < len;++i) {
        //var car = Sprite.fromImage("images/car.png")
        let car = new PIXI.Sprite(carTexture);
        let signal = new PIXI.Sprite(turnSignalTextures[1]);
        car.anchor.set(1, 0.5);

        if ($debugMode) {
            car.interactive = true;
            car.on('mouseover', function () {
                $selectedEntity = car.name;
                car.alpha = 0.8;
            });
            car.on('mouseout', function () {
                // selectedEntity = "";
                car.alpha = 1;
            });
        }
        signal.anchor.set(1, 0.5);
        carPool.push([car, signal]);
    }
    showCanvas();

    return true;
}


function transCoord(point: number[]) {
    return [point[0], -point[1]];
}

// @ts-ignore
PIXI.Graphics.prototype.drawLine = function(pointA, pointB) {
    this.moveTo(pointA.x, pointA.y);
    this.lineTo(pointB.x, pointB.y);
}

// @ts-ignore
PIXI.Graphics.prototype.drawDashLine = function(pointA, pointB, dash = 16, gap = 8) {
    let direct = pointA.directTo(pointB);
    let distance = pointA.distanceTo(pointB);

    let currentPoint = pointA;
    let currentDistance = 0;
    let length;
    let finish = false;
    while (true) {
        this.moveTo(currentPoint.x, currentPoint.y);
        if (currentDistance + dash >= distance) {
            length = distance - currentDistance;
            finish = true;
        } else {
            length = dash
        }
        currentPoint = currentPoint.moveAlong(direct, length);
        this.lineTo(currentPoint.x, currentPoint.y);
        if (finish) break;
        currentDistance += length;

        if (currentDistance + gap >= distance) {
            break;
        } else {
            currentPoint = currentPoint.moveAlong(direct, gap);
            currentDistance += gap;
        }
    }
};

function drawNode(node, graphics) {
    if($debugMode) graphics.beginFill(LANE_COLOR,0.6);
    else graphics.beginFill(LANE_COLOR);
    let outline = node.outline;
    for (let i = 0 ; i < outline.length ; i+=2) {
        outline[i+1] = -outline[i+1];
        if (i == 0)
            graphics.moveTo(outline[i], outline[i+1]);
        else
            graphics.lineTo(outline[i], outline[i+1]);
    }
    graphics.endFill();
    if ($debugMode) {
        graphics.hitArea = new PIXI.Polygon(outline);
        graphics.interactive = true;
        graphics.on("mouseover", function () {
            $selectedEntity = node.id;
            graphics.alpha = 0.5;
        });
        graphics.on("mouseout", function () {
            graphics.alpha = 1;
        });
    }

}

function drawEdge(edge, graphics, lane_color=LANE_COLOR) {
    let from = edge.from;
    let to = edge.to;
    let points = edge.points;

    let pointA, pointAOffset, pointB, pointBOffset;
    let prevPointBOffset = null;

    let roadWidth = 0;
    edge.laneWidths.forEach(function(l){
        roadWidth += l;
    }, 0);

    let coords = [], coords1 = [];

    for (let i = 1;i < points.length;++i) {
        if (i == 1){
            pointA = points[0].moveAlongDirectTo(points[1], from.virtual ? 0 : from.width);
            pointAOffset = points[0].directTo(points[1]).rotate(ROTATE);
        } else {
            pointA = points[i-1];
            pointAOffset = prevPointBOffset;
        }
        if (i == points.length - 1) {
            pointB = points[i].moveAlongDirectTo(points[i-1], to.virtual ? 0 : to.width);
            pointBOffset = points[i-1].directTo(points[i]).rotate(ROTATE);
        } else {
            pointB = points[i];
            pointBOffset = points[i-1].directTo(points[i+1]).rotate(ROTATE);
        }
        prevPointBOffset = pointBOffset;

        let lightG = new PIXI.Graphics();
        lightG.lineStyle(TRAFFIC_LIGHT_WIDTH, 0xFFFFFF);
        //@ts-ignore
        lightG.drawLine(new Point(0, 0), new Point(1, 0));
        let lightTexture = renderer.generateTexture(lightG);

        // Draw Traffic Lights
        if (i == points.length-1 && !to.virtual) {
            let edgeTrafficLights = [];
            let prevOffset = 0;
            let offset = 0;
            for (let lane = 0;lane < edge.nLane;++lane) {
                offset += edge.laneWidths[lane];
                var light = new PIXI.Sprite(lightTexture);
                light.anchor.set(0, 0.5);
                light.scale.set(offset - prevOffset, 1);
                let point_ = pointB.moveAlong(pointBOffset, prevOffset);
                light.position.set(point_.x, point_.y);
                light.rotation = pointBOffset.getAngleInRadians();
                edgeTrafficLights.push(light);
                prevOffset = offset;
                trafficLightContainer.addChild(light);
            }
            trafficLightsG[edge.id] = edgeTrafficLights;
        }

        // Draw Roads
        graphics.lineStyle(LANE_BORDER_WIDTH, LANE_BORDER_COLOR, 1);
        graphics.drawLine(pointA, pointB);

        let pointA1 = pointA.moveAlong(pointAOffset, roadWidth);
        let pointB1 = pointB.moveAlong(pointBOffset, roadWidth);

        graphics.lineStyle(0);
        if($debugMode) graphics.beginFill(lane_color, 0.6);
        else graphics.beginFill(lane_color);

        coords = coords.concat([pointA.x, pointA.y, pointB.x, pointB.y]);
        coords1 = coords1.concat([pointA1.y, pointA1.x, pointB1.y, pointB1.x]);

        graphics.drawPolygon([pointA.x, pointA.y, pointB.x, pointB.y, pointB1.x, pointB1.y, pointA1.x, pointA1.y]);
        graphics.endFill();

        let offset = 0;
        for (let lane = 0, len = edge.nLane-1;lane < len;++lane) {
            offset += edge.laneWidths[lane];
            graphics.lineStyle(LANE_BORDER_WIDTH, LANE_INNER_COLOR);
            graphics.drawDashLine(pointA.moveAlong(pointAOffset, offset), pointB.moveAlong(pointBOffset, offset), LANE_DASH, LANE_GAP);
        }

        offset += edge.laneWidths[edge.nLane-1];

        // graphics.lineStyle(LANE_BORDER_WIDTH, LANE_BORDER_COLOR);
        // graphics.drawLine(pointA.moveAlong(pointAOffset, offset), pointB.moveAlong(pointBOffset, offset));
    }

    if ($debugMode) {
        coords = coords.concat(coords1.reverse());
        graphics.interactive = true;
        graphics.hitArea = new PIXI.Polygon(coords);
        graphics.on("mouseover", function () {
            graphics.alpha = 0.5;
            $selectedEntity = edge.id;
        });

        graphics.on("mouseout", function () {
            graphics.alpha = 1;
        });
    }
}

$: {
    if ($controls.paused && $globalCount != cnt) {
        cnt = $globalCount;
        drawStep(cnt);
    }
}

function run(delta) {
    let redraw = false;
    if (ready && (!$controls.paused || redraw)) {
        try {
            drawStep(cnt);
        }catch (e) {
            console.log(e)
            infoAppend("Error occurred when drawing");
            ready = false;
        }
        if (!$controls.paused) {
            frameElapsed += 1;
            if (frameElapsed >= (1 / $controls.replaySpeed ** 2)) {
                //cnt += 1;
                globalCount.tryIncrement(id);
                //console.log(`[${id}]: step: `, cnt, $globalCount);
                if ($globalCount != cnt) {  // if every thread has arrived, increase my count too
                    cnt = $globalCount
                    frameElapsed = 0;
                    // if (cnt == 0) {
                    //     globalCount.tryReset(id);
                    // }
                }
            }
        }
    }
}

function _statusToColor(status: any) {
    switch (status) {
        case 'r':
            return LIGHT_RED;
        case 'g':
            return LIGHT_GREEN;
        default:
            return 0x808080;  
    }
}

function stringHash(str: string) {
    let hash = 0;
    let p = 127, p_pow = 1;
    let m = 1e9 + 9;
    for (let i = 0; i < str.length; i++) {
        hash = (hash + str.charCodeAt(i) * p_pow) % m;
        p_pow = (p_pow * p) % m;
    }
    return hash;
}

function drawStep(step: number) {
    let [carLogs, tlLogs] = logs[step].split(';');

    tlLogs = tlLogs.split(',');
    carLogs = carLogs.split(',');
    
    let tlLog, tlEdge, tlStatus;
    for (let i = 0, len = tlLogs.length;i < len;++i) {
        tlLog = tlLogs[i].split(' ');
        tlEdge = tlLog[0];
        tlStatus = tlLog.slice(1);
        for (let j = 0, len = tlStatus.length;j < len;++j) {
            trafficLightsG[tlEdge][j].tint = _statusToColor(tlStatus[j]);
            if (tlStatus[j] == 'i' ) {
                trafficLightsG[tlEdge][j].alpha = 0;
            }else{
                trafficLightsG[tlEdge][j].alpha = 1;
            }
        }
    }

    carContainer.removeChildren();
    turnSignalContainer.removeChildren();

    let carLog, position, length, width;
    for (let i = 0, len = carLogs.length - 1;i < len;++i) {
        carLog = carLogs[i].split(' ');
        position = transCoord([parseFloat(carLog[0]), parseFloat(carLog[1])]);
        length = parseFloat(carLog[5]);
        width = parseFloat(carLog[6]);
        carPool[i][0].position.set(position[0], position[1]);
        carPool[i][0].rotation = 2*Math.PI - parseFloat(carLog[2]);
        carPool[i][0].name = carLog[3];
        let carColorId = stringHash(carLog[3]) % CAR_COLORS_NUM;
        carPool[i][0].tint = CAR_COLORS[carColorId];
        carPool[i][0].width = length;
        carPool[i][0].height = width;
        carContainer.addChild(carPool[i][0]);

        let laneChange = parseInt(carLog[4]) + 1;
        carPool[i][1].position.set(position[0], position[1]);
        carPool[i][1].rotation = carPool[i][0].rotation;
        carPool[i][1].texture = turnSignalTextures[laneChange];
        carPool[i][1].width = length;
        carPool[i][1].height = width;
        turnSignalContainer.addChild(carPool[i][1]);
    }

    if($debugMode && step>0 && step%10==0) {
        let numRoads = Object.keys(density).length 
        for (let roadId in density) {
            let road = simulatorContainer.children[0].getChildByName(roadId, true);
            let index = Math.ceil(density[roadId][step] * numRoads * 100)
            if (index > 99) index = 99
            if (index < 0) index = 0
            //console.log("index", index)
            road.tint = parseInt(gradientArray[index].slice(1), 16)

        }
    }

    carNum = carLogs.length-1;
    totalStepNum = totalStep;
    currentStepNum = cnt+1;
    progressPercentage = (cnt / totalStep * 100).toFixed(2) + "%";
    // if (statsFile != "") {
    //     if (withRange) nodeRange.value = stats[step][1];
    //     nodeStats.innerText = stats[step][0].toFixed(2);
    // }
}

/*
Chart
 */
// }
</script>


<div id="simulator-canvas" class="h-100" bind:this={nodeCanvas}>
    <div id="spinner" class="spinner d-none" bind:this={spinnerDomElem}>
        <div class="rect1"></div>
        <div class="rect2"></div>
        <div class="rect3"></div>
        <div class="rect4"></div>
        <div class="rect5"></div>
    </div>
    <div id="guide" class="ms-auto me-auto mt-5 alert alert-secondary  w-50" bind:this={guideDomElem}>
        <h5>How to use the demonstrator</h5>
        <hr />
        <ul>
            <li>Select a <b>Scenario</b> and <b>Method</b></li>
            <li>Add (upto three) other scenarios for side-by-side comparison! </li>
            <li>Click <b>Heatmap</b> to visualize a color gradient on top* </li>
            <li>Press the <b>Start</b> button to start replaying the scenarios </li>
            <li>To restart, Reload the page (Ctrl/Cmd+R)</li>
        </ul>
        <h5>Navigation Keys</h5>
        <hr />
        <ul class="list-group">
            <li class="list-group-item d-flex justify-content-between align-items-center">
                Pause
                <span class="badge bg-secondary">P</span>
            </li>
            <li class="list-group-item d-flex justify-content-between align-items-center">
                Step Forward
                <span class="badge bg-secondary">]</span>
            </li>
            <li class="list-group-item d-flex justify-content-between align-items-center">
                Step Backward
                <span class="badge bg-secondary">[</span>
            </li>
        </ul>
    </div>
</div>


<style>
    /* https://tobiasahlin.com/spinkit/ */
.spinner {
  margin: 100px auto;
  width: 50px;
  height: 40px;
  text-align: center;
  font-size: 10px;
}

.spinner > div {
  background-color: #333;
  height: 100%;
  width: 6px;
  display: inline-block;
  
  -webkit-animation: sk-stretchdelay 1.2s infinite ease-in-out;
  animation: sk-stretchdelay 1.2s infinite ease-in-out;
}

.spinner .rect2 {
  -webkit-animation-delay: -1.1s;
  animation-delay: -1.1s;
}

.spinner .rect3 {
  -webkit-animation-delay: -1.0s;
  animation-delay: -1.0s;
}

.spinner .rect4 {
  -webkit-animation-delay: -0.9s;
  animation-delay: -0.9s;
}

.spinner .rect5 {
  -webkit-animation-delay: -0.8s;
  animation-delay: -0.8s;
}

@-webkit-keyframes sk-stretchdelay {
  0%, 40%, 100% { -webkit-transform: scaleY(0.4) }  
  20% { -webkit-transform: scaleY(1.0) }
}

@keyframes sk-stretchdelay {
  0%, 40%, 100% { 
    transform: scaleY(0.4);
    -webkit-transform: scaleY(0.4);
  }  20% { 
    transform: scaleY(1.0);
    -webkit-transform: scaleY(1.0);
  }
}

#simulator-canvas {
    margin: 0.5em;
}

</style>