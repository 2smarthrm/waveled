import React from 'react';
import CtaSection from '~/components/Section/Common/Cta/CtaSection';
import FooterOneSection from '~/components/Section/Common/FooterOne/FooterOneSection';
import HeaderTwo from '~/components/Section/Common/Header/HeaderTwo';
import PageHeader from '~/components/Section/Common/PageHeader';
import SingleTeamSection from '~/components/Section/SingleTeam/SingleTeamSection';

const page = () => {
    return (
        <div>
            <HeaderTwo className="tekup-header-top bg-light1 "/>
            <PageHeader title="Team Single"/>
            <SingleTeamSection/>
            <CtaSection/>
            <FooterOneSection className="tekup-footer-section dark-bg"/>
        </div>
    );
};

export default page;