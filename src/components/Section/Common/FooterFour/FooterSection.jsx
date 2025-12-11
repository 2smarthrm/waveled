"use client";

import Link from "next/link";
import { useEffect, useState } from "react";


const isBrowser = typeof window !== "undefined";
const protocol = isBrowser && window.location.protocol === "https:" ? "https" : "http";
const API_BASE = protocol === "https"  ?  'https://waveledserver.vercel.app' : "http://localhost:4000";
 
const toArray = (raw) =>
  Array.isArray(raw)
    ? raw
    : Array.isArray(raw?.data)
    ? raw.data
    : Array.isArray(raw?.items)
    ? raw.items
    : [];

async function fetchJson(url) {
  const res = await fetch(url, { cache: "no-store" });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
}

export default function FooterFore() {
  const [cats, setCats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  useEffect(() => {
    let abort = false;

    (async () => {
      setLoading(true);
      setErr("");
      try { 
        const raw = await fetchJson(`${API_BASE}/api/products`);
        if (abort) return;
        const products = toArray(raw);

        const map = new Map(); 
        for (const p of products) {
          const cat = p?.wl_category;
          if (!cat) continue;
          const id = cat?._id || cat?.wl_slug || String(cat?.wl_name || "other");
          if (!map.has(id)) {
            map.set(id, {
              id,
              name: cat?.wl_name || "Outros",
              slug: cat?.wl_slug || id,
              count: 1,
            });
          } else {
            map.get(id).count++;
          }
        }
 
        const list = Array.from(map.values())
          .sort((a, b) => a.name.localeCompare(b.name, "pt"))
          .slice(0, 8);

        if (!abort) setCats(list);
      } catch (e) {
        if (!abort) setErr(e?.message || "Erro ao carregar categorias.");
      } finally {
        if (!abort) setLoading(false);
      }
    })();

    return () => {
      abort = true;
    };
  }, []);

  return (
    <>
      <footer className="tekup-footer-section dark-bg">
        <div className="container">
          <div className="tekup-footer-top tekup-section-padding">
            <div className="row"> 
              <div className="col-xl-3 col-lg-12">
                <div className="tekup-footer-textarea light-color">
                  <Link href="/">
                      <img src={"https://ik.imagekit.io/fsobpyaa5i/Waveled_logo-03%20(1).png"}
                      alt="" style={{maxHeight:"65px"}} />
                  </Link>
                  <p>
                    Waveled é uma empresa inovadora especializada em soluções
                    display led, unindo eficiência, qualidade e
                    design moderno.
                  </p>
                  <div className="tekup-social-icon-box style-two">
                    <ul>
                      <li>
                        <Link  className="social-link" href="#">
                          <i className="ri-facebook-fill" />
                        </Link>
                      </li>
                      <li>
                        <Link  className="social-link" href="#">
                          <i className="ri-linkedin-fill" />
                        </Link>
                      </li>
                    </ul>
                  </div>
                </div>
              </div> 
              <div className="col-xl-2 offset-xl-1 col-md-3">
                <div className="tekup-footer-menu light-color">
                  <div className="tekup-footer-title light-color">
                    <h5>Empresa</h5>
                  </div>
                  <ul>
                    <li>
                      <Link href="about-us">Sobre Nós</Link>
                    </li>
                    <li>
                      <Link href="/service">Serviços</Link>
                    </li>
                    <li>
                      <Link href="contact-us">Contatos</Link>
                    </li>
                  </ul>
                </div>
              </div>

              {/* --------- Produtos (dinâmico) ---------- */}
              <div className="col-xl-3 col-md-4">
                <div className="tekup-footer-menu light-color extar-margin">
                  <div className="tekup-footer-title light-color">
                    <h5>Produtos</h5>
                  </div> 
                  {loading ? (
                    <ul>
                      <li><span className="text-light">A carregar…</span></li>
                    </ul>
                  ) : err ? (
                    <ul>
                      <li><span className="text-danger">{err}</span></li> 
                      <li><Link href="/shop">Todos os produtos</Link></li>
                    </ul>
                  ) : cats.length === 0 ? (
                    <ul>
                      <li><span className="text-light">Sem categorias.</span></li>
                    </ul>
                  ) : (
                    <ul>
                      {cats.map((c) => (
                        <li key={c.id}>
                          <Link href={`/shop?category=${(c.slug)}`}>
                            {c.name}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>

              <div className="col-xl-3 col-md-4">
                <div className="tekup-footer-menu light-color extar-margin">
                  <div className="tekup-footer-title light-color">
                    <h5>Contactos</h5>
                  </div>
                  <ul>
                    <li>
                      <div className="icon"> </div>
                      <span className="text-light text-white">
                        Rua Fernando Farinha nº 2A e 2B Braço de Prata 
                        1950-448 Lisboa
                      </span>
                    </li>
                    <li>
                      <div className="icon"> </div>
                      <span className="text-light text-white">
                        Email : <a href="mailto:sales@waveled.com">sales@waveled.com</a>
                      </span>
                    </li>
                    <li>
                      <div className="icon"> </div>
                      <span className="text-light text-white">
                        Tel : +351 210 353 555
                      </span>
                      <br /> 
                      <span style={{ marginLeft: "40px" }} className="text-light">
                        +351 212 456 082
                      </span>
                      <br />
                      <small style={{ fontSize: "14px" }} className="text-primary">
                        Chamada para a Rede Fixa Nacional
                      </small>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
          <div className="tekup-footer-bottom">
            <div className="row">
              <div className="col-md-6">
                <div className="tekup-copywright light-color right">
                  <p>©{new Date().getFullYear()} waveled. All rights reserved.</p>
                </div>
              </div>
              <div className="col-md-6">
                <div className="tekup-footer-menu light-color style-two right mb-0">
                  <ul>
                    <li>
                      <Link href="/privacy_and_policy">Políticas de Privacidade</Link>
                    </li>
                    <li>
                      <Link href="/terms_and_conditions">Termos &amp; Condições</Link>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div> 
        </div>
      </footer>
    </>
  );
}
