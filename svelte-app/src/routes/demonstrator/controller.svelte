<script lang="ts">
    import * as utils from './utils';
    import {onMount} from 'svelte';
    import {controls, debugMode, selectedParams, infoDOM, startSimulation, globalCount} from './stores';

    let pauseButton: HTMLButtonElement;
    let replayControlDom: HTMLInputElement;
    let replaySpeedDom: HTMLTableCellElement;
    let startBtnDomElem: HTMLButtonElement;
    let fastBtnDomElem: HTMLSpanElement;
    let slowBtnDomElem: HTMLSpanElement;

    let roadnetOptionsList = [["Loading..."]];
    let replayOptionsForRoadnetOptionList = [["Loading..."]];
    $selectedParams = [{roadnetOption: "Loading...", replayOption: "Loading..."}];

    $debugMode = true;
    async function start() {
        /// create children and pass message to children containing simulation params
        //$syncCount = new SynchronizedCounter($selectedParams.length);
        globalCount.setNumThreads($selectedParams.length);
        $startSimulation = true;
    }

    function clearSelect(selectElem: HTMLSelectElement | null) {
        while(selectElem && selectElem.options.length) {
            selectElem.remove(0);
        }
    }

    async function addScenario() {
        let roadnetOptions = await utils.getRoadnetOptions();
        let replayOptions = await utils.getReplayOptions(roadnetOptions[0]);
        roadnetOptionsList = [...roadnetOptionsList, roadnetOptions];
        replayOptionsForRoadnetOptionList = [...replayOptionsForRoadnetOptionList, replayOptions];
        $selectedParams = [...$selectedParams, {roadnetOption: roadnetOptions[0], replayOption: replayOptions[0]}]
        console.log($selectedParams, $debugMode)
    }

    async function initialize() {
        roadnetOptionsList = [];
        replayOptionsForRoadnetOptionList = [];
        $selectedParams = [];
        addScenario();
    }


    onMount(() => {
        // clearSelect(roadnetSelect)

        // utils.getRoadnetOptions(roadnetCallback).then((opt) => utils.getReplayOptions(opt, repalyCallback));

        // roadnetSelect.addEventListener('change', (event) => utils.getReplayOptions((event.target as HTMLInputElement).value, repalyCallback));
        initialize();
        startBtnDomElem.addEventListener("click", start);

        slowBtnDomElem.addEventListener("click", function() {
            updateReplaySpeed($controls.replaySpeed - 0.1);
        })

        fastBtnDomElem.addEventListener("click", function() {
            updateReplaySpeed($controls.replaySpeed + 0.1);
        })

        replayControlDom.addEventListener('change', function(e){
            updateReplaySpeed(Number(replayControlDom.value) / 100);
        });

        pauseButton.addEventListener('click', function(e){
            $controls.paused = !$controls.paused;
        });

        function updateReplaySpeed(speed: number){
            speed = Math.min(speed, 1);
            speed = Math.max(speed, 0);
            $controls.replaySpeed = speed;
            replayControlDom.value = String(speed * 100);
            replaySpeedDom.innerHTML = speed.toFixed(2);
        }

        updateReplaySpeed(0.5);
    });


    async function onRoadnetOptionChange(i: number) {
        let replayOptions = await utils.getReplayOptions($selectedParams[i].roadnetOption);
        replayOptionsForRoadnetOptionList[i] = replayOptions;
        $selectedParams[i].replayOption = replayOptions[0];
    } 
</script>

<div id="predefined-scenarios" class="border-dark">

    <div>
        {#each roadnetOptionsList as _,i}
        <div class="border-bottom pb-2">
            <label for="roadnet">Select Scenario</label>

            <select class="form-select" id="roadnet" bind:value={$selectedParams[i].roadnetOption} on:change={() => onRoadnetOptionChange(i)}>
                {#each roadnetOptionsList[i] as opt}
                    <option value={opt}>{opt}</option>
                {/each}
            </select>
            
            <label for="flow">Select Method</label>
            <select class="form-select" id="flow" bind:value={$selectedParams[i].replayOption}>
                {#each replayOptionsForRoadnetOptionList[i] as opt}
                    <option value={opt}>{opt}</option>
                {/each}
            </select>
        </div>
        {/each}

        <div>
            {#if $selectedParams.length < 4}
            <button class="btn btn-link" on:click={addScenario}> <span class="fas fa-plus"></span> Add scenario</button>
            {/if}
        </div>

        <div>
            <input type="checkbox" id="debug-mode"  bind:checked={$debugMode}/>
            <label for="debug-mode">Heatmap</label>
        </div>
        <div class="col-12 mt-3">
            <button class="btn btn-primary" id="start-btn" bind:this={startBtnDomElem}>Start</button>
        </div>
    </div>
</div>
<div id="control-box " class="border-bottom">
    <h5 class="mt-4">Control Box</h5>
    <table class="table table-borderless table-hover mb-0">
        <tbody>
        <tr style="line-height: 10px; height: 10px;">
            <th scope="row" class="pl-0" id="stats-name">Replay Speed</th>
            <td class="text-right" id="replay-speed" bind:this={replaySpeedDom}>0</td>
        </tr>
        </tbody>
    </table>
    <div class="row no-gutters">
        <div class="col-2 text-center">
            <span class="fas fa-minus" id="slow-btn" style="cursor: pointer" bind:this={slowBtnDomElem}></span>
        </div>
        <div class="col-7">
            <input type="range" class="custom-range" id="replay-control" bind:this={replayControlDom}>
        </div>
        <div class="col-2 text-center">
            <span class="fas fa-plus" id="fast-btn" style="cursor: pointer" bind:this={fastBtnDomElem}></span>
        </div>
    </div>
    <div class="row m-3">
        <div class="col-12 text-center">
            <button class="btn btn-outline-secondary w-100" id="pause" bind:this={pauseButton}>{$controls.paused ? "Resume" : "Pause"}</button>
        </div>
    </div>

</div>

<h5 class="mt-4">Info Box</h5>
<div id="info" class="alert alert-light border">
    {$infoDOM.innerText}
</div>

<style>
/* #info {
    max-height: 100%;
} */
</style>