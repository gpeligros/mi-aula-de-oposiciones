import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Layout } from "@/components/Layout";
import Home from "@/pages/Home";
import Oposiciones from "@/pages/Oposiciones";
import OposicionDetalle from "@/pages/OposicionDetalle";
import Metodo from "@/pages/Metodo";
import Recursos from "@/pages/Recursos";
import Planes from "@/pages/Planes";
import Entrar from "@/pages/Entrar";
import NotFound from "@/pages/NotFound";
import { AvisoLegal, Cookies, Privacidad } from "@/pages/Legal";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/oposiciones" element={<Oposiciones />} />
          <Route path="/oposiciones/:slug" element={<OposicionDetalle />} />
          <Route path="/metodo" element={<Metodo />} />
          <Route path="/recursos" element={<Recursos />} />
          <Route path="/planes" element={<Planes />} />
          <Route path="/entrar" element={<Entrar />} />
          <Route path="/aviso-legal" element={<AvisoLegal />} />
          <Route path="/privacidad" element={<Privacidad />} />
          <Route path="/cookies" element={<Cookies />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
