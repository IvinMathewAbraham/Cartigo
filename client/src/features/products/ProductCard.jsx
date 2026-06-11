import { formatPrice, getDiscount, renderStars } from './productUtils'


export default function ProductCard({ product, onAddToCart }) {
	const discount = getDiscount(product.was, product.price)

	return (
		<div className="prod-card">
			{discount >= 30 && <div className="badge-corner">-{discount}%</div>}
			<div className="prod-img">
				<img
					src={product.image}
					alt={product.name}
					className="product-image"
				/>
			</div>
			<div className="prod-body">
				<div className="prod-brand">{product.brand}</div>
				<div className="prod-name">{product.name}</div>
				<div><span className="stars">{renderStars(product.rating)}</span><span className="rev-count">({product.reviews.toLocaleString()})</span></div>
				<div className="prod-price">{formatPrice(product.price)}</div>
				<div className="prod-was">M.R.P: <s>{formatPrice(product.was)}</s> <span className="prod-save">({discount}% off)</span></div>
				<div className="prime-badge"> FREE Delivery by Tomorrow</div>
				<button className="add-cart-btn" onClick={()=>onAddToCart(product.id)}>Add to Cart</button>
			</div>
		</div>
	)
}