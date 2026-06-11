import React, { useEffect, useState } from 'react'
import './App.css'
import Navbar from './components/layout/Navbar.jsx'
import PageTabs from './components/layout/PageTabs.jsx'
import SubNav from './components/layout/SubNav.jsx'
import CartDrawer from './features/cart/CartDrawer.jsx'
import FilterSidebar from './features/categories/FilterSidebar.jsx'
import ProductGrid from './features/products/ProductGrid.jsx'
import LandingPage from './pages/Landing/Landingpage.jsx'
import AdminPage from './pages/Admin/AdminPage.jsx'
import ShopPage from './pages/Shop/ShopPage.jsx'

// Sample product data with images
import sonyHeadphones from './assets/sony-headphones.jpg'
import redmiPhone from './assets/redmi-phone.jpg'
import lenovoLaptop from './assets/lenovo-laptop.jpg'
import boatWatch from './assets/boat-watch.jpg'
import canonCamera from './assets/canon-camera.jpg'
import samsungTv from './assets/samsung-tv.jpg'
import nikeShoes from './assets/nike-shoes.jpg'
import appleAirpods from './assets/apple-airpods.jpg'

const initialProducts = [
	{ id:1, name:'Sony WH-1000XM5 Wireless Headphones', brand:'Sony', image:sonyHeadphones, price:1499, was:2799, rating:4.7, reviews:8420, category:'Electronics', stock:28 },
	{ id:2, name:'Redmi Note 13 Pro 5G — 8GB/256GB', brand:'Xiaomi', image:redmiPhone, price:12999, was:17499, rating:4.5, reviews:32100, category:'Electronics', stock:85 },
	{ id:3, name:'Lenovo IdeaPad 5 Slim Laptop Core i5', brand:'Lenovo', image:lenovoLaptop, price:42999, was:61499, rating:4.4, reviews:5640, category:'Electronics', stock:12 },
	{ id:4, name:'boAt Wave Prime Smartwatch IP68', brand:'boAt', image:boatWatch, price:3299, was:5299, rating:4.3, reviews:14800, category:'Electronics', stock:140 },
	{ id:5, name:'Canon EOS M50 Mark II Mirrorless Camera', brand:'Canon', image:canonCamera, price:28500, was:38000, rating:4.6, reviews:3200, category:'Electronics', stock:7 },
	{ id:6, name:'Samsung 32" Full HD Smart LED TV', brand:'Samsung', image:samsungTv, price:14499, was:19999, rating:4.4, reviews:9870, category:'Electronics', stock:33 },
	{ id:7, name:'Nike Air Max 270 Running Shoes', brand:'Nike', image:nikeShoes, price:4999, was:7999, rating:4.5, reviews:22300, category:'Fashion', stock:56 },
	{ id:8, name:'Apple AirPods Pro (2nd Gen)', brand:'Apple', image:appleAirpods, price:19999, was:26900, rating:4.8, reviews:61200, category:'Electronics', stock:44 },
]



export default function App(){
	const [products] = useState(initialProducts)
	const [cart, setCart] = useState([{ ...initialProducts[0], qty:1 }, { ...initialProducts[1], qty:2 }])
	const [cartOpen, setCartOpen] = useState(false)
	const [view, setView] = useState('landing')
	const [adminSection, setAdminSection] = useState('dashboard')
	const [toast, setToast] = useState('')

	useEffect(()=>{ if(toast){ const t = setTimeout(()=>setToast(''),2500); return ()=>clearTimeout(t) } },[toast])

	function addToCart(id){
		setCart(prev=>{
			const ex = prev.find(x=>x.id===id)
			if(ex) return prev.map(p=>p.id===id?{...p, qty:p.qty+1}:p)
			const p = products.find(x=>x.id===id)
			return [...prev, {...p, qty:1}]
		})
		setToast('Added to cart')
	}
	function removeFromCart(id){ setCart(prev=>prev.filter(x=>x.id!==id)) }
	function changeQty(id, delta){ setCart(prev=>prev.flatMap(it=>{ if(it.id!==id) return it; const qty = it.qty+delta; if(qty<=0) return []; return {...it, qty} })) }

	const total = cart.reduce((s,x)=>s + x.price * x.qty,0)
	const count = cart.reduce((s,x)=>s + x.qty,0)

	return (
		<div>
			<Navbar cartCount={count} onCartToggle={()=>setCartOpen(s=>!s)} />
			<SubNav />
			<PageTabs activeView={view} onChange={setView} />

			<LandingPage view={view} setView={setView} products={products} addToCart={addToCart} />

			<ShopPage view={view} setView={setView} products={products} addToCart={addToCart} />

			<AdminPage view={view} setView={setView} adminSection={adminSection} setAdminSection={setAdminSection} />

			<CartDrawer
				open={cartOpen}
				count={count}
				items={cart}
				total={total}
				onClose={()=>setCartOpen(false)}
				onIncrement={(id)=>changeQty(id,1)}
				onDecrement={(id)=>changeQty(id,-1)}
				onRemove={removeFromCart}
			/>

			<div className={`toast ${toast? 'show':''}`} id="toast">{toast}</div>
		</div>
	)
}
