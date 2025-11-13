"use client"

import FooterOneSection from "~/components/Section/Common/FooterOne/FooterOneSection";
import HeaderTwo from "~/components/Section/Common/Header/HeaderTwo";
import PageHeader from "~/components/Section/Common/PageHeader";
import SingleBlogSection from "~/components/Section/SingleBlog/SingleBlogSection";

const SingleBlogPage = () => {
    return (
        <div>
            <HeaderTwo className="tekup-header-top bg-light1 "/>
            <PageHeader title="Technology support allows erie non-profit to serve"/>
            <SingleBlogSection/>
            <FooterOneSection className="tekup-footer-section dark-bg"/>
        </div>
    );
};

export default SingleBlogPage;