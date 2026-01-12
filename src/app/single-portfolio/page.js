 import axios from "axios";
import { headers } from "next/headers";

import FooterFour from "~/components/Section/Common/FooterFour";
import HeaderFour from "~/components/Section/Common/Header/HeaderFour";
import PageHeader from "~/components/Section/Common/PageHeader";
import SinglePortfolioSection from "~/components/Section/Portfolio/SinglePortfolio/SinglePortfolioSection";

function getApiBaseUrl() {
  const protocol = headers().get("x-forwarded-proto") || "https";

  // Aqui tens a tua regra:
  // Se estivermos em HTTP → usar localhost:4000
  // Se estivermos em HTTPS → usar servidor vercel
  if (protocol === "http") {
    return "http://localhost:4000";
  }

  return "https://waveledserver.vercel.app";
}

async function getCase(id) {
  if (!id) return { error: "Falta o parâmetro ?project=<id>." };

  const API_BASE_URL = getApiBaseUrl();

  try {
    // Ajusta o endpoint conforme a tua API
    const response = await axios.get(`${API_BASE_URL}/api/success-cases/${id}`, {
      headers: {
        "Cache-Control": "no-cache",
      },
    });

    return { data: response.data };
  } catch (error) {
    console.error("Erro ao buscar caso:", error.message);

    if (axios.isAxiosError(error)) {
      const status = error.response?.status;

      if (status === 404) return { error: "Caso de sucesso não encontrado." };
      if (status) return { error: `Falha ao carregar (HTTP ${status}).` };

      return { error: "Erro de rede ao contactar o servidor." };
    }

    return { error: "Erro interno inesperado." };
  }
}

export default async function SinglePortfolioPage({ searchParams }) {
  const id = searchParams?.project;
  const { data, error } = await getCase(id);

  if (error) {
    return (
      <div>
        <HeaderFour className="tekup-header-top bg-light1 " />
        <div className="container" style={{ padding: "3rem 0" }}>
          <br />
          <br />
          <h2>Casos de Sucesso</h2>
          <p style={{ color: "crimson" }}>{error}</p>
        </div>
        <FooterFour />
      </div>
    );
  }

  return (
    <div>
      <HeaderFour className="tekup-header-top bg-light1 " />
      <br />
      <SinglePortfolioSection item={data} />
      <FooterFour />
    </div>
  );
}
