"use client"; 
import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";

import HeaderFour from "~/components/Section/Common/Header/HeaderFour";
import FooterFour from "~/components/Section/Common/FooterFour";

const isBrowser = typeof window !== "undefined";
const protocol = isBrowser && window.location.protocol === "https:" ? "https" : "http";

const API_BASE =
  protocol === "https" ? "https://waveledserver.vercel.app" : "http://localhost:4000";

const IMG_HOST =
  protocol === "https" ? "https://waveledserver.vercel.app" : "http://localhost:4000";

function normalizeImg(src) {
  if (!src) return "";
  const s = String(src);
  if (s.startsWith("http://") || s.startsWith("https://")) return s;
  return `${IMG_HOST}${s.startsWith("/") ? "" : "/"}${s}`;
}

async function fetchJson(url) {
  const r = await fetch(url, {
    method: "GET",
    credentials: "include",
    headers: { Accept: "application/json" },
    cache: "no-store",
  });
  const data = await r.json().catch(() => ({}));
  if (!r.ok) throw new Error(data?.error || "Falha ao carregar");
  return data;
}

const ALL = "all";

export default function ServicePage() {
  // Data
  const [cats, setCats] = useState([]); 
  const [allProducts, setAllProducts] = useState([]);  

  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  // Filters
  const [categoryId, setCategoryId] = useState(ALL);
  const [subcategoryId, setSubcategoryId] = useState(ALL);

  // Pagination
  const [page, setPage] = useState(1);
  const PAGE_SIZE = 12;

  // Load all once
  useEffect(() => {
    let alive = true;

    (async () => {
      setLoading(true);
      setErr("");
      try {
        const [catRes, prodRes] = await Promise.all([
          fetchJson(`${API_BASE}/api/categories-with-subcategories?_ts=${Date.now()}`),
          fetchJson(`${API_BASE}/api/products?_ts=${Date.now()}`),
        ]);

        const catList = Array.isArray(catRes?.data) ? catRes.data : [];
        const mappedCats = catList
          .map((c) => ({
            id: String(c?._id),
            label: String(c?.wl_name || "Categoria"),
            wl_order: typeof c?.wl_order === "number" ? c.wl_order : 0,
            subcategories: Array.isArray(c?.subcategories) ? c.subcategories : [],
          }))
          .sort((a, b) => (a.wl_order || 0) - (b.wl_order || 0));

        const productsList = Array.isArray(prodRes?.data) ? prodRes.data : [];

        if (!alive) return;
        setCats(mappedCats);
        setAllProducts(productsList);
      } catch (e) {
        if (!alive) return;
        setErr(e?.message || "Erro ao carregar produtos.");
        setCats([]);
        setAllProducts([]);
      } finally {
        if (alive) setLoading(false);
      }
    })();

    return () => {
      alive = false;
    };
  }, []);

  const activeCategory = useMemo(() => {
    if (categoryId === ALL) return null;
    return cats.find((c) => c.id === categoryId) || null;
  }, [cats, categoryId]);

  const subOptions = useMemo(() => {
    const subs = activeCategory?.subcategories || [];
    return subs
      .slice()
      .sort((a, b) =>
        String(a?.wl_name || "").localeCompare(String(b?.wl_name || ""), "pt")
      )
      .map((s) => ({ id: String(s?._id), label: String(s?.wl_name || "Subcategoria") }));
  }, [activeCategory]);

  
  useEffect(() => {
    setSubcategoryId(ALL);
    setPage(1);
  }, [categoryId]);

 
  const filteredProducts = useMemo(() => {
    const list = Array.isArray(allProducts) ? allProducts : [];
    if (categoryId === ALL) return list;

    const catFiltered = list.filter((p) => {
      const cat = p?.wl_category?._id || p?.wl_category;
      const catsArr = Array.isArray(p?.wl_categories) ? p.wl_categories : [];
      const inMain = String(cat || "") === String(categoryId);
      const inArray = catsArr.some((x) => String(x?._id || x) === String(categoryId));
      return inMain || inArray;
    });

    if (subcategoryId === ALL) return catFiltered; 
    return catFiltered.filter((p) => {
      const sub =
        p?.wl_subcategory?._id ||
        p?.wl_subcategory ||
        p?.wl_subcategories?.[0]?._id ||
        p?.wl_subcategories?.[0] ||
        p?.wl_sub_category?._id ||
        p?.wl_sub_category ||
        "";
      const subsArr = Array.isArray(p?.wl_subcategories) ? p.wl_subcategories : [];
      const inMain = String(sub || "") === String(subcategoryId);
      const inArray = subsArr.some((x) => String(x?._id || x) === String(subcategoryId));
      return inMain || inArray;
    });
  }, [allProducts, categoryId, subcategoryId]);

 
  const totalPages = useMemo(() => {
    const total = filteredProducts.length;
    return Math.max(1, Math.ceil(total / PAGE_SIZE));
  }, [filteredProducts.length]);

  useEffect(() => {
    if (page > totalPages) setPage(totalPages);
  }, [totalPages, page]);

  const pageItems = useMemo(() => {
    const start = (page - 1) * PAGE_SIZE;
    return filteredProducts.slice(start, start + PAGE_SIZE);
  }, [filteredProducts, page]);

  function goToPage(p) {
    const next = Math.min(Math.max(1, p), totalPages);
    setPage(next);
    if (isBrowser) window.scrollTo({ top: 0, behavior: "smooth" });
  }

  
  const pageNumbers = useMemo(() => {
    const max = 3;  
    if (totalPages <= max) return Array.from({ length: totalPages }, (_, i) => i + 1);
    const res = [1];
    if (page === 1) return [1, 2, 3];
    if (page === totalPages) return [totalPages - 2, totalPages - 1, totalPages];
    return [page - 1, page, page + 1].filter((n) => n >= 1 && n <= totalPages);
  }, [page, totalPages]);

  return (
    <div>
      <HeaderFour />
      <title>Produtos</title>

      <br />
      <br />
      <br />
      <br />
      <br />
      <br /> 

      <div className="product-area">
        <div className="container">

        <div className="tekup-section-title">
          <h2 className="text-dark">Produtos</h2>
        </div>
          {/* Filters center */}
          <div className="wl-filters">
            <div className="wl-filter-card">
              <div className="wl-filter-row">
                <div className="wl-field">
                  <label className="wl-label">Categoria</label>
                  <select
                    className="wl-select"
                    value={categoryId}
                    onChange={(e) => setCategoryId(e.target.value)}
                  >
                    <option value={ALL}>Ver todos os produtos</option>
                    {cats.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="wl-field">
                  <label className="wl-label">Subcategoria</label>
                  <select
                    className="wl-select"
                    value={subcategoryId}
                    onChange={(e) => {
                      setSubcategoryId(e.target.value);
                      setPage(1);
                    }}
                    disabled={categoryId === ALL || !subOptions.length}
                  >
                    <option value={ALL}>
                      {categoryId === ALL ? "Selecione uma categoria" : "Ver todas"}
                    </option>
                    {subOptions.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="wl-filter-meta">
                {loading ? (
                  <span className="wl-muted">A carregar…</span>
                ) : err ? (
                  <span className="wl-error">{err}</span>
                ) : (
                  <span className="wl-muted">
                    {filteredProducts.length} produto(s) encontrados
                  </span>
                )}
              </div>
            </div>
          </div>
          <br/><br/>

          {/* Grid */}
          <div className="row">
            {loading ? (
              Array.from({ length: 12 }).map((_, i) => (
                <div key={i} className="col-xl-3 col-lg-4 col-md-6">
                  <div className="tekup-shop-wrap wl-skel">
                    <div className="tekup-shop-thumb">
                      <div className="wl-skel-img" />
                    </div>
                    <div className="tekup-shop-data">
                      <div className="wl-skel-line" />
                      <div className="wl-skel-line sm" />
                    </div>
                  </div>
                </div>
              ))
            ) : err ? (
              <div className="col-12">
                <div style={{ padding: 16 }}>
                  <p className="wl-error" style={{ margin: 0 }}>
                    {err}
                  </p>
                </div>
              </div>
            ) : pageItems.length ? (
              pageItems.map((p) => {
                const id = p?._id;
                const name = p?.wl_name || "Produto";
                const img = normalizeImg(p?.wl_images?.[0] || "");
                const href = `/single-shop?product=${encodeURIComponent(id || "")}`;

                return (
                  <div key={id} className="col-xl-3 col-lg-4 col-md-6">
                    <div className="tekup-shop-wrap">
                      <div className="tekup-shop-thumb">
                        <Link href={href}> 
                           <div className="image-prd">
                            <img src={img || "/images/shop/shop01.png"} alt={name} />
                           </div>
                        </Link>

                        <Link className="tekup-shop-btn" href={href}>
                          Ver detalhes
                        </Link>
                      </div>

                      <div className="tekup-shop-data">
                        <Link href={href}>
                          <h5>{name}</h5>
                        </Link>
                      </div>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="col-12">
                <div style={{ padding: 16 }}>
                  <p style={{ margin: 0 }}>Sem produtos para os filtros selecionados.</p>
                </div>
              </div>
            )}
          </div>



          {/* Pagination */}
          {!loading && !err && totalPages > 1 ? (
            <div className="tekup-navigation">
              <nav className="navigation pagination center" aria-label="Produtos">
                <div className="nav-links">
                  <button
                    type="button"
                    className="next page-numbers"
                    onClick={() => goToPage(page - 1)}
                    disabled={page === 1}
                    aria-label="Anterior"
                  >
                    <i className="ri-arrow-left-s-line" />
                  </button>

                  {pageNumbers.map((n) => (
                    <button
                      key={n}
                      type="button"
                      className={`page-numbers ${n === page ? "current" : ""}`}
                      aria-current={n === page ? "page" : undefined}
                      onClick={() => goToPage(n)}
                    >
                      {n}
                    </button>
                  ))}

                  <button
                    type="button"
                    className="next page-numbers"
                    onClick={() => goToPage(page + 1)}
                    disabled={page === totalPages}
                    aria-label="Seguinte"
                  >
                    <i className="ri-arrow-right-s-line" />
                  </button>
                </div>
              </nav>
            </div>
          ) : null}
        </div>
      </div>

      <br />
      <br />
      <br />

      <FooterFour />

      <style jsx global>{`
        /* center filters */
        .wl-filters {
          display: flex;
          justify-content: center;
          margin-bottom: 22px;
        }

        .tekup-section-title{
           margin-bottom:0px !important;
        }

        .wl-filter-card {
          width:100%;
          background: #fff;
          border: 1px solid rgba(17, 24, 39, 0.08);
          border-radius: 18px;
          padding: 16px 16px 12px; 
        }

        .wl-filter-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 14px;
          align-items: end;
        }

        .wl-field {
          display: grid;
          gap: 8px;
        }

        .wl-label {
          font-weight: 800;
          font-size: 14px;
          color: #111827;
          margin: 0;
        }

        .wl-select {
          height: 46px;
          border-radius: 12px;
          border: 1px solid rgba(17, 24, 39, 0.16);
          padding: 0 12px;
          background: #fff;
          color: #111827;
          font-weight: 700;
          outline: none;
        }

        .wl-select:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .wl-select:focus {
          border-color: #0019ff;
          box-shadow: 0 0 0 3px rgba(0, 25, 255, 0.12);
        }

        .wl-filter-meta {
          margin-top: 10px;
          display: flex;
          justify-content: space-between;
          gap: 10px;
        }

        .wl-muted {
          color: rgba(17, 24, 39, 0.7);
          font-weight: 700;
          font-size: 14px;
        }

        .wl-error {
          color: #dc2626;
          font-weight: 800;
          font-size: 14px;
        }

        /* skeleton */
        .wl-skel .wl-skel-img {
          width: 100%;
          aspect-ratio: 1 / 1;
          background: rgba(17, 24, 39, 0.06);
          border-radius: 12px;
          animation: wlPulse 1.2s ease-in-out infinite;
        }

        .wl-skel .wl-skel-line {
          height: 14px;
          border-radius: 999px;
          background: rgba(17, 24, 39, 0.06);
          margin-top: 10px;
          animation: wlPulse 1.2s ease-in-out infinite;
        }
        .wl-skel .wl-skel-line.sm {
          width: 60%;
        }

        @keyframes wlPulse {
          0% {
            opacity: 0.55;
          }
          50% {
            opacity: 1;
          }
          100% {
            opacity: 0.55;
          }
        }

        /* make tekup cards consistent if theme has different img sizes */
        .tekup-shop-thumb img {
          width: 100%;
          height: auto;
          display: block;
          object-fit: contain;
          background: #fff;
          border-radius: 12px;
        }

        /* pagination buttons as buttons (keep tekup styles) */
        .tekup-navigation .nav-links button.page-numbers,
        .tekup-navigation .nav-links button.next.page-numbers {
          border: 0;
          background: transparent;
        }

        .tekup-navigation .nav-links button:disabled {
          opacity: 0.35;
          cursor: not-allowed;
        }

        @media (max-width: 767.98px) {
          .wl-filter-row {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
}
