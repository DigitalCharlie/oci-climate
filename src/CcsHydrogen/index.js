import './styles.scss'
import React, { useEffect, useState } from 'react'


const ExLink = ({href, children}) => {
  return <a href={href} target="_blank" rel="noopener noreferrer">{children}</a>
}

export default function CcsHydrogen(props) {
    useEffect(() => {
        const scriptId = 'flourish-embed-script';
        if (!document.getElementById(scriptId)) {
            const script = document.createElement('script');
            script.id = scriptId;
            script.src = 'https://public.flourish.studio/resources/embed.js';
            script.async = true;
            document.body.appendChild(script);
        }
    }, []);
    return(
        <div style={{ marginTop: props.headerHeight }} className="CcsHydrogen">
            <h1>Subsidies for CCS and fossil hydrogen</h1>
            <p>
                Carbon capture and storage (CCS) is often presented as a solution for reducing carbon dioxide (CO₂) emissions. Governments have introduced subsidies, tax incentives, grants, and other public finance measures to support CCS. Governments worldwide have pledged up to USD 244 billion<sup>1</sup> in public finance for CCS and hydrogen fossil projects. We have tracked $79 billion in public funding pledged to CCS and fossil hydrogen projects between 1984 and 2025. Other forms of public finance, such as tax credits, have also been introduced to support this technology. For example, <ExLink href="https://oilchange.org/blogs/the-45q-tax-credit-for-carbon-capture-storage-costs-and-transparency-issues/">the U.S. government’s 45Q tax credit</ExLink> is worth up to $100 billion. 
            </p>
            <p>
                However, CCS does not enable the energy transition. <ExLink href="https://doi.org/10.1038/s41558-024-02104-0">Research shows that 88 percent of projects started before 2018 failed</ExLink>, and leading think tank <ExLink href="https://brandcentral.dnv.com/original/gallery/10651/files/original/78ea6dd7-2c6d-48db-bced-036e616a7b22.pdf">DNV has found that failure rates have only increased in recent years</ExLink>. In 2009, <ExLink href="https://www.iisd.org/articles/deep-dive/carbon-capture-not-net-zero-solution">the International Energy Agency (IEA) target was to capture 300 million tonnes per annum (Mtpa) by 2020</ExLink>, but <ExLink href="https://www.iea.org/reports/global-energy-review-2025/co2-emissions">in 2025 the total capture capacity of all operating projects worldwide was only 61 Mtpa, 20 percent of the goal and less than 0.1 percent of total CO2 emissions worldwide</ExLink>.
            </p>
            <p>
                Hydrogen has also been presented as a potential tool to address industrial CO2 emissions. We have tracked $5.3 billion in subsidies for fossil hydrogen projects. However, <ExLink href="https://www.cleanegroup.org/wp-content/uploads/Blue-and-Green-Hydrogen-Production-Harms.pdf">fossil-based hydrogen relies on fossil gas for its production and can require 25 percent more gas to produce the same energy value in hydrogen form</ExLink>. This adds emissions from the gas supply chain, and the carbon captured during hydrogen production does not compensate for the emissions already generated.
            </p>
            <p>
                Despite its failures, public expenditure on CCS has increased substantially, reaching announcements of up to $32 billion in 2024. The top five country funders are the United Kingdom ($31 billion), the United States ($15 billion), the European Union ($7.4 billion), Norway ($6.1 billion), and Japan ($5.2 billion).
            </p>
            <div className="flourish-embed flourish-chart" data-src="visualisation/30528736">
            <script src="https://public.flourish.studio/resources/embed.js"></script><noscript><img src="https://public.flourish.studio/visualisation/30528736/thumbnail" style={{width:"100%"}} alt="chart visualization" /></noscript></div>
            <p>
                Governments have prioritized investments in projects associated with the fossil fuel industry. According to our database, in 2024, 79 percent of operating carbon-capture capacity globally sends captured CO₂ to Enhanced Oil Recovery (EOR). EOR injects CO2 into depleted oil wells to increase oil production. This means that public money is spent to prolong oil production rather than accelerate the transition away from fossil fuels. Today, taxpayers in the United States and Canada finance oil companies by subsidizing at least $3.5 billion in commercial EOR-CCS projects. 
            </p>
            <p>
                Among commercial projects (excluding research or experimental projects), $13.2 billion in subsidies have been allocated to projects capturing CO₂ from gas-fired power plants, $4.1 billion to cement production, $3.9 billion to biomass power generation, $3.4 billion to hydrogen production, and $2.6 billion to coal-fired power generation. All of these sectors, except biomass power generation, are linked to the fossil fuel industry. For example, fossil-based hydrogen production uses fossil gas as a feedstock, while coal is often used as a fuel in cement production. Gas is also used as a fuel to generate the extremely high temperatures required to transform raw materials into cement clinker. 
            </p>
            <div className="flourish-embed flourish-chart" data-src="visualisation/30528989">
            <script src="https://public.flourish.studio/resources/embed.js"></script><noscript><img src="https://public.flourish.studio/visualisation/30528736/thumbnail" style={{width:"100%"}} alt="chart visualization" /></noscript></div>
            <p>
                We have tracked $79 billion in subsidies for CCS and fossil hydrogen projects between 1984 and 2025. Of this amount, $64 billion has been allocated to commercial projects, including $36 billion for commercial capture plants. The remaining amount is pledged to storage, transportation, and other parts of the supply chain. The 15 largest pledges to these commercial plants account for $26 billion. Of these 15 projects, nine are located in the United States, two in Canada, and one each in Denmark, Norway, the United Kingdom, and Sweden. 
            </p>
            <div className="flourish-embed flourish-chart" data-src="visualisation/30529054">
            <script src="https://public.flourish.studio/resources/embed.js"></script><noscript><img src="https://public.flourish.studio/visualisation/30528736/thumbnail" style={{width:"100%"}} alt="chart visualization" /></noscript></div>
            <p>
                In conclusion, we found that governments are investing in technologies that do not promote the energy transition. From 1984 to 2025, governments pledged $79 billion in subsidies for CCS and fossil hydrogen projects. The main funders are the United Kingdom, the United States, the European Union, Norway, and Japan. The sectors with the largest funding are gas-fired power plants, cement, biomass power generation, hydrogen production, and coal-fired power plants. All of these sectors, except biomass power generation, are linked to the fossil fuel industry. Likewise, we found that 79 percent of the CO₂ captured at commercially operating plants is injected into depleted oil wells. Thus, rather than promoting the energy transition, governments worldwide have pledged public funds to technologies that reinforce the fossil fuel industry.
            </p>
            <div className="footnote">
                <div><p>1.</p></div>
                <div>
                    <p>
                        This amount covers different forms of public finance, such as tax credits, grants, loans, and other forms of public finance support. In the case of tax credits, our figures are based on government institutions’ estimates of maximum potential spending. For example, <ExLink href="https://oilchange.org/blogs/the-45q-tax-credit-for-carbon-capture-storage-costs-and-transparency-issues/">the U.S. 45Q tax credit for captured CO2 could cost the U.S. treasury up to $100 billion</ExLink> according to some estimates. Due to a lack of transparency, we have not been able to determine the amount actually spent through tax credits.
                    </p>
                    <p>
                        Our figures for grant funding are based on funds pledged by government institutions and do not represent money actually spent. Due to the financing structures associated with these projects, the amount of funding ultimately disbursed may, in some cases, be lower than the amount initially pledged. The figures presented in this database therefore represent the maximum amount of public funding that governments have pledged for each project. 
                    </p>
                    <p>
                        The United States represents a notable case for CCS and hydrogen project funding. Since January 2025, the federal government has announced the cancellation of subsidies for several projects. However, updated official information on the status of these funding commitments remains limited. Therefore, it is not possible to determine with certainty which projects received public funding from 2023 onwards. The value of these uncertain commitments represents less than 10 percent of the total subsidies tracked in the database.
                    </p>
                </div>
            </div>
        </div>
    )
}