import { formatPrice } from '../products/productUtils'

export default function CartSummary({ count, total }) {
	return (
		<div className="cart-footer">
			<div style={{fontSize:12,color:'#666',marginBottom:8}}> Your order qualifies for FREE delivery</div>
			<div className="cart-subtotal"><span>Subtotal ({count} items):</span><span id="cartTotal">{formatPrice(total)}</span></div>
			<button className="checkout-btn">Proceed to Checkout →</button>
		</div>
	)
}