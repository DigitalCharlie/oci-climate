import { useState, useEffect, useRef } from 'react';
import './styles.scss'
import ociMap from '../images/oci_map.png'
import classNames from 'classnames';
import { Link } from 'react-router-dom';
import IntroMap from './IntroMap'
import useDataHook from '../hooks/useDataHook'
import useMapHook from '../hooks/useMapHook'
import { useInView } from 'react-intersection-observer';
import { useSpring, animated } from 'react-spring';
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
  const [imageVisible, setImageVisible] = useState(true);
  const [introHidden, setIntroHidden] = useState(false);
  const [showMapBars, setShowMapBars] = useState(false);
  const data = useDataHook()

  const introContainer = useRef()
  const collection = useMapHook()

  const [introMapSize, setIntroMapSize] = useState(null)
  useEffect(() => {
      if (data.length && introMapSize && collection) {
      setTimeout(() => {
        setH1Visible(true);
      }, 100)
      setTimeout(() => {
        setP1Visible(true);
        setShowMapBars(true);
      }, 1000)
      setTimeout(() => {
        setP2Visible(true);
      }, 2000)
      setTimeout(() => {
        setButtonsVisible(true);
      }, 3000)
    }
  }, [data, introMapSize, collection])

  useEffect(() => {
    if (introDismissed) {
      window.document.body.style.overflowY = 'auto';
      window.document.body.scrollTo({ top: contentHeight, behavior: 'smooth'})
    } else {
      window.document.body.style.overflowY = 'hidden';
    }
  }, [introDismissed])
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

  const [fossilFuelBoxRef, fossilFuelBoxInView, fossilFuelBoxEntry] = useInView({ threshold: 1 })
  const [cleanBoxRef, cleanBoxInView, cleanBoxEntry] = useInView({ threshold: 1 })
  const [cleanBoxRef2, cleanBoxInView2, cleanBoxEntry2] = useInView({ threshold: 1 })
  const [cleanBoxRef3, cleanBoxInView3, cleanBoxEntry3] = useInView({ threshold: 1 })
  console.log(fossilFuelBoxEntry)
  let fossilFuelBoxHeight = 0
  let cleanBoxHeight = 0
  if (fossilFuelBoxInView || (fossilFuelBoxEntry && fossilFuelBoxEntry.boundingClientRect.top < 0)) {
    fossilFuelBoxHeight = contentHeight * 0.8
  }
  if (cleanBoxInView || (cleanBoxEntry && cleanBoxEntry.boundingClientRect.top < 0)) {
    cleanBoxHeight = fossilFuelBoxHeight / 2.5
  }
  if (cleanBoxInView2 || (cleanBoxEntry2 && cleanBoxEntry2.boundingClientRect.top < 0)) {
    let temp = fossilFuelBoxHeight
    fossilFuelBoxHeight = cleanBoxHeight
    cleanBoxHeight = temp
  }

  if (cleanBoxInView3 || (cleanBoxEntry3 && cleanBoxEntry3.boundingClientRect.top < 0)) {
    fossilFuelBoxHeight = 0
  }
  const fossilFuelOpacity = fossilFuelBoxHeight ? 1 : 0
  const cleanOpacity = cleanBoxHeight ? 1 : 0

  const boxHeights = useSpring({ fossilFuelBoxHeight, cleanBoxHeight })
  const barWidth = introMapSize ?  introMapSize[0] * 0.1 : 0
  const width = introMapSize ? introMapSize[0] : 0
  return (
    <div className="intro" ref={introContainer} style={{ display: introHidden ? 'none' : 'block', top: headerHeight}}>
      {width ? <IntroMap
        showBars={showMapBars}
        collection={collection}
        data={data}
        width={width}
        height={contentHeight} />
       : null}
      <div className="introText" style={{ top: contentHeight / 2}}>
        <h1 className={classNames({visible: h1Visible})}>A public database of international public finance for energy</h1>
        <p  className={classNames({visible: p1Visible})}>G20 countries have provided at least $188 billion in influential, government-backed public finance for oil, gas, and coal since 2018.</p>
        <p  className={classNames({visible: p2Visible})}>We are tracking this money from G20 export credit agencies, development finance institutions, and multilateral development banks at the project level to help make sure they <span className='highlight'>#StopFundingFossils</span> and shift it to support just climate solutions instead. </p>
      </div>
      <div className={classNames('buttons', {visible: buttonsVisible, introDismissed})}>
        {introDismissed ? null : <button onClick={() => setIntroDismissed(true)}>Read More</button>}
        <Link to='/data'>Explore the data</Link>
      </div>
      <div className='restOfIntro'>
        <section style={{ minHeight: contentHeight * 2}}>
          <h2 style={{ top: headerHeight}}>Why does international public finance for energy matter？</h2>
          <p >The International Energy Agency is clear we need to end all finance for new fossil fuel supply and rapidly transition to renewable energy and to stay within 1.5°C of warming and avoid the worst climate impacts.</p>
          <p ref={fossilFuelBoxRef}>Despite this, G20 countries are still financing at least USD <strong className='large'>$63 billion a year</strong> for <span className='fossilFuel'>fossil fuel</span> <strong>projects</strong> through their export credit agencies, development finance institutions, and multilateral development banks (2018-2020 average). </p>
          <p ref={cleanBoxRef}>This is <strong className='large'>2.5x their support</strong> for <span className='clean'>renewable energy</span>.</p>
          <p>This money – provided as loans, guarantees, equity, and grants — has an outsized impact on energy systems. Public finance often comes with below-market rates, technical capacity, and decreased financial risks that make projects much more likely to go forward — something that is increasingly influential as the fossil fuel industry faces unprecedented global headwinds. We need this $63 billion a year in public finance for fossil fuels  —  and more — to support a just transition to renewable energy instead. </p>
        </section>
        <section  style={{ minHeight: contentHeight * 2}}>
          <h2 style={{ top: headerHeight}}>How do we get public finance out for fossils?</h2>
          <p ref={cleanBoxRef2}>Momentum is building to finally make <strong className='large'>public finance fossil free</strong>. </p>
          <p ref={cleanBoxRef3}>As of 2021, almost all G20 countries have policies to end their coal finance. And six G20 countries, along with 33 other countries and institutions, signed a joint commitment at COP26 to end their international support for oil and gas by 2022 as well.</p>
          <p>We’re tracking G20 countries’ and MDBs’ implementation of these promises into policy here. Visit our research and action page here to learn more and help make sure governments <strong className='large'>#StopFundingFossils</strong>.  </p>
        </section>
      </div>
      <svg style={{ top: headerHeight }} className='fuelTypes' width={width} height={contentHeight}>
      <animated.g style={{ opacity: fossilFuelOpacity}} transform={boxHeights.fossilFuelBoxHeight.interpolate(y => `translate(${width * 0.1 + barWidth / 2}, ${contentHeight - y})`)}>
          <animated.rect
            height={boxHeights.fossilFuelBoxHeight}
            width={barWidth}
            fill={colors['Fossil Fuel']}
          />
          <text dy='-1em' fill={colors['Fossil Fuel']}>Fossil Fuel</text>
        </animated.g>
        <animated.g style={{ opacity: cleanOpacity }} transform={boxHeights.cleanBoxHeight.interpolate(y => `translate(${width * 0.9 - barWidth / 2}, ${contentHeight - y})`)}>
          <animated.rect
            height={boxHeights.cleanBoxHeight}
            width={barWidth}
            fill={colors.Clean}
          />
          <text dy={'-1em'} fill={colors.Clean}>Renewable Energy</text>
        </animated.g>

      </svg>
    </div>
  )
}

