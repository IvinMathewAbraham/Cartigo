export default function FilterSidebar() {
	return (
		<div className="shop-sidebar">
			<div className="sidebar-section">
				<div className="sidebar-title">Department</div>
				<div className="filter-option"><input type="radio" name="dept" defaultChecked /> All Departments</div>
				<div className="filter-option"><input type="radio" name="dept" /> Electronics</div>
			</div>
		</div>
	)
}