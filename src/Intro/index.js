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
const colors = {
  'Fossil Fuel': '#F4A77E',
  'Clean':'#63CAD1'
}
export default function Intro(props) {
  const { contentHeight, headerHeight } = props;
  const [introDismissed, setIntroDismissed] = useState(false);
  const [h1Visible, setH1Visible] = useState(false);
  const [p1Visible, setP1Visible] = useState(false);
  const [p2Visible, setP2Visible] = useState(false);
  const [buttonsVisible, setButtonsVisible] = useState(false);
  const [showMapBars, setShowMapBars] = useState(false);
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
        setH1Visible(true);
      }, 100)
      setTimeout(() => {
        setMapVisible(true)
      }, 1300 / 2)

      setTimeout(() => {
        setP1Visible(true);
      }, 2300 / 2)
      setTimeout(() => {
        setMapFilled(true);

      }, 2600 / 2)
      setTimeout(() => {
        setP2Visible(true);
        setShowMapBars(true);
      }, 6000 / 2)
      setTimeout(() => {
        setButtonsVisible(true);
      }, 8000 / 2)
    }
  }, [data, introMapSize, collection])

  useEffect(() => {
    let timeout = null
    if (introDismissed) {
      window.document.body.style.overflowY = 'auto';
      // window.document.body.scrollTo({ top: contentHeight, behavior: 'smooth'})
      transition()
        .duration(1000)
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
          timeout = setTimeout(() => setRestOfIntroVisible(true), 300)
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
  const [fossilFuelBoxRef, fossilFuelBoxInView, fossilFuelBoxEntry] = useInView({ threshold: 1, rootMargin })
  const [cleanBoxRef, cleanBoxInView, cleanBoxEntry] = useInView({ threshold: 1 })
  const [cleanBoxRef2, cleanBoxInView2, cleanBoxEntry2] = useInView({ threshold: 1 })
  const [cleanBoxRef3, cleanBoxInView3, cleanBoxEntry3] = useInView({ threshold: 1 })
  const [finalBoxRef, finalBoxInView] = useInView({ threshold: 1 })
  // console.log(fossilFuelBoxEntry)
  let fossilFuelBoxHeight = 0
  let cleanBoxHeight = 0
  const width = introMapSize ? introMapSize[0] : 0
  const mobileLayout = width && width < 600

  let expandedHeight =  mobileLayout ? contentHeight * 0.2 : contentHeight * 0.8
  let showingBars = false
  // console.log(fossilFuelBoxInView, fossilFuelBoxEntry && fossilFuelBoxEntry.boundingClientRect.top, fossilFuelBoxEntry)
  // console.log(fossilFuelBoxHeight, cleanBoxEntry && cleanBoxEntry.boundingClientRect.top)
  // console.log(cleanBoxInView2, cleanBoxEntry2 && cleanBoxEntry2.boundingClientRect.top)
  // console.log(cleanBoxInView3, cleanBoxEntry3 && cleanBoxEntry3.boundingClientRect.top)

  let firstShown = false
  let showBarLabels = true
  if (introDismissed && (fossilFuelBoxInView || (fossilFuelBoxEntry && fossilFuelBoxEntry.boundingClientRect.top < 0))) {
    showingBars = true
    fossilFuelBoxHeight = expandedHeight
    // console.log('1')
    firstShown = true
  }
  // console.log(fossilFuelBoxInView, fossilFuelBoxEntry)
  let secondShown = false
  if (introDismissed && firstShown && (cleanBoxInView || (cleanBoxEntry && cleanBoxEntry.boundingClientRect.top < 0))) {
    cleanBoxHeight = fossilFuelBoxHeight / 2.5
    // console.log('2')
    secondShown = true
  }
  let thirdShown = false
  if (introDismissed && secondShown && (cleanBoxInView2 || (cleanBoxEntry2 && cleanBoxEntry2.boundingClientRect.top < 0))) {
    let temp = fossilFuelBoxHeight
    fossilFuelBoxHeight = cleanBoxHeight
    cleanBoxHeight = temp
    // console.log('3')
    thirdShown = true
    showBarLabels = false
  }

  let fourthShown = false
  if (introDismissed && thirdShown && (cleanBoxInView3 || (cleanBoxEntry3 && cleanBoxEntry3.boundingClientRect.top < 0))) {
    fossilFuelBoxHeight = 0
    // console.log('4')
    fourthShown = true
    showBarLabels = false
  }

  if (introDismissed && thirdShown && finalBoxInView) {
    fossilFuelBoxHeight = expandedHeight
    cleanBoxHeight = fossilFuelBoxHeight / 2.5
    showBarLabels = true
  }


  const fossilFuelOpacity = fossilFuelBoxHeight ? 1 : 0
  const cleanOpacity = cleanBoxHeight ? 1 : 0

  const boxHeights = useSpring({ fossilFuelBoxHeight, cleanBoxHeight, config: { duration: 1000, easing: easeCubic }})
  const barWidth = introMapSize ?  (mobileLayout ? introMapSize[0] * 0.3 : introMapSize[0] * 0.1) : 0

  let mobileSVGOffset = mobileLayout ? 80 : 0
  let barPadding = mobileLayout ? 6 : 0
  const labelHeight = 30

  return (
    <div className="intro" ref={introContainer} style={{ top: headerHeight}}>
      {!width || !render ? <div className='loading'>Loading Finance Data...</div> : null}
      {width ? <IntroMap
        showBars={showMapBars}
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
          <h1 className={classNames({visible: h1Visible})}>A Public Database of International Public Finance for Energy</h1>
          <p  className={classNames({visible: p1Visible})}>G20 countries have provided at least $188 billion in influential, government-backed public finance for oil, gas, and coal since 2018.</p>
          <p  className={classNames({visible: p2Visible})}>We are tracking this money from G20 export credit agencies, development finance institutions, and multilateral development banks at the project level to help make sure they <span className='highlight'>#StopFundingFossils</span> and shift it to support just climate solutions instead. </p>
          {introDismissed ? null : <div className={classNames('buttons', {visible: buttonsVisible && !introDismissed, introDismissed, mobileLayout})}>
            {introDismissed ? null : <button onClick={() => setIntroDismissed(true)}>Read More</button>}
            <Link to='/data'>Explore the data</Link>
            <div className={classNames('scrollToContinue', {visible: introDismissed && !finalBoxInView})}>Scroll to continue reading</div>
          </div>}
        </div>
        <div className={classNames('buttons fixed', {visible: buttonsVisible && introDismissed, introDismissed, mobileLayout})}>
            <Link className={classNames('finalExplore', {visible: finalBoxInView})} to='/data'>Explore the data</Link>
            <div className={classNames('scrollToContinue', {visible: introDismissed && !finalBoxInView})}>Scroll to continue reading</div>
          </div>

        <div className='restOfIntro' style={{ paddingBottom: contentHeight / 2, opacity: restOfIntroVisible ? 1 : 0}}>
          <section style={{ minHeight: contentHeight * 2.5, paddingBottom: contentHeight / 2}}>
          <div>
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
            <p ref={finalBoxRef}>We’re tracking G20 countries’ and MDBs’ implementation of these promises into policy <Link to='/tracker'>here</Link>. Or, visit our resources page <Link to='/resources'>here</Link> to learn more and help make sure governments <strong className='large'>#StopFundingFossils</strong>.  </p>
          </section>
        </div>
        <svg style={{ top: headerHeight }} className={classNames('fuelTypes', { mobileLayout})} width={width} height={contentHeight}>

          {mobileLayout && showingBars ? <rect fill='#fff' opacity='0.9' width={width} height={expandedHeight + labelHeight + barPadding} y={contentHeight - expandedHeight - mobileSVGOffset - labelHeight - barPadding } /> : null}
          <animated.g style={{ opacity: fossilFuelOpacity}} transform={boxHeights.fossilFuelBoxHeight.interpolate(y => `translate(${width * 0.1}, ${contentHeight - y - mobileSVGOffset - barPadding})`)}>
            <animated.rect
              height={boxHeights.fossilFuelBoxHeight}
              width={barWidth}
              fill={colors['Fossil Fuel']}
            />
            <text dy='-1em' fill={colors['Fossil Fuel']}>Fossil Fuel
              <tspan style={{ opacity: showBarLabels ? 1 : 0}}> $63 billion</tspan>
            </text>
          </animated.g>
          <animated.g style={{ opacity: cleanOpacity }} transform={boxHeights.cleanBoxHeight.interpolate(y => `translate(${width * 0.8 - barWidth}, ${contentHeight - y - mobileSVGOffset - barPadding})`)}>
            <animated.rect
              height={boxHeights.cleanBoxHeight}
              width={barWidth}
              fill={colors.Clean}
            />
            <text dy={'-1em'} fill={colors.Clean}>Renewable Energy

              <tspan style={{ opacity: showBarLabels ? 1 : 0}}> $26 billion</tspan>
            </text>
          </animated.g>


        </svg>
        <Footer introFooter opacity={finalBoxInView ? 1 : 0 } />
      </Fragment> : null}

    </div>
  )
}

