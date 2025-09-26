import FooterFour from "~/components/Section/Common/FooterFour";
import HeaderTwo from "~/components/Section/Common/Header/HeaderTwo";
import PageHeader from "~/components/Section/Common/PageHeader";
import SinglePortfolioSection from "~/components/Section/Portfolio/SinglePortfolio/SinglePortfolioSection";


const SinglePortfolioPage = () => {
    return (
        <>
          <HeaderTwo className="tekup-header-top bg-light1 "/>
          <PageHeader title="Cyber Security Analysis"/> 
          <SinglePortfolioSection/>
          <FooterFour />
        </>
    );
};

export default SinglePortfolioPage ;