"use client";

import React, { useEffect, useMemo, useState, useCallback } from "react";
import axios from "axios";
import Lightbox from "react-awesome-lightbox";
import "react-awesome-lightbox/build/style.css";

// Base para API e imagens
const isBrowser = typeof window !== "undefined";
const protocol = isBrowser && window.location.protocol === "https:" ? "https" : "http";
const API_BASE = protocol === "https"  ?  'https://waveledserver1.vercel.app' : "http://localhost:4000";

// Prefixa host se a URL for relativa
const withHost = (u) => {
  if (!u) return "";
  if (/^https?:\/\//i.test(u)) return u;
  return `${API_BASE}${u.startsWith("/") ? "" : "/"}${u}`;
};

// Texto seguro
const safe = (s, fb = "") => (typeof s === "string" && s.trim() ? s.trim() : fb);

// Divide um array em grupos de 3
const chunk3 = (arr) => {
  const chunks = [];
  for (let i = 0; i < arr.length; i += 3) chunks.push(arr.slice(i, i + 3));
  return chunks;
};

function CategoryGridGalery({ categoryId = null, productId = null, productCode = null }) {
  const effectiveProductId = productId || productCode || null;

  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState(null);

  // Lightbox
  const [lbIndex, setLbIndex] = useState(-1);
  const isOpen = lbIndex >= 0;

  const fetchExamples = useCallback(async () => {
    try {
      setLoading(true);
      setErr(null);

      const params = {};
      if (categoryId) params.categoryId = categoryId;
      if (effectiveProductId) params.productId = effectiveProductId;

      const r = await axios.get(`${API_BASE}/api/examples`, { params });
      const list = Array.isArray(r.data?.data) ? r.data.data : [];

      const normalized = list
        .map((it) => ({
          _id: String(it._id || ""),
          title: safe(it.title, "Sem título"),
          description: safe(it.description, ""),
          image: withHost(it.image),
        }))
        .filter((x) => !!x.image);

      setItems(normalized);
    } catch (e) {
      setErr(e?.response?.data?.error || e?.message || "Falha ao carregar exemplos");
    } finally {
      setLoading(false);
    }
  }, [categoryId, effectiveProductId]);

  useEffect(() => {
    fetchExamples();
  }, [fetchExamples]);

  // Imagens para o lightbox (na mesma ordem de "items")
  const lightboxImages = useMemo(
    () =>
      items.map((it) => ({
        url: it.image,
        title: it.title + (it.description ? ` — ${it.description}` : ""),
      })),
    [items]
  );

  // Índices por layout fixo
  const idxLarge = 0;
  const idxDoubleA = 1;
  const idxDoubleB = 2;
  const idxVertical = 3;

  // Restantes imagens depois das 4 primeiras (large + double(2) + vertical)
  const rest = items.slice(4);

  // Máximo de 3 grupos "tripple-box" => no máximo 9 imagens extra
  const tripleChunks = useMemo(() => chunk3(rest).slice(0, 1), [rest]);

  return (
    <aside>
      {/* Estados simples */}
      {loading && <div>A carregar…</div>}
      {err && !loading && <div>⚠️ {err}</div>}
      {!loading && !err && !items.length && <div></div>}

      {!!items.length && (
        <div className="gallery-wrapper">
          {/* large-box (idx 0) */}
          {items[idxLarge] && (
            <div
              className="large-box box-img"
              onClick={() => setLbIndex(idxLarge)}
              style={{ cursor: "zoom-in" }}
            >
              <div className="image">
                <img src={items[idxLarge].image} alt={items[idxLarge].title} />
              </div>
              <div className="over-box">
                <h5>{items[idxLarge].title}</h5>
                {items[idxLarge].description && <small className="d-none">{items[idxLarge].description}</small>}
              </div>
            </div>
          )}

          {/* double-box (idx 1 e 2) */}
          {(items[idxDoubleA] || items[idxDoubleB]) && (
            <div className="double-box">
              {items[idxDoubleA] && (
                <div
                  className="box sm-box box-img"
                  onClick={() => setLbIndex(idxDoubleA)}
                  style={{ cursor: "zoom-in" }}
                >
                  <div className="image">
                    <img src={items[idxDoubleA].image} alt={items[idxDoubleA].title} />
                  </div>
                  <div className="over-box">
                    <h5>{items[idxDoubleA].title}</h5>
                    {items[idxDoubleA].description && <small className="d-none">{items[idxDoubleA].description}</small>}
                  </div>
                </div>
              )}
              {items[idxDoubleB] && (
                <div
                  className="box sm-box box-img"
                  onClick={() => setLbIndex(idxDoubleB)}
                  style={{ cursor: "zoom-in" }}
                >
                  <div className="image">
                    <img src={items[idxDoubleB].image} alt={items[idxDoubleB].title} />
                  </div>
                  <div className="over-box">
                    <h5>{items[idxDoubleB].title}</h5>
                    {items[idxDoubleB].description && <small className="d-none">{items[idxDoubleB].description}</small>}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* vertical-box (idx 3) */}
          {items[idxVertical] && (
            <div className="vertical-box">
              <div
                className="box-img"
                onClick={() => setLbIndex(idxVertical)}
                style={{ cursor: "zoom-in" }}
              >
                <div className="image">
                  <img src={items[idxVertical].image} alt={items[idxVertical].title} />
                </div>
                <div className="over-box">
                  <h5>{items[idxVertical].title}</h5>
                  {items[idxVertical].description && <small className="d-none">{items[idxVertical].description}</small>}
                </div>
              </div>
            </div>
          )}

          {/* tripple-box (até 3 grupos) */}
          {tripleChunks.map((chunk, cIdx) => (
            <div className="tripple-box" key={`tripple-${cIdx}`}>
              {chunk.map((it, i) => {
                // índice REAL no array items: 4 + deslocamento do grupo + posição no grupo
                const realIndex = 4 + cIdx * 3 + i;
                return (
                  <div
                    className="box-img"
                    key={it._id || `${cIdx}-${i}`}
                    onClick={() => setLbIndex(realIndex)}
                    style={{ cursor: "zoom-in" }}
                  >
                    <div className="image">
                      <img src={it.image} alt={it.title} />
                    </div>
                    <div className="over-box">
                      <h5>{it.title}</h5>
                      {it.description && <small className="d-none">{it.description}</small>}
                    </div>
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      )}

      {/* Lightbox */}
      {isOpen && (
        <Lightbox
          images={items.map((it) => ({
            url: it.image,
            title: it.title + (it.description ? ` — ${it.description}` : ""),
          }))}
          startIndex={lbIndex}
          onClose={() => setLbIndex(-1)}
        />
      )}
    </aside>
  );
}

export default CategoryGridGalery;
