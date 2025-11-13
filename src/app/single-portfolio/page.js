import FooterFour from "~/components/Section/Common/FooterFour";
import HeaderFour from "~/components/Section/Common/Header/HeaderFour";
import PageHeader from "~/components/Section/Common/PageHeader";
import SinglePortfolioSection from "~/components/Section/Portfolio/SinglePortfolio/SinglePortfolioSection";



async function getCase(id) {
  if (!id) return { error: "Falta o parâmetro ?project=<id>." };

  const url = `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000"}/api/success-cases/${id}`;

  const res = await fetch(url, { cache: "no-store" });

  if (!res.ok) {
    if (res.status === 404) return { error: "Caso de sucesso não encontrado." };
    return { error: `Falha ao carregar (HTTP ${res.status}).` };
  }

  const data = await res.json();
  return { data };
}

export default async function SinglePortfolioPage({ searchParams }) {
  const id = searchParams?.project;
  const { data, error } = await getCase(id);

  if (error) {
    return (
      <div>
        <HeaderFour className="tekup-header-top bg-light1 " />
        <div className="container" style={{ padding: "3rem 0" }}>
          <br /><br />
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
  )
}






