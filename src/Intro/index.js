import { useState, useEffect, useRef } from 'react';
import './styles.scss'
import ociMap from '../images/oci_map.png'
import classNames from 'classnames';
import { Link } from 'react-router-dom';
import IntroMap from './IntroMap'
import useDataHook from '../hooks/useDataHook'
import useMapHook from '../hooks/useMapHook'

export default function Intro(props) {
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
      setH1Visible(false)
      setTimeout(() => {
        setP1Visible(false)
      }, 300)
      setTimeout(() => {
        setP2Visible(false)
      }, 600)
      setTimeout(() => {
        setButtonsVisible(false)
      }, 900)
      setTimeout(() => {
        setImageVisible(false)
      }, 1200)
      setTimeout(() => {
        setIntroHidden(true)
      }, 1500)


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
  return (
    <div className="intro" ref={introContainer} style={{ display: introHidden ? 'none' : 'block'}}>
      {introMapSize ? <IntroMap showBars={showMapBars} collection={collection} data={data} width={introMapSize[0]} height={introMapSize[1]} /> : null}
      <div className="introText">
        <h1 className={classNames({visible: h1Visible})}>A public database of international public finance for energy</h1>
        <p  className={classNames({visible: p1Visible})}>G20 countries have provided at least $188 billion in influential, government-backed public finance for oil, gas, and coal since 2018.</p>
        <p  className={classNames({visible: p2Visible})}>We are tracking this money from G20 export credit agencies, development finance institutions, and multilateral development banks at the project level to help make sure they <span className='highlight'>#StopFundingFossils</span> and shift it to support just climate solutions instead. </p>
      </div>
      <div className={classNames('buttons', {visible: buttonsVisible})}>
        <button onClick={() => setIntroDismissed(true)}>Read More</button>
        <Link to='/data'>Explore the data</Link>
      </div>
    </div>
  )
}

