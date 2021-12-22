import './About.scss'
import { HashLink } from 'react-router-hash-link'
import { Link } from 'react-router-dom'
import slug from 'slug'
const ExLink = ({href, children}) => {
  return <a href={href} target="_blank" rel="noopener noreferrer">{children}</a>
}

export default function About(props) {

  const questions = [
    'Where does the data come from?',
    'How is the amount of finance amount determined?',
    'What public finance data is included here?',
    'Do the amounts reported here include all G20 international public finance for energy?',
    'How can I look at public finance for specific projects or see more detail?',
    'How to cite this website',
    'Is international public finance a “subsidy”?',
    'What do public finance institutions need to do to support a just energy transition aligned with 1.5C?',
    'What about domestic support for fossil fuels?',
    'Aren’t fossil fuels needed for development?',

  ]
  const slugs = questions.map(q => slug(q))

  return (
    <div  style={{ marginTop: props.headerHeight }}  className='About'>
      <h1>About</h1>
      <p>
        {questions.map((q, i) => (
          <div key={i}>
            <HashLink smooth to={`#${slugs[i]}`}>{q}</HashLink>
          </div>
        ))}
        <div>
          <HashLink smooth to={`#downloadData`}>Download Data</HashLink>
        </div>
      </p>
      <h2>FAQ about the Data</h2>
      <p>We use the following definitions for these categories:</p>
      <p>
        <strong>Fossil Fuel</strong>: This includes the oil, gas, and coal sectors. This includes access, exploration and appraisal, development, extraction, preparation, transport, plant construction and operation, distribution, and decommissioning. It also includes energy efficiency projects where the energy source(s) involved are primarily fossil fuels.
      </p>
      <p>
        <strong>Renewable</strong>: This includes energy that is both low-carbon and has negligible impacts on the environment and human populations if implemented with appropriate safeguards. This includes solar, wind, tidal, geothermal, and small-scale hydro. This classification also includes energy efficiency projects where the energy source(s) involved are not primarily fossil fuels.
      </p>
      <p>
        <strong>Other</strong>: This includes projects where (a) the energy source(s) are unclear or unidentified, as with many transmission and distribution projects as well as (b) non-fossil energy sources that typically have significant impacts on the environment and human populations. This includes large hydropower, biofuels, biomass, nuclear power, and incineration. More than 70% of this category is for transmission and distribution projects and projects where the energy source is unclear.
      </p>
      <p>
        If a project includes multiple energy sources, we split it into multiple transactions whenever possible. Otherwise, it is classified as ‘Other.’
      </p>
      <p id={slugs[0]}><strong>Where does the data come from?</strong></p>
      <p>
        Oil Change International builds this dataset by tracking energy finance from public finance institutions at the project and transaction level. As of 2021, it covers over 14,000 transactions including grants, loans, equity purchases, guarantees, and insurance back to 2013. About 70% of the total finance in the dataset is from loans. This data is sourced primarily from government and institution reporting (including annual reports with project information, press releases, freedom-of information requests, and project databases) as well as the Infrastructure Journal (IJ) Global database, Boston University’s Global Economic Governance Initiative’s China Global Energy Database, and investigations by our partners at Solutions for our Climate (Korea), Jubilee Australia, and Urgewald (Germany). We are also grateful to partners at Friends of the Earth US, Just Finance International, 350Africa.org, Les Amis de la Terre, Re:Common, Friends of the Earth Japan, Japan Center for a Sustainable Environment and Society (JACSES), Both ENDS, Fundación Ambiente y Recursos Naturales, Above Ground, Legambiente, Transnational Institute, Market Forces, Iniciativa Climática de Mexico, ActionAid, Jubilee Australia, Bank Information Centre, and Recourse.org for their periodic review of this dataset.

      </p>
      <p id={slugs[1]}>
        <strong>How is the amount of finance amount determined?</strong>
      </p>
      <p>
        For each project or transaction, the dollar amount shown is the amount committed from the financial institution on the date that the loan, grant, or guarantee was approved by the institution. The amount is entered in U.S. dollars and the original currency. If currency conversion is required, the U.S. dollar amount is calculated based on the exchange rate on December 31 of the approval year, using the rates published on <ExLink href="https://www.x-rates.com/">X-Rates</ExLink>’ exchange rates calculator.
      </p>
      <p>
        If it can be determined from project information that only a portion of the project or loan went to energy, then only that percentage will be included as the finance amount – otherwise a conservative estimate is made based on the number of sectors listed.
      </p>
      <p id={slugs[2]}>
        <strong>What public finance data is included here?</strong>
      </p>
      <p>
        This dataset covers only public finance from G20 country bilateral finance institutions and the major MDBs. We consider these export credit agencies, development finance institutions, and multilateral development banks to be in scope as ‘public finance institutions’ when national government(s) holds more than 50% of the shares and where there is a clear policy mandate that drives decisions beyond solely commercial performance (see the figures in the Data section for a full list and classifications). This means we do not cover finance or subsidies from G20 governments directly, sovereign wealth funds, or institutions owned by subnational governments. Generally, the MDBs, DFIs, and ECAs we cover provide energy finance internationally, but they sometimes also provide domestic support. These domestic projects are also included where information is available so we can get a full institution-level picture. Government agencies or national development banks that occasionally provide international finance are also not reflected here.

      </p>
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
      <p>
        This scope means that to get a more holistic picture of support for fossil fuels from any one G20 government, these international public finance figures should be combined with data on direct domestic fossil fuel subsidies, domestic public finance, support to energy-related state-owned enterprises, and countries – see for example <ExLink href="https://www.iisd.org/publications/g20-scorecard">this report</ExLink> OCI wrote with International Institute for Sustainable Development and Overseas Development Institute in 2020, or a <ExLink href="https://about.bnef.com/blog/g-20-fossil-fuel-support-hits-nearly-600-billion-in-2020/">2021 update</ExLink> using this methodology and our data from BloombergNEF in 2021.

      </p>
      <p id={slugs[3]}>
        <strong>Do the amounts reported here include all G20 international public finance for energy?</strong>
      </p>
      <p>
        Poor reporting from governments means there are four significant limitations in this dataset. This means the figures presented in these reports are incomplete and therefore underestimated:

        <ul>
          <li>
          Many institutions have <strong>limited or no reporting on their projects</strong>. Islamic Development Bank, China, Russia, India, Saudi Arabia, Mexico, South Africa, Indonesia, and Turkey had particularly little publicly available information — meaning they do not have annual reports with project information, semi-regular press releases, a freedom-of information request detailing funding, or any form of project database. This is marked throughout the data section. However, it’s important to note that the totals for other countries or institutions that do provide some of these sources are still uncertain. In all cases, we use media reporting and paid databases like IJGlobal to supplement data provided by government sources.

          </li>
          <li>
          There is little data available on much of the energy finance provided via <strong>financial intermediaries</strong> (FIs) — third-party financial institutions like local banks, pension funds, or private equity funds. Details on the volume of public finance for specific energy activities ultimately delivered through those intermediaries are rarely available. This is a significant gap given lending through financial intermediaries is <ExLink href="https://germanwatch.org/en/20374">often</ExLink> half to two-thirds of finance for institutions focused on private-sector lending, and up to a quarter for those more focused on sovereign lending. Financial intermediation is also growing across all finance, and available data suggests this is likely the case for energy finance of the trade and development finance institutions mapped here.
          </li>
          <li>
          There is little data available on the energy-related portions of much of the <strong>“policy-based” lending</strong> from MDBs (The World Bank Group (WBG), Asian Development Bank (ADB), African Development Bank (AfDB), European Bank for Reconstruction and Development (EBRD), and the Inter-American Development Bank (IBRD) engage in this, providing government budget support that can be across multiple sectors and departments).
          </li>
          <li>
          There is little data available on many <strong>associated facilities</strong> — investments in facilities directly associated with energy projects such as new roads, ports, or transmission lines needed for a fossil fuel project to operate; and for which in the absence of the energy project there would not be a demand to build them.
          </li>
        </ul>
      </p>
      <p  id={slugs[4]}>
        <strong>How can I look at public finance for specific projects or see more detail?</strong>

      </p>
      <p>
        You can download the data as a spreadsheet <HashLink smooth to='/about#downloadData'>here</HashLink>. Definitions for each field are provided in the first tab, and a source for each transaction is in the last column. You can also read more background and analysis on public finance <Link to='/research'>here</Link>.

      </p>
      <p id={slugs[5]}><strong>How to cite this website</strong></p>
      <p>The data in the Public Finance for Energy Database is available for use under a <ExLink href="https://creativecommons.org/licenses/by-nc/4.0/">Creative Commons Attribution-NonCommercial 4.0 International License</ExLink>. If using this finance data, please cite it as Oil Change International, “Public Finance for Energy Database,” [Date Accessed], URL.</p>

      <h2>FAQ about international public finance</h2>
      <p id={slugs[6]}><strong>Is international public finance a “subsidy”?</strong></p>
      <p>The World Trade Organization’s <ExLink href="https://www.wto.org/english/docs_e/legal_e/24-scm_01_e.htm">definition</ExLink> calls public finance a subsidy to energy production to the extent that it constitutes a “direct transfer of funds” (as with grants, loans, and equity infusion) or “potential direct transfers of funds or liabilities” (as with guarantees and insurance) to an energy project or sector. However, due to the lack of transparency and robust reporting from public finance institutions, it is not possible to separate out what portion of public finance is a subsidy component.</p>
      <p>
      Furthermore, beyond the portions that can be formally conceived of as a subsidy, public finance for energy plays an outsized role in shaping energy systems. These loans, grants, equity, and guarantees lower risk for other investors because they are government-backed and are often provided at preferential below-market rates. Public finance institutions often further influence the energy landscape by signaling government priorities and adding research and advisory capacity. These all help leverage additional investment for proposed projects. These are benefits that — if wielded alongside a commitment to human rights due diligence, community-led development, and strengthening public goods — are desperately needed for a just energy transition rather than for propping up the fossil fuel industry.
      </p>
      <p id={slugs[7]}><strong>What do public finance institutions need to do to support a just energy transition aligned with 1.5C?</strong></p>
      <p>The International Energy Agency (IEA) <ExLink href="https://www.iea.org/reports/net-zero-by-2050">says</ExLink> that to limit global warming to 1.5°C, 2021 needs to mark the end of new investments in not just coal, but also new oil and gas supply. It is also clear that governments must pursue a much more rapid and just energy transition to avoid the worst climate impacts. This means we need to end all finance for new fossil fuel projects, but especially influential, government-backed public finance.</p>
      <p>
      Fossil free public finance also isn’t enough -- to support a globally just energy transition in line with 1.5°C, we also need public finance institutions to greatly increase their support for renewable energy, implement comprehensive human rights due diligence across their projects, and provide their fair share of debt cancellation and climate finance. Read our full recommendations for international public finance <ExLink href="https://priceofoil.org/2021/10/28/past-last-call-g20-public-finance-institutions-are-still-bankrolling-fossil-fuels/"> in this report.</ExLink>
      </p>
      <p id={slugs[8]}>
        <strong>What about domestic support for fossil fuels?</strong>
      </p>
      <p>International public finance for fossil fuels is only part of the problem. G20 countries must also clean up their act at home, which should include ending all kinds of domestic support for fossil fuels, implementing financial regulations to end private fossil fuel finance, and legislating a just and managed transition away from domestic fossil fuel production.</p>
      <p id={slugs[9]}>
        <strong>Aren’t fossil fuels needed for development?</strong>
      </p>
      <p>Fossil fuels have <ExLink href="https://priceofoil.org/2021/10/14/the-skys-limit-africa/">rarely served</ExLink> as a vehicle for just development, energy access, or resource sovereignty in the Global South because of poor contract terms, industry-friendly subsidy and royalty frameworks, debt traps, corruption, and the outsized ownership of fossil resources by multinational corporations based in wealthy countries. And as the industry faces increasing systemic financial risks, the possibility that fossil fuels can promote just development is increasingly slim.
      </p>
      <p>
      Continued public finance for fossil fuels now nearly always contradicts recommendations for achieving <ExLink href="https://www.seforall.org/data-and-evidence/energizing-finance-series/energizing-finance-2020">energy access</ExLink> and <ExLink href="https://www.iisd.org/">avoiding economic shocks</ExLink> like stranded assets and climate disasters. Furthermore, ending these public finance flows also does not mean halting the use and production of fossil fuels in overnight. Rather, it means saying no to new projects now and starting widespread planning now to ensure there is time and resources for clean-up and for a just transition for the workers and communities that depend upon production. The wealthy countries most responsible for historic and current emissions — including most of the G20 — must move first and fastest to phase out their fossil fuel production and pay their fair share for the global energy transition.
      </p>
      <p>
      As seen <Link to='/finance'>in all existing policies</Link> from G20 institutions to end public finance for fossil fuels, there should be limited short-term exceptions for emergency settings and energy access in cases where renewable energy is not immediately available -- categories which account for a <ExLink href="http://priceofoil.org/2018/10/10/shortchanging-energy-access-report-mdb-finance/">minute portion</ExLink> of G20 public finance for fossil fuels.

      </p>
      <h2 id="downloadData">Download Data</h2>
      <p>You can download our dataset in Excel format to explore for yourself.</p>
      <p><a href={`${process.env.PUBLIC_URL}/OCI Public Finance for Energy Database - 2021.xlsx`}>Download XLS Data</a></p>
    </div>
  )
}