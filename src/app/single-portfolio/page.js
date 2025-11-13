import axios from "axios";

import FooterFour from "~/components/Section/Common/FooterFour";
import HeaderFour from "~/components/Section/Common/Header/HeaderFour";
import PageHeader from "~/components/Section/Common/PageHeader";
import SinglePortfolioSection from "~/components/Section/Portfolio/SinglePortfolio/SinglePortfolioSection";

// URL base da API (ajusta como preferires)
const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ||
  (process.env.NODE_ENV === "production"
    ? "https://waveledserver.vercel.app"
    : "http://localhost:4000");

async function getCase(id) {
  if (!id) return { error: "Falta o parâmetro ?project=<id>." };

  try {
    // ⚠️ Ajusta o endpoint conforme a tua API real
    // Exemplo: /cases/:id
    const response = await axios.get(`${API_BASE_URL}/cases/${id}`, {
      // Se quiseres garantir que não há cache em proxies intermédios:
      headers: {
        "Cache-Control": "no-cache",
      },
    });

    const data = response.data;
    return { data };
  } catch (error) {
    console.error("Erro a buscar caso:", error?.message || error);

    if (axios.isAxiosError(error)) {
      const status = error.response?.status;

      if (status === 404) {
        return { error: "Caso de sucesso não encontrado." };
      }

      if (status) {
        return { error: `Falha ao carregar (HTTP ${status}).` };
      }

      return {
        error: "Erro de rede ao contactar o servidor de Casos de Sucesso.",
      };
    }

    return {
      error: "Ocorreu um erro inesperado ao carregar o caso.",
    };
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


