export const formatTag = (tag: string) => tag.startsWith('#') ? tag.slice(1) : tag

const normalizeLabel = (value: string) =>
	value
		.normalize('NFD')
		.replace(/[\u0300-\u036f]/g, '')
		.trim()
		.toLowerCase()

export const formatRarityLabel = (rarity: string) => {
	const normalized = normalizeLabel(rarity)

	if (normalized.includes('champion') || normalized.includes('campeao')) return 'Campeão'
	if (normalized.includes('legend')) return 'Lendária'
	if (normalized.includes('epic') || normalized.includes('epica')) return 'Épica'
	if (normalized.includes('rare') || normalized.includes('rara')) return 'Rara'
	if (normalized.includes('common') || normalized.includes('comum')) return 'Comum'

	if (!rarity) {
		return rarity
	}

	return rarity.charAt(0).toUpperCase() + rarity.slice(1).toLowerCase()
}