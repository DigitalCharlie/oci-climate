import { useState, useEffect, useRef, Fragment } from 'react';
import './styles.scss'
import classNames from 'classnames';
import { Link } from 'react-router-dom';
import IntroMap from './IntroMap'
import useDataHook from '../hooks/useDataHook'
import useMapHook from '../hooks/useMapHook'
import { useInView } from 'react-intersection-observer';
import { useSpring, animated } from 'react-spring';
import { easeCubic } from 'd3-ease'
import { transition } from 'd3-transition';
import { interpolateNumber } from 'd3-interpolate';
import Footer from '../Footer/'
import publicFinance from '../images/public-finance-by-year.png'
import mdb from '../images/mdb-comparison.png'
import g20 from '../images/top-15-g20.png'

const colors = {
  'Fossil Fuel': '#F4A77E',
  'Clean':'#63CAD1'
}
const ExLink = ({href, children}) => {
  return <a href={href} target="_blank" rel="noopener noreferrer">{children}</a>
}
export default function Intro(props) {
  const { contentHeight, headerHeight } = props;
  const [introDismissed, setIntroDismissed] = useState(false);
  const [topVisible, setTopVisible] = useState(false);
  const [buttonsVisible, setButtonsVisible] = useState(false);
  const [mapFilled, setMapFilled] = useState(false);
  const [mapVisible, setMapVisible] = useState(false);
  const [restOfIntroVisible, setRestOfIntroVisible] = useState(false);
  const data = useDataHook()

  const introContainer = useRef()
  const collection = useMapHook()
  const [render, setRender ] = useState(false)
  const [introMapSize, setIntroMapSize] = useState(null)
  useEffect(() => {
      if (data.length && introMapSize && collection) {
      setTimeout(() => {
        setRender(true)
      }, 10)
      setTimeout(() => {
        setMapVisible(true)
      }, 200 / 2)
      setTimeout(() => {
        setTopVisible(true);
        setMapFilled(true);
      }, 200 / 2)
      setTimeout(() => {
        setButtonsVisible(true);
      }, 200 / 2)
    }
  }, [data, introMapSize, collection])

  useEffect(() => {
    let timeout = null
    if (introDismissed) {
      window.document.body.style.overflowY = 'auto';
      // window.document.body.scrollTo({ top: contentHeight, behavior: 'smooth'})
      transition()
        .duration(700)
        .ease(easeCubic)
        .tween('scroll',
          () => {
            var i = interpolateNumber(window.scrollY, contentHeight);
            return t => {
              window.document.body.scrollTo(0, i(t));
            }
          }
        )
        .on('end', () => {
          timeout = setTimeout(() => setRestOfIntroVisible(true), 0)
        })
    } else {
      window.document.body.style.overflowY = 'hidden';
    }
    return () => {
      window.document.body.style.overflowY = 'auto';
      clearTimeout(timeout)
    }
  }, [introDismissed, contentHeight])
  useEffect(() => {
    const resize = () => {
      if (introContainer.current) {
        setIntroMapSize([introContainer.current.offsetWidth, introContainer.current.offsetHeight])
      }
    }
    resize()
    window.addEventListener('resize', resize)
    return () => {
      window.removeEventListener('resize', resize)
    }
  },[])

  useEffect(() => {
    const scroll = () => {
      // console.log('scroll')
      if (!introDismissed && buttonsVisible) {
        setIntroDismissed(true)
        window.removeEventListener('wheel', scroll)
        window.removeEventListener('touchmove', scroll)
      }
    }
    window.addEventListener('wheel', scroll)
    window.addEventListener('touchmove', scroll)
    return () => {
      window.removeEventListener('wheel', scroll)
      window.removeEventListener('touchmove', scroll)
    }

  }, [introDismissed, buttonsVisible])
  const rootMargin = `0px 0px -${contentHeight / 6}px 0px`
  // const [fossilFuelBoxRef, fossilFuelBoxInView, fossilFuelBoxEntry] = useInView({ threshold: 1, rootMargin })
  // const [cleanBoxRef, cleanBoxInView, cleanBoxEntry] = useInView({ threshold: 1 })
  // const [cleanBoxRef2, cleanBoxInView2, cleanBoxEntry2] = useInView({ threshold: 1 })
  // const [cleanBoxRef3, cleanBoxInView3, cleanBoxEntry3] = useInView({ threshold: 1 })
  const [finalBoxRef, finalBoxInView] = useInView({ threshold: 1 })
  // console.log(fossilFuelBoxEntry)
  // let fossilFuelBoxHeight = 0
  // let cleanBoxHeight = 0
  const width = introMapSize ? introMapSize[0] : 0
  const mobileLayout = width && width < 600

  // let expandedHeight =  mobileLayout ? contentHeight * 0.3 : contentHeight * 0.8
  // let showingBars = false

  // let firstShown = false
  // let showBarLabels = true
  // if (introDismissed && (fossilFuelBoxInView || (fossilFuelBoxEntry && fossilFuelBoxEntry.boundingClientRect.top < 0))) {
  //   showingBars = true
  //   fossilFuelBoxHeight = expandedHeight
  //   // console.log('1')
  //   firstShown = true
  // }
  // // console.log(fossilFuelBoxInView, fossilFuelBoxEntry)
  // let secondShown = false
  // if (introDismissed && firstShown && (cleanBoxInView || (cleanBoxEntry && cleanBoxEntry.boundingClientRect.top < 0))) {
  //   cleanBoxHeight = fossilFuelBoxHeight / 2.5
  //   // console.log('2')
  //   secondShown = true
  // }
  // let thirdShown = false
  // if (introDismissed && secondShown && (cleanBoxInView2 || (cleanBoxEntry2 && cleanBoxEntry2.boundingClientRect.top < 0))) {
  //   let temp = fossilFuelBoxHeight
  //   fossilFuelBoxHeight = cleanBoxHeight
  //   cleanBoxHeight = temp
  //   // console.log('3')
  //   thirdShown = true
  //   showBarLabels = false
  // }

  // let fourthShown = false
  // if (introDismissed && thirdShown && (cleanBoxInView3 || (cleanBoxEntry3 && cleanBoxEntry3.boundingClientRect.top < 0))) {
  //   fossilFuelBoxHeight = 0
  //   // console.log('4')
  //   fourthShown = true
  //   showBarLabels = false
  // }

  // if (introDismissed && thirdShown && finalBoxInView) {
  //   fossilFuelBoxHeight = expandedHeight
  //   cleanBoxHeight = fossilFuelBoxHeight / 2.5
  //   showBarLabels = true
  // }


  // const fossilFuelOpacity = fossilFuelBoxHeight ? 1 : 0
  // const cleanOpacity = cleanBoxHeight ? 1 : 0

  // const boxHeights = useSpring({ fossilFuelBoxHeight, cleanBoxHeight, config: { duration: 1000, easing: easeCubic }})
  // const barWidth = introMapSize ?  (mobileLayout ? introMapSize[0] * 0.3 : introMapSize[0] * 0.1) : 0

  let mobileSVGOffset = mobileLayout ? 60 : 0
  let barPadding = mobileLayout ? 6 : 0
  const labelHeight = 50

  const barPositioning = mobileLayout ? 0.15 : 0.1
  return (
    <div className="intro" ref={introContainer} style={{ top: headerHeight}}>
      {!width || !render ? <div className='loading'>Loading Finance Data...</div> : null}
      {width ? <IntroMap
        // showBars={showMapBars} // dont show bars on map
        collection={collection}
        data={data}
        width={width}
        height={contentHeight}
        filled={mapFilled}
        opacity={mapVisible ? 1 : 0}
      />
       : null}
       {render ? <Fragment>
        <div className="introText" style={{ top: mobileLayout ? contentHeight / 2.5 : contentHeight / 2}}>
          <h1 className={classNames({visible: topVisible})}>A <span className="blue">public</span> database for <span className="blue">public</span> finance </h1>
          <p  className={classNames({visible: topVisible})}>G20 governments and the major multilateral development banks (MDBs) provide over USD 141 billion each year in both domestic and international finance for energy projects. This public money has an outsized influence on what kinds of energy projects get built and, depending on government decisions, either continue to lock in more climate-wrecking fossil fuels or support a publicly led just energy transition. 
          </p>
          <p  className={classNames({visible: topVisible})}>This page hosts the Public Finance for Energy Database, a project of <ExLink href="https://oilchange.org/">Oil Change International</ExLink>. It is a free and publicly available resource that tracks public finance for energy flows across multiple institutions. The database covers over 20,000 transactions totalling over $2 trillion and has been widely used by civil society and think tank partners as well as by the UN Environment Programme (UNEP), BloombergNEF, and academia. 
          </p>
          <div className={classNames('buttons', {visible: buttonsVisible})}>
            <button onClick={() => setIntroDismissed(true)}>Read More</button>
            <Link to='/data'>Explore the data</Link>
          </div>
        </div>
        <div className={classNames('buttons fixed introDismissed' , {visible: buttonsVisible, mobileLayout, finalBoxInView})}>
            <div className={classNames('scrollToContinue', {visible: !finalBoxInView})}>Scroll to continue reading</div>
          </div>

        <div className='restOfIntro' style={{ paddingBottom: contentHeight / 5, opacity: restOfIntroVisible ? 1 : 0}}>
          <section>
          <h2>Why track public finance? </h2>
          <p>
            Public finance has an outsized impact on energy systems, often functioning, in effect, as a subsidy for the energy industry. This is because these loans, guarantees, equity, and grants are provided at below-market rates, and supply technical capacity and decreased financial risk that make projects much more likely to go forward. 
          </p>
          <p>
            The science is clear: <ExLink href="https://oilchange.org/publications/skys-limit-data-update-shut-down-60-of-existing-fossil-fuel-extraction-to-keep-1-5c-in-reach/">Keeping the 1.5°C limit in reach requires ending fossil fuel expansion</ExLink> and rapidly <ExLink href="https://productiongap.org/">phasing out oil, gas, and coal production and use</ExLink>, while simultaneously enacting a just transition to 100% renewable energy systems. Doing so is <ExLink href="https://oilchange.org/publications/limits-to-private-finance-approach/">already much more affordable than continued fossil fuel dependence</ExLink>.
          </p>
          <p>
            Yet, governments continue to prop up fossil fuel production and use with public finance, including support for carbon capture and storage (CCS) and fossil hydrogen. This jeopardizes the 1.5°C limit and goes against both the <ExLink href="https://unfccc.int/news/cop28-agreement-signals-beginning-of-the-end-of-the-fossil-fuel-era">COP28 commitment to transition away from fossil fuels</ExLink> and the Paris Agreement commitment to align financial flows with climate goals (Article 2.1(c)).
          </p>
          <p>
            To get on a pathway to a globally just transition will require governments to take a much more active role in coordinating, regulating, and investing in this transition. This will involve both: 1) shifting all public finance and production subsidies away from fossil fuels, including CCS and fossil hydrogen, and 2) simultaneously scaling up fair public funding support for clean energy and a just transition that upholds comprehensive human rights due diligence. 
          </p>
          {/* <div>
          <h3 className="chart-title">
            G20 and MDB domestic and international public finance for fossil fuels, clean, and other energy, 2013-2024, in USD Billions
          </h3>
          <img className="intro-graph" src={publicFinance} alt="Chart of public finance between 2013 and 2024" />
          <p className='intro-caption'>Despite governments’ long lasting commitments to end fossil fuel subsidies and align financial flows with the Paris climate goals, since 2013 public finance flows to fossil fuel projects have not decreased rapidly enough and support for clean energy has not increased to the extent needed.</p>
          </div> */}
          <p>
            Wealthy Global North countries with the largest historic greenhouse gas emissions have a responsibility to move first and fastest in phasing out fossil fuels domestically and provide their fair share of public, grants-based climate finance to the Global South.
          </p>
          <p>
            The money is available: <ExLink href="https://oilchange.org/publications/we-can-pay-for-it/">A suite of measures can unlock $6.6 trillion per year in public finance</ExLink>. Alongside this, wealthy governments must pursue debt cancellation and must support, rather than block, Global South countries’ proposals to update international monetary, trade, tax, and debt policies, building a more just and equitable global financial system that is fit to deliver a globally just energy transition.
          </p>
          <p>
              The money is available through adopting <ExLink href="https://oilchange.org/publications/we-can-pay-for-it/">a suite of measures that can unlock USD 6.6 trillion per year in public finance</ExLink>. Alongside this, they must pursue debt cancellation and support, rather than block, Global South country proposals to update international monetary, trade, tax, and debt policies, building a more just and equitable global financial system that is fit to deliver a globally just energy transition.
          </p>
          <h2>What the data shows</h2>
          <p>
            Our database is compiled from different datasets tracking international public finance, national development banks (NDBs), and domestic finance for CCS and hydrogen. It includes two scopes of data:
          </p>
          <ul>
            <li>Energy transactions from G20 export credit agencies (ECAs), G20 development finance institutions (DFIs), G20 NDBs, and the major MDBs;</li>
            <li>The domestic transactions related to CCS and fossil hydrogen from all countries. These transactions are financial commitments pledged by governments rather than confirmed spending. Because (a) some projects are not yet operational, (b) some finance mechanisms depend on operational performance, and (c) some government data is not transparent, we cannot verify how much of the money pledged for CCS and fossil hydrogen has actually been spent. Therefore, our figures represent the maximum amount governments have committed to these projects during their operational lifetime.</li>
          </ul>
          <p>
            <strong>Looking at international public finance</strong>, our data shows that these government institutions and MDBs are providing at least $20.6 billion a year on average in international public finance for oil, gas, and coal. The top international fossil fuel financiers are Japan, the United States, and Italy. So far 40 signatories have signed on to the <ExLink href="https://cleanenergytransitionpartnership.org/who-we-are/">Clean Energy Transition Partnership (CETP)</ExLink>, agreeing to end their international support for oil and gas by the end of 2022 and instead fully prioritize their public finance for clean energy. <ExLink href="https://oilchange.org/publications/holding-course-missing-speed-protecting-progress-on-ending-fossil-fuel-finance-and-unlocking-clean-energy-support/">As of 2024, this has led to a drop in fossil fuel finance of between 71 and 78 percent below pre-CETP levels among CETP signatories.</ExLink> Signatory countries must keep their promise without loopholes, and ensure other countries follow suit.
          </p>
          <p>
            <strong>Looking at G20 domestic public finance</strong>, some NDBs are already strategically financing domestic clean energy, with eight G20 countries (Australia, Brazil, China, France, Germany, South Africa, Turkiye, and the United Kingdom) providing more clean energy finance than fossil fuel finance between 2022 and 2024. At the same time, many NDBs continue to be a vehicle for ongoing fossil fuel finance. In Indonesia, Mexico, Canada, the United States, South Korea, and Russia, fossil fuel finance made up at least 74 percent of total energy finance between 2022 and 2024. Between 2022 and 2024, these domestic public banks provided at least $28 billion in fossil fuel support. The top domestic fossil fuel financiers between 2022 and 2024 were Canada, China, and South Korea.
          </p>
          <p>
            <strong>Looking specifically at subsidies for CCS and fossil hydrogen</strong>, our database shows that national governments globally have pledged $79 billion in grants, tax credits, loans, and other support between 1984 and 2025 to projects related to CCS and fossil hydrogen, including research and development. On average, governments spend around $3 billion per year on these projects. Since 2020, subsidies for CCS and fossil hydrogen have increased substantially, reaching a peak to date of around $32 billion in 2024. The top funders are the United Kingdom ($31 billion), the United States ($15 billion), and the European Union ($7.4 billion). 
          </p>
          <h2>A trusted tool for media, academics, governments, and campaigners</h2>
          <p>
            Cited by <ExLink href="https://about.bnef.com/blog/new-report-finds-g-20-member-countries-support-fossil-fuels-at-levels-untenable-to-achieve-paris-agreement-goals/">BloombergNEF</ExLink>, <ExLink href="https://www.reuters.com/business/cop/19-countries-plan-cop26-deal-end-financing-fossil-fuels-abroad-sources-2021-11-03/">Reuters</ExLink>, <ExLink href="https://www.energymonitor.ai/finance/sustainable-finance/how-wealthy-governments-continue-to-subsidise-fossil-fuels-in-developing-nations">Energy Monitor</ExLink>, <ExLink href="https://www.nature.com/articles/d41586-021-02847-2">Nature</ExLink>, <ExLink href="https://link.springer.com/article/10.1007/s10584-025-03881-z">Climatic Change</ExLink>, <ExLink href="https://www.sciencedirect.com/science/article/pii/S0301421525002010#da0010">Energy Policy</ExLink>, <ExLink href="https://www.cambridge.org/core/books/governing-the-climate-energy-nexus/87F5A10BD95C94B1245DF2F9CA5D00B5">Cambridge University</ExLink>, <ExLink href="https://foe.org/news/report-g20-governments-bankroll-188billion-in-fossil-fuels/">Friends of the Earth US</ExLink>, <ExLink href="https://www.iisd.org/publications/g20-scorecard">International Institute for Sustainable Development</ExLink>, <ExLink href="https://www.oecd-ilibrary.org/energy/oecd-companion-to-the-inventory-of-support-measures-for-fossil-fuels-2018_9789264286061-en">OECD</ExLink>, <ExLink href="https://forourclimate.org/en/fueling-the-climate-crisis">Solutions for Our Climate</ExLink>, <ExLink href="https://www.banktrack.org/news/at_least_132_billion_in_finance_for_fossil_fuels_is_locking_africa_out_of_a_just_transition_shows_new_report">Banktrack</ExLink>, <ExLink href="https://bigshiftglobal.org/">Big Shift Global</ExLink> and many others.
          </p>

          <h2>
            <strong>Explore the Site</strong>
          </h2>
          <p>
            <strong><Link to="/data">Data Dashboard</Link></strong>: An interactive panel showing the flows of public finance going to fossil fuel, clean, and other energy projects from G20 trade institutions, G20 DFIs, G20 NDBs, and the major MDBs.
          </p>
          <p>
            <strong><Link to="/ccs-hydrogen">CCS and fossil hydrogen</Link></strong>: This database has been developed based on public funding pledged by national governments to domestic projects focused on CCS or the production of fossil-based hydrogen. The database records subsidies governments have publicly pledged for specific projects, including research and development, rather than announcements of funding targets.
          </p>
          <p ref={finalBoxRef}>
            <strong><Link to="/tracker">Policy Tracker</Link></strong>: A live report card on G20 countries’ and MDBs’ implementation of their promises to end international public finance for fossil fuels.
          </p>
          <p>
            <strong><Link to="/about">About</Link></strong>: Details on how we collect our data, key definitions, and data limitations.
          </p>
          <p>
            <strong><Link to="resources">Resources</Link></strong>: Research and news on international public finance from Oil Change International and our partners.
          </p>
          <p>
            <strong><ExLink href="https://act.oilchange.org/forms/oci-email-signup?source=energy-finance-database">Sign up for research updates</ExLink></strong>: Receive an email when we upload new data or publish major reports using the Public Finance for Energy Database.
          </p>
          </section>
        </div>
        <Footer introFooter opacity={finalBoxInView ? 1 : 0 } />
      </Fragment> : null}

    </div>
  )
}

