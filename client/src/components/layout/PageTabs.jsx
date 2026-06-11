export default function PageTabs({ activeView, onChange }) {
	return (
		<div className="page-tabs">
			<div className={`tab ${activeView==='landing'?'active':''}`} onClick={()=>onChange('landing')}> Home</div>
			<div className={`tab ${activeView==='shop'?'active':''}`} onClick={()=>onChange('shop')}> Customer Shop</div>
			<div className={`tab ${activeView==='admin'?'active':''}`} onClick={()=>onChange('admin')}> Admin Dashboard</div>
		</div>
	)
}