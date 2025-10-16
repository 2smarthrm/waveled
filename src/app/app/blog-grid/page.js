import BlogGridSection from "~/components/Section/BlogGrid/BlogGridSection";
import FooterOneSection from "~/components/Section/Common/FooterOne/FooterOneSection";
import HeaderTwo from "~/components/Section/Common/Header/HeaderTwo";
import PageHeader from "~/components/Section/Common/PageHeader";


const BlogGridPage = () => {
    return (
        <div>
            <HeaderTwo className="tekup-header-top bg-light1 "/>
            <PageHeader title="Blog Grid"/>
            <BlogGridSection/>
            <FooterOneSection className="tekup-footer-section dark-bg"/>
        </div>
    );
};

export default BlogGridPage;