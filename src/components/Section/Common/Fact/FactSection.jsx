"use client";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";


const isBrowser = typeof window !== "undefined";
const protocol = isBrowser && window.location.protocol === "https:" ? "https" : "http";
const API_BASE = protocol === "https"  ?  'https://waveledserver1.vercel.app' : "http://localhost:4000";

const isAbs = (u) => typeof u === "string" && /^https?:\/\//i.test(u);
const withHost = (u) => (u ? (isAbs(u) ? u : `${API_BASE}${u}`) : "");
const safeText = (s, fb = "") => (typeof s === "string" && s.trim() ? s : fb);

const FactSection = () => {
  const [ActiveTab, setActiveTab] = useState(1);

  // ---- dados dinâmicos ----
  const [solutions, setSolutions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState(null);

  useEffect(() => {
    const ac = new AbortController();
    (async () => {
      try {
        setLoading(true);
        setErr(null);
        const res = await fetch(`${API_BASE}/api/solutions`, {
          signal: ac.signal,
          cache: "no-store",
        });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const json = await res.json();
        const list = Array.isArray(json?.data) ? json.data : [];
        setSolutions(list);
      } catch (e) {
        if (e?.name !== "AbortError")
          setErr(e?.message || "Erro ao carregar soluções");
      } finally {
        setLoading(false);
      }
    })();
    return () => ac.abort();
  }, []);

  // top 4 com descrições mais longas
  const topFour = useMemo(() => {
    const score = (s) => (safeText(s?.description).length || 0);
    return [...(solutions || [])].sort((a, b) => score(b) - score(a)).slice(0, 4);
  }, [solutions]);

  // helper para render dinâmico por tab (com fallback)
  const TabContent = ({ item, fallbackTitle, fallbackDesc, fallbackImg, cta }) => {
    const title = item ? safeText(item.title, fallbackTitle) : fallbackTitle;
    const desc = item ? safeText(item.description, fallbackDesc) : fallbackDesc;
    const img = item ? withHost(item.image) : fallbackImg;
    const href = item ? `/solutions?sl=${item._id}` : cta?.href;

    return (
      <>
        <div className="content">
          <h4 className="text-dark">{title}</h4>
          <p style={{ whiteSpace: "pre-line" }}>{desc}</p>
          <br />
          <Link href={href || "#"} className="tekup-default-btn">
            {cta?.label || "Saiba mais"}
          </Link>
        </div>
        <div className="image">
          {img ? (
            <img src={img} alt={title} />
          ) : (
            <div
              className="d-flex align-items-center justify-content-center bg-light"
              style={{ minHeight: 220, border: "1px solid #eee" }}
            >
              <span className="text-muted">Sem imagem</span>
            </div>
          )}
        </div>
      </>
    );
  };

  return (
    <div className="section">
      <div className="service-img">
        <img
          src="https://ik.imagekit.io/fsobpyaa5i/image-gen%20(18).png"
          alt="waveled"
        />
      </div>
      <br />
      <br />
      <br />
      <br />

      <section className="waveled-categories">
        <div className="container">
          <div className="d-flex justify-content-center">
            <div className="cat-tab-header">
              <li
                className={
                  ActiveTab === 1
                    ? "tekup-default-btn ml-1 mr-1"
                    : "tekup-default-btn tekup-white-btn ml-1 mr-1"
                }
                onClick={() => setActiveTab(1)}
              >
               {topFour[0]?.title}
              </li>
              <li
                className={
                  ActiveTab === 2
                    ? "tekup-default-btn ml-1 mr-1"
                    : "tekup-default-btn tekup-white-btn ml-1 mr-1"
                }
                onClick={() => setActiveTab(2)}
              >
                 {topFour[1]?.title}
              </li>
              <li
                className={
                  ActiveTab === 3
                    ? "tekup-default-btn ml-1 mr-1"
                    : "tekup-default-btn tekup-white-btn ml-1 mr-1"
                }
                onClick={() => setActiveTab(3)}
              >
               {topFour[2]?.title}
              </li>
              <li
                className={
                  ActiveTab === 4
                    ? "tekup-default-btn ml-1 mr-1"
                    : "tekup-default-btn tekup-white-btn ml-1 mr-1"
                }
                onClick={() => setActiveTab(4)}
              >
                 {topFour[3]?.title}
              </li>
            </div>
          </div>

          <br />
          <br />

          {/* estados (mantém design; apenas mensagens simples) */}
          {loading && (
            <div className="text-center text-muted">A carregar…</div>
          )}
          {err && <div className="alert alert-danger">{err}</div>}

          <aside className="cat-tab-body">
            {/* INDOOR -> topFour[0] */}
            <article
              className={ActiveTab === 1 ? "container-fluid box-tab" : "d-none"}
            >
              <TabContent
                item={topFour[0]}
                fallbackTitle="Indoor"
                fallbackDesc={`Displays LED de alto desempenho para interiores com imagem nítida, cores fiéis e integração discreta em qualquer espaço. Ideais para retalho premium, auditórios, empresas, museus e estúdios. Disponíveis para venda e aluguer.`}
                fallbackImg="https://www.eagerled.com/wp-content/uploads/2022/11/010f225f02effda801215aa0485bd0.jpg"
                cta={{ label: "Saiba mais", href: "/shop?category=indoor" }}
              />
            </article>

            {/* OUTDOOR -> topFour[1] */}
            <article
              className={ActiveTab === 2 ? "container-fluid box-tab" : "d-none"}
            >
              <TabContent
                item={topFour[1]}
                fallbackTitle="Outdoor"
                fallbackDesc={`Soluções de alta robustez e brilho elevado para exterior, com excelente visibilidade sob luz solar direta e proteção contra intempéries (IP65+). Preparadas para operação 24/7 e monitorização remota.`}
                fallbackImg="https://images.samsung.com/is/image/samsung/assets/us/business/displays/outdoor-and-window/explore/OutdoorDigitalSignage_OG-IMAGE_1200x630.jpg"
                cta={{ label: "Saiba mais", href: "/shop?category=outdoor" }}
              />
            </article>

            {/* ALUGUER -> topFour[2] */}
            <article
              className={ActiveTab === 3 ? "container-fluid box-tab" : "d-none"}
            >
              <TabContent
                item={topFour[2]}
                fallbackTitle="Aluguer (Eventos)"
                fallbackDesc={`Estruturas modulares de montagem rápida para palcos, feiras e ativações de marca, com alta taxa de atualização para captação por câmara sem flicker. Compatível com rigging, ground support e LED de piso.`}
                fallbackImg="https://www.bibiled.com/wp-content/uploads/2024/05/Everything-you-need-to-know-about-outdoor-LED-rental-screens-www.bibild.com-1.jpg"
                cta={{ label: "Pedir orçamento", href: "/contact-us" }}
              />
            </article>

            {/* DESPORTO -> topFour[3] */}
            <article
              className={ActiveTab === 4 ? "container-fluid box-tab" : "d-none"}
            >
              <TabContent
                item={topFour[3]}
                fallbackTitle="Desporto"
                fallbackDesc={`Soluções LED para recintos desportivos com segurança reforçada, integração com scoring e broadcast. De perímetros LED a scoreboards e cubos centrais, para venda e aluguer.`}
                fallbackImg="https://prodisplay.com/wp-content/uploads/2022/02/outdoor-led-display-screen-sports-events.jpg"
                cta={{ label: "Ver soluções", href: "/shop?category=sports" }}
              />
            </article>
          </aside>
        </div>
      </section>
    </div>
  );
};

export default FactSection;
