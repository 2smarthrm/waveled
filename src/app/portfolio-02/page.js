import FooterFour from "~/components/Section/Common/FooterFour";
import HeaderTwo from "~/components/Section/Common/Header/HeaderTwo";
import PageHeader from "~/components/Section/Common/PageHeader";
import MasonrySection from "~/components/Section/Portfolio/Masonry/MasonrySection";


const PortfolioTwoPage = () => {
    return (
        <div>
            <HeaderTwo className="tekup-header-top bg-light1 "/>
            <PageHeader title="Portfolio Masonry"/>
            <MasonrySection/>
            <FooterFour />
        </div>
    );
};

export default PortfolioTwoPage;