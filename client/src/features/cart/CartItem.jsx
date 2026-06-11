import QuantitySelector from './QuantitySelector'
import { formatPrice } from '../products/productUtils'

export default function CartItem({ item, onIncrement, onDecrement, onRemove }) {
	return (
		<div className="cart-item">
			<div className="cart-item-img">
				<img
					src={item.image}
					alt={item.name}
					className="cart-item-image"
				/>
			</div>
			<div className="cart-item-info">
				<div className="cart-item-name">{item.name}</div>
				<div className="cart-item-price">{formatPrice(item.price * item.qty)}</div>
				<div className="qty-controls">
					<QuantitySelector
						quantity={item.qty}
						onIncrement={()=>onIncrement(item.id)}
						onDecrement={()=>onDecrement(item.id)}
					/>
					<span style={{fontSize:11,color:'#999',marginLeft:6,cursor:'pointer'}} onClick={()=>onRemove(item.id)}>Remove</span>
				</div>
			</div>
		</div>
	)
}