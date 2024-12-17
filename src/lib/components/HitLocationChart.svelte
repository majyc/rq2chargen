<script>
	export let hitPoints = 10;
	export let baseArmor = 0;
</script>

<div class="relative h-[600px] w-[300px] rounded-lg border bg-white p-4">
	<!-- Background figure -->
	<img
		src="/malehuman.png"
		alt="Human outline"
		class="absolute left-1/2 top-0 h-[580px] w-[280px] -translate-x-1/2 object-cover opacity-80"
	/>

	<!-- Location labels -->
	<div class="relative h-full w-full">
		<!-- Head -->
		<div class="absolute left-[45%] top-[5%] -translate-x-1/2 text-center">
			<div class="rounded-md bg-white/90 p-1 text-xs shadow-sm">
				<div class="font-bold">Head (19-20)</div>
				<div>AP: {baseArmor} | HP: {Math.floor(hitPoints * 0.35)}</div>
			</div>
		</div>

		<!-- Chest -->
		<div class="absolute left-[45%] top-[25%] -translate-x-1/2 text-center">
			<div class="rounded-md bg-white/90 p-1 text-xs shadow-sm">
				<div class="font-bold">Chest (12)</div>
				<div>AP: {baseArmor} | HP: {Math.floor(hitPoints * 0.4)}</div>
			</div>
		</div>

		<!-- Abdomen -->
		<div class="absolute left-1/2 top-[40%] -translate-x-1/2 text-center">
			<div class="rounded-md bg-white/90 p-1 text-xs shadow-sm">
				<div class="font-bold">Abdomen (09-11)</div>
				<div>AP: {baseArmor} | HP: {Math.floor(hitPoints * 0.35)}</div>
			</div>
		</div>

		<!-- Left Arm -->
		<div class="absolute left-[2%] top-[30%] text-center">
			<div class="rounded-md bg-white/90 p-1 text-xs shadow-sm">
				<div class="font-bold">L.Arm (16-18)</div>
				<div>AP: {baseArmor}</div>
				<div>HP: {Math.floor(hitPoints * 0.3)}</div>
			</div>
		</div>

		<!-- Right Arm -->
		<div class="absolute right-[2%] top-[30%] text-center">
			<div class="rounded-md bg-white/90 p-1 text-xs shadow-sm">
				<div class="font-bold">R.Arm (13-15)</div>
				<div>AP: {baseArmor}</div>
				<div>HP: {Math.floor(hitPoints * 0.3)}</div>
			</div>
		</div>

		<!-- Left Leg -->
		<div class="absolute left-[12%] top-[70%] text-center">
			<div class="rounded-md bg-white/90 p-1 text-xs shadow-sm">
				<div class="font-bold">L.Leg (05-08)</div>
				<div>AP: {baseArmor}</div>
				<div>HP: {Math.floor(hitPoints * 0.35)}</div>
			</div>
		</div>

		<!-- Right Leg -->
		<div class="absolute right-[12%] top-[70%] text-center">
			<div class="rounded-md bg-white/90 p-1 text-xs shadow-sm">
				<div class="font-bold">R.Leg (01-04)</div>
				<div>AP: {baseArmor}</div>
				<div>HP: {Math.floor(hitPoints * 0.35)}</div>
			</div>
		</div>
	</div>

	<!-- Title -->
	<h3 class="absolute -top-6 left-0 text-sm font-bold">Hit Locations</h3>
</div>

