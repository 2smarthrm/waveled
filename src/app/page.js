/*
/*

HomeFour — Primeiro bloco com “primeiras imagens adicionadas e, em seguida, as mais recentes”.

Lógica aplicada ao carrossel de soluções:
- Busca /api/solutions
- Separa por createdAt:
  - oldestAsc: ascendente (primeiras adicionadas)
  - newestDesc: descendente (mais recentes)
- Concatena oldestAsc + newestDesc removendo duplicados por _id

*/

"use client";

import Link from "next/link";
import dynamic from "next/dynamic";
import { useEffect, useMemo, useState } from "react";

import AccordionSection from "~/components/Section/Home-4/AccordionSection";
import HeroSection from "~/components/Section/Home-4/HeroSection";
import ItSolutionSection from "~/components/Section/Home-4/ItSolutionSection";
import TestimonialSection from "~/components/Section/Home-7/TestimonialSection";
import ServiceSection from "~/components/Section/Home-4/ServiceSection";
import RecentProjectsSection from "~/components/Section/Home-4/RecentProjectsSection";
import HeaderFour from "~/components/Section/Common/Header/HeaderFour";
import FooterFour from "~/components/Section/Common/FooterFour";
import CtaThreeSection from "~/components/Section/Common/CtaThree/CtaThreeSection";

const Carousel = dynamic(() => import("react-multi-carousel"), { ssr: false });
import "react-multi-carousel/lib/styles.css";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";
const IMG_HOST = process.env.NEXT_PUBLIC_IMG_HOST || "http://localhost:4000";

const isAbsoluteUrl = (u) => typeof u === "string" && /^https?:\/\//i.test(u);
const withHost = (u) => (u ? (isAbsoluteUrl(u) ? u : `${IMG_HOST}${u}`) : "");
const safeText = (s, fb = "") => (typeof s === "string" && s.trim() ? s : fb);
const pickImage = (it) =>
  it?.image || it?.cover || it?.coverUrl || it?.img || it?.thumbnail || it?.thumbUrl || it?.photo;

const isMobileUA = () => {
  if (typeof navigator === "undefined") return false;
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
};

const responsive = {
  ultraDesktop: { breakpoint: { max: 4000, min: 2560 }, items: 6 },
  xlDesktop:   { breakpoint: { max: 2560, min: 1920 }, items: 6 },
  lgDesktop:   { breakpoint: { max: 1920, min: 1536 }, items: 6 },
  desktop:     { breakpoint: { max: 1536, min: 1280 }, items: 6 },
  smDesktop:   { breakpoint: { max: 1280, min: 1024 }, items: 4 },
  lgTablet:    { breakpoint: { max: 1024, min: 834 }, items: 4 },
  tablet:      { breakpoint: { max: 834,  min: 768 }, items: 3 },
  phablet:     { breakpoint: { max: 768,  min: 576 }, items: 2 },
  mobile:      { breakpoint: { max: 576,  min: 375 }, items: 2 },
  miniMobile:  { breakpoint: { max: 375,  min: 0 },   items: 1 },
};

// helper: cria ordem "primeiras adicionadas" -> "mais recentes"
const orderFirstOldestThenNewest = (arr) => {
  const items = Array.isArray(arr) ? arr.slice() : [];
  // normalizar datas (se faltar createdAt, considerar 0)
  const getTime = (x) => {
    const d = x?.createdAt ? new Date(x.createdAt) : null;
    const t = d && !isNaN(d.getTime()) ? d.getTime() : 0;
    return t;
  };
  const oldestAsc = items.slice().sort((a, b) => getTime(a) - getTime(b));
  const newestDesc = items.slice().sort((a, b) => getTime(b) - getTime(a));

  // merge sem duplicar _id
  const seen = new Set();
  const merged = [];
  for (const it of [...oldestAsc, ...newestDesc]) {
    const id = String(it?._id || "");
    if (!id || seen.has(id)) continue;
    seen.add(id);
    merged.push(it);
  }
  return merged;
};

const HomeFour = ({ deviceType: deviceTypeProp }) => {
  const deviceType = deviceTypeProp || (isMobileUA() ? "mobile" : "desktop");
  const autoPlay = deviceType !== "mobile";

  const [solutions, setSolutions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState(null);

  useEffect(() => {
    const ac = new AbortController();
    (async () => {
      try {
        setLoading(true);
        setErr(null);
        const res = await fetch(`${API_BASE}/api/solutions/`, {
          signal: ac.signal,
          cache: "no-store",
        });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const json = await res.json();
        const list = Array.isArray(json?.data) ? json.data : [];

        // aplica a ordenação desejada
        const ordered = orderFirstOldestThenNewest(list.sort());
        setSolutions(ordered);
      } catch (e) {
        setInterval(() => {
           console.log(e);
        }, 3000) 
        if (e?.name !== "AbortError") setErr(e?.message || "Erro ao carregar soluções");
      } finally {
        setLoading(false);
      }
    })();
    return () => ac.abort();
  }, []);

  // memo para render rápido
  const cards = useMemo(() => {
    return (solutions || []).map((item) => {
      const id = String(item?._id || "");
      const title = safeText(item?.title, "Solução");
      const img = withHost(pickImage(item));
      const href = `/solutions?sl=${encodeURIComponent(id)}`;
      return { id, title, img, href };
    });
  }, [solutions]);

  return (
    <div>
      <HeaderFour />
      <HeroSection />

      <section>
        <div className="section home-featured-items tekup-section-padding2 pt-5 pb-3">
          <div className="container-fluid">
            <div className="tekup-section-title text-center">
              <h3 className="text-dark">Explorar todas as soluções</h3>
              <p className="text-muted">Projetos e aplicações reais dos nossos produtos.</p>
            </div>

            <div className="row-featured">
              {loading && (
                <div className="text-center py-5" role="status" aria-live="polite">
                  A carregar soluções…
                </div>
              )}

              {!loading && err && <div className="text-center py-4 text-danger">Erro: {err}</div>}

              {!loading && !err && cards.length === 0 && (
                <div className="text-center py-4">Sem soluções registadas ainda.</div>
              )}

              {!loading && !err && cards.length > 0 && (
                <Carousel
                  swipeable
                  draggable
                  showDots
                  responsive={responsive}
                  infinite
                  autoPlay={autoPlay}
                  autoPlaySpeed={2500}
                  pauseOnHover
                  keyBoardControl
                  customTransition="all .5s ease"
                  transitionDuration={500}
                  containerClass="carousel-container"
                  removeArrowOnDeviceType={["tablet", "mobile"]}
                  deviceType={deviceType}
                  dotListClass="custom-dot-list-style"
                  itemClass="carousel-item-padding-40-px"
                  renderDotsOutside
                  aria-label="Carrossel de soluções"
                >
                  {cards.map(({ id, title, img, href }) => (
                    <article key={id} className="featured-card">
                      <Link href={href} aria-label={title}>
                        <div className="image">
                          {img ? (
                            <img src={img} alt={title} loading="lazy" decoding="async" />
                          ) : (
                            <div
                              style={{
                                aspectRatio: "16/9",
                                width: "100%",
                                display: "grid",
                                placeItems: "center",
                                background: "#f3f3f3",
                                borderRadius: "8px",
                              }}
                              aria-label="Sem imagem disponível"
                            >
                              <span style={{ fontSize: 12, color: "#666" }}>Sem imagem</span>
                            </div>
                          )}
                        </div>
                        <strong>{title}</strong>
                      </Link>
                    </article>
                  ))}
                </Carousel>
              )}
            </div>
          </div>
        </div>
      </section>

      <ServiceSection />
      <ItSolutionSection />
      <RecentProjectsSection />
      <TestimonialSection />
      <AccordionSection />
      <CtaThreeSection />
      <FooterFour />
    </div>
  );
};

export default HomeFour;
