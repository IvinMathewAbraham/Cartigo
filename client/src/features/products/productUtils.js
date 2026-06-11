export function formatPrice(value) {
	return '₹' + value.toLocaleString('en-IN')
}

export function getDiscount(wasPrice, currentPrice) {
	return Math.round(((wasPrice - currentPrice) / wasPrice) * 100)
}

export function renderStars(rating) {
	let stars = ''
	for (let i = 1; i <= 5; i += 1) {
		stars += i <= Math.floor(rating) ? '★' : '☆'
	}
	return stars
}