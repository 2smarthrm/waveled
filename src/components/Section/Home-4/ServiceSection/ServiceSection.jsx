"use client";
import axios from "axios";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

const isBrowser = typeof window !== "undefined";
const protocol = isBrowser && window.location.protocol === "https:" ? "https" : "http";
const API_BASE = protocol === "https" ? "https://waveledserver1.vercel.app" : "http://localhost:4000";

const isAbsoluteUrl = (u) => typeof u === "string" && /^https?:\/\//i.test(u);
const withHost = (u) => (u ? (isAbsoluteUrl(u) ? u : `${API_BASE}${u.startsWith("/") ? "" : "/"}${u}`) : "");

const ServiceSection = () => { 
  const [homeSpecials, setHomeSpecials] = useState([]);
  const [loading, setLoading] = useState(true);
 
  useEffect(() => {
    let alive = true;

    (async () => {
      try {
        setLoading(true);
        const { data } = await axios.get(`${API_BASE}/api/cms/home-specials`, {
          withCredentials: true,
          headers: { Accept: "application/json" },
        });

        const list = Array.isArray(data?.data) ? data.data : [];
 
        const mapped = list
          .map((it) => ({
            slot: Number(it?.wl_slot || 0),
            name: String(it?.wl_title || "").trim(),
            desc: String(it?.wl_description || "").trim(),
            image: withHost(it?.wl_image),
            productId: it?.wl_product?._id || it?.wl_product || "",
          }))
          .filter((x) => x.slot >= 1 && x.slot <= 4 && x.image)
          .sort((a, b) => a.slot - b.slot);

        if (alive) setHomeSpecials(mapped);
      } catch (e) {
        console.error("Erro ao carregar home-specials:", e);
        if (alive) setHomeSpecials([]);
      } finally {
        if (alive) setLoading(false);
      }
    })();

    return () => {
      alive = false;
    };
  }, []);
 
  const CardData = useMemo(() => {
    return homeSpecials.map((x) => ({
      name: x.name || "Solução especial",
      image: x.image,
      productId: x.productId,
      desc: x.desc,
    }));
  }, [homeSpecials]);

  const hasData = CardData.length > 0;

  return (
    <div className={"section large-features-section tekup-section-padding2 pt-4"}>
      <br />
      <br />
      <div className="container-fluid">
        <div className="tekup-section-title center">
          <h2>Soluções imersivas adaptadas a todos os tipos de negócio</h2>
        </div>

        <div className="row">
          {loading ? ( 
            Array.from({ length: 4 }).map((_, idx) => (
              <article className="ims-card" key={`sk-${idx}`} aria-hidden="true">
                <div className="ims-skel" />
                <div className="overflow">
                  <h3 className="ims-skel-line" />
                  <button className="tekup-default-btn" disabled style={{ opacity: 0.6 }}>
                    Solicitar projeto
                  </button>
                </div>
              </article>
            ))
          ) : !hasData ? (
            <div className="w-100 d-flex justify-content-center">
              <div className="text-muted fw-semibold" style={{ padding: "18px 10px" }}>
                Sem soluções especiais configuradas.
              </div>
            </div>
          ) : (
            CardData.map((item, index) => { 
              const href =  "/contact-us";

              return (
                <article className="ims-card" key={index}>
                  <img src={item?.image} alt={item?.name} />
                  <div className="overflow">
                    <h3>{item?.name}</h3>
                    <Link href={href}>
                      <button className="tekup-default-btn">Solicitar projeto</button>
                    </Link>
                  </div>
                </article>
              );
            })
          )}
        </div>
      </div>
 
      <style jsx>{`
        .ims-skel {
          width: 100%;
          height: 260px;
          border-radius: 14px;
          background: #e9ecef;
          position: relative;
          overflow: hidden;
        }
        .ims-skel::after {
          content: "";
          position: absolute;
          inset: 0;
          transform: translateX(-100%);
          background: linear-gradient(
            90deg,
            rgba(255, 255, 255, 0) 0%,
            rgba(255, 255, 255, 0.7) 50%,
            rgba(255, 255, 255, 0) 100%
          );
          animation: shimmer 1.1s infinite;
        }
        .ims-skel-line {
          width: 80%;
          height: 18px;
          border-radius: 10px;
          background: #e9ecef;
          margin: 0;
        }
        @keyframes shimmer {
          100% {
            transform: translateX(100%);
          }
        }
      `}</style>
    </div>
  );
};

export default ServiceSection;
