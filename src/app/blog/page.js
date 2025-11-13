import BlogSection from "~/components/Section/Blog/BlogSection";
import FooterOneSection from "~/components/Section/Common/FooterOne/FooterOneSection";
import HeaderTwo from "~/components/Section/Common/Header/HeaderTwo";
import PageHeader from "~/components/Section/Common/PageHeader";

const BlogPage = () => {
    return (
        <>
            <HeaderTwo className="tekup-header-top bg-light1 "/>
           <PageHeader title="Blog"/>
           <BlogSection/> 
           <FooterOneSection className="tekup-footer-section dark-bg"/>
        </>
    );
};

export default BlogPage;