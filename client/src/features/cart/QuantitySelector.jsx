export default function QuantitySelector({ quantity, onIncrement, onDecrement }) {
	return (
		<div className="qty-controls">
			<button className="qty-btn" onClick={onDecrement}>−</button>
			<span className="qty-num">{quantity}</span>
			<button className="qty-btn" onClick={onIncrement}>+</button>
		</div>
	)
}