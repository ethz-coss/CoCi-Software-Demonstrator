<script lang="ts">
    import Simulator from "./simulator.svelte";
    import Controller from "./controller.svelte";
    import Viewport from 'svelte-viewport-info';
    import {controls, selectedParams, globalCount, debugMode, startSimulation, selectedEntity} from "./stores";
    import Navbar from "../navbar.svelte";
    const P = 80;
    const LEFT_BRACKET = 219, RIGHT_BRACKET = 221; 
    let progressPercentage;
    function handleKeydown(e) {
        if (e.keyCode == P) {
            $controls.paused = !$controls.paused;
        } else if (e.keyCode == LEFT_BRACKET) {
            $controls.paused = true;
            $globalCount = ($globalCount - 1 + 3600) % 3600;
        } else if (e.keyCode == RIGHT_BRACKET) {
            $controls.paused = true;
            $globalCount = ($globalCount + 1) % 3600;
        }
    }
    let screenHeight = Viewport.Height - 50;
    let halfScreenHeight = Math.ceil(screenHeight/2);
    console.log("screenHeight", screenHeight);
</script>
<svelte:window on:keydown={handleKeydown}/>

<Navbar />
<main class="flex-shrink-0">
<div class="container-fluid pt-0 pb-0">
    <div class="row vh-100">
        <div class="col-2 pt-4 shadow-lg mr-0 status-panel h-100 noscrollbar" style="overflow-y: scroll;">
            <!-- <i class="fas fa-car h2"></i> -->
            <h3 class="pb-3 border-bottom">CoCi Demonstrator</h3>
            <table class="table table-borderless table-hover border-bottom">
                <tbody>
                <tr class="d-none">
                    <th scope="row" class="pl-0">Number of vehicles</th>
                    <td class="text-right" id="car-num">{$controls.replaySpeed}</td>
                </tr>
                <tr class="d-none">
                    <th scope="row" class="pl-0">Total number of simulation step</th>
                    <td class="text-right" id="total-step-num">3600</td>
                </tr>
                <tr>
                    <th scope="row" class="pl-0">Current step</th>
                    <td class="text-right" id="current-step-num">{$globalCount}</td>
                </tr>
                <tr class="d-none">
                    <th scope="row" class="pl-0">Current simulation progress</th>
                    <td class="text-right" id="progress-percentage">{progressPercentage}</td>
                </tr>
                <tr class="d-none" id="speed-tr">
                    <th scope="row" class="pl-0">Average speed on lanes</th>
                    <td class="text-right" id="speed">0</td>
                </tr>
                <tr>
                    <th scope="row" class="pl-0">Selected</th>
                    <td class="text-right" id="selected-entity">{$selectedEntity}</td>
                </tr>
                </tbody>
            </table>
            <Controller/>
        </div>
        <div class="col-10 h-100" style="overflow-y: scroll;">
            {#each $selectedParams as _,i}
                <!-- <Simulator id={i}/> -->
                {#if i%2 == 0}
                    <div class="row {$selectedParams.length > 2 ? "h-50": "h-100"}">
                        <div class="col" style="height: {$selectedParams.length > 2 ? halfScreenHeight : screenHeight}px;"> 
                            <Simulator id={i}/> 
                        </div>
                        {#if i+1 < $selectedParams.length}
                            <div class="col" style="height: {$selectedParams.length > 2 ? halfScreenHeight : screenHeight}px;"> <Simulator id={i+1}/> </div>
                        {/if}
                    </div>
                {/if}
            {/each}
        </div>
    </div>
</div>

<div id="gradient-container" class:d-none={!$debugMode || false}>
    Density
    <div id="gradient-legend"></div>
</div>
</main>
<style>
.status-panel {
    z-index: 3;
    min-height: 100vh;
    /*overflow-y: auto; */
}

.noscrollbar::-webkit-scrollbar {
    width: 0px;
    background: transparent;
}

#gradient-container {
    width: 200px;
    position: fixed;
    z-index: 1000;
    right:10px;
    bottom:25px;
}
#gradient-legend {
    background: linear-gradient(90deg, #00FFFF, #00FF00, #FFFF00, #FF0000);
    height: 15px;
    width: 200px;
    position: fixed;
    z-index: 1000;
    right:10px;
    bottom:10px;
}
</style>
