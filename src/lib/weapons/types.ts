export interface WeaponType {
	category: string;
	name: string;
	basic: number;
	baseChance: number;
	costs: {
		low: number;
		medium: number;
		high: number;
	};
	strikeRank?: number;
	damage?: string;
	encumbrance?: number;
}

export interface WeaponDisplay {
	id: string;
	equipped: boolean;
	name: string;
	effectiveSkill: number;
	effectiveParry: number;
	strikeRank: number;
	damage: string;
	encumbrance: number;
	visible: boolean;
}
