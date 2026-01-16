"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

const isBrowser = typeof window !== "undefined";
const protocol =
  isBrowser && window.location.protocol === "https:" ? "https" : "http";
const API_BASE =
  protocol === "https"
    ? "https://waveledserver.vercel.app"
    : "http://localhost:4000";

const LOGO_URL =
  "https://ik.imagekit.io/fsobpyaa5i/Waveled_logo-02%20(1)%20(4).png";

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

export default function FooterFore(props) {
  const [areasList, setAreasList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");
  const [email, setEmail] = useState("");
  const [nlState, setNlState] = useState({ status: "idle", msg: "" });

  useEffect(() => {
    let abort = false;

    (async () => {
      setLoading(true);
      setErr("");
      try {
        const raw = await fetchJson(`${API_BASE}/api/cms/application-areas`);
        if (abort) return;

        const items = toArray(raw);
        const list = (items || [])
          .map((a) => {
            const id = a?._id || a?.wl_slug || String(a?.wl_name || "");
            const name =
              a?.wl_solution_title || a?.wl_title || a?.wl_name || "Área";
            return { id, name, slug: a?.wl_slug || id };
          })
          .filter((x) => x.id && x.name)
          .sort((a, b) => a.name.localeCompare(b.name, "pt"))
          .slice(0, 5); // max 5

        if (!abort) setAreasList(list);
      } catch (e) {
        if (!abort)
          setErr(e?.message || "Erro ao carregar áreas de aplicação.");
      } finally {
        if (!abort) setLoading(false);
      }
    })();

    return () => {
      abort = true;
    };
  }, []);

  const footerStyle = useMemo(
    () => ({
      backgroundColor: "#ffffff",
      color: "#111111",
      borderTop: "1px solid #eaeaea",
    }),
    []
  );

  const textStyle = useMemo(() => ({ color: "#111111" }), []);
  const mutedStyle = useMemo(() => ({ color: "#333333" }), []);
  const linkStyle = useMemo(() => ({ color: "#111111" }), []);

  function isValidEmail(v) {
    const s = String(v || "").trim();
    if (!s) return false;
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s);
  }

  async function handleNewsletterSubmit(e) {
    e.preventDefault();
    const v = email.trim();

    if (!isValidEmail(v)) {
      setNlState({ status: "error", msg: "Indique um email válido." });
      return;
    }

    // UI pronto; integra aqui o teu endpoint quando existir
    // Ex: await fetch(`${API_BASE}/api/newsletter`, { method:"POST", headers:{...}, body: JSON.stringify({email:v}) })
    setNlState({ status: "success", msg: "Subscrição registada com sucesso." });
    setEmail("");
  }

  return (
    <>
      {/* CTA bar antes do footer */}
 
        <section
          className="wl-prefooter-cta"
          aria-label="Chamada para contacto"
        >
          <div className="wl-cta-bg" aria-hidden="true" />
          <div className="container">
            <div className="wl-cta-inner">
              <div className="wl-cta-left">
                <h2 className="wl-cta-title">
                  Hello  
                </h2>
                <p className="wl-cta-sub">
                  Se você tem as perguntas, a Waveled tem as respostas.
                </p>
              </div>

              <div className="wl-cta-right">
                <Link href="/contact-us" className="tekup-default-btn">
                  Falar connosco
                </Link>
              </div>
            </div>
          </div>
        </section>
    
      <footer className="tekup-footer-section" style={footerStyle}>
        <div className="container">
          <div className="tekup-footer-top tekup-section-padding">
            <div className="row">
              <div className="col-xl-3 col-lg-12">
                <div className="tekup-footer-textarea">
                  <Link href="/">
                    <img
                      src={LOGO_URL}
                      alt="Waveled"
                      style={{ maxHeight: "65px", width: "auto" }}
                    />
                  </Link>

                  <p style={{ ...mutedStyle, marginTop: "14px" }}>
                    Waveled é uma empresa inovadora especializada em soluções
                    display led, unindo eficiência, qualidade e design moderno.
                  </p>

                  {/* Newsletter UI (abaixo da descrição do 1º bloco) */}
                  <form
                    onSubmit={handleNewsletterSubmit}
                    className="wl-newsletter"
                  >
                    <div className="wl-newsletter-row">
                      <input
                        className="wl-newsletter-input"
                        type="email"
                        placeholder="Subscreva com o seu email"
                        value={email}
                        onChange={(e) => {
                          setEmail(e.target.value);
                          if (nlState.status !== "idle")
                            setNlState({ status: "idle", msg: "" });
                        }}
                        aria-label="Email para newsletter"
                      />
                      <button className="wl-newsletter-btn" type="submit">
                        Subscrever
                      </button>
                    </div>
                    {nlState.status !== "idle" ? (
                      <div
                        className="wl-newsletter-msg"
                        style={{
                          color:
                            nlState.status === "success"
                              ? "#16a34a"
                              : "#dc2626",
                        }}
                      >
                        {nlState.msg}
                      </div>
                    ) : null}
                  </form>

                  <div className="tekup-social-icon-box d-none style-two">
                    <ul>
                      <li>
                        <Link
                          className="social-link"
                          href="#"
                          style={linkStyle}
                        >
                          <i className="ri-facebook-fill" />
                        </Link>
                      </li>
                      <li>
                        <Link
                          className="social-link"
                          href="#"
                          style={linkStyle}
                        >
                          <i className="ri-linkedin-fill" />
                        </Link>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="col-xl-2 offset-xl-1 col-md-3">
                <div className="tekup-footer-menu">
                  <div className="tekup-footer-title">
                    <h5 style={textStyle}>Empresa</h5>
                  </div>
                  <ul>
                    <li>
                      <Link href="/about-us" style={linkStyle}>
                        Sobre Nós
                      </Link>
                    </li>
                    <li>
                      <Link href="/service" style={linkStyle}>
                        Serviços
                      </Link>
                    </li>
                    <li>
                      <Link href="/contact-us" style={linkStyle}>
                        Contatos
                      </Link>
                    </li>
                  </ul>
                </div>
              </div>

              <div className="col-xl-3 col-md-4">
                <div className="tekup-footer-menu extar-margin">
                  <div className="tekup-footer-title">
                    <h5 style={textStyle}>Soluções</h5>
                  </div>

                  {loading ? (
                    <ul>
                      <li>
                        <span style={mutedStyle}>A carregar…</span>
                      </li>
                    </ul>
                  ) : err ? (
                    <ul>
                      <li>
                        <span style={{ color: "#dc2626" }}>{err}</span>
                      </li>
                      <li>
                        <Link href="/shop" style={linkStyle}>
                          Ver soluções
                        </Link>
                      </li>
                    </ul>
                  ) : areasList.length === 0 ? (
                    <ul>
                      <li>
                        <span style={mutedStyle}>Sem áreas de aplicação.</span>
                      </li>
                      <li>
                        <Link href="/shop" style={linkStyle}>
                          Ver soluções
                        </Link>
                      </li>
                    </ul>
                  ) : (
                    <ul>
                      {areasList.map((a) => (
                        <li key={a.id}>
                          <Link
                            href={`/solution?area=${encodeURIComponent(a.id)}`}
                            style={linkStyle}
                          >
                            {a.name}
                          </Link>
                        </li>
                      ))}

                      {/* link fixo para ver mais soluções */}
                      <li style={{ marginTop: "10px" }}>
                        <Link
                          href="/solution?area=695b880b926032a07bbefef7"
                          style={{
                            ...linkStyle,
                            fontWeight: 500,
                          }}
                        >
                          Ver mais soluções
                        </Link>
                      </li>
                    </ul>
                  )}
                </div>
              </div>

              <div className="col-xl-3 col-md-4">
                <div className="tekup-footer-menu extar-margin">
                  <div className="tekup-footer-title">
                    <h5 style={textStyle}>Contactos</h5>
                  </div>
                  <ul>
                    <li>
                      <div className="icon" />
                      <span style={mutedStyle}>
                        Rua Fernando Farinha nº 2A e 2B Braço de Prata 1950-448
                        Lisboa
                      </span>
                    </li>

                    <li>
                      <div className="icon" />
                      <span style={mutedStyle}>
                        Email:{" "}
                        <a href="mailto:sales@waveled.com" style={linkStyle}>
                          sales@waveled.com
                        </a>
                      </span>
                    </li>

                    <li>
                      <div className="icon" />
                      <span style={mutedStyle}>Tel: +351 210 353 555</span>
                      <br />
                      <span style={{ marginLeft: "40px", ...mutedStyle }}>
                        +351 212 456 082
                      </span>
                      <br />
                      <small style={{ fontSize: "14px", color: "#2563eb" }}>
                        Chamada para a Rede Fixa Nacional
                      </small>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          <div
            className="tekup-footer-bottom"
            style={{ borderTop: "1px solid #eaeaea" }}
          >
            <div className="row">
              <div className="col-md-6">
                <div className="tekup-copywright right">
                  <p style={{ ...mutedStyle, margin: 0 }}>
                    ©{new Date().getFullYear()} Waveled , All rights reserved.
                  </p>
                </div> 
              </div>

              <div className="col-md-6">
                <div className="tekup-footer-menu style-two right mb-0">
                  <ul>
                    <li>
                      <Link href="/privacy_and_policy" style={linkStyle}>
                        Políticas de Privacidade
                      </Link>
                    </li>
                    <li>
                      <Link href="/terms_and_conditions" style={linkStyle}>
                        Termos & Condições
                      </Link>
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
