import FooterFour from "~/components/Section/Common/FooterFour";
import HeaderFour from "~/components/Section/Common/Header/HeaderFour";
import PageHeader from "~/components/Section/Common/PageHeader";
import SingleShopSection from "~/components/Section/SingleShop/SingleShopSection";

const SinglePage = () => {
  return (
    <>
      <HeaderFour className="tekup-header-top bg-light1 " /> 
              <title>produtos</title>
      <br/> <br/> <br/>
      <SingleShopSection />
      <FooterFour className="tekup-footer-section dark-bg" />
    </>
  );
}; 
 
export default SinglePage;
 