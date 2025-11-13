"use client";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Slider from "react-slick";
import Link from "next/link";
import axios from "axios";
import { useEffect, useMemo, useState } from "react";
import RecentProjectsCardFour from "~/components/Ui/Cards/RecentProjectsCardFour";

const isBrowser = typeof window !== "undefined";
const protocol = isBrowser && window.location.protocol === "https:" ? "https" : "http";
const BaseUrl = protocol === "https"  ?  'https://waveledserver.vercel.app' : "http://localhost:4000";

const RecentProjectsSection = () => {
  const [mounted, setMounted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [items, setItems] = useState([]);
  const [error, setError] = useState("");

 
  useEffect(() => {
    setMounted(true);
  }, []);

  const settings = useMemo(
    () => ({
      arrows: false,
      dots: true,
      infinite: true,
      speed: 500,
      slidesToShow: 3.8,
      slidesToScroll: 1,
      autoplay: true,
      autoplaySpeed: 3000,
      adaptiveHeight: true,
      responsive: [
        {
          breakpoint: 1498,
          settings: {
            slidesToShow: 4.8,
            slidesToScroll: 4,
          },
        },
        {
          breakpoint: 1308,
          settings: {
            slidesToShow: 3,
            slidesToScroll: 3,
          },
        },
        {
          breakpoint: 991,
          settings: {
            slidesToShow: 1.4,
            slidesToScroll: 1,
          },
        },
        {
          breakpoint: 576,
          settings: {
            slidesToShow: 1.1,
            slidesToScroll: 1,
          },
        },
      ],
    }),
    []
  );

  async function loadData() {
    try {
      setLoading(true);
      setError("");
      const res = await axios.get(`${BaseUrl}/api/success-cases`, {
        withCredentials: true,
      });
      const data = Array.isArray(res?.data?.data) ? res.data.data : [];
      setItems(data);
    } catch (err) {
      setError("Não foi possível carregar os projetos agora.");
      setItems([]); 
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadData();
  }, []);
 
  const sliderKey = useMemo(
    () => `recent-projects-${mounted ? "m" : "s"}-${items.length}`,
    [mounted, items.length]
  );

  if (!mounted) { 
    return null;
  }
 
  if (!loading && items.length === 0) {
    return null;
  }

  return (
    <section
      className={
        items.length > 0
          ? "section tekup-section-padding mt-0 bg-light1 overflow-hidden"
          : "section tekup-section-padding mt-0 bg-light1 overflow-hidden"
      }
    > 
      <style jsx global>{`
        /* Garante que o track alinhe slides lado a lado */
        .slick-track {
          display: flex !important;
        }
        /* Permite que os slides cresçam pela altura do conteúdo do card */
        .slick-slide {
          height: auto;
        }
        /* O wrapper direto dentro do slide preenche a altura */
        .slick-slide > div {
          height: 100%;
        }
        /* Opcional: dot spacing e padding dos slides */
        .slick-slide {
          padding: 6px;
        }
        .slick-dots {
          bottom: -28px;
        }
      `}</style>
 
      <div className="container">
        <div className="tekup-section-title center">
          <h2>Nossos Últimos Projetos</h2>
          {error ? (
            <p className="text-danger mt-2" style={{ fontSize: 14 }}>
              {error}
            </p>
          ) : null}
        </div>
      </div>
 
      {loading && items.length >= 4 ? (
        <div className="container">
          <div className="py-5 text-center">A carregar…</div>
        </div>
      ) : (
        <div className="container-fluid px-0">
          <Slider key={sliderKey} {...settings}>
            {items.map((item, idx) => ( 
              <div key={item?.id || idx}>
                <RecentProjectsCardFour item={item} />
              </div>
            ))}
          </Slider>
        </div>
      )}
    </section>
  );
};

export default RecentProjectsSection;
