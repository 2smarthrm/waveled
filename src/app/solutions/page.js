"use client";

import HeaderFour from "~/components/Section/Common/Header/HeaderFour";
import FooterFour from "~/components/Section/Common/FooterFour";
import CtaThreeSection from "~/components/Section/Common/CtaThree/CtaThreeSection";
import { useEffect, useMemo, useState, useCallback } from "react";
import axios from "axios";
import Slider from "react-slick";
import Link from "next/link";

//  yet-another-react-lightbox
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";

// (opcional, mas recomendado)
import Zoom from "yet-another-react-lightbox/plugins/zoom";
import Thumbnails from "yet-another-react-lightbox/plugins/thumbnails";
import Captions from "yet-another-react-lightbox/plugins/captions";
import "yet-another-react-lightbox/plugins/thumbnails.css";
import "yet-another-react-lightbox/plugins/captions.css";

// === Skeletons (React-Bootstrap) ===
import { Placeholder, Spinner } from "react-bootstrap";

// Helpers de imagem/texto
const isAbsoluteUrl = (u) => typeof u === "string" && /^https?:\/\//i.test(u);
const safeText = (s, fb = "") => (typeof s === "string" && s.trim() ? s : fb);
const hasLongDescription = (ex, min = 30) => {
  const d = (ex?.description || "").replace(/\s+/g, " ").trim();
  return d.length >= min;
};

const isBrowser = typeof window !== "undefined";
const protocol = isBrowser && window.location.protocol === "https:" ? "https" : "http";
const BaseUrl = protocol === "https" ? "https://waveledserver.vercel.app" : "http://localhost:4000";
const withHost = (u) => (u ? (isAbsoluteUrl(u) ? u : `${BaseUrl}${u}`) : "");

// Slider settings para os Kits (react-slick)
const sliderProducts = {
  dots: false,
  infinite: false,
  speed: 500,
  arrows: true,
  slidesToShow: 4,
  slidesToScroll: 4,
  responsive: [
    { breakpoint: 1280, settings: { slidesToShow: 3.5, slidesToScroll: 3.5 } },
    { breakpoint: 1024, settings: { slidesToShow: 3, slidesToScroll: 3 } },
    { breakpoint: 768, settings: { slidesToShow: 2, slidesToScroll: 2 } },
    { breakpoint: 480, settings: { slidesToShow: 1, slidesToScroll: 1 } },
  ],
};

// Slider settings para "Indústrias e Soluções Aplicáveis" (react-slick)
const industriesSliderSettings = {
  dots: false,
  infinite: false,
  speed: 500,
  arrows: true,
  slidesToShow: 2,
  slidesToScroll: 1,
  autoplay: true,
  autoplaySpeed: 3000,
  swipeToSlide: true,
  responsive: [
    { breakpoint: 1024, settings: { slidesToShow: 2, slidesToScroll: 1 } },
    { breakpoint: 768, settings: { slidesToShow: 1, slidesToScroll: 1 } },
  ],
};

function useSolutionId() {
  const [id, setId] = useState(null);
  useEffect(() => {
    try {
      if (typeof window !== "undefined") {
        const sp = new URLSearchParams(window.location.search);
        const v = sp.get("sl");
        if (v && v.trim()) setId(v.trim());
      }
    } catch {}
  }, []);
  return id;
}

//  Util para criar slides do YARL a partir de itens {image,title} ou string
// YARL espera: slides=[{ src, title?, description? }]
const toLbSlides = (arr = []) =>
  arr
    .filter(Boolean)
    .map((x) => {
      const src = withHost(x?.image || x?.url || x);
      const title = safeText(x?.title || "", "");
      const description = safeText(x?.description || "", "");
      return { src, title: title || undefined, description: description || undefined };
    })
    .filter((x) => !!x.src);

/* ===========================================================
   SKELETONS
   =========================================================== */

const TitleParagraphSkeleton = ({ lines = 2, titleWidth = "40%", textWidth = "80%" }) => (
  <div>
    <Placeholder as="h2" animation="wave">
      <Placeholder xs={6} style={{ maxWidth: titleWidth, height: 32 }} />
    </Placeholder>
    {Array.from({ length: lines }).map((_, i) => (
      <Placeholder key={i} as="p" animation="wave">
        <Placeholder xs={10} style={{ maxWidth: textWidth, height: 16 }} />{" "}
      </Placeholder>
    ))}
  </div>
);

// grande + média + 2 pequenas (mesmo grid do BlockSection)
const BlockSectionSkeleton = () => (
  <aside className="block-solution-section">
    <div className="block-side">
      <div className="skeleton-soft skeleton-light">
        <TitleParagraphSkeleton lines={2} />
      </div>
    </div>

    <div className="images-area">
      <div className="large-image">
        <div className="skeleton-soft skeleton-light">
          <Placeholder as="div" animation="wave" style={{ width: "100%", height: 360, borderRadius: 12 }}>
            <Placeholder xs={12} style={{ width: "100%", height: "100%" }} />
          </Placeholder>
        </div>
      </div>

      <div className="block-images">
        <div className="md-image">
          <div className="skeleton-soft skeleton-light">
            <Placeholder as="div" animation="wave" style={{ width: "100%", height: 170, borderRadius: 12 }}>
              <Placeholder xs={12} style={{ width: "100%", height: "100%" }} />
            </Placeholder>
          </div>
        </div>

        <div className="group-images">
          {[0, 1].map((i) => (
            <div className="img" key={i}>
              <div className="skeleton-soft skeleton-light">
                <Placeholder as="div" animation="wave" style={{ width: "100%", height: 82, borderRadius: 12 }}>
                  <Placeholder xs={12} style={{ width: "100%", height: "100%" }} />
                </Placeholder>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  </aside>
);

const BlockItemSkeleton = () => (
  <aside className="block-solution-section">
    <div className="block-side">
      <div className="skeleton-soft skeleton-light">
        <TitleParagraphSkeleton lines={3} />
      </div>
    </div>
    <div className="images-area">
      <div className="col large-image">
        <div className="skeleton-soft skeleton-light">
          <Placeholder as="div" animation="wave" style={{ width: "100%", height: 340, borderRadius: 12 }}>
            <Placeholder xs={12} style={{ width: "100%", height: "100%" }} />
          </Placeholder>
        </div>
      </div>
    </div>
  </aside>
);

const KitsSectionSkeleton = () => (
  <div className="product-kit-area mt-4 bg-dark" style={{ borderRadius: 12, padding: "24px" }}>
    <div className="d-flex align-items-center justify-content-between mb-3">
      <div className="skeleton-soft skeleton-light" style={{ flex: 1 }}>
        <Placeholder as="h4" animation="wave">
          <Placeholder xs={4} style={{ height: 28 }} />
        </Placeholder>
      </div>
      <div className="skeleton-soft skeleton-light" style={{ width: 120, textAlign: "right" }}>
        <Placeholder as="small" animation="wave">
          <Placeholder xs={6} style={{ height: 14 }} />
        </Placeholder>
      </div>
    </div>

    <div className="row">
      {Array.from({ length: 4 }).map((_, i) => (
        <div className="col-12 col-sm-6 col-md-4 col-lg-3 mb-3" key={i}>
          <div className="p-2">
            <div className="skeleton-soft skeleton-light">
              <Placeholder as="div" animation="wave" style={{ width: "100%", height: 180, borderRadius: 8 }} />
            </div>
            <div className="skeleton-soft skeleton-light mt-2">
              <Placeholder as="div" animation="wave">
                <Placeholder xs={8} style={{ height: 16 }} />
              </Placeholder>
              <Placeholder as="div" animation="wave">
                <Placeholder xs={5} style={{ height: 12 }} />
              </Placeholder>
            </div>
          </div>
        </div>
      ))}
    </div>
  </div>
);

const SolutionImageSkeleton = () => (
  <div className="solution-image bg-white pt-0 mt-0 mb-0">
    <div className="skeleton-soft skeleton-light">
      <Placeholder as="div" animation="wave" style={{ width: "100%", maxHeight: 560, height: 420, borderRadius: 8 }} />
    </div>
  </div>
);

const GridSixSkeleton = () => (
  <section className="mt-4 bg-black">
    <div className="section tekup-section-padding">
      <div className="container">
        <hr />
        <br />
        <div className="col">
          <div className="d-flex col justify-content-between">
            <div className="skeleton-soft skeleton-light" style={{ maxWidth: 280 }}>
              <Placeholder as="h3" animation="wave">
                <Placeholder xs={8} style={{ height: 26 }} />
              </Placeholder>
            </div>
            <div className="skeleton-soft skeleton-light" style={{ maxWidth: 550 }}>
              <Placeholder as="p" animation="wave">
                <Placeholder xs={12} style={{ height: 14 }} />
                <Placeholder xs={9} style={{ height: 14 }} />
              </Placeholder>
            </div>
          </div>
          <br />
          <div className="row single-portofolio-area">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="col-sm-6 col-md-4 col-lg-3 mb-4">
                <div className="skeleton-soft skeleton-light">
                  <Placeholder as="div" animation="wave" style={{ width: "100%", height: 180, borderRadius: 8 }} />
                </div>
                <div className="skeleton-soft skeleton-light mt-2">
                  <Placeholder as="div" animation="wave">
                    <Placeholder xs={10} style={{ height: 14 }} />
                  </Placeholder>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  </section>
);

/* ===========================================================
   COMPONENTES REAIS
   =========================================================== */

function BlockSection({ title, description, imgs = [], onOpenLightbox }) {
  // Espera até 4 imagens: [0]=large, [1]=md, [2]=small1, [3]=small2
  const present = useMemo(() => imgs.filter(Boolean), [imgs]);
  const lbSlides = useMemo(() => toLbSlides(present), [present]);

  const getIdx = useCallback(
    (visualPos) => {
      const original = imgs[visualPos];
      const idx = present.findIndex((p) => p === original);
      return idx < 0 ? 0 : idx;
    },
    [imgs, present]
  );

  const handleClick = (visualPos) => {
    if (!onOpenLightbox || lbSlides.length === 0) return;
    onOpenLightbox(lbSlides, getIdx(visualPos));
  };

  const [large, md, s1, s2] = imgs;

  return (
    <aside className="block-solution-section">
      <div className="block-side">
        <h2 className="tekup-section-title pt-0 pb-0 mb-4 text-dark">{safeText(title)}</h2>
        <p className="col-lg-8 mt-0 pt-0">{safeText(description)}</p>
      </div>
      <div className="images-area">
        <div className="large-image">
          {!!large && (
            <img
              src={withHost(large.image)}
              alt={safeText(large.title, "Exemplo")}
              role="button"
              style={{ cursor: "zoom-in" }}
              onClick={() => handleClick(0)}
            />
          )}
        </div>
        <div className={"block-images"}>
          <div className="md-image">
            {!!md && (
              <img
                src={withHost(md.image)}
                alt={safeText(md.title, "Exemplo")}
                role="button"
                style={{ cursor: "zoom-in" }}
                onClick={() => handleClick(1)}
              />
            )}
          </div>
          <div className="group-images">
            <div className="img">
              {!!s1 && (
                <img
                  src={withHost(s1.image)}
                  alt={safeText(s1.title, "Exemplo")}
                  role="button"
                  style={{ cursor: "zoom-in" }}
                  onClick={() => handleClick(2)}
                />
              )}
            </div>
            <div className="img">
              {!!s2 && (
                <img
                  src={withHost(s2.image)}
                  alt={safeText(s2.title, "Exemplo")}
                  role="button"
                  style={{ cursor: "zoom-in" }}
                  onClick={() => handleClick(3)}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}

function BlockItem({ reverse = false, title, description, img, onOpenLightbox }) {
  const lbSlides = useMemo(() => toLbSlides([img ? { image: img, title } : null]), [img, title]);

  return (
    <aside className={reverse ? "block-solution-section reverse" : "block-solution-section"}>
      <div className="block-side">
        <h2 className="tekup-section-title pt-0 pb-0 mb-4 text-dark">{safeText(title)}</h2>
        <p className="col-lg-8 mt-0 pt-0">{safeText(description)}</p>
      </div>
      <div className={reverse ? "reverse images-area" : "images-area"}>
        <div className="col large-image">
          {img ? (
            <img
              src={withHost(img)}
              alt={safeText(title)}
              role="button"
              style={{ width: "100%", cursor: "zoom-in" }}
              onClick={() => onOpenLightbox && onOpenLightbox(lbSlides, 0)}
            />
          ) : null}
        </div>
      </div>
    </aside>
  );
}

function KitsSection({ kits = [], productMap = {}, onOpenLightbox }) {
  const kitsWithProducts = kits
    .map((kit) => ({
      ...kit,
      products: (kit.productIds || []).map((pid) => productMap[pid]).filter(Boolean),
    }))
    .filter((kit) => kit.products.length > 0);

  if (!kitsWithProducts.length) return null;

  return (
    <div className="product-kit-area mt-4 bg-dark" style={{ borderRadius: 12, padding: "24px" }}>
      {kitsWithProducts.map((kit) => {
        const prods = kit.products;

        const gallery = toLbSlides(
          prods.map((p) => {
            const thumb = Array.isArray(p.wl_images) && p.wl_images.length ? p.wl_images[0] : "";
            return thumb ? { image: thumb, title: p?.wl_name } : null;
          })
        );

        return (
          <div key={kit._id} className="mb-5">
            <div className="d-flex align-items-center justify-content-between">
              <h4 className="text-light mb-3">{safeText(kit.name)}</h4>
              <small className="text-silver">{prods.length} produto(s)</small>
            </div>

            <Slider {...sliderProducts}>
              {prods.map((p, idx) => {
                const thumb = Array.isArray(p.wl_images) && p.wl_images.length ? withHost(p.wl_images[0]) : "";
                const name = safeText(p.wl_name, "Produto");
                const id = p._id;

                return (
                  <article key={id} className="p-2">
                    <div className="image" style={{ background: "#111", borderRadius: 8, padding: 8 }}>
                      {thumb ? (
                        <img
                          src={thumb}
                          alt={name}
                          role="button"
                          style={{
                            width: "100%",
                            height: 180,
                            objectFit: "cover",
                            borderRadius: 8,
                            cursor: "zoom-in",
                          }}
                          onClick={() => onOpenLightbox && onOpenLightbox(gallery, idx)}
                        />
                      ) : (
                        <div style={{ height: 180, borderRadius: 8, background: "#222" }} />
                      )}
                    </div>

                    <Link href={`/single-shop?product=${id}`} className="d-block mt-2">
                      <strong className="text-white" title={name}>
                        {name.length > 45 ? name.slice(0, 45) + "…" : name}
                      </strong>
                    </Link>

                    {p?.wl_category?.wl_name ? (
                      <small className="d-block text-silver">{p.wl_category.wl_name}</small>
                    ) : null}
                  </article>
                );
              })}
            </Slider>
          </div>
        );
      })}
    </div>
  );
}

/* ===========================================================
   HELPERS PARA CONSTRUIR LISTA DE EXEMPLOS + LAYOUT
   =========================================================== */

// Mistura os vários grupos do endpoint em 1 única lista de exemplos
function buildExamplesArray(examplesObj) {
  const ex = examplesObj || {};
  const main = Array.isArray(ex.main) ? ex.main : [];
  const relCat = Array.isArray(ex.relatedByCategory) ? ex.relatedByCategory : [];
  const relProd = Array.isArray(ex.relatedByProducts) ? ex.relatedByProducts : [];

  const showAll = Array.isArray(ex.showcase?.allShowcase) ? ex.showcase.allShowcase : [];

  const result = [];
  const seen = new Set();

  const pushUnique = (item) => {
    if (!item) return;
    const id = String(item._id || "");
    if (!id || seen.has(id)) return;
    seen.add(id);
    result.push(item);
  };

  // Ordem de prioridade:
  // 1) main (curados para a solução)
  main.forEach(pushUnique);
  // 2) exemplos showcase (categoria + produtos)
  showAll.forEach(pushUnique);
  // 3) related (categoria/produtos) para complementar
  relCat.forEach(pushUnique);
  relProd.forEach(pushUnique);

  return result;
}

// Constrói o layout: hero (4) + [block(2) + grid(…)] repetido
function buildLayout(examples = []) {
  const all = Array.isArray(examples) ? examples : [];
  if (!all.length) {
    return { heroExamples: [], sections: [] };
  }

  // 1) Hero: primeiras 4 imagens
  const heroExamples = all.slice(0, 4);
  const usedIds = new Set(heroExamples.map((ex) => String(ex._id || "")));

  const sections = [];
  const findRemaining = () => all.filter((ex) => !usedIds.has(String(ex._id || "")));

  let remaining = findRemaining();
  let guard = 0;

  while (remaining.length && guard < 50) {
    guard++;

    // 2) Secção de blocos (BlockItem) – apenas exemplos com descrição >= 30
    const blockCandidates = remaining.filter((ex) => hasLongDescription(ex, 30));

    if (blockCandidates.length) {
      const blockItems = blockCandidates.slice(0, Math.min(2, blockCandidates.length));
      sections.push({ type: "block", items: blockItems });
      blockItems.forEach((ex) => usedIds.add(String(ex._id || "")));
    }

    // atualizar remaining
    remaining = findRemaining();
    if (!remaining.length) break;

    // 3) Secção "grid"
    const gridItems = remaining.slice(0, 100);
    if (gridItems.length) {
      sections.push({ type: "grid", items: gridItems });
      gridItems.forEach((ex) => usedIds.add(String(ex._id || "")));
    }

    remaining = findRemaining();
  }

  return { heroExamples, sections };
}

/* ===========================================================
   PÁGINA
   =========================================================== */

const SolutionPage = () => {
  const solutionId = useSolutionId();

  const [loading, setLoading] = useState(true);
  const [solution, setSolution] = useState(null);
  const [products, setProducts] = useState([]); // /solutions/:id/products
  const [kits, setKits] = useState([]); // /solutions/:id/kits
  const [examples, setExamples] = useState([]); // lista já misturada
  const [error, setError] = useState(null);

  //  Estado do Lightbox (YARL)
  const [lbOpen, setLbOpen] = useState(false);
  const [lbSlides, setLbSlides] = useState([]);
  const [lbIndex, setLbIndex] = useState(0);

  const openLightbox = useCallback((slidesArray, startAt = 0) => {
    const slides = Array.isArray(slidesArray) ? slidesArray : [];
    if (!slides.length) return;
    setLbSlides(slides);
    setLbIndex(Number.isFinite(startAt) ? startAt : 0);
    setLbOpen(true);
  }, []);

  const closeLightbox = useCallback(() => {
    setLbOpen(false);
    setLbSlides([]);
    setLbIndex(0);
  }, []);

  const productMap = useMemo(() => {
    const map = {};
    for (const p of products) {
      if (p && p._id) map[p._id] = p;
    }
    return map;
  }, [products]);

  const { heroExamples, sections } = useMemo(() => buildLayout(examples), [examples]);

  useEffect(() => {
    let cancel = false;

    async function run() {
      if (!solutionId) return;
      setLoading(true);
      setError(null);
      try {
        // Podemos buscar tudo em paralelo
        const [prodResp, kitsResp, exResp] = await Promise.all([
          axios.get(`${BaseUrl}/api/solutions/${solutionId}/products`, { withCredentials: true }),
          axios.get(`${BaseUrl}/api/solutions/${solutionId}/kits`, { withCredentials: true }),
          axios.get(`${BaseUrl}/api/solutions/${solutionId}/examples`, { withCredentials: true }),
        ]);

        if (cancel) return;

        // Produtos e kits
        setProducts(prodResp?.data?.data || []);
        setKits(kitsResp?.data?.data || []);

        // Endpoint de examples agora devolve solution + examples.*
        const exPayload = exResp?.data?.data || {};
        const solMeta = exPayload.solution;
        if (!solMeta) throw new Error("Solução não encontrada.");

        // Solução: preferimos alldata se existir
        setSolution(solMeta.alldata || solMeta);

        const examplesObj = exPayload.examples || {};
        const allExamples = buildExamplesArray(examplesObj);
        setExamples(allExamples);
      } catch (err) {
        console.error(err);
        setError(err?.response?.data?.error || err?.message || "Erro ao carregar dados.");
      } finally {
        if (!cancel) setLoading(false);
      }
    }

    run();
    return () => {
      cancel = true;
    };
  }, [solutionId]);

  return (
    <div className="solutions-page">
      <HeaderFour />
      <title>Soluções</title>
      <br />

      <section className="section pb-0 mb-0 tekup-section-padding">
        <div className="container">
          {/* ======= LOADING STATE (Skeletons) ======= */}
          {loading && (
            <div className="py-4">
              <div className="d-flex align-items-center gap-2 mb-3">
                <Spinner animation="border" size="sm" variant="secondary" />
                <span className="text-muted">A carregar solução…</span>
              </div>

              {/* 1) Cabeçalho + 4 exemplos */}
              <BlockSectionSkeleton />

              {/* 2) Kits */}
              <KitsSectionSkeleton />

              {/* 3) Imagem principal */}
              <br />
              <br />
              <SolutionImageSkeleton />

              {/* 4) Dois blocos seguintes (placeholder) */}
              <div className="mt-4">
                <BlockItemSkeleton />
                <BlockItemSkeleton />
              </div>

              {/* 5) Grelha final */}
              <br />
              <br />
              <GridSixSkeleton />
            </div>
          )}

          {/* ======= ERROR ======= */}
          {!loading && error && (
            <div className="py-5">
              <h4>Ocorreu um problema</h4>
              <p className="text-danger">{safeText(error)}</p>
            </div>
          )}

          {/* ======= SUCCESS ======= */}
          {!loading && !error && solution && (
            <>
              {/* 1) Cabeçalho + 4 exemplos (hero) */}
              <BlockSection
                title={solution.title}
                description={solution.description}
                imgs={[heroExamples[0], heroExamples[1], heroExamples[2], heroExamples[3]]}
                onOpenLightbox={openLightbox}
              />

              {/* 2) Kits */}
              <KitsSection kits={kits} productMap={productMap} onOpenLightbox={openLightbox} />
            </>
          )}
        </div>
      </section>

      {/* 3) Imagem principal da solução */}
      {!loading && !error && solution?.image ? (
        <>
          <br />
          <br />
          <div className="solution-image bg-white pt-0 mt-0 mb-0">
            <img
              src={withHost(solution.image)}
              alt={safeText(solution.title)}
              style={{
                width: "100%",
                maxHeight: 560,
                objectFit: "cover",
                cursor: "zoom-in",
              }}
              role="button"
              onClick={() => openLightbox(toLbSlides([{ image: solution.image, title: solution.title }]), 0)}
            />
          </div>
          <br />
          <br />
        </>
      ) : null}

      {/* 4 & 5) Padrão repetido: [BlockItem x2] + [Slider de Indústrias] */}
      {!loading && !error && sections.length > 0 && (
        <>
          {sections.map((section, sIdx) => {
            if (section.type === "block") {
              const items = section.items || [];
              if (!items.length) return null;

              return (
                <section key={`block-${sIdx}`} className="section pb-0 mb-0 pt-0 tekup-section-padding">
                  <div className="container">
                    {items.map((ex, idx) => (
                      <BlockItem
                        key={ex._id || `${sIdx}-${idx}`}
                        reverse={idx % 2 === 0}
                        title={safeText(ex.title, solution?.title || "Exemplo")}
                        description={safeText(ex.description, solution?.description || "")}
                        img={ex.image}
                        onOpenLightbox={openLightbox}
                      />
                    ))}
                  </div>
                </section>
              );
            }

            if (section.type === "grid") {
              const items = section.items || [];
              if (!items.length) return null;

              const gallery = toLbSlides(items);

              return (
                <section key={`grid-${sIdx}`} className="mt-4 bg-black ">
                  <div className="section tekup-section-padding">
                    <div className="container">
                      <hr />
                      <br />
                      <div className="col">
                        <div className="d-flex col justify-content-between">
                          <div>
                            <h3 className="text-light mt-4">Indústrias e Soluções Aplicáveis</h3>
                          </div>
                          <div style={{ maxWidth: "550px" }}>
                            <p className="text-silver mt-2">
                              Combinações de produtos e projetos interessantes baseados nesta solução.
                            </p>
                          </div>
                        </div>
                        <br />

                        {/* Slider react-slick */}
                        <Slider {...industriesSliderSettings} className="industries-carousel-container">
                          {items.map((ex, index) => {
                            const img = withHost(ex?.image);
                            const title = safeText(ex?.title, "Exemplo");
                            if (!img) return null;

                            return (
                              <div key={ex._id || `${sIdx}-${index}`} style={{ padding: "0 12px", marginBottom: 24 }}>
                                <article className="industries-carousel-item" style={{ padding: "0 12px", marginBottom: 24 }}>
                                  <img
                                    src={img}
                                    alt={title}
                                    style={{
                                      width: "100%",
                                      height: 480,
                                      borderRadius: 8,
                                      objectFit: "cover",
                                      cursor: "zoom-in",
                                    }}
                                    role="button"
                                    onClick={() => openLightbox(gallery, index)}
                                  />
                                  <strong className="text-silver d-block mt-2" title={title}>
                                    {title.length > 60 ? title.slice(0, 60) + "…" : title}
                                  </strong>
                                </article>
                              </div>
                            );
                          })}
                        </Slider>
                      </div>
                    </div>
                  </div>
                </section>
              );
            }

            return null;
          })}
        </>
      )}

      <CtaThreeSection />
      <FooterFour noHello />

      {/*  Lightbox global (YARL) */}
      <Lightbox
        open={lbOpen}
        close={closeLightbox}
        slides={lbSlides}
        index={lbIndex}
        plugins={[Zoom, Thumbnails, Captions]}
        on={{ view: ({ index }) => setLbIndex(index) }}
      />
    </div>
  );
};

export default SolutionPage;
