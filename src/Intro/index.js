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
      }, 50)
      setTimeout(() => {
        setMapVisible(true)
      }, 1300 / 2)
      setTimeout(() => {
        setTopVisible(true);
        setMapFilled(true);
      }, 2300 / 2)
      setTimeout(() => {
        setButtonsVisible(true);
      }, 2300 / 2)
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
          <p  className={classNames({visible: topVisible})}>G20 governments and the major multilateral development banks (MDBs) provide over USD $100 billion each year in international finance for energy projects. This public money has an outsized influence on what kinds of energy projects get built. Unfortunately, for every dollar going to the clean energy we need to build a just and liveable future, almost two times more is still flowing to fossil fuels.
          </p>
          <p  className={classNames({visible: topVisible})}>The Public Finance for Energy Database is the only resource tracking these flows across more than one institution. At 15,000 transactions and counting, totalling over $2 trillion, our data is free and publicly available  to make sure G20 governments and MDBs can be held accountable to their promises to build a liveable and just future.
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
          <h3>Why track international public finance? </h3>
          <p>
            The Public Finance for Energy Database is a project of <a href="https://priceofoil.org/" target="_blank">Oil Change International</a>. We compile transaction-level data on finance from G20 export credit agencies and development finance institutions as well as the major multilateral development banks. Our data shows these government institutions are providing at least <strong>$55 billion a year</strong> on average in influential international public finance for oil, gas, and coal. For 2019-2021 this was <strong>almost double</strong> their support for clean energy. <strong>This public money is prolonging the fossil fuel era and making it harder for clean energy projects to get built.</strong>
          </p>
          <p>
          This fossil fuel finance runs directly counter to our global climate goals. <strong>The International Energy Agency is clear that, in order to maintain a 50% chance to limit global warming to 1.5°C, we need to stop investing in new fossil fuel supply now, and rapidly increase public finance for affordable clean energy.</strong> 
          </p>
          <div>
          <h3 className="chart-title">
            G20 and MDB public finance for fossil fuels, clean, and other energy, 2013-2021, in USD Billions
          </h3>
          <img className="intro-graph" src={publicFinance} alt="Chart of public finance between 2013 and 2021" />
          <p className='intro-caption'>Despite governments’ long lasting commitments to end fossil fuel subsidies and align financial flows with the Paris climate goals, since 2013 public finance flows to fossil fuel projects have only slightly decreased and support for clean energy has not increased to the extent needed.</p>
          </div>
          <p>
            Public finance has an outsized impact on energy systems and often acts as a subsidy. This is because these loans, guarantees, equity, and grants have come with below-market rates, technical capacity, and decreased financial risks that make projects much more likely to go forward. We need the $55 billion a year in public finance for fossil fuels — and more — to be shifted to support a just transition to clean energy instead.
          </p>
          <p>
            To get on the pathway to a globally just energy transition in line with 1.5°C, we need wealthy G20 governments to do much more as well, including rapidly phasing out their fossil fuel production at home, ensuring their public finance institutions uphold comprehensive human rights due diligence across for clean energy projects, and providing their fair share of climate finance, loss and damage finance, and debt cancellation. 
          </p>

          <h3 className="chart-title">Top 15 G20 countries for international public finance for fossil fuels, annual average 2019-2021, USD billions</h3>

          <img className="intro-graph" src={g20} alt="Chart of top 15 G20 public finance for fossil fuels" />
          <p className='intro-caption'>Japan, Canada and Korea are the largest current providers of international public finance for fossil fuels out of the G20 countries, bankrolling almost $9 billion a year on average 2019-2021.</p>

          <h3 className="chart-title">
            Multilateral Development Bank finance for fossil fuels, annual average 2019-2021, USD billions
          </h3>
          <img className="intro-graph" src={mdb} alt="Chart of comparison of fossil fuel funding by multilateral development banks" />
          <p className="intro-caption">Among MDBs, the World Bank Group provides the most financing for fossil fuel projects each year.
</p>

          <p>
            Despite these trends,  public pressure for climate action means a breakthrough is on the horizon. As of 2021, most G20 countries have policies to end their coal finance and at the 2021 global climate conference in Glasgow, 34 countries and 5 institutions signed a joint commitment to end their international support for oil and gas by the end of 2022 and instead fully prioritize their public finance for clean energy. We are tracking their progress on these promises <Link to="/tracker">here</Link>. We need to ensure countries get on track to keep their promise without loopholes, and ensure other countries follow-suit.
          </p>

          <h3>
            A trusted tool for media, academics, governments and campaigners
          </h3>
          <p>
            Cited by <ExLink href="https://about.bnef.com/blog/new-report-finds-g-20-member-countries-support-fossil-fuels-at-levels-untenable-to-achieve-paris-agreement-goals/">BloombergNEF</ExLink>, <ExLink href="https://www.reuters.com/business/cop/19-countries-plan-cop26-deal-end-financing-fossil-fuels-abroad-sources-2021-11-03/">Reuters</ExLink>, <ExLink href="https://www.energymonitor.ai/finance/sustainable-finance/how-wealthy-governments-continue-to-subsidise-fossil-fuels-in-developing-nations">Energy Monitor</ExLink>, <ExLink href="https://www.nature.com/articles/d41586-021-02847-2">Nature</ExLink>, <ExLink href="https://www.cambridge.org/core/books/governing-the-climate-energy-nexus/87F5A10BD95C94B1245DF2F9CA5D00B5">Cambridge University</ExLink>, <ExLink href="https://foe.org/news/report-g20-governments-bankroll-188billion-in-fossil-fuels/">Friends of the Earth US</ExLink>, <ExLink href="https://www.iisd.org/publications/g20-scorecard">International Institute for Sustainable Development</ExLink>, <ExLink href="https://www.oecd-ilibrary.org/energy/oecd-companion-to-the-inventory-of-support-measures-for-fossil-fuels-2018_9789264286061-en">OECD</ExLink>, <ExLink href="https://forourclimate.org/en/fueling-the-climate-crisis">Solutions for Our Climate</ExLink>, <ExLink href="https://www.banktrack.org/news/at_least_132_billion_in_finance_for_fossil_fuels_is_locking_africa_out_of_a_just_transition_shows_new_report">Banktrack</ExLink>, <ExLink href="https://bigshiftglobal.org/">Big Shift Global</ExLink> and many others.
          </p>

          <h3>
            <strong>Explore the Site</strong>
          </h3>
          <p>
            <strong><Link to="/data">Data Dashboard</Link></strong>: An interactive panel showing the flows of public finance going to fossil fuel, clean, and other energy projects from G20 trade and development finance institutions and the major MDBs.
          </p>
          <p ref={finalBoxRef}>
            <strong><Link to="/tracker">Policy Tracker</Link></strong>: A live report card on G20 country and MDB implementation of their promises to end public finance for fossil fuels.
          </p>
          <p>
            <strong><Link to="/about">About</Link></strong>: Details on our how we collect our data, key definitions, and data limitations from incomplete government reporting. 
          </p>
          <p>
            <strong><Link to="resources">Resources</Link></strong>: Research and news on international public finance from Oil Change International and our partners.
          </p>
          </section>
        </div>
        <Footer introFooter opacity={finalBoxInView ? 1 : 0 } />
      </Fragment> : null}

    </div>
  )
}

