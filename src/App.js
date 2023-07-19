
import { BrowserRouter , Routes,Route } from "react-router-dom";
import "./App.css";

//importamos los componentes creados
import { AuthContextProvider } from './Auth/AuthProvider';
import Home from "./Views/inicio";
import login from "./Views/login";
import registro from "./Views/resgistro";
import smart from "./Views/smart";
import showphones from "./Views/showphones";
import prueba from "./Views/prueba";
import crudPhones from "./Views/crudPhones";
import crudUsers from "./Views/crudUsers";
import CrudFooter from "./Views/crudFooter";
import crudLogos from "./Views/crudLogos"
import pruebas from "./Views/pruebas"
import admin from "./Views/admin"


function App() {
  return (
    
      <AuthContextProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path='/login' Component={login}></Route>
            <Route path='/registro' Component={registro}></Route>
            <Route path='/smartphone' Component={smart}></Route>
            <Route path='/showphones' Component={showphones}></Route>
            <Route path='/crudPhones' Component={crudPhones}></Route>
            <Route path='/crudUsers' Component={crudUsers}></Route>
            <Route path='/crudFooter' Component={CrudFooter}></Route>
            <Route path='/crudLogos' Component={crudLogos}></Route>

            <Route path='/admin' Component={admin}></Route>

            <Route path='/pruebas' Component={pruebas}></Route>
            <Route path='/prueba' Component={prueba}></Route>
          </Routes>
        </BrowserRouter>
      </AuthContextProvider>
   
  );
}

export default App;
