
import SearchBar from '../../features/search/SearchBar';

export default function Navbar({ cartCount, onCartToggle }) {
	return (
		<div className="topnav">
			<div className="logo">
				Cartigo
			</div>

			<SearchBar />

			<div className="nav-right">
				<div className="nav-link">
					<span>Hello, Ivin</span>
					
				</div>

				<div className="nav-link">
					<span>Returns</span>
					<strong>& Orders</strong>
				</div>

				<div className="cart-btn" onClick={onCartToggle}>
					 Cart
					<span className="cart-count" id="cartCount">
						{cartCount}
					</span>
				</div>
			</div>
		</div>
	);
}