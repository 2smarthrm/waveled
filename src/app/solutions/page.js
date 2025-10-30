 

"use client";
import HeaderFour from '~/components/Section/Common/Header/HeaderFour';
import FooterFour from '~/components/Section/Common/FooterFour';
import CtaThreeSection from '~/components/Section/Common/CtaThree/CtaThreeSection';
import { useEffect, useMemo, useState, useCallback } from 'react';
import axios from 'axios';
import Slider from "react-slick";
import Link from 'next/link';
import Lightbox from "react-awesome-lightbox";
import "react-awesome-lightbox/build/style.css";

// Helpers de imagem/texto
const isAbsoluteUrl = (u) => typeof u === "string" && /^https?:\/\//i.test(u);
const safeText = (s, fb = "") => (typeof s === "string" && s.trim() ? s : fb);

const BaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:4000";
const withHost = (u) => (u ? (isAbsoluteUrl(u) ? u : `${BaseUrl}${u}`) : "");

// Slider settings
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
    { breakpoint: 768,  settings: { slidesToShow: 2, slidesToScroll: 2 } },
    { breakpoint: 480,  settings: { slidesToShow: 1, slidesToScroll: 1 } },
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

// Util para criar array de imagens do lightbox a partir de itens {image,title}
const toLbImages = (arr = []) =>
  arr
    .filter(Boolean)
    .map((x) => ({
      url: withHost(x?.image || x), // suporta tanto objeto {image} como string direta
      title: safeText(x?.title || "", ""),
    }))
    .filter((x) => !!x.url);

/** Blocos visuais **/
function BlockSection({ title, description, imgs = [], onOpenLightbox }) {
  // Espera até 4 imagens: [0]=large, [1]=md, [2]=small1, [3]=small2
  const present = useMemo(() => imgs.filter(Boolean), [imgs]);
  const lbImages = useMemo(() => toLbImages(present), [present]);

  // mapear índice de clique (considerando buracos ausentes)
  const indicesMap = useMemo(() => {
    const map = [];
    present.forEach((item, idx) => map.push(idx));
    return map;
  }, [present]);

  // Helpers para obter índice no array lbImages a partir da posição “visual”
  const getIdx = useCallback(
    (visualPos) => {
      // visualPos é a posição em imgs [0..3]; precisamos encontrar a sua posição dentro de 'present'
      const original = imgs[visualPos];
      const idx = present.findIndex((p) => p === original);
      return idx < 0 ? 0 : idx;
    },
    [imgs, present]
  );

  const handleClick = (visualPos) => {
    if (!onOpenLightbox || lbImages.length === 0) return;
    onOpenLightbox(lbImages, getIdx(visualPos));
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
        <div className={'block-images'}>
          <div className='md-image'>
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
          <div className='group-images'>
            <div className='img'>
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
            <div className='img'>
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
  const lbImages = useMemo(() => toLbImages([img ? { image: img, title } : null]), [img, title]);

  return (
    <aside className={reverse ? 'block-solution-section reverse' : 'block-solution-section'}>
      <div className='block-side'>
        <h2 className='tekup-section-title pt-0 pb-0 mb-4 text-dark'>{safeText(title)}</h2>
        <p className='col-lg-8 mt-0 pt-0'>{safeText(description)}</p>
      </div>
      <div className={reverse ? "reverse images-area" : 'images-area'}>
        <div className='col large-image'>
          {img ? (
            <img
              src={withHost(img)}
              alt={safeText(title)}
              role="button"
              style={{ width: "100%", cursor: "zoom-in" }}
              onClick={() => onOpenLightbox && onOpenLightbox(lbImages, 0)}
            />
          ) : null}
        </div>
      </div>
    </aside>
  );
}


function KitsSection({ kits = [], productMap = {}, onOpenLightbox }) {
  // só mantém kits que realmente tenham produtos
  const kitsWithProducts = kits
    .map((kit) => ({
      ...kit,
      products: (kit.productIds || [])
        .map((pid) => productMap[pid])
        .filter(Boolean),
    }))
    .filter((kit) => kit.products.length > 0);

  // se não houver nenhum kit com produtos, não exibe nada
  if (!kitsWithProducts.length) return null;

  return (
    <div
      className="product-kit-area mt-4 bg-dark"
      style={{ borderRadius: 12, padding: "24px" }}
    >
      {kitsWithProducts.map((kit) => {
        const prods = kit.products;

        const gallery = toLbImages(
          prods.map((p) => {
            const thumb =
              Array.isArray(p.wl_images) && p.wl_images.length
                ? p.wl_images[0]
                : "";
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
                const thumb =
                  Array.isArray(p.wl_images) && p.wl_images.length
                    ? withHost(p.wl_images[0])
                    : "";
                const name = safeText(p.wl_name, "Produto");
                const id = p._id;

                return (
                  <article key={id} className="p-2">
                    <div
                      className="image"
                      style={{
                        background: "#111",
                        borderRadius: 8,
                        padding: 8,
                      }}
                    >
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
                          onClick={() =>
                            onOpenLightbox && onOpenLightbox(gallery, idx)
                          }
                        />
                      ) : (
                        <div
                          style={{
                            height: 180,
                            borderRadius: 8,
                            background: "#222",
                          }}
                        />
                      )}
                    </div>
                    <Link
                      href={`/single-shop?product=${id}`}
                      className="d-block mt-2"
                    >
                      <strong className="text-white" title={name}>
                        {name.length > 45 ? name.slice(0, 45) + "…" : name}
                      </strong>
                    </Link>
                    {p?.wl_category?.wl_name ? (
                      <small className="d-block text-silver">
                        {p.wl_category.wl_name}
                      </small>
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




const SolutionPage = () => {
  const solutionId = useSolutionId();

  const [loading, setLoading] = useState(true);
  const [solution, setSolution] = useState(null);
  const [products, setProducts] = useState([]);   // /solutions/:id/products
  const [kits, setKits] = useState([]);           // /solutions/:id/kits
  const [examples, setExamples] = useState([]);   // /solutions/:id/examples
  const [error, setError] = useState(null);

  // Estado do Lightbox
  const [lbOpen, setLbOpen] = useState(false);
  const [lbImages, setLbImages] = useState([]);
  const [lbIndex, setLbIndex] = useState(0);

  const openLightbox = useCallback((imagesArray, startAt = 0) => {
    const imgs = Array.isArray(imagesArray) ? imagesArray : [];
    if (!imgs.length) return;
    setLbImages(imgs);
    setLbIndex(Number.isFinite(startAt) ? startAt : 0);
    setLbOpen(true);
  }, []);

  const closeLightbox = useCallback(() => {
    setLbOpen(false);
    setLbImages([]);
    setLbIndex(0);
  }, []);

  // Mapa rápido por _id para cruzar kits -> produtos
  const productMap = useMemo(() => {
    const map = {};
    for (const p of products) {
      if (p && p._id) map[p._id] = p;
    }
    return map;
  }, [products]);

  // Particionar exemplos conforme os blocos pedidos
  const first4 = useMemo(() => examples.slice(0, 4), [examples]);
  const next2 = useMemo(() => examples.slice(4, 6), [examples]);
  const next6 = useMemo(() => examples.slice(6, 12), [examples]);

  useEffect(() => {
    let cancel = false;

    async function run() {
      if (!solutionId) return;
      setLoading(true);
      setError(null);
      try {
        // 1) Buscar lista de soluções e selecionar a correta (não há GET single no backend fornecido)
        const solListResp = await axios.get(`${BaseUrl}/api/solutions`, { withCredentials: true });
        const solList = (solListResp?.data?.data || []).reverse();

        const sol = solList.find(s => String(s._id) === String(solutionId));
        if (!sol) throw new Error("Solução não encontrada.");
        if (cancel) return;
        setSolution(sol);

        // 2) Produtos relacionados
        const prodResp = await axios.get(`${BaseUrl}/api/solutions/${solutionId}/products`, { withCredentials: true });
        if (cancel) return;
        setProducts(prodResp?.data?.data || []);

        // 3) Kits
        const kitsResp = await axios.get(`${BaseUrl}/api/solutions/${solutionId}/kits`, { withCredentials: true });
        if (cancel) return;
        setKits(kitsResp?.data?.data || []);

        // 4) Exemplos
        const exResp = await axios.get(`${BaseUrl}/api/solutions/${solutionId}/examples`, { withCredentials: true });
        if (cancel) return;
        setExamples(exResp?.data?.data || []);
      } catch (err) {
        console.error(err);
        setError(err?.response?.data?.error || err?.message || "Erro ao carregar dados.");
      } finally {
        if (!cancel) setLoading(false);
      }
    }

    run();
    return () => { cancel = true; };
  }, [solutionId]);

  // Galeria para a grelha next6
  const next6Gallery = useMemo(() => toLbImages(next6), [next6]);

  return (
    <div className="solutions-page">
      <HeaderFour />
      <br />

      <section className="section pb-0 mb-0 tekup-section-padding">
        <div className="container">
          {loading && (
            <div className="py-5">
              <h4>A carregar solução…</h4>
              <p>Por favor aguarda uns instantes.</p>
            </div>
          )}

          {!loading && error && (
            <div className="py-5">
              <h4>Ocorreu um problema</h4>
              <p className="text-danger">{safeText(error)}</p>
            </div>
          )}

          {!loading && !error && solution && (
            <>
              {/* 1) Cabeçalho + 4 exemplos (não repetem em baixo) */}
              <BlockSection
                title={solution.title}
                description={solution.description}
                imgs={[
                  first4[0],
                  first4[1],
                  first4[2],
                  first4[3],
                ]}
                onOpenLightbox={openLightbox}
              />

              {/* 2) Kits associados + produtos (com cruzamento ao /products) */}
              <KitsSection kits={kits} productMap={productMap} onOpenLightbox={openLightbox} />
            </>
          )}
        </div>
      </section>

      {/* 3) Imagem principal da solução */}
      {!loading && !error && solution?.image ? (
        <>
          <br /><br />
          <div className="solution-image bg-white pt-0 mt-0 mb-0">
            <img
              src={withHost(solution.image)}
              alt={safeText(solution.title)}
              style={{ width: "100%", maxHeight: 560, objectFit: "cover", cursor: "zoom-in" }}
              role="button"
              onClick={() =>
                openLightbox(
                  toLbImages([{ image: solution.image, title: solution.title }]),
                  0
                )
              }
            />
          </div>
          <br /><br />
        </>
      ) : null}

      {/* 4) Dois exemplos seguintes */}
      {!loading && !error && next2.length > 0 && (
        <section className="section pb-0 mb-0 pt-0 tekup-section-padding">
          <div className="container">
            {next2.map((ex, idx) => (
              <BlockItem
                key={ex._id || idx}
                reverse={idx % 2 === 0} // alterna para ficar dinâmico
                title={safeText(ex.title, solution?.title || "Exemplo")}
                description={safeText(ex.description, solution?.description || "")}
                img={ex.image}
                onOpenLightbox={openLightbox}
              />
            ))}
          </div>
        </section>
      )}

      {/* 5) Até 6 exemplos restantes (grid) */}
      {!loading && !error && next6.length > 0 && (
        <>
          <br /><br />
          <section className="mt-4 bg-black ">
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
                  <div className="row single-portofolio-area">
                    {next6.map((ex, index) => {
                      const img = withHost(ex?.image);
                      const title = safeText(ex?.title, "Exemplo");
                      if (!img) return null;
                      return (
                        <article key={ex._id || index} className="col-sm-6 col-md-4 col-lg-3 mb-4">
                          <img
                            src={img}
                            alt={title}
                            style={{ width: "100%", height: 180, borderRadius: 8, objectFit: "cover", cursor: "zoom-in" }}
                            role="button"
                            onClick={() => openLightbox(next6Gallery, index)}
                          />
                          <strong className="text-silver d-block mt-2" title={title}>
                            {title.length > 60 ? title.slice(0, 60) + "…" : title}
                          </strong>
                        </article>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          </section>
        </>
      )}

      <CtaThreeSection />
      <FooterFour />

      {/* Lightbox global */}
      {lbOpen && (
        <Lightbox
          images={lbImages}
          startIndex={lbIndex}
          onClose={closeLightbox}
        />
      )}
    </div>
  );
};

export default SolutionPage;
