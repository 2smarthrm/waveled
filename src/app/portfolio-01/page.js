import FooterFour from "~/components/Section/Common/FooterFour";
import HeaderTwo from "~/components/Section/Common/Header/HeaderTwo";
import PageHeader from "~/components/Section/Common/PageHeader";
import PortfolioGridSection from "~/components/Section/Portfolio/Grid/PortfolioGridSection";


const PortfolioGridPage = () => {
    return (
        <>
        <HeaderTwo className="tekup-header-top bg-light1 "/>
          <PageHeader title="Portfolio Grid"/>  
          <PortfolioGridSection/>
          <FooterFour />
        </>
    );
};

export default PortfolioGridPage;