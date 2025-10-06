import React from "react";
import './App.css';
import {BrowserRouter,Routes,Route,Link} from 'react-router-dom'
import InformationCenter from "./Tracker.js";
import HomeNav from "./Home..js";
function HomeLink(){ return (<HomeNav/>)}

function Tracker(){ return (<InformationCenter/>);}

function Financial(){ return <h1>Financial Page</h1>;}

function About(){ return <h1>About Page</h1>;}


export default function NavigationBar(){
return (
<BrowserRouter>
<nav className="navbar">
 <Link to='/' className="nav-link">Home</Link>{" "}
 <Link to='/tracker'className="nav-link">Tracker</Link>{" "}
 <Link to='/financial'className="nav-link">Financial</Link>{" "}
 <Link to='/about'className="nav-link">About</Link>{" "}
</nav>

<Routes>
<Route path="/" element={<HomeLink/>} />
<Route path="/about" element={<About />} />
<Route path="/tracker" element={<Tracker />} /> 
<Route path="/financial" element={<Financial />} /> 
</Routes>

</BrowserRouter>
)

}