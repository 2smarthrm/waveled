/*

/*
usar um skeleton na zona Explorar todas as soluções
para ficar masi bonito oa inves d epor um test diznedo carregar soluções, fazer isso e devolver fullcode:
*/

"use client";

import Link from "next/link";
import dynamic from "next/dynamic";
import { useEffect, useMemo, useState } from "react";
import axios from "axios";

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

// --------- ENV ---------
const isBrowser = typeof window !== "undefined";
const protocol = isBrowser && window.location.protocol === "https:" ? "https" : "http";
const API_BASE = protocol === "https"  ?  'https://waveledserver.vercel.app' : "http://localhost:4000";
const IMG_HOST = protocol === "https"  ?  'https://waveledserver.vercel.app' : "http://localhost:4000";

// --------- Helpers ---------
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
  xlDesktop:    { breakpoint: { max: 2560, min: 1920 }, items: 6 },
  lgDesktop:    { breakpoint: { max: 1920, min: 1536 }, items: 6 },
  desktop:      { breakpoint: { max: 1536, min: 1280 }, items: 6 },
  smDesktop:    { breakpoint: { max: 1280, min: 1024 }, items: 4 },
  lgTablet:     { breakpoint: { max: 1024, min: 834 }, items: 4 },
  tablet:       { breakpoint: { max: 834,  min: 768 }, items: 3 },
  phablet:      { breakpoint: { max: 768,  min: 576 }, items: 2 },
  mobile:       { breakpoint: { max: 576,  min: 375 }, items: 2 },
  miniMobile:   { breakpoint: { max: 375,  min: 0 },   items: 1 },
};

// Ordena: primeiro por mais antigas (ASC), depois acrescenta as mais recentes (DESC) sem duplicar
const orderFirstOldestThenNewest = (arr) => {
  const items = Array.isArray(arr) ? arr.slice() : [];
  const getTime = (x) => {
    const d = x?.createdAt ? new Date(x.createdAt) : null;
    const t = d && !isNaN(d.getTime()) ? d.getTime() : 0;
    return t;
  };
  const oldestAsc = items.slice().sort((a, b) => getTime(a) - getTime(b));
  const newestDesc = items.slice().sort((a, b) => getTime(b) - getTime(a));

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

// --------- Axios client ---------
const api = axios.create({
  baseURL: API_BASE,
  timeout: 15000,
  // withCredentials: true,
});

// --------- Skeleton Card (shimmer) ---------
const SkeletonCard = () => (
  <article className="featured-card skeleton-card" aria-hidden="true">
    <div className="image skeleton-box" />
    <div className="skeleton-title skeleton-box" />
  </article>
);

const SKELETON_ITEMS = Array.from({ length: 10 }).map((_, i) => i);

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

        const { data } = await api.get("/api/solutions", {
          signal: ac.signal,
          headers: { Accept: "application/json" },
        });

        const list = Array.isArray(data?.data) ? data.data : [];
        const ordered = orderFirstOldestThenNewest(list);
        setSolutions(ordered);
      } catch (e) {
        if (axios.isCancel(e)) return;
        const status = e?.response?.status;
        const statusText = e?.response?.statusText;
        const msg = status
          ? `HTTP ${status}${statusText ? ` — ${statusText}` : ""}`
          : (e?.message || "Erro ao carregar soluções");
        console.error("Erro a obter /api/solutions:", e);
        setErr(msg);
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

            <div
              className="row-featured"
              aria-live="polite"
              aria-busy={loading ? "true" : "false"}
            >
              {/* SKELETON STATE */}
              {loading && (
                <Carousel
                  swipeable
                  draggable={false}
                  showDots
                  responsive={responsive}
                  infinite
                  autoPlay={false}
                  keyBoardControl={false}
                  customTransition="all .4s ease"
                  transitionDuration={400}
                  containerClass="carousel-container"
                  removeArrowOnDeviceType={["tablet", "mobile"]}
                  deviceType={deviceType}
                  dotListClass="custom-dot-list-style"
                  itemClass="carousel-item-padding-40-px"
                  renderDotsOutside
                  aria-label="Carrossel de soluções (a carregar)"
                >
                  {SKELETON_ITEMS.map((k) => (
                    <SkeletonCard key={`sk-${k}`} />
                  ))}
                </Carousel>
              )}

              {/* ERROR STATE */}
              {!loading && err && (
                <div className="text-center py-4 text-danger">
                  Erro: {err}
                </div>
              )}

              {/* EMPTY STATE */}
              {!loading && !err && cards.length === 0 && (
                <div className="text-center py-4">Sem soluções registadas ainda.</div>
              )}

              {/* DATA STATE */}
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

      {/* Skeleton styles */}
      <style jsx>{`
        .featured-card {
          padding: 8px 15px;
        }
        .featured-card .image {
          aspect-ratio: 16/9;
          width: 100%;
          overflow: hidden;
          border-radius: 12px;
          background: #f3f3f3;
          margin-bottom: 10px;
        }

       .featured-card .image img{
           width:100%;
           object-fit:cover;
        }

        .featured-card strong {
          display: block;
          font-size: 17px;
          line-height: 1.35;
          color: #111;
        }

        /* Skeleton base */
        .skeleton-box {
          position: relative;
          overflow: hidden;
          background: #e9ecef;
        }
        .skeleton-box::after {
          content: "";
          position: absolute;
          inset: 0;
          transform: translateX(-100%);
          background: linear-gradient(
            90deg,
            rgba(255,255,255,0) 0%,
            rgba(255,255,255,0.6) 50%,
            rgba(255,255,255,0) 100%
          );
          animation: shimmer 1.2s infinite;
        }
        @keyframes shimmer {
          100% { transform: translateX(100%); }
        }

        .skeleton-card .image {
          background: #e9ecef;
          border-radius: 12px;
        }
        .skeleton-title {
          height: 14px;
          width: 80%;
          border-radius: 8px;
        }

        /* Fine-tuning spacing for skeleton cards */
        .skeleton-card {
          padding: 8px;
        }
        .skeleton-card .image {
          aspect-ratio: 16/9;
          margin-bottom: 10px;
        }

        /* Ensure dots don't jump during skeleton */
        :global(.react-multi-carousel-dot-list) {
          margin-top: 8px;
        }
      `}</style>
    </div>
  );
};

export default HomeFour;
