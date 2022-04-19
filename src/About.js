import './About.scss'
import { HashLink } from 'react-router-hash-link'
import { Link } from 'react-router-dom'
import slug from 'slug'
const ExLink = ({href, children}) => {
  return <a href={href} target="_blank" rel="noopener noreferrer">{children}</a>
}

export default function About(props) {

  const downloadPath = `OCI Public Finance for Energy Database - Download Copy.xlsx`

  const dataQuestions = [
    'How are projects classified as fossil fuel, clean, or other?',
    'Where does the data come from?',
    'How is the amount of finance determined?',
    'What public finance data is included here?',
    'Do the amounts reported here include all G20 international public finance for energy?',
    'How can I look at public finance for specific projects or see more detail?',
    'How do I cite this website?',
    `What is this site's Privacy Policy?`
  ]
  
  const dataSlugs = dataQuestions.map(q=>slug(q))
  
  const bgQuestions = [
    'Is international public finance a “subsidy”?',
    'What would 1.5C aligned international public finance for energy look like?',
    'What about domestic support for fossil fuels?',
    'Is public finance for fossil fuels needed for development?'
  ]
  
  const bgSlugs = bgQuestions.map(q=>slug(q))

  return (
    <div  style={{ marginTop: props.headerHeight }}  className='About'>
      <h1>About</h1>
      <p>
        Public Finance for Energy Database is a project of Oil Change International, formerly called the Shift the Subsidies Database. It is the only publicly available database tracking international finance for energy from government-owned institutions across multiple countries. We track G20 governments’ energy finance at export credit agencies, development finance institutions, and multilateral development banks at the project level.
      </p>
      <p>
        Below are some of the most frequently asked questions. If you would like to explore the data yourself at the transaction level, you can click <a href={`${process.env.PUBLIC_URL}/${downloadPath}`}>here</a> to download it as a spreadsheet (.xlsx file).
      </p>
      <br />
      <h2>Frequently Asked Questions</h2>
      
      <h3>About the data and methodology</h3>
        {dataQuestions.map((q, i) => (
          <div key={i}>
            <HashLink smooth to={`#${dataSlugs[i]}`}>{q}</HashLink>
          </div>
        ))}

      <h3>About international public finance for energy</h3>
        {bgQuestions.map((q, i) => (
          <div key={i}>
            <HashLink smooth to={`#${bgSlugs[i]}`}>{q}</HashLink>
          </div>
        ))}
<br />
<br />
<h2>Our Data and Methodology</h2>
<h3 id={dataSlugs[0]}><strong>How are projects classified as fossil fuel, clean, or other?</strong></h3>

<p>We use the following definitions for these categories:</p>
<p><strong>Fossil Fuel:</strong> This includes the oil, gas, and coal sectors. This includes access, exploration and appraisal, development, extraction, preparation, transport, plant construction and operation, distribution, and decommissioning. It also includes energy efficiency projects where the energy source(s) involved are primarily fossil fuels.</p>
<p><strong>Clean:</strong> This includes energy that is both low-carbon and has negligible impacts on the environment and human populations if implemented with appropriate safeguards. This includes solar, wind, tidal, geothermal, and small-scale hydro. This classification also includes energy efficiency projects where the energy source(s) involved are not primarily fossil fuels.</p>
<p><strong>Other:</strong> This includes projects where (a) the energy source(s) are unclear or unidentified, as with many transmission and distribution projects as well as (b) non-fossil energy sources that typically have significant impacts on the environment and human populations. This includes large hydropower, biofuels, biomass, nuclear power, and incineration. If a project includes multiple energy sources, we split it into multiple transactions whenever possible. Otherwise, it is also classified as ‘Other.’ More than 70% of the finance in this category is for transmission and distribution projects and other projects where the associated energy sources are unclear.</p>

<br /><h3 id={dataSlugs[1]}><strong>Where does the data come from?</strong></h3>
<p>Oil Change International builds this dataset by tracking energy finance from public finance institutions at the transaction level. As of 2021, it covers over 14,000 transactions including grants, loans, equity purchases, and guarantees back to 2008 for multilateral development banks and back to 2013 for the bilateral categories of public finance institutions. This data is sourced primarily from government and institution reporting (including annual reports with project information, press releases, freedom-of information requests, and project databases) as well as the Infrastructure Journal (IJ) Global database, Boston University’s Global Economic Governance Initiative’s China Global Energy Database, and investigations by our partners at Solutions for our Climate (Korea), Jubilee Australia, and Urgewald (Germany).</p>
<p>We are also grateful to partners at Friends of the Earth US, Just Finance International, 350Africa.org, Les Amis de la Terre, Re:Common, Friends of the Earth Japan, Japan Center for a Sustainable Environment and Society (JACSES), Both ENDS, Fundación Ambiente y Recursos Naturales, Above Ground, Legambiente, Transnational Institute, Market Forces, Iniciativa Climática de Mexico, ActionAid, Jubilee Australia, Bank Information Centre, and Recourse.org for their periodic review of this dataset.</p>

<br /><h3 id={dataSlugs[2]}><strong>How is the amount of finance determined?</strong></h3>

<p>For each transaction, the dollar amount shown is the amount committed from the financial institution on the date that the loan, grant, or guarantee was approved by the institution. The amount is entered in both U.S. dollars and the original currency (the Data Dashboard shows all figures in USD only). If currency conversion is required, the U.S. dollar amount is calculated based on the exchange rate on December 31 of the approval year.
</p>
<p>
Details on financial terms are rarely publicly available, and so the full amount of any grant, loan, equity purchase, or guarantee is what is included. About 70% of the total finance reported in the dataset is from loans. 
</p>
<p>
In cases where multiple sectors are included in one transaction, only the portion of the project or loan that went to energy  is included. Where this is not possible, a conservative estimate is made based on the number of sectors listed. Where only a range of finance is reported, we report the total as the low end of the range. 
</p>

<br /><h3 id={dataSlugs[3]}><strong>What public finance data is included here?</strong></h3>
<p>This dataset covers only public finance from G20 country bilateral finance institutions and the major MDBs. We consider these export credit agencies, development finance institutions, and multilateral development banks to be in scope as ‘public finance institutions’ when national government(s) holds more than 50% of the shares and where there is a clear policy mandate that drives decisions beyond solely commercial performance (see the figures in the <Link to="/data">Data Dashboard</Link> for a full list of institutions and classifications). This means we do not cover finance or subsidies from G20 governments directly, sovereign wealth funds, or institutions owned by subnational governments. Generally, the MDBs, DFIs, and ECAs we cover provide energy finance internationally, but they sometimes also provide domestic support. These domestic projects are also included where information is available so we can get a full institution-level picture. Government agencies or national development banks that occasionally provide international finance are also not reflected here.</p>
<table>
<thead>
  <tr>
    <th>Type of Institution</th>
    <th>Typical Mandate</th>
    <th>Examples</th>
  </tr>
</thead>
<tbody>
  <tr>
    <td>Multilateral Development Bank</td>
    <td>Promote sustainable development and reduce poverty. Chartered and governed by more than one country.</td>
    <td>World Bank Group, Islamic Development Bank</td>
  </tr>
  <tr>
    <td>Development Finance Institution</td>
    <td>Promote sustainable development and reduce poverty. They may have further objectives based on national policy priorities. DFIs typically focus on bilateral finance but some national development banks that we cover support both domestic and international projects.</td>
    <td>China Development Bank (China), Agence Française de Développement (France), Nacional Financiera (Mexico)</td>
  </tr>
  <tr>
    <td>Export Credit Agency</td>
    <td>Promote the export of goods and services from their country.</td>
    <td>Korea Trade Insurance Corporation (Korea), Euler Hermes (Germany)</td>
  </tr>
</tbody>
</table>

<br /><h3 id={dataSlugs[4]}><strong>Do the amounts reported here include all G20 international public finance for energy?</strong></h3>

<p>Poor reporting from governments means there are four significant limitations in this dataset. This means the figures presented in the database are incomplete and therefore underestimated:</p>

<ul>
	<li>Many institutions have limited or no reporting on their projects. Islamic Development Bank, China, Russia, India, Saudi Arabia, Mexico, South Africa, Indonesia, and Turkey had particularly little publicly available information — meaning they do not have annual reports with project information, semi-regular press releases, a freedom-of-information request detailing funding, or any form of project database. This is marked throughout the data dashboard. However, it’s important to note that the totals for other countries or institutions that do provide some of these sources are still uncertain. In all cases, we use media reporting and paid databases like IJGlobal to supplement data provided by government sources.</li>
	<li>There is little data available on much of the energy finance provided via financial intermediaries (FIs) — third-party financial institutions like local banks, pension funds, or private equity funds. Details on the volume of public finance for specific energy activities ultimately delivered through those intermediaries are rarely available. This is a significant gap given lending through financial intermediaries is often half to two-thirds of finance for institutions focused on private-sector lending, and up to a quarter for those more focused on sovereign lending. Financial intermediation is also growing across all finance, and available data suggests this is likely the case for energy finance of the trade and development finance institutions mapped here.</li>
	<li>There is little data available on the energy-related portions of much of the “policy-based” lending from MDBs, providing government budget support that can be across multiple sectors and departments (The World Bank Group (WBG), Asian Development Bank (ADB), African Development Bank (AfDB), European Bank for Reconstruction and Development (EBRD), and the Inter-American Development Bank (IBRD) engage in this).</li>
	<li>There is little data available on many associated facilities — investments in facilities directly associated with energy projects such as new roads, ports, or transmission lines needed for a fossil fuel project to operate; and for which in the absence of the energy project there would not be a demand to build them.</li>
</ul>


<br /><h3 id={dataSlugs[5]}><strong>How can I look at public finance for specific projects or see more detail?</strong></h3>

<p>You can download the data as a spreadsheet <a href={`${process.env.PUBLIC_URL}/${downloadPath}`}>here</a>. Definitions for each field are provided in the first tab, and a source for each transaction is in the last column. You can also read more background and analysis on public finance <Link to='/resources'>here</Link>.</p>


<br /><h3 id={dataSlugs[6]}><strong>How do I cite this website?</strong></h3>
      <p>The data in the Public Finance for Energy Database is available for use under a <ExLink href="https://creativecommons.org/licenses/by-nc/4.0/">Creative Commons Attribution-NonCommercial 4.0 International License</ExLink>, which requires that attribution to Public Finance for Energy Database is given, a link to the Creative Commons license is included, and that this material cannot be used for commercial purposes.
      </p>
      <p>
      If using this database, please cite it as Oil Change International, “Public Finance for Energy Database,” [Date Accessed], URL.</p>

<br /><h3 id={dataSlugs[7]}><strong>What is this site's privacy policy?</strong></h3>
<p>The Public Finance for Energy Database website (the “site”) does not collect, maintain, or process any personally identifiable information of visitors to the site. The site is hosted by <ExLink href="http://netlify.com/">netlify.com</ExLink>, you can read their privacy policy <ExLink href="https://www.netlify.com/privacy/">here</ExLink>. The site is managed and operated by <ExLink href="https://priceofoil.org/">Oil Change International</ExLink>. If you have any questions, please contact <ExLink href="mailto:info@priceofoil.org">info@priceofoil.org</ExLink>.</p>


<br /><h2>Background on International Public Finance for Energy</h2>

<h3 id={bgSlugs[0]}><strong>Is international public finance a “subsidy”?</strong></h3>
  <p>The World Trade Organization’s <ExLink href="https://www.wto.org/english/docs_e/legal_e/24-scm_01_e.htm">definition</ExLink> calls public finance a subsidy to energy production to the extent that it constitutes a “direct transfer of funds” (as with grants, loans, and equity infusions) or “potential direct transfers of funds or liabilities” (as with guarantees and insurance) to an energy project or sector. However, due to the lack of transparency and robust reporting from public finance institutions, it is not possible to separate out what portion of public finance is a subsidy component.</p>
  <p>
  Furthermore, beyond the portions that can be formally conceived of as a subsidy, public finance for energy still plays an outsized role in shaping energy systems. These loans, grants, equity, and guarantees still lower risk for other investors when there is no below-market component because they are government-backed. Public finance institutions often further influence the energy landscape by signaling government priorities and adding research and advisory capacity. These all help leverage additional investment for proposed projects. These are benefits that — if wielded alongside a commitment to human rights due diligence, community-led development, and strengthening public goods — are desperately needed for a just energy transition rather than for propping up the fossil fuel industry.
  </p>
  <p>
  To get a more holistic picture of support for fossil fuels from any one G20 government, international public finance figures should be combined with data on direct domestic fossil fuel subsidies, domestic public finance, and support to energy-related state-owned enterprises – see for example <a href="https://www.iisd.org/publications/g20-scorecard">this report</a> Oil Change International wrote with International Institute for Sustainable Development and Overseas Development Institute in 2020, or a <a href="https://about.bnef.com/blog/g-20-fossil-fuel-support-hits-nearly-600-billion-in-2020/">2021 update</a> using this methodology and our data from BloombergNEF in 2021.
  </p>
  <br /><h3 id={bgSlugs[1]}><strong>What would 1.5C aligned international public finance for energy look like?</strong></h3>

<p>The International Energy Agency (IEA) <ExLink href="https://www.iea.org/reports/net-zero-by-2050">says</ExLink> that to limit global warming to 1.5°C, 2021 needs to mark the end of new investments in not just coal, but also new oil and gas supply. The IEA is also clear that governments must pursue a much more rapid and just energy transition to avoid the worst climate impacts. This means we need to end all finance for new fossil fuel projects, but especially influential, government-backed public finance.</p>

<p>Fossil free public finance alone is not enough to support a globally just energy transition in line with 1.5°C. We also need public finance institutions to greatly increase their support for clean energy, implement comprehensive human rights due diligence across their projects, and provide their fair share of debt cancellation and climate finance. You can read more detailed recommendations for international public finance in a report from Oil Change International and Friends of the Earth US <ExLink href="https://priceofoil.org/2021/10/28/past-last-call-g20-public-finance-institutions-are-still-bankrolling-fossil-fuels/">here</ExLink>.</p>

<br /><h3 id={bgSlugs[2]}><strong>What about domestic support for fossil fuels?</strong></h3>
<p>International public finance for fossil fuels is only part of the problem. G20 countries must also clean up their act at home, which should include ending all kinds of domestic support for fossil fuels, implementing financial regulations to end private fossil fuel finance, and legislating a just and managed transition away from domestic fossil fuel production.</p>

<br /><h3 id={bgSlugs[3]}><strong>Is public finance for fossil fuels needed for development?</strong></h3>
<p>The majority of G20 international public finance for energy flows between wealthy countries. Of the top 20 recipients of public finance for fossil fuels in 2018-2020, only one was low-income by the World Bank classification (Mozambique), six were lower-middle income, and the remainder were upper or middle income. When G20 international public finance for fossil fuels does flow to lower income countries, it has <ExLink href="https://priceofoil.org/2021/10/14/the-skys-limit-africa/">rarely served</ExLink> as a vehicle for just development, energy access, or resource sovereignty because of poor contract terms, industry-friendly subsidy and royalty frameworks, debt traps, corruption, and the outsized ownership of fossil resources by multinational corporations based in wealthy countries. And as the industry faces increasing systemic financial risks, the possibility that fossil fuels can promote just development is increasingly slim.</p>

<p>The outlook for fossil fuels and development has continued to diminish, and continued public finance for fossil fuels now nearly always contradicts recommendations for achieving <ExLink href="https://www.seforall.org/data-and-evidence/energizing-finance-series/energizing-finance-2020;">energy access</ExLink> and <ExLink href="https://www.iisd.org/publications/natural-gas-finance-clean-alternatives-global-south/">avoiding economic shocks</ExLink> like stranded assets and climate disasters. Ending public finance flows would not mean halting the use and production of fossil fuels overnight. Rather, it means saying no to new projects now and starting widespread planning now to ensure there is time and resources for clean-up and for a just transition for the workers and communities that depend upon production. The wealthy countries most responsible for historic and current emissions — including most of the G20 — must move first and fastest to phase out their fossil fuel production and pay their fair share for the global energy transition.</p>

<p>As seen in all <Link to="/tracker">existing policies</Link> restricting public finance for fossil fuels, there are limited and reasonable short-term exceptions for emergency settings and energy access in cases where clean energy is not immediately available -- categories which account for a <ExLink href="http://priceofoil.org/2018/10/10/shortchanging-energy-access-report-mdb-finance/">minute portion</ExLink> of G20 public finance for fossil fuels. </p>
<br />




    </div>
  )
}