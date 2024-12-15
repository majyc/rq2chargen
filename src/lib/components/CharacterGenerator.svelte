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
		attackSkill: number;
		parrySkill: number;
	}

	interface WeaponType {
		category: string;
		name: string;
		basic: number; // Basic training cost
		costs: {
			low: number; // 05-25%
			medium: number; // 30-50%
			high: number; // 55-75%
		};
	}

	const weaponTypes: WeaponType[] = [
		// Cutting Weapons, One Handed
		{
			category: 'Cutting Weapon, One Handed',
			name: 'Axe',
			basic: 20,
			costs: { low: 300, medium: 500, high: 1000 }
		},
		{
			category: 'Cutting Weapon, One Handed',
			name: 'Sword',
			basic: 10,
			costs: { low: 300, medium: 500, high: 1000 }
		},

		// Cutting Weapons, Two Handed
		{
			category: 'Cutting Weapon, Two Handed',
			name: 'Axe',
			basic: 15,
			costs: { low: 300, medium: 600, high: 1200 }
		},
		{
			category: 'Cutting Weapon, Two Handed',
			name: 'Sword',
			basic: 5,
			costs: { low: 500, medium: 1000, high: 2000 }
		},

		// Cut and Thrust Weapons
		{
			category: 'Cut and Thrust Weapons, One Handed',
			name: 'Rapier',
			basic: 5,
			costs: { low: 500, medium: 1000, high: 2000 }
		},
		{
			category: 'Cut and Thrust Weapons, One Handed',
			name: 'Shortsword',
			basic: 15,
			costs: { low: 200, medium: 400, high: 800 }
		},
		{
			category: 'Cut and Thrust Weapons, One Handed',
			name: 'Sickle',
			basic: 15,
			costs: { low: 200, medium: 400, high: 800 }
		},

		// Hand to Hand Weapons
		{
			category: 'Hand to Hand Weapons',
			name: 'Butt',
			basic: 25,
			costs: { low: 100, medium: 300, high: 600 }
		},
		{
			category: 'Hand to Hand Weapons',
			name: 'Dagger',
			basic: 25,
			costs: { low: 200, medium: 400, high: 800 }
		},
		{
			category: 'Hand to Hand Weapons',
			name: 'Fist',
			basic: 25,
			costs: { low: 200, medium: 400, high: 800 }
		},
		{
			category: 'Hand to Hand Weapons',
			name: 'Grapple',
			basic: 25,
			costs: { low: 500, medium: 800, high: 1200 }
		},
		{
			category: 'Hand to Hand Weapons',
			name: 'Kick',
			basic: 25,
			costs: { low: 200, medium: 400, high: 1000 }
		},

		// Smashing Weapons
		{
			category: 'Smashing Weapons, One Handed',
			name: 'Hammer',
			basic: 15,
			costs: { low: 300, medium: 600, high: 1000 }
		},
		{
			category: 'Smashing Weapons, One Handed',
			name: 'Mace',
			basic: 25,
			costs: { low: 200, medium: 400, high: 800 }
		},
		{
			category: 'Smashing Weapons, Two Handed',
			name: 'Hammer',
			basic: 15,
			costs: { low: 300, medium: 600, high: 1200 }
		},
		{
			category: 'Smashing Weapons, Two Handed',
			name: 'Maul',
			basic: 20,
			costs: { low: 200, medium: 600, high: 1500 }
		},

		// Flexible Weapons
		{
			category: 'Smashing Weapons, Flexible One Handed',
			name: 'Flail',
			basic: 15,
			costs: { low: 400, medium: 800, high: 1200 }
		},
		{
			category: 'Smashing Weapons, Flexible One Handed',
			name: 'Morning Star',
			basic: 5,
			costs: { low: 400, medium: 800, high: 1600 }
		},

		// Thrusting Weapons
		{
			category: 'Thrusting Weapons, One Handed',
			name: 'Spear',
			basic: 10,
			costs: { low: 200, medium: 400, high: 1000 }
		},
		{
			category: 'Thrusting Weapons, One Handed',
			name: 'Pike',
			basic: 10,
			costs: { low: 400, medium: 800, high: 1600 }
		},
		{
			category: 'Thrusting Weapons, Two Handed',
			name: 'Spear',
			basic: 20,
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

	let availableMoney = 0;
	let guildCredit = 0;
	let guildDebt = 0;
	let trainingPurchases: TrainingPurchase[] = [];
	let showTrainingPanel = false;

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
	let currentTraining: WeaponTraining[] = weaponTypes.map((w: WeaponType) => ({
		weapon: w.name,
		attackSkill: 5, // Starting skill level
		parrySkill: 5 // Starting skill level
	}));

	function getCurrentTraining(weaponName: string): WeaponTraining {
		return (
			currentTraining.find((t) => t.weapon === weaponName) || {
				weapon: weaponName,
				attackSkill: 5,
				parrySkill: 5
			}
		);
	}

	function purchaseTraining(weapon: string, skillType: 'attack' | 'parry', weaponType: WeaponType) {
		const training = getCurrentTraining(weapon);
		const currentSkill = skillType === 'attack' ? training.attackSkill : training.parrySkill;

		if (currentSkill >= 75) {
			alert('Cannot train beyond 75% through guilds');
			return;
		}

		const cost = calculateTrainingCost(weaponType, currentSkill);

		if (cost > availableMoney + guildCredit - guildDebt) {
			alert('Not enough money or credit available');
			return;
		}

		// If using credit, add to debt
		if (cost > availableMoney) {
			const creditNeeded = cost - availableMoney;
			guildDebt += creditNeeded;
			availableMoney = 0;
		} else {
			availableMoney -= cost;
		}

		// Record the purchase
		trainingPurchases = [
			...trainingPurchases,
			{
				weapon,
				skillType,
				percentagePoints: 5,
				cost
			}
		];

		// Update the training levels
		currentTraining = currentTraining.map((t) => {
			if (t.weapon === weapon) {
				if (skillType === 'attack') {
					t.attackSkill += 5;
				} else {
					t.parrySkill += 5;
				}
			}
			return t;
		});
	}

	function undoLastPurchase() {
		const lastPurchase = trainingPurchases[trainingPurchases.length - 1];
		if (!lastPurchase) return;

		// Refund money or reduce debt
		if (guildDebt > 0) {
			guildDebt -= Math.min(guildDebt, lastPurchase.cost);
		} else {
			availableMoney += lastPurchase.cost;
		}

		// Update training levels
		currentTraining = currentTraining.map((t) => {
			if (t.weapon === lastPurchase.weapon) {
				if (lastPurchase.skillType === 'attack') {
					t.attackSkill -= 5;
				} else {
					t.parrySkill -= 5;
				}
			}
			return t;
		});

		trainingPurchases = trainingPurchases.slice(0, -1);
	}
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

					<div class="space-y-6">
						{#each Array.from(new Set(weaponTypes.map((w) => w.category))) as category}
							<div class="rounded-lg border p-4">
								<h4 class="mb-3 font-semibold">{category}</h4>
								<div class="grid gap-4 sm:grid-cols-2">
									{#each weaponTypes.filter((w) => w.category === category) as weapon}
										<div class="rounded-lg border p-3">
											<h5 class="mb-2 font-medium">{weapon.name}</h5>
											<div class="space-y-2">
												<div class="text-sm">Basic Cost: {weapon.basic}L</div>
												<div class="grid grid-cols-2 gap-2">
													<button
														on:click={() => purchaseTraining(weapon.name, 'attack', weapon)}
														class="rounded bg-blue-500 px-2 py-1 text-sm text-white hover:bg-blue-600"
													>
														Train Attack (+5%)
													</button>
													<button
														on:click={() => purchaseTraining(weapon.name, 'parry', weapon)}
														class="rounded bg-blue-500 px-2 py-1 text-sm text-white hover:bg-blue-600"
													>
														Train Parry (+5%)
													</button>
												</div>
											</div>
										</div>
									{/each}
								</div>
							</div>
						{/each}
					</div>
					{#if trainingPurchases.length > 0}
						<div class="mt-4">
							<h4 class="mb-2 font-semibold">Training Purchases:</h4>
							<ul class="space-y-1 text-sm">
								{#each trainingPurchases as purchase}
									<li>
										{purchase.weapon} - {purchase.skillType} +5% ({purchase.cost}L)
									</li>
								{/each}
							</ul>
							<button
								on:click={undoLastPurchase}
								class="mt-2 rounded bg-red-500 px-2 py-1 text-sm text-white"
							>
								Undo Last Purchase
							</button>
						</div>
					{/if}
				</div>
			{/if}
		</div>
	</div>
</div>
