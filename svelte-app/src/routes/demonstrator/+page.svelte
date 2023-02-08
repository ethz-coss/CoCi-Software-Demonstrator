<script lang="ts">
    import Simulator from "./simulator.svelte";
    import Controller from "./controller.svelte";
    import {controls, selectedParams, globalCount} from "./stores";
    const P = 80;
    const LEFT_BRACKET = 219, RIGHT_BRACKET = 221; 
    let progressPercentage, selectedEntity;
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
</script>
<svelte:window on:keydown={handleKeydown}/>

<div class="container-fluid w-100 h-100 pt-0 pb-0">
    <div class="row h-100">
        <div class="col-2 pt-4 shadow-lg mr-0 status-panel ">
            <!-- <i class="fas fa-car h2"></i> -->
            <h2 class="pb-3 border-bottom">CoCi Demonstrator</h2>
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
                    <td class="text-right" id="selected-entity">{selectedEntity}</td>
                </tr>
                </tbody>
            </table>
            <Controller/>
        </div>
        <div class="col-10">
            {#each $selectedParams as _,i}
                <!-- <Simulator id={i}/> -->
                {#if i%2 == 0}
                    <div class="row {$selectedParams.length > 2 ? "h-50": "h-100"}">
                        <div class="col"> 
                            <Simulator id={i}/> 
                        </div>
                        {#if i+1 < $selectedParams.length}
                            <div class="col"> <Simulator id={i+1}/> </div>
                        {/if}
                    </div>
                {/if}
            {/each}
        </div>
    </div>
</div>

<style>
.status-panel {
    z-index: 3;
    min-height: 100vh;
    /*overflow-y: auto; */
}
</style>
