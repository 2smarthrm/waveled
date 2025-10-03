import FooterFour from "~/components/Section/Common/FooterFour";
import HeaderFour from "~/components/Section/Common/Header/HeaderFour";
import PageHeader from "~/components/Section/Common/PageHeader";
import SinglePortfolioSection from "~/components/Section/Portfolio/SinglePortfolio/SinglePortfolioSection";


const SinglePortfolioPage = () => {
    return (
        <>
          <HeaderFour className="tekup-header-top bg-light1 "/> 
           <br/><br/>
          <SinglePortfolioSection/>
          <FooterFour />
        </>
    );
};

export default SinglePortfolioPage ;