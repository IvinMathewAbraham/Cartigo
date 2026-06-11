import ProductCard from './ProductCard'

export default function ProductGrid({ id, products, onAddToCart }) {
	return (
		<div className="prod-grid" id={id}>
			{products.map(product => (
				<ProductCard key={product.id} product={product} onAddToCart={onAddToCart} />
			))}
		</div>
	)
}