<script lang="ts">
	import HitLocationChart from './HitLocationChart.svelte';

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

	interface TrainingPurchase {
		weapon: string;
		skillType: 'attack' | 'parry';
		percentagePoints: number;
		cost: number;
	}

	interface TrainingOption {
		weapon: string;
		baseCost: number; // Cost per 5% increment
		currentAttack: number;
		currentParry: number;
		maxTrainable: number;
	}

	interface WeaponTraining {
		weapon: string;
		attackTraining: number;
		parryTraining: number;
		category: string; // Added to help with grouping
		originalCost: number; // Track how much was spent initially
	}

	interface WeaponType {
		category: string;
		name: string;
		basic: number; // Basic training cost
		baseChance: number; // Basic chance to hit
		costs: {
			low: number; // 05-25%
			medium: number; // 30-50%
			high: number; // 55-75%
		};
	}

	const weaponTypes: WeaponType[] = [
		// 10% Chance Base
		{
			category: 'Missile Weapons',
			name: 'Axe (thrown)',
			basic: 25,
			baseChance: 10,
			costs: { low: 200, medium: 400, high: 800 }
		},
		{
			category: 'Missile Weapons',
			name: 'Bow',
			basic: 25,
			baseChance: 10,
			costs: { low: 200, medium: 400, high: 800 }
		},
		{
			category: 'Hand to Hand Weapons',
			name: 'Head Butt',
			basic: 25,
			baseChance: 10,
			costs: { low: 200, medium: 400, high: 800 }
		},
		{
			category: 'Defensive Items',
			name: 'Medium Shield',
			basic: 25,
			baseChance: 10,
			costs: { low: 200, medium: 400, high: 800 }
		},
		{
			category: 'Thrusting Weapons',
			name: 'Pike',
			basic: 10,
			baseChance: 10,
			costs: { low: 400, medium: 800, high: 1600 }
		},
		{
			category: 'Missile Weapons',
			name: 'Sling',
			basic: 25,
			baseChance: 10,
			costs: { low: 200, medium: 400, high: 800 }
		},
		{
			category: 'Thrusting Weapons',
			name: 'Spear, 1H',
			basic: 10,
			baseChance: 10,
			costs: { low: 200, medium: 400, high: 1000 }
		},
		{
			category: 'Cut and Thrust Weapons',
			name: 'Sword, 1H',
			basic: 10,
			baseChance: 10,
			costs: { low: 300, medium: 500, high: 1000 }
		},

		// 15% Chance Base
		{
			category: 'Cut and Thrust Weapons',
			name: 'Axe, 1H',
			basic: 20,
			baseChance: 15,
			costs: { low: 300, medium: 500, high: 1000 }
		},
		{
			category: 'Missile Weapons',
			name: 'Flail',
			basic: 15,
			baseChance: 15,
			costs: { low: 400, medium: 800, high: 1200 }
		},
		{
			category: 'Missile Weapons',
			name: 'Javelin/Dart (thrown)',
			basic: 25,
			baseChance: 15,
			costs: { low: 200, medium: 400, high: 800 }
		},
		{
			category: 'Hand to Hand Weapons',
			name: 'Knife (thrown)',
			basic: 25,
			baseChance: 15,
			costs: { low: 200, medium: 400, high: 800 }
		},
		{
			category: 'Smashing Weapons',
			name: 'Maul',
			basic: 20,
			baseChance: 15,
			costs: { low: 200, medium: 600, high: 1500 }
		},
		{
			category: 'Cut and Thrust Weapons',
			name: 'Shortsword',
			basic: 15,
			baseChance: 15,
			costs: { low: 200, medium: 400, high: 800 }
		},
		{
			category: 'Cut and Thrust Weapons',
			name: 'Sickle',
			basic: 15,
			baseChance: 15,
			costs: { low: 200, medium: 400, high: 800 }
		},

		// 20% Chance Base
		{
			category: 'Cut and Thrust Weapons',
			name: 'Club/Mace, 1H or 2H',
			basic: 25,
			baseChance: 20,
			costs: { low: 200, medium: 400, high: 800 }
		},
		{
			category: 'Missile Weapons',
			name: 'Crossbow',
			basic: 25,
			baseChance: 20,
			costs: { low: 200, medium: 400, high: 800 }
		},
		{
			category: 'Smashing Weapons',
			name: 'Hammer, 1H',
			basic: 15,
			baseChance: 20,
			costs: { low: 300, medium: 600, high: 1000 }
		},
		{
			category: 'Defensive Items',
			name: 'Large Shield',
			basic: 25,
			baseChance: 20,
			costs: { low: 200, medium: 400, high: 800 }
		},
		{
			category: 'Thrusting Weapons',
			name: 'Spear, 2H',
			basic: 20,
			baseChance: 20,
			costs: { low: 200, medium: 400, high: 800 }
		},
		{
			category: 'Hand to Hand Weapons',
			name: 'Staff',
			basic: 25,
			baseChance: 20,
			costs: { low: 200, medium: 400, high: 800 }
		},

		// 25% Chance Base
		{
			category: 'Hand to Hand Weapons',
			name: 'Dagger',
			basic: 25,
			baseChance: 25,
			costs: { low: 200, medium: 400, high: 800 }
		},
		{
			category: 'Hand to Hand Weapons',
			name: 'Grapple',
			basic: 25,
			baseChance: 25,
			costs: { low: 500, medium: 800, high: 1200 }
		},
		{
			category: 'Hand to Hand Weapons',
			name: 'Kick',
			basic: 25,
			baseChance: 25,
			costs: { low: 200, medium: 400, high: 1000 }
		},
		{
			category: 'Missile Weapons',
			name: 'Thrown Rock',
			basic: 25,
			baseChance: 25,
			costs: { low: 200, medium: 400, high: 800 }
		}
	];

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

	let availableMoney = startingMoney;
	let guildCredit = 0;
	let guildDebt = 0;
	let showTrainingPanel = false;

	function calculateEffectiveSkill(baseChance: number, trainedSkill: number): number {
		return baseChance + trainedSkill;
	}

	function adjustSkill(weapon: string, skillType: 'attack' | 'parry', adjustment: number) {
		const weaponType = weaponTypes.find((w) => w.name === weapon);
		if (!weaponType) return;

		currentTraining = currentTraining.map((t) => {
			if (t.weapon === weapon) {
				const currentTraining = skillType === 'attack' ? t.attackTraining : t.parryTraining;
				const newTraining = currentTraining + adjustment;

				// Check bounds
				if (newTraining < 0 || newTraining > 70) return t; // Max 70% training to reach 75-95% effective

				// Calculate cost difference
				const oldCost = calculateTrainingCost(weaponType, currentTraining);
				const newCost = calculateTrainingCost(weaponType, newTraining);
				const costDiff = adjustment > 0 ? newCost : -oldCost;

				// Check if we can afford it
				if (costDiff > 0 && costDiff > availableMoney + guildCredit - guildDebt) {
					alert('Not enough money or credit available');
					return t;
				}

				// Update money/debt
				if (costDiff > 0) {
					if (costDiff > availableMoney) {
						guildDebt += costDiff - availableMoney;
						availableMoney = 0;
					} else {
						availableMoney -= costDiff;
					}
				} else {
					if (guildDebt > 0) {
						guildDebt = Math.max(0, guildDebt + costDiff);
					} else {
						availableMoney -= costDiff;
					}
				}

				return {
					...t,
					attackTraining: skillType === 'attack' ? newTraining : t.attackTraining,
					parryTraining: skillType === 'parry' ? newTraining : t.parryTraining,
					originalCost: t.originalCost + (costDiff > 0 ? costDiff : 0)
				};
			}
			return t;
		});
	}

	// Group weapons by category
	$: groupedWeapons = Array.from(new Set(currentTraining.map((t) => t.category))).map(
		(category) => ({
			category,
			weapons: currentTraining.filter((t) => t.category === category)
		})
	);

	const trainingOptions: TrainingOption[] = [
		{ weapon: 'Broadsword', baseCost: 100, currentAttack: 10, currentParry: 5, maxTrainable: 75 },
		{ weapon: 'Shortsword', baseCost: 80, currentAttack: 15, currentParry: 5, maxTrainable: 75 },
		{ weapon: 'Dagger', baseCost: 50, currentAttack: 15, currentParry: 5, maxTrainable: 75 },
		{ weapon: 'Spear', baseCost: 100, currentAttack: 15, currentParry: 5, maxTrainable: 75 }
	];

	// Calculate available guild credit based on STR
	$: guildCredit = stats.STR * 100;

	// Calculate CHA discount (5% per point over 12)
	$: chaDiscount = Math.max(0, (stats.CHA - 12) * 0.05);

	function calculateTrainingCost(weapon: WeaponType, currentSkill: number): number {
		// Determine which cost bracket to use based on current skill
		let cost: number;
		if (currentSkill < 25) {
			cost = weapon.costs.low;
		} else if (currentSkill < 50) {
			cost = weapon.costs.medium;
		} else {
			cost = weapon.costs.high;
		}

		// Apply CHA discount
		cost = cost * (1 - chaDiscount);
		return Math.floor(cost);
	}

	// Track current training levels separately from weapon definitions
	let currentTraining: WeaponTraining[] = weaponTypes.map(
		(w: WeaponType): WeaponTraining => ({
			weapon: w.name,
			category: w.category,
			attackTraining: 0,
			parryTraining: 0,
			originalCost: 0
		})
	);

	function getCurrentTraining(weaponName: string): WeaponTraining {
		return (
			currentTraining.find((t) => t.weapon === weaponName) || {
				weapon: weaponName,
				category: '',
				attackTraining: 0,
				parryTraining: 0,
				originalCost: 0
			}
		);
	}
</script>

<div class="w-full max-w-4xl rounded-lg border p-6 shadow-sm">
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

		<div class="grid grid-cols-3 gap-4">
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

		<!-- Primary Stats Column -->
		<div class="grid grid-cols-3 gap-4">
			<div class="space-y-4">
				<h3 class="font-bold">Primary Statistics</h3>
				{#each Object.entries(stats) as [stat, value]}
					<div class="flex items-center justify-between">
						<span class="text-sm font-medium">{stat}</span>
						<div class="font-mono">{value || '-'}</div>
					</div>
				{/each}
			</div>

			<!-- Derived Stats Column -->
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

			<!-- Hit Location Chart -->
			<div class="relative">
				<HitLocationChart {hitPoints} baseArmor={0} />
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

		<div class="mt-4">
			<button
				on:click={() => (showTrainingPanel = !showTrainingPanel)}
				class="flex w-full items-center justify-between rounded-lg bg-gray-100 p-3 hover:bg-gray-200"
			>
				<h3 class="font-bold">Training & Guild Credit</h3>
				<svg class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
					{#if showTrainingPanel}
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

			{#if showTrainingPanel}
				<div class="mt-2 rounded-lg border border-gray-200 bg-white p-4">
					<div class="mb-4 space-y-2 rounded-lg bg-gray-50 p-3">
						<h4 class="font-semibold">Guild Credit Rules:</h4>
						<ul class="ml-4 list-disc space-y-1 text-sm text-gray-600">
							<li>Credit available: STR × 100 Lunars</li>
							<li>Must be paid back before further training</li>
							<li>CHA discount: -{Math.floor(chaDiscount * 100)}% ({stats.CHA} CHA)</li>
							<li>Training limited to 75% through guilds</li>
							<li>Each 5% increase costs more at higher skill levels</li>
						</ul>
					</div>

					<div class="mb-4 grid grid-cols-2 gap-4 text-sm">
						<div>Available Money: {availableMoney} L</div>
						<div>Guild Credit: {guildCredit} L</div>
						<div>Guild Debt: {guildDebt} L</div>
						<div>Net Available: {availableMoney + guildCredit - guildDebt} L</div>
					</div>

					{#each groupedWeapons as group}
						<div class="mb-6">
							<h3 class="mb-2 font-bold">{group.category}</h3>
							<div class="overflow-x-auto">
								<table class="w-full">
									<thead>
										<tr class="border-b text-sm">
											<th class="p-2 text-left">Weapon</th>
											<th class="p-2">Basic Cost</th>
											<th class="p-2">Base %</th>
											<th class="p-2" colspan="2">Attack</th>
											<th class="p-2">Next Cost</th>
											<th class="p-2" colspan="2">Parry</th>
											<th class="p-2">Next Cost</th>
										</tr>
										<tr class="border-b text-xs text-gray-600">
											<th class="p-2 text-left"></th>
											<th></th>
											<th></th>
											<th class="p-2">Training</th>
											<th class="p-2">Effective</th>
											<th></th>
											<th class="p-2">Training</th>
											<th class="p-2">Effective</th>
											<th></th>
										</tr>
									</thead>
									<tbody>
										{#each group.weapons as training}
											{@const weapon = weaponTypes.find((w) => w.name === training.weapon)}
											{#if weapon}
												<tr class="border-b hover:bg-gray-50">
													<td class="p-2">{training.weapon}</td>
													<td class="p-2 text-center">{weapon.basic}L</td>
													<td class="p-2 text-center">{weapon.baseChance}%</td>
													<td class="p-2">
														<div class="flex items-center justify-center space-x-2">
															<button
																on:click={() => adjustSkill(training.weapon, 'attack', -5)}
																disabled={training.attackTraining <= 0}
																class="rounded bg-gray-200 px-2 py-1 text-sm hover:bg-gray-300 disabled:bg-gray-100 disabled:text-gray-400"
															>
																-
															</button>
															<span class="w-12 text-center">+{training.attackTraining}%</span>
															<button
																on:click={() => adjustSkill(training.weapon, 'attack', 5)}
																disabled={training.attackTraining >= 70}
																class="rounded bg-gray-200 px-2 py-1 text-sm hover:bg-gray-300 disabled:bg-gray-100 disabled:text-gray-400"
															>
																+
															</button>
														</div>
													</td>
													<td class="p-2 text-center font-medium">
														{calculateEffectiveSkill(weapon.baseChance, training.attackTraining)}%
													</td>
													<td class="p-2 text-center text-sm">
														{calculateTrainingCost(weapon, training.attackTraining)}L
													</td>
													<td class="p-2">
														<div class="flex items-center justify-center space-x-2">
															<button
																on:click={() => adjustSkill(training.weapon, 'parry', -5)}
																disabled={training.parryTraining <= 0}
																class="rounded bg-gray-200 px-2 py-1 text-sm hover:bg-gray-300 disabled:bg-gray-100 disabled:text-gray-400"
															>
																-
															</button>
															<span class="w-12 text-center">+{training.parryTraining}%</span>
															<button
																on:click={() => adjustSkill(training.weapon, 'parry', 5)}
																disabled={training.parryTraining >= 70}
																class="rounded bg-gray-200 px-2 py-1 text-sm hover:bg-gray-300 disabled:bg-gray-100 disabled:text-gray-400"
															>
																+
															</button>
														</div>
													</td>
													<td class="p-2 text-center font-medium">
														{calculateEffectiveSkill(weapon.baseChance, training.parryTraining)}%
													</td>
													<td class="p-2 text-center text-sm">
														{calculateTrainingCost(weapon, training.parryTraining)}L
													</td>
												</tr>
											{/if}
										{/each}
									</tbody>
								</table>
							</div>
						</div>
					{/each}
				</div>
			{/if}
		</div>
	</div>
</div>
