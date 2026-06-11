export default function SearchBar() {
	return (
		<div className="nav-search">
			<select>
				<option>All</option>
				<option>Electronics</option>
			</select>
			<input placeholder="Search products, brands and more..." />
			<button>Search</button>
		</div>
	)
}