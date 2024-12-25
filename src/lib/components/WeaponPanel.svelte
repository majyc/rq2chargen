<!-- Separate component for the weapons panel -->
<script lang="ts">
    import type { WeaponDisplay } from '../weapons/types';
    
    export let weapons: WeaponDisplay[] = [];
    export let editingWeapons = false;
    
    function handleSave() {
        editingWeapons = false;
        dispatch('save');
    }
    
    import { createEventDispatcher } from 'svelte';
    const dispatch = createEventDispatcher();
</script>

<div class="overflow-x-auto">
    <table class="w-full">
        <thead>
            <tr class="border-b text-sm">
                <th class="p-2">Equipped</th>
                <th class="p-2 text-left">Weapon</th>
                <th class="p-2">Attack %</th>
                <th class="p-2">Parry %</th>
                <th class="p-2">SR</th>
                <th class="p-2">Damage</th>
                <th class="p-2">ENC</th>
            </tr>
        </thead>
        <tbody>
            {#each weapons.filter(w => w.visible || editingWeapons) as weapon (weapon.id)}
                <tr class="border-b hover:bg-gray-50">
                    <td class="p-2 text-center">
                        {#if editingWeapons}
                            <input
                                type="checkbox"
                                bind:checked={weapon.visible}
                                class="h-4 w-4 rounded border-gray-300"
                            />
                        {:else}
                            <input
                                type="checkbox"
                                bind:checked={weapon.equipped}
                                class="h-4 w-4 rounded border-gray-300"
                            />
                        {/if}
                    </td>
                    <td class="p-2">{weapon.name}</td>
                    <td class="p-2 text-center">{weapon.effectiveSkill}%</td>
                    <td class="p-2 text-center">{weapon.effectiveParry}%</td>
                    <td class="p-2 text-center">{weapon.strikeRank}</td>
                    <td class="p-2 text-center">{weapon.damage}</td>
                    <td class="p-2 text-center">{weapon.encumbrance}</td>
                </tr>
            {/each}
        </tbody>
    </table>
</div>

<div class="mt-4 flex justify-end space-x-2">
    {#if editingWeapons}
        <button
            on:click={handleSave}
            class="rounded bg-primary px-4 py-2 text-sm text-white hover:bg-primary/90"
        >
            Save Changes
        </button>
    {:else}
        <button
            on:click={() => editingWeapons = true}
            class="rounded bg-gray-200 px-4 py-2 text-sm hover:bg-gray-300"
        >
            Show/Hide Weapons
        </button>
    {/if}
</div>