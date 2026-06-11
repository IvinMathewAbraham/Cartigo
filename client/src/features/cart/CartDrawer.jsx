import CartItem from './CartItem'
import CartSummary from './CartSummary'

export default function CartDrawer({ open, count, items, total, onClose, onIncrement, onDecrement, onRemove }) {
	return (
		<div className={`cart-sidebar ${open ? 'open' : ''}`} id="cartSidebar">
			<div className="cart-header">
				<h3> Shopping Cart ({count} items)</h3>
				<button className="cart-close" onClick={onClose}>✕</button>
			</div>
			<div className="cart-items" id="cartItemsList">
				{items.length === 0 && <div style={{textAlign:'center',padding:40,color:'#999',fontSize:14}}>Your cart is empty </div>}
				{items.map(item => (
					<CartItem
						key={item.id}
						item={item}
						onIncrement={onIncrement}
						onDecrement={onDecrement}
						onRemove={onRemove}
					/>
				))}
			</div>
			<CartSummary count={count} total={total} />
		</div>
	)
}