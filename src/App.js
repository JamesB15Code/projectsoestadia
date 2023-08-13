import { BrowserRouter , Routes,Route } from "react-router-dom";

//importamos los componentes creados
import { AuthContextProvider } from './Auth/AuthProvider';
import Home from "./Views/inicio";
import login from "./Views/login";
import registro from "./Views/resgistro";
import prueba from "./Views/prueba";
import crudProducts from "./Views/crudProducts";
import crudUsers from "./Views/crudUsers";
import crudEmpresa from "./Views/crudEmpresa";
import crudSlider from "./Views/crudSlider";
import crudLogos from "./Views/crudLogos"
import recuperarPass from "./Views/recuperacionPass";

import admin from "./Views/admin"
import perfilUser from "./Views/perfilUser"
import perfilAdmin from "./Views/perfilAdmin"

import ordenesCompra from "./Views/ordenesCompra";
import ordenesCompraAdmin from "./Views/ordenesCompraAdmin";
import showphones from "./Views/showphones";
import showtablets from "./Views/showTablets"
import showAcesorios from "./Views/showAccesorios"
import showAudio from "./Views/showAudio"

function App() {
  return (
    
      <AuthContextProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path='/login' Component={login}/>
            <Route path='/registro' Component={registro}/>
            <Route path='/showphones' Component={showphones}/>
            <Route path='/showtablets' Component={showtablets}/>
            <Route path='/showAcesorios' Component={showAcesorios}/>
            <Route path='/showAudio' Component={showAudio}/>

            <Route path='/crudProducts' Component={crudProducts}/>
            <Route path='/crudUsers' Component={crudUsers}/>
            <Route path='/crudEmpresa' Component={crudEmpresa}/>
            <Route path='/crudLogos' Component={crudLogos}/>
            <Route path='/crudSlider' Component={crudSlider}/>

            <Route path='/admin' Component={admin}/>
            <Route path='/perfilUser' Component={perfilUser}/>
            <Route path='/perfilAdmin' Component={perfilAdmin}/>
            <Route path='/recuperarPass' Component={recuperarPass}/>

            <Route path='/ordenesCompra' Component={ordenesCompra}/>
            <Route path='/ordenesCompraAdmin' Component={ordenesCompraAdmin}/>
            
            <Route path='/prueba' Component={prueba}/>
          </Routes>
        </BrowserRouter>
      </AuthContextProvider>
   
  );
}

export default App;
