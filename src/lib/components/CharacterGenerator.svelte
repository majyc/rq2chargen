<script lang="ts">
	interface Stats {
		STR: number;
		CON: number;
		SIZ: number;
		INT: number;
		POW: number;
		DEX: number;
		CHA: number;
	}

	interface Background {
		value: string;
		label: string;
		chance: number;
		money: () => number;
	}

	interface RerollCheck {
		needsReroll: boolean;
		message: string;
	}

	const CharGenRules = {
		STANDARD: 'standard',
		LOW_AVERAGE: 'low_average',
		LOW_STATS: 'low_stats',
		BOTH: 'both'
	} as const;

	type CharGenRule = (typeof CharGenRules)[keyof typeof CharGenRules];

	const backgrounds: Background[] = [
		{
			value: 'peasant',
			label: 'Peasant',
			chance: 25,
			money: () => rollDice(1, 100)
		},
		{
			value: 'townsman',
			label: 'Townsman',
			chance: 35,
			money: () => rollDice(2, 100)
		},
		{
			value: 'barbarian',
			label: 'Barbarian',
			chance: 25,
			money: () => rollDice(1, 100)
		},
		{
			value: 'poor-noble',
			label: 'Poor Noble',
			chance: 10,
			money: () => rollDice(1, 100) * 5
		},
		{
			value: 'rich-noble',
			label: 'Rich Noble',
			chance: 4,
			money: () => rollDice(1, 100) * 10
		},
		{
			value: 'very-rich-noble',
			label: 'Very Rich Noble',
			chance: 1,
			money: () => rollDice(1, 100) * 20
		}
	];

	let name = '';
	let chargenRules: CharGenRule = CharGenRules.STANDARD;
	let stats: Stats = {
		STR: 0,
		CON: 0,
		SIZ: 0,
		INT: 0,
		POW: 0,
		DEX: 0,
		CHA: 0
	};
	let background = '';
	let startingMoney = 0;
	let derivationNotes: string[] = [];
	let isDerivationVisible = false;

	const rollDice = (numberOfDice: number, sides: number): number => {
		return Array(numberOfDice)
			.fill(0)
			.map(() => Math.floor(Math.random() * sides) + 1)
			.reduce((a, b) => a + b, 0);
	};

	const roll3d6 = () => {
		const rolls = Array(3)
			.fill(0)
			.map(() => Math.floor(Math.random() * 6) + 1);
		return {
			total: rolls.reduce((a, b) => a + b, 0),
			rolls
		};
	};

	const checkLowAverage = (stats: Stats): RerollCheck => {
		const avg = Object.values(stats).reduce((a, b) => a + b, 0) / 7;
		return {
			needsReroll: avg < 9,
			message: `Average (${avg.toFixed(2)}) ${avg < 9 ? 'below' : 'above'} 9`
		};
	};

	const checkLowStats = (stats: Stats): RerollCheck => {
		const hasLow = Object.values(stats).some((v) => v <= 6);
		const hasHigh = Object.values(stats).some((v) => v >= 15);
		return {
			needsReroll: hasLow && !hasHigh,
			message: `Has characteristic <= 6 with ${hasHigh ? '' : 'no'} characteristic >= 15`
		};
	};

	const needsReroll = (stats: Stats): RerollCheck => {
		switch (chargenRules) {
			case CharGenRules.LOW_AVERAGE:
				return checkLowAverage(stats);
			case CharGenRules.LOW_STATS:
				return checkLowStats(stats);
			case CharGenRules.BOTH: {
				const avgCheck = checkLowAverage(stats);
				const statsCheck = checkLowStats(stats);
				return {
					needsReroll: avgCheck.needsReroll || statsCheck.needsReroll,
					message: `${avgCheck.message} AND ${statsCheck.message}`
				};
			}
			default:
				return { needsReroll: false, message: 'Standard rules - no reroll needed' };
		}
	};

	const rollStats = () => {
		let newStats: Stats;
		let notes: string[] = [];
		do {
			newStats = {
				STR: 0,
				CON: 0,
				SIZ: 0,
				INT: 0,
				POW: 0,
				DEX: 0,
				CHA: 0
			};
			for (const stat of Object.keys(stats) as Array<keyof Stats>) {
				const { total, rolls } = roll3d6();
				newStats[stat] = total;
				notes.push(`${stat}: Rolled ${rolls.join('+')} = ${total}`);
			}

			const { needsReroll: needsRerollResult, message } = needsReroll(newStats);
			notes.push(message);

			if (!needsRerollResult) {
				const avg = Object.values(newStats).reduce((a, b) => a + b, 0) / 7;
				notes.push(`Final average: ${avg.toFixed(2)}`);
				break;
			} else {
				notes.push('Rerolling characteristics');
			}
		} while (true);

		stats = newStats;
		derivationNotes = notes;
	};

	const determineBackground = () => {
		const roll = Math.floor(Math.random() * 100) + 1;
		let cumulative = 0;
		for (const bg of backgrounds) {
			cumulative += bg.chance;
			if (roll <= cumulative) {
				background = bg.value;
				startingMoney = bg.money();
				derivationNotes = [
					...derivationNotes,
					`Background roll: ${roll} = ${bg.label}`,
					`Starting money for ${bg.label}: ${startingMoney} Lunars`
				];
				return;
			}
		}
	};

	$: hitPoints = (() => {
		const base = stats.CON;
		const sizMod = stats.SIZ >= 17 ? 1 : 0;
		const powMod = stats.POW >= 17 ? 1 : 0;
		return base + sizMod + powMod;
	})();

	$: damageBonus = (() => {
		const avg = Math.floor((stats.STR + stats.SIZ) / 2);
		if (avg <= 6) return '-1D4';
		if (avg <= 12) return 'None';
		if (avg <= 16) return '+1D4';
		if (avg <= 20) return '+1D6';
		return `+${Math.floor((avg - 20) / 8) + 1}D6`;
	})();

	$: movement = 8;
	$: strikeRank = stats.SIZ + stats.DEX;
	$: defense = Math.max(0, (stats.DEX - 12) * 5);
</script>

<div class="w-full max-w-2xl rounded-lg border p-6 shadow-sm">
	<header class="space-y-1.5">
		<h2 class="text-2xl font-semibold">RuneQuest Character Generator</h2>
	</header>

	<div class="space-y-4 p-6">
		<div class="flex gap-4">
			<button
				on:click={rollStats}
				class="rounded-md bg-primary px-4 py-2 text-primary-foreground hover:bg-primary/90"
			>
				Roll Statistics
			</button>
			<button
				on:click={determineBackground}
				class="rounded-md bg-primary px-4 py-2 text-primary-foreground hover:bg-primary/90"
			>
				Determine Background
			</button>
		</div>

		<div class="grid grid-cols-2 gap-4">
			<div class="space-y-2">
				<label for="character-name" class="text-sm font-medium">Character Name</label>
				<input
					id="character-name"
					bind:value={name}
					placeholder="Enter name"
					class="w-full rounded-md border px-3 py-2"
				/>
			</div>

			<div class="space-y-2">
				<label for="generation-rules" class="text-sm font-medium">Generation Rules</label>
				<select
					id="generation-rules"
					bind:value={chargenRules}
					class="w-full rounded-md border px-3 py-2"
				>
					{#each Object.entries(CharGenRules) as [key, value]}
						<option {value}>
							{key.toLowerCase().replace('_', ' ')}
						</option>
					{/each}
				</select>
			</div>
		</div>

		<div class="grid grid-cols-2 gap-4">
			<div class="space-y-4">
				<h3 class="font-bold">Primary Statistics</h3>
				{#each Object.entries(stats) as [stat, value]}
					<div class="flex items-center justify-between">
						<span class="text-sm font-medium">{stat}</span>
						<div class="font-mono">{value || '-'}</div>
					</div>
				{/each}
			</div>

			<div class="space-y-4">
				<h3 class="font-bold">Derived Statistics</h3>
				<div class="flex items-center justify-between">
					<span class="text-sm font-medium">Background</span>
					<div class="font-mono">{background || '-'}</div>
				</div>
				<div class="flex items-center justify-between">
					<span class="text-sm font-medium">Starting Money</span>
					<div class="font-mono">{startingMoney || '-'} Lunars</div>
				</div>
				<div class="flex items-center justify-between">
					<span class="text-sm font-medium">Hit Points</span>
					<div class="font-mono">{hitPoints || '-'}</div>
				</div>
				<div class="flex items-center justify-between">
					<span class="text-sm font-medium">Damage Bonus</span>
					<div class="font-mono">{damageBonus || '-'}</div>
				</div>
				<div class="flex items-center justify-between">
					<span class="text-sm font-medium">Strike Rank</span>
					<div class="font-mono">{strikeRank || '-'}</div>
				</div>
				<div class="flex items-center justify-between">
					<span class="text-sm font-medium">Defense</span>
					<div class="font-mono">{defense}%</div>
				</div>
			</div>
		</div>

		{#if derivationNotes.length > 0}
			<div class="mt-4">
				<button
					on:click={() => (isDerivationVisible = !isDerivationVisible)}
					class="flex w-full items-center justify-between rounded-lg bg-gray-100 p-3 hover:bg-gray-200"
				>
					<h3 class="font-bold">Derivation Notes</h3>
					<svg class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
						{#if isDerivationVisible}
							<path
								fill-rule="evenodd"
								d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z"
								clip-rule="evenodd"
							/>
						{:else}
							<path
								fill-rule="evenodd"
								d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
								clip-rule="evenodd"
							/>
						{/if}
					</svg>
				</button>

				{#if isDerivationVisible}
					<div class="mt-2 space-y-1 rounded-lg border border-gray-200 bg-white p-4 text-sm">
						{#each derivationNotes as note, i}
							<div class="text-gray-600">
								{note}
							</div>
						{/each}
					</div>
				{/if}
			</div>
		{/if}
	</div>
</div>
