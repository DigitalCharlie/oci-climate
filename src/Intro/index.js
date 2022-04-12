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
          <h1 className={classNames({visible: topVisible})}>Tracking international public finance for energy</h1>
          <p  className={classNames({visible: topVisible})}>G20 governments provide more than USD $100 billion each year in international finance for energy projects through their trade and development institutions. This money has an outsized influence on what kinds of energy projects get built. Unfortunately, for every dollar going to the clean energy we need to build a just and liveable future, 2.5x more is still flowing to fossil fuels. 
          </p>
          <p  className={classNames({visible: topVisible})}>Public Finance for Energy Database aims to track these flows and make it easier to hold G20 governments accountable for these influential investments. It is the only publicly available database tracking international public finance for energy across multiple countries.
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
            Public Finance for Energy Database compiles transaction-level data on finance from G20 export credit agencies and development finance institutions as well as the large multilateral development banks they hold major governing stakes in. Our data shows these government institutions are providing at least <strong>$63 billion a year</strong> on average in influential international public finance for oil, gas, and coal. For 2018-2020 this was <strong>2.5x</strong> their support for clean energy. This public money is prolonging the fossil fuel era and making it harder for clean energy projects to get built. 
          </p>
          <p>
            This fossil fuel finance runs directly counter to our global climate goals. The International Energy Agency is clear that we need to end all finance for new fossil fuel supply and rapidly transition to clean energy to stay within 1.5°C of warming and avoid the worst climate impacts. Despite governments’ commitments to end fossil fuel subsidies and align financial flows with the Paris climate goals, since 2013 public finance flows to fossil fuel projects have only slightly decreased and support for clean energy remains small.
          </p>

          <h3 className="chart-title">
            G20 and MDB public finance for fossil fuels, clean, and other energy, 2013-2020, in USD Billions
          </h3>
          <img src={publicFinance} alt="Chart of public finance between 2013 and 2020" />

          <p>
            Public finance also has an outsized impact on energy systems and often acts as a subsidy. This is because these loans, guarantees, equity, and grants have come with below-market rates, technical capacity, and decreased financial risks that make projects much more likely to go forward. We need the $63 billion a year in public finance going to fossil fuels — and more — to support a just transition to clean energy instead. To get on the pathway to a globally just energy transition in line with 1.5°C, we need wealthy G20 governments to do much more as well, including rapidly phasing out their fossil fuel production at home, ensuring their public finance institutions uphold comprehensive human rights due diligence across for clean energy projects, and providing their fair share of debt cancellation and climate finance. 
          </p>

          <p>
            Public Finance for Energy Database includes over 10,000 transactions from 2013 to 2020 and has been used by researchers for publications at <ExLink href="https://about.bnef.com/blog/new-report-finds-g-20-member-countries-support-fossil-fuels-at-levels-untenable-to-achieve-paris-agreement-goals/">BloombergNEF</ExLink>, <ExLink href="https://www.reuters.com/business/cop/19-countries-plan-cop26-deal-end-financing-fossil-fuels-abroad-sources-2021-11-03/">Reuters</ExLink>, <ExLink href="https://www.energymonitor.ai/finance/sustainable-finance/how-wealthy-governments-continue-to-subsidise-fossil-fuels-in-developing-nations">Energy Monitor</ExLink>, <ExLink href="https://www.nature.com/articles/d41586-021-02847-2">Nature</ExLink>, <ExLink href="https://www.cambridge.org/core/books/governing-the-climate-energy-nexus/87F5A10BD95C94B1245DF2F9CA5D00B5">Cambridge University</ExLink>, <ExLink href="https://foe.org/news/report-g20-governments-bankroll-188billion-in-fossil-fuels/">Friends of the Earth US</ExLink>, <ExLink href="https://www.iisd.org/publications/g20-scorecard">International Institute for Sustainable Development</ExLink>, and many others.
          </p>
          <p>
            This data shows that Canada, Japan, Korea, and China are the largest current providers of international public finance for fossil fuels out of the G20 countries, bankrolling more than $10 billion a year on average 2018-2020. 
          </p>

          <h3 className="chart-title">Top 15 G20 countries for international public finance for fossil fuels, annual average 2018-2020, USD billions</h3>

          <img src={g20} alt="Chart of top 15 G20 public finance for fossil fuels" />

          <p>
            At the multilateral development bank level, we find the World Bank Group is providing the most financing for fossil fuel projects each year. 
          </p>

          <h3 className="chart-title">
            Multilateral Development Bank finance for fossil fuels, annual average 2018-2020, USD billions
          </h3>
          <img src={mdb} alt="Chart of comparison of fossil fuel funding by multilateral development banks" />

          <p>
            In the face of these troubling trends, public pressure for climate action means a breakthrough could be on the horizon. As of 2021, most G20 countries have policies to end their coal finance. And six G20 countries, along with 33 other countries and institutions, signed a joint commitment at COP26 to end their international support for oil and gas by the end of 2022 as well. Momentum is building, but these commitments must be implemented without loopholes and expanded to more countries rapidly for public finance to align with a livable future. 
          </p>

          <h3>
            <strong>Explore the Site</strong>
          </h3>
          <p>
            Our <Link to="/data">Data Dashboard</Link> shows the total flows of public finance going to fossil fuel, clean, and other energy projects from the major multilateral development banks as well as G20 countries’ trade and development finance institutions. You can toggle to adjust what countries, types of energy, and years are shown. 
          </p>
          <p ref={finalBoxRef}>
            Our <Link to="/tracker">Policy Tracker</Link> shows progress on the G20 country and MDBs implementation of these promises. 
          </p>
          <p>
            The <Link to="/about">About</Link> page has details on our how we collect our data, key definitions, and the poor government transparency that limits what we can report on. 
          </p>
          <p>
            Our <Link to="resources">Resources</Link> page provides the latest research and news on international public finance from Oil Change International and our partners. 
          </p>
          {/* <div>
              <h2 style={{ top: headerHeight}}>Why does international public finance for energy matter？</h2>

            <p>
                The International Energy Agency is clear we need to <strong>end all finance for new fossil fuel supply and rapidly transition to renewable energy</strong> and to stay within 1.5°C of warming and avoid the worst climate impacts.
              </p>
            </div>
            <p ref={fossilFuelBoxRef}>Despite this, G20 countries are still financing at least USD <strong className='large'>$63 billion a year</strong> for <span className='fossilFuel'>fossil fuel</span> <strong>projects</strong> through their export credit agencies, development finance institutions, and multilateral development banks. </p>
            <p ref={cleanBoxRef}>For 2018-2020 this was <strong className='large'>2.5x their support</strong> for <span className='clean'>renewable&nbsp;energy</span>.</p>
            <p>This money – provided as loans, guarantees, equity, and grants — has an outsized impact on energy systems. Public finance often comes with below-market rates, technical capacity, and decreased financial risks that make projects much more likely to go forward — something that is increasingly influential as the fossil fuel industry faces unprecedented global headwinds. We need this $63 billion a year in public finance for fossil fuels  —  and more — to support a just transition to renewable energy&nbsp;instead. </p>
          </section>
          <section  style={{ minHeight: contentHeight * 1.5}}>
            <div>
              <h2 style={{ top: headerHeight}}>How do we get public finance out for fossils?</h2>
              <p ref={cleanBoxRef2}>
                Momentum is building to finally make <strong className='large'>public finance fossil&nbsp;free</strong>.
              </p>
            </div>
            <p ref={cleanBoxRef3}>As of 2021, almost all G20 countries have policies to end their coal finance. And six G20 countries, along with 33 other countries and institutions, signed a joint commitment at COP26 to end their international support for oil and gas by 2022 as&nbsp;well.</p>
            <p ref={finalBoxRef}>We’re tracking G20 countries’ and MDBs’ implementation of these promises into policy <Link to='/tracker'>here</Link>. Or, visit our resources page <Link to='/resources'>here</Link> to learn more and help make sure governments <strong className='large'>#StopFundingFossils</strong>.  </p> */}
          </section>
        </div>
        {/* <svg style={{ top: headerHeight }} className={classNames('fuelTypes', { mobileLayout})} width={width} height={contentHeight}>

          {mobileLayout && showingBars ? <rect fill='#fff' opacity='0.9' width={width} height={expandedHeight + labelHeight + barPadding} y={contentHeight - expandedHeight - mobileSVGOffset - labelHeight - barPadding } /> : null}
          <animated.g style={{ opacity: fossilFuelOpacity}} transform={boxHeights.fossilFuelBoxHeight.interpolate(y => `translate(${width * barPositioning}, ${contentHeight - y - mobileSVGOffset - barPadding})`)}>
            <animated.rect
              height={boxHeights.fossilFuelBoxHeight}
              width={barWidth}
              fill={colors['Fossil Fuel']}
            />
            <text style={{ transform: showBarLabels ? 'translateY(-1.2em)' : 'translateY(0)'}} dy={ '-1em'}  fill={colors['Fossil Fuel']}>Fossil Fuel

            </text>
            <text dy='-1em' style={{ opacity: showBarLabels ? 1 : 0}} fill={colors['Fossil Fuel']}>$63 billion</text>
          </animated.g>
          <animated.g style={{ opacity: cleanOpacity }} transform={boxHeights.cleanBoxHeight.interpolate(y => `translate(${width * (1 - barPositioning) - barWidth}, ${contentHeight - y - mobileSVGOffset - barPadding})`)}>
            <animated.rect
              height={boxHeights.cleanBoxHeight}
              width={barWidth}
              fill={colors.Clean}
            />
            <text style={{ transform: showBarLabels ? 'translateY(-1.2em)' : 'translateY(0)'}} dy={ '-1em'} fill={colors.Clean}>Renewable Energy


            </text>
            <text dy={ '-1em'} fill={colors.Clean} style={{ opacity: showBarLabels ? 1 : 0}}> $26 billion</text>
          </animated.g>


        </svg> */}
        <Footer introFooter opacity={finalBoxInView ? 1 : 0 } />
      </Fragment> : null}

    </div>
  )
}

