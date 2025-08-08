export interface IFRSReportData {
  companyName: string;
  periodFrequency: string;
  inauguralOrSubsequent: string;
  reportingPeriod: string;
  reportingStandards: string;
  externalAuditorAppointed: string;
  contactDetails: string;
  leadershipTitle: string;
  departmentsNames: string;
  board: string;
  committeeName: string;
  specificTrainingsProvided: string;
  policiesName: string;
  workshopsConducted: string;
  sustainabilityRisksAndOpportunities: string;
  energySource: string;
  sectorIndustryName: string;
  externalConsultants: string;
  benchmarkDetail: string;
  kpis: string;
  dataMonitoringSystems: string;
  ipccAndIea: string;
  physicalRisksScenarios: string;
  selectedBusinessSite: string;
  transitionRiskScenarios: string;
  innovativeFacility: string;
  toolsUsed: string;
}

export function generateIFRSReport(data: IFRSReportData): string {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>IFRS Sustainability Report</title>
    <style>
                body {
                    font-family: 'Calibri', sans-serif;
                    line-height: 1.6;
                    margin: 40px;
                    color: #333;
                }
                .section {
                    margin-bottom: 30px;
                }
                .section-title {
                    font-size: 36px;
                    font-weight: bold;
                    margin-bottom: 15px;
                    color: black;
                    // border-bottom: 2px solid #3498db;
                    padding-bottom: 5px;
                }
                .content {
                    text-align: justify;
                    margin-bottom: 15px;
                }
                .highlight {
                    font-weight: bold;
                    color: black;
                }
                table {
                    width: 100%;
                    border-collapse: collapse;
                    margin: 20px 0;
                }
                th, td {
                    border: 1px solid #ddd;
                    padding: 12px;
                    text-align: left;
                }
                th {
                    background-color: #f8f9fa;
                    font-weight: bold;
                }
                ul {
                    margin-left: 20px;
                }
                li {
                    margin-bottom: 8px;
                }
            </style>
</head>
<body>
    <div class="section">
        <div class="section-title">Introduction of the Report</div>
        <div class="content">
            <p><span class="highlight">Scope and Coverage</span></p>
            <p>Each page invites you to see how sustainability is reshaping our business, from the boardroom to the communities we serve and provides a comprehensive view of <span class="highlight">${data.companyName}</span> core business operations and corporate functions. It presents key economic and social metrics derived from our facilities and headquarters, alongside environmental data focused on energy consumption, including electricity and fuel, across production plants, corporate offices, and company-owned vehicles.</p>
            
            <p><span class="highlight">Timeframe Covered:</span></p>
            <p>Published <span class="highlight">${data.periodFrequency}</span>, this <span class="highlight">${data.inauguralOrSubsequent}</span> sustainability report for <span class="highlight">${data.companyName}</span> focuses on the period from <span class="highlight">${data.reportingPeriod}</span>. To offer a well-rounded perspective on our advancements, supplementary data from previous years has been incorporated where relevant. This Sustainability Report underscores our ongoing commitment to sustainable development and responsible resource management.</p>
            
            <p><span class="highlight">Breaking Boundaries:</span></p>
            <p>The report is based on a flexible approach integrating diverse standards such as Global Reporting Initiatives (GRI) and International Sustainability Standards Board (ISSB). The information in this report is derived from scientifically validated measurement techniques and calculated using established mathematical methods. In instances where direct data was not accessible, reasonable estimation approaches have been utilized. It thoroughly covers all material topics, addressing the significant economic, environmental, social, and governance impacts of our operations.</p>
            
            <p><span class="highlight">A Journey, not a Destination:</span><br>This report marks a checkpoint in our journey toward sustainable growth and resilience. While we remain committed to improving, learning, and collaborating for greater impact, it includes forward-looking statements based on current assumptions and conditions. These projections are subject to change, and actual outcomes may differ due to various uncertainties.</p>
            
            <p><span class="highlight">Verification and External Assurance:</span></p>
            <p>This report is independently reviewed by <span class="highlight">${data.externalAuditorAppointed}</span> to evaluate inclusivity, materiality, and responsiveness. A statement from the independent external reviewer at the end of the report provides details on the review scope, the steps taken, and their findings.</p>
            
            <p><span class="highlight">Your Voice Matters: </span></p>
            <p>We created this report not just for you to read, but to speak dialogue. Your insights, questions, and critiques help shape the future we aim to co-create. Share your thoughts at <span class="highlight">${data.contactDetails}</span></p>
        </div>
    </div>

    <div class="section">
        <div class="section-title">Governance- Board's Roles and Responsibilities</div>
        <div class="content">
            <p><span class="highlight">Governance:</span></p>
            <p>The Board of Directors at <span class="highlight">${data.companyName}</span> is fully committed to integrating sustainability into the heart of our business strategy. The Board ensures that sustainability principles are embedded across all departments of the organization including <span class="highlight">${data.departmentsNames}</span>. Our commitment to sustainability not only meets the needs of the present but also secures a resilient and prosperous future for our stakeholders and the communities we serve.</p>
            
            <p><span class="highlight">Our Governance Model:</span></p>
            <p>Our sustainability strategy is driven by the <span class="highlight">${data.board}</span> and <span class="highlight">${data.committeeName}</span> ensuring transparent and efficient implementation. Well-defined roles and responsibilities are in place to meet sustainability goals and facilitate proper deployment. The Board of Directors offers leadership and direction, while the committees and department support the delivery of the sustainability initiatives endorsed by the Board. Moreover, each department of <span class="highlight">${data.companyName}</span> carry out tasks according to the core sustainability initiatives of <span class="highlight">${data.companyName}</span> and report to the Committee.</p>
            
            <p><span class="highlight">Our Communication Flow:</span></p>
            <p>Sustainability and climate-related risks and opportunities are communicated to <span class="highlight">${data.companyName}</span>'s Board through a structured hierarchy: relevant department's Manager reports to the designated committee.</p>
            
            <p><span class="highlight">Board's Leadership in Sustainability Decision-Making and Policy Development:</span></p>
            <p>At <span class="highlight">${data.companyName}</span>, the Board plays a vital role in shaping and guiding the company's sustainability and climate policy, ensuring it aligns with long-term success and stakeholder value. With expert input across economic, environmental, social, and governance fields, the Board ensures informed decision-making for sustainable management.</p>
            <p>This allows the Board to set the strategic direction for the company's values, ethics, and business practices, approve major sustainability plans, budgets, and investments, and provide oversight for initiatives that aim to enhance positive impacts while minimizing adverse effects on the economy, environment, and society.</p>
            <p><span class="highlight">${data.companyName}</span> also integrates Sustainability objectives into the <span class="highlight">${data.leadershipTitle}</span>'s KPIs, ensuring a structured approach to management and oversight. The establishment, evaluation, and compensation related to these KPIs are systematically reviewed and submitted to the Board of Directors-the highest governing body of <span class="highlight">${data.companyName}</span>.</p>
            <p>The Board of <span class="highlight">${data.companyName}</span> also ensures that all members, particularly those responsible for developing and overseeing sustainability strategies, possess the necessary expertise and competencies to effectively manage these initiatives. To facilitate the continuous development of these skills, <span class="highlight">${data.companyName}</span> organizes regular meetings and sessions for board members, at management level and for each department personnel who is taking part in sustainability strategy implementation, to enhance their knowledge and capabilities as well as making it a part of Board's training.</p>
            <p><span class="highlight">${data.specificTrainingsProvided}</span></p>
            
            <p><span class="highlight">Board Oversight:</span></p>
            <p>Board of <span class="highlight">${data.companyName}</span> oversees sustainability and climate-related risks and opportunities through the Sustainability Committee, regular risk assessments, and integration of sustainability into <span class="highlight">${data.companyName}</span>'s business strategy. It ensures accountability through stakeholder engagement, regulatory compliance, expert consultation, training, and technology for real-time tracking. Progress is monitored through performance metrics, and integration into executive remuneration.</p>
            <p>The Board endorses sustainability targets, advises on interventions as needed, and allocates resources to achieve <span class="highlight">${data.companyName}</span>'s Sustainability targets.</p>
        </div>
    </div>

    <div class="section">
        <div class="section-title">Management's Role</div>
        <div class="content">
            <p><span class="highlight">Management's Role:</span></p>
            <p>At management level, the <span class="highlight">${data.leadershipTitle}</span> provides direction and approves decisions pertaining to sustainability. Management has clear roles and responsibilities promoting company-wide sustainability management where various departments <span class="highlight">${data.departmentsNames}</span> work together to achieve strategic goal of <span class="highlight">${data.companyName}</span>. It is also involved in overseeing and directing the implementation of each sustainability agenda item, incorporating it into operations of <span class="highlight">${data.companyName}</span>, ensuring all sustainability-related issues with material impacts are discussed and approved by the Board of Directors</p>
        </div>
    </div>

    <div class="section">
        <div class="section-title">Terms of Reference, Mandates, Role Descriptions, and Related Policies:</div>
        <div class="content">
            <p><span class="highlight">${data.companyName}</span> has following sustainability related policies implemented by the Board: <span class="highlight">${data.policiesName}</span></p>
            <p><span class="highlight">Roles and Responsibilities:</span></p>
            <p>The Chairperson of the <span class="highlight">${data.committeeName}</span> shall be a member of the Board and is responsible for:</p>
            <ul>
                <li>Providing strategic oversight on the company's sustainability initiatives, climate change actions, and risk management practices, ensuring that sustainability-related risks and opportunities are effectively incorporated into business operations and decision-making.</li>
                <li>Development and implementation of the company's sustainability framework, ensuring alignment with industry best practices and regulatory requirements. Oversee the conduct of risk assessments related to sustainability and climate change, both current and emerging.</li>
                <li>Identifying and prioritizing material matters related to sustainability and climate change, considering the risks and opportunities related to Economic Sustainability, Environmental Sustainability, Social Sustainability, and Governance Sustainability (EESG).</li>
                <li>Monitoring and assessing risks that could affect the company's financial performance, reputation, and long-term viability, ensuring that sustainability-related risks are effectively managed at all levels of the organization.</li>
                <li>Overseeing the robustness of risk mitigation measures, ensuring the integrity of financial information and the effectiveness of the company's risk management framework. Recommend the company's risk profile and risk appetite for Board approval, ensuring alignment with sustainability goals.</li>
                <li>Recommend the Governance and Risk Management Policy for Board approval and advise on appropriate exposure limits and risk-taking authority delegated by the Board to the CEO and executive management.</li>
                <li>Oversee the process developed by management to identify, evaluate, and manage principal risks, ensuring that material sustainability risks are being monitored and addressed.</li>
                <li>Review and monitor the risk implications of new and emerging risks, organizational changes, and major initiatives affecting sustainability performance, recommending necessary actions to mitigate these risks.</li>
                <li>Review the principles, policies, limits, standards, and procedures established by management concerning sustainability risks, ensuring these align with best practices and regulatory requirements.</li>
                <li>Review issues raised by the CEO, Executive Director, Chief Financial Officer, External Auditors, Company Secretary or Internal Auditors that impact the risk management framework or the Group's risk management</li>
                <li>Engage with independent experts, as needed, to carry out special investigations or provide advice to ensure the company's sustainability framework and risk management practices are robust.</li>
                <li>Review and make recommendations to the Board on draft statutory statements concerning governance and risk management, ensuring compliance with regulatory requirements.</li>
                <li>Authorized to direct special investigations into emerging sustainability-related risks and seek expert advice to support decision-making and ensure effective risk management.</li>
                <li>Provide regular reports to the Board of Directors on findings, recommendations, and activities, including updates on sustainability performance and progress against key targets.</li>
                <li>Ensure transparent communication of the company's sustainability performance, particularly to investors, through the annual sustainability report and other relevant disclosures.</li>
                <li>Assess its own effectiveness annually, identifying areas for improvement, and periodically review and update these Terms of Reference to ensure alignment with the company's evolving sustainability and risk management objectives.</li>
                <li>Meet regularly, at least quarterly, to discuss and review the company's sustainability performance, risk assessments, and progress toward sustainability targets.</li>
                <li>Recommend actions to address ESG concerns, provide guidance on the adoption of best international practices, and ensure compliance with relevant ESG laws, regulations, and reporting requirements.</li>
                <li>Oversee and review sustainability-related training opportunities for employees, management, and the Board to ensure widespread ESG awareness and knowledge across the organization</li>
                <li>Foster constructive engagement with stakeholders, including investors, communities, government authorities, and NGOs, to understand their expectations and ensure the company's sustainability practices align with stakeholder concerns</li>
                <li>Assist in reviewing major projects, investments, and initiatives, advising management on the ESG implications for effective decision-making and ensuring alignment with the company's sustainability strategy</li>
                <li>Ensure that sustainability performance is captured in the company's annual performance appraisals, linking sustainability efforts to remuneration and promotions where appropriate</li>
                <li>Oversee external audits and certifications of sustainability management systems and review the results to ensure adherence to sustainability practices.</li>
            </ul>
        </div>
    </div>

    <div class="section">
        <div class="section-title">Materiality Assessment</div>
        <div class="content">
            <p><span class="highlight">Materiality</span></p>
            <p><span class="highlight">${data.companyName}</span> has conducted materiality assessment to identify key sustainability and climate related risks and opportunities by using double materiality approach (Based on European Financial Reporting Advisory Group's Implementation Guidance) to prioritize material risks and opportunities in terms of Impact Materiality which examines the effects of business activities on the environment and society throughout the value chain and Financial Materiality that identifies how sustainability issues influence the <span class="highlight">${data.companyName}</span>'s value creation, cash flow, and capital access, considering both risks and opportunities.</p>
            <p>It informs us how we focus our resources, and what information we choose to include in our Responsible Business Reporting. We have considered industry trends, internal data and historical performance reviews as well as internal and external stakeholders' perspective while assessing the key risks and opportunities. The assessment follows national and international reporting guidelines, such as <span class="highlight">${data.reportingStandards}</span></p>
            
            <p><span class="highlight">Identification of Material Risks: ${data.companyName}</span> conducts a Value Chain Analysis to identify sustainability-related risks across its operations. The company aligns with global sustainability standards ${data.reportingStandards} and evaluates industry peer practices to assess potential risks. Additionally, <span class="highlight">${data.companyName}</span> analyzes customer feedback, industry trends, and internal data along with media research to identify emerging risks and inform its sustainability strategy. We categorize our identified risks and opportunities into two primary areas: sustainability-related risks and climate-related risks and opportunities, encompassing both physical and transition impacts.</p>
            
            <p><span class="highlight">Grouping of similar issues:</span></p>
            <p>Grouping issues is essential in our double materiality. Considering issues in isolation can obscure their full impact on the company. By grouping them, we can better understand their interactions and how they may amplify or mitigate each other's effects</p>
            
            <p><span class="highlight">Engagement of Key Stakeholders: </span>We actively involve <span class="highlight">${data.leadershipTitle}</span>, board members, department heads, employees, and <span class="highlight">${data.committeeName}</span> to gather valuable insights on key sustainability concerns. We also regularly consult with investors, customers, suppliers, regulators, and communities as well as NGOs who focus on sustainability goals, through surveys to understand their perspectives on our EESG performance.</p>
            
            <p><span class="highlight">Evaluation of Impact: </span></p>
            <p><span class="highlight"><i>Impact of ${data.companyName}'s Activities on Stakeholders and the Environment:</i></span></p>
            <ul>
                <li>Involves evaluating how operations affect society and the environment for each identified risk, while categorizing these impacts as positive or negative and determining whether they are actual or potential</li>
            </ul>
            
            <p><span class="highlight"><i>Financial Implications for ${data.companyName}'s Business Activities:</i></span></p>
            <ul>
                <li>Involves evaluating the financial effects of external factors on <span class="highlight">${data.companyName}</span>'s business for each identified risk, while defining the characteristics of these impacts and distinguishing between risks and opportunities</li>
            </ul>
            
            <p><span class="highlight">Evaluation of Level of Impact: </span></p>
            <p><span class="highlight">Criteria for Analysis</span></p>
            <p><span class="highlight">Environmental & Social Impact: </span>Evaluates factors such as scale, scope, likelihood, and the extent to which the impact is irreversible</p>
            <p><span class="highlight">Financial Impact: </span>Assesses the severity of the impact using both qualitative and quantitative measures, as well as the probability of occurrence.</p>
            
            <p>We conducted <span class="highlight">${data.workshopsConducted}</span> with our stakeholders including domestic and international employees of <span class="highlight">${data.companyName}</span>, customers, contractors, and other external stakeholders, to explain the assessed impacts, risks, and opportunities, while gathering their feedback. Stakeholders rated each issue's Scale, Scope, and Remedi ability for Impact Materiality and assessed Financial Materiality.</p>
            
            <p><span class="highlight">Prioritization:</span></p>
            <p>After stakeholders rated the material issues, we calculated average scores for Scale, Scope. We summed these scores to derive Impact Materiality scores. Key material issues were identified by multiplying the Financial and Impact Materiality scores. These identified risks are mapped onto a materiality matrix, enabling us to highlight and address the most critical risks that drive business success and shape stakeholder decisions.</p>
            
            <p><span class="highlight">Materiality Matrix:</span></p>
            <p><span class="highlight">Validation: </span></p>
            <p>In collaboration with the <span class="highlight">${data.committeeName}</span>, leadership, and experts, we review and validate key issues to align with our strategy, business model, and goals. These priorities are presented to the Board for approval, ensuring effective management of sustainability risks and opportunities. Going forward, we will evaluate the strength of our strategy against these challenges to ensure resilience and long-term success.</p>
        </div>
    </div>

    <div class="section">
        <div class="section-title">Sustainability-related Risks and Opportunities</div>
        <div class="content">
            <p>Our Sustainability-Incorporated business model effectively manages sustainability risks and opportunities in the short and medium term, ensuring operational resilience. With no significant uncertainties identified, there is no need for asset decommissioning, repurposing, or upgrades to financial facilities.</p>
            <p>Following risks and opportunities are identified that are relevant to our organization: <span class="highlight">${data.sustainabilityRisksAndOpportunities}</span></p>
        </div>
    </div>

    <div class="section">
        <div class="section-title">How ${data.companyName} defines its short-, medium- and long-term time horizon</div>
        <div class="content">
            <p><span class="highlight">${data.companyName}</span> established time horizons and scenarios to guide the analysis, closely aligning them with our strategic planning goals. Immediate actions address short-term needs, medium-term strategies ensure alignment with industry and global standards, and long-term goals drive our vision for sustainable transformation</p>
            
            <table>
                <tr>
                    <th>Short-Term</th>
                    <th>Medium-Term</th>
                    <th>Long-Term</th>
                </tr>
                <tr>
                    <td><span class="highlight">&lt; 3 Years</span></td>
                    <td><span class="highlight">3 to 6 Years</span></td>
                    <td><span class="highlight">&gt; 6 Years</span></td>
                </tr>
                <tr>
                    <td>Navigating short term performance expectations against long-term value creation within three years, currently set for 2027</td>
                    <td>Navigating medium term performance expectations against long-term value creation within six years period, currently set for 2030</td>
                    <td>Navigating long-term performance expectations against long-term value creation beyond six-year period, currently set for 2050, which aligns with our commitment to achieving Net Zero Carbon Emissions (NZCE) by 2050</td>
                </tr>
            </table>
        </div>
    </div>

    <div class="section">
        <div class="section-title">Trade-offs Consideration</div>
        <div class="content">
            <p><span class="highlight">Trade-Offs Consideration:</span></p>
            <p><span class="highlight">${data.companyName}</span> while choosing a location for new facility, carefully weighed the trade-offs between sustainability risks and opportunities. On one hand, we considered the positive impact of creating jobs and supporting the local economy. On the other hand, <span class="highlight">${data.companyName}</span> looked at potential environmental challenges, such as energy use. To address these issues, <span class="highlight">${data.companyName}</span> chose a site with access to <span class="highlight">${data.energySource}</span> sources ensuring the alignment of their sustainability goals as well as providing benefits to the community.</p>
        </div>
    </div>

    <div class="section">
        <div class="section-title">Risk Management</div>
        <div class="content">
            <p>At <span class="highlight">${data.companyName}</span>, sustainability risk management is integral to our operations as a leading <span class="highlight">${data.sectorIndustryName}</span> company. By embedding Sustainability considerations into our overall enterprise risk management framework, we address challenges unique to the ${data.sectorIndustryName} industry, such as <span class="highlight">${data.sustainabilityRisksAndOpportunities}</span></p>
            
            <p><span class="highlight">Strategic Risk Management Through the Lens of IFRS S1/ Sustainability-Related Risk Management in Alignment with IFRS-1</span></p>
            <p>Our dynamic approach includes:</p>
            <p><span class="highlight">Proactive Risk Identification:</span> Includes scanning across our operations and value chain for emerging and material risks.</p>
            <p><span class="highlight">Impact and Likelihood Assessment</span>: Evaluation of potential risks with precision</p>
            <p><span class="highlight">Strategic Prioritization</span>: Focusing on addressing the most significant sustainability risks that align with our materiality assessment</p>
            <p><span class="highlight">Real-Time Monitoring</span>: Leveraging technology and stakeholder feedback to track evolving risks continuously.</p>
            <p><span class="highlight">Transparent Reporting</span>: Delivering clear and accountable risk insights to internal and external stakeholders.</p>
            <p>By integrating these practices, we not only mitigate risks but also unlock opportunities to innovation, build stakeholder trust, and advance sustainability goals within our industry.</p>
            <p>Sustainability risk is prioritized over all other risks faced by <span class="highlight">${data.companyName}</span> due to its profound impact, strategic significance, and the strong commitment of our Board to championing sustainability into <span class="highlight">${data.companyName}</span>'s business operations.</p>
            
            <p><span class="highlight">Processes and Related Policies for Identifying, Assessing, Prioritizing, and Monitoring Sustainability-Related Risks:</span></p>
            <p>Our company has established a comprehensive set of processes and policies to identify, assess, prioritize, and monitor sustainability-related risks across our operations. The risk assessment is supported by our risk appetite and determines our risk response.</p>
            
            <p><span class="highlight">Proactive Risk Identification:</span></p>
            <p>Our sustainability committee leads a comprehensive approach to identifying risks by collaborating closely with key departments including <span class="highlight">${data.departmentsNames}</span> across the organization. This collaboration ensures a holistic view of potential risks through the integration of diverse internal and external data sources such as market research, regulatory updates, stakeholder feedback, and industry-specific assessments.</p>
            <p>Additionally, we actively engage <span class="highlight">${data.externalConsultants}</span> and subject matter experts to gain deeper insights and remain ahead of emerging risks and challenges.</p>
            
            <p><span class="highlight">Impact and Likelihood Assessment: </span></p>
            <p><span class="highlight">${data.companyName}</span> assesses the nature, likelihood, magnitude and financial impacts of risks by using both Qualitative factors in a way that it considers interest of employees, customers, contractors and other external stakeholders and <span class="highlight">${data.sectorIndustryName}</span> market trends prevailing, and Quantitative factors considering <span class="highlight">${data.benchmarkDetail}</span> a benchmark along with probability.</p>
            
            <p><span class="highlight">Strategic Prioritization:</span></p>
            <p>We weigh the risks based on their impact on business continuity, stakeholder trust, and long-term sustainability. <span class="highlight">${data.companyName}</span> also uses scenario analysis, industry benchmarks, and risk modeling to evaluate potential outcomes and prioritize risks accordingly. Critical risks are given higher priority, especially those related to climate change, regulatory compliance, resource scarcity, and supply chain disruptions.</p>
            
            <p><span class="highlight">Real-Time Monitoring and Transparent Reporting: </span></p>
            <p><span class="highlight">${data.companyName}</span> monitors sustainability-related risks by conducting regular risk assessments, tracking Key Performance Indicators (KPIs) of <span class="highlight">${data.companyName}</span> that includes <span class="highlight">${data.kpis}</span>, and utilizing scenario analysis to anticipate potential future challenges. It also engages with stakeholders and implements <span class="highlight">${data.dataMonitoringSystems}</span> to track energy use, waste, and emissions.</p>
        </div>
    </div>

    <div class="section">
        <div class="section-title">Climate-Related Strategy</div>
        <div class="content">
            <p>We continuously review and update our climate-related risks and opportunities to stay aligned with evolving climate data, frameworks, and guidelines. Our latest climate risk assessment, incorporated scenario analysis as per <span class="highlight">${data.reportingStandards}</span>, along with the most recent climate, energy, and economic data from the <span class="highlight">${data.ipccAndIea}</span>. These insights not only identified material climate risks and opportunities but also refined our response strategies. This chapter highlights our key climate scenario analysis findings and progress.</p>
        </div>
    </div>

    <div class="section">
        <div class="section-title">Time Horizons:</div>
        <div class="content">
            <p><span class="highlight">${data.companyName}</span> established time horizons and scenarios to guide the analysis, closely aligning them with our strategic planning goals. Immediate actions address short-term needs, medium-term strategies ensure alignment with industry and global standards, and long-term goals drive our vision for sustainable transformation</p>
            
            <table>
                <tr>
                    <th>Short-Term</th>
                    <th>Medium-Term</th>
                    <th>Long-Term</th>
                </tr>
                <tr>
                    <td><span class="highlight">&lt;3 Years</span></td>
                    <td><span class="highlight">3 to 6 Years</span></td>
                    <td><span class="highlight">&gt; 6 Years</span></td>
                </tr>
                <tr>
                    <td>This period is essential for managing urgent matters and responding to fast-evolving developments which may significantly affect our operations</td>
                    <td>This timeframe aligns with the mid-term targets outlined in Pakistan's Nationally Determined Contributions (NDCs). This period enables <span class="highlight">${data.companyName}</span> to address the projected surge in global demand for primary fossil fuels by 2030.</td>
                    <td>This timeframe supports our long-term ambitious planning to achieve carbon emission reduction goals in alignment with Net Zero Emission RoadMap by 2050 enabling <span class="highlight">${data.companyName}</span> to become market leader in sustainable business practices in <span class="highlight">${data.sectorIndustryName}</span> industry</td>
                </tr>
            </table>
        </div>
    </div>

    <div class="section">
        <div class="section-title">Scenario Analysis for Climate Risk Assessment</div>
        <div class="content">
            <p><span class="highlight">${data.companyName}</span> is exposed to climate related Physical and Transitional Risks.</p>
            <p><span class="highlight">Physical Risks:</span> Physical risks from climate change can be acute or chronic, potentially disrupting business operations, workforce, communities, investors, infrastructure, and assets</p>
            <p><span class="highlight">Acute Physical Risks:</span> Severe weather events such as floods, droughts, hurricanes, heatwaves, or geological changes can directly or indirectly affect operations, supply chains, and productivity.</p>
            <p><span class="highlight">Chronic Physical Risks: </span>Long-term climate shifts, may gradually affect resource availability, operational stability, and overall business sustainability.</p>
            <p><span class="highlight">Transitional</span> <span class="highlight">Risks: </span>Transition risks are associated with the extent at which an organization manages and adapts to the transitions related to climate change. These can be in the form of transition to net-zero emissions, technological innovations, market shifts, governmental policies, and some reputational risks.</p>
            
            <p>We have selected different scenarios for assessment of these risks because in an era of escalating climate change urgency, understanding and managing these risks is crucial for our long-term sustainability.</p>
            <ul>
                <li>To analyze physical risks, <span class="highlight">${data.companyName}</span> selected the <span class="highlight">${data.physicalRisksScenarios}</span> from <span class="highlight">${data.ipccAndIea}</span>, studying them across distinct scenarios: <span class="highlight">${data.physicalRisksScenarios}</span></li>
                <li>The evaluation of transitional risks is based on the <span class="highlight">${data.selectedBusinessSite}</span></li>
                <li>Both risk assessments also incorporate a scenario aligned with the Paris Agreement's target of limiting global warming to below 2°C</li>
            </ul>
            
            <p>Building on external research, climate-related disclosures from peers, and input from industry publications, we validate and prioritize identified risks and opportunities. Alongside these external inputs, we integrate <span class="highlight">${data.companyName}</span>'s internal assessment of exposure to evaluate the relevance and significance of each risk and opportunity to our business.</p>
            <p>Once material risks and opportunities are identified, we analyze their implications across <span class="highlight">${data.companyName}</span>'s value chain, focusing on potential impacts to our financial position and other areas as well. This ensures that we assess not only the immediate operational risks but also the broader implications for business continuity and long-term viability.</p>
        </div>
    </div>

    <div class="section">
        <div class="section-title">Physical Risks Assessment</div>
        <div class="content">
            <p><span class="highlight">Scope: ${data.companyName}</span> has selected <span class="highlight">${data.selectedBusinessSite}</span> site</p>
            <p><span class="highlight">Applied Scenarios: ${data.physicalRisksScenarios}</span></p>
            
            <table>
                <tr>
                    <th>Hazard</th>
                    <th>Baseline</th>
                    <th>2030 SSP1-2.6</th>
                    <th>2030 SSP5-8.5</th>
                    <th>2050 SSP1-2.6</th>
                    <th>2050 SSP5-8.5</th>
                    <th>Financial Impact</th>
                </tr>
                <tr>
                    <td>Coastal and Offshore</td>
                    <td>Limited</td>
                    <td>Limited</td>
                    <td>Limited</td>
                    <td>Limited</td>
                    <td>High</td>
                    <td>Low</td>
                </tr>
                <tr>
                    <td>Extreme Cold</td>
                    <td>Low</td>
                    <td>Limited</td>
                    <td>Limited</td>
                    <td>Limited</td>
                    <td>Limited</td>
                    <td>Low</td>
                </tr>
                <tr>
                    <td>Extreme Heat</td>
                    <td>Low</td>
                    <td>Limited</td>
                    <td>Moderate</td>
                    <td>Moderate</td>
                    <td>Very High</td>
                    <td>Moderate</td>
                </tr>
                <tr>
                    <td>Extreme Rainfall Flooding</td>
                    <td>Limited</td>
                    <td>Limited</td>
                    <td>Limited</td>
                    <td>Limited</td>
                    <td>Moderate</td>
                    <td>Limited</td>
                </tr>
                <tr>
                    <td>Extreme Winds and Storms</td>
                    <td>Limited</td>
                    <td>Limited</td>
                    <td>Limited</td>
                    <td>Limited</td>
                    <td>Limited</td>
                    <td>Limited</td>
                </tr>
                <tr>
                    <td>Rainfall-Induced Landslides</td>
                    <td>Limited</td>
                    <td>Limited</td>
                    <td>Limited</td>
                    <td>Limited</td>
                    <td>Limited</td>
                    <td>Limited</td>
                </tr>
                <tr>
                    <td>River Flooding</td>
                    <td>Limited</td>
                    <td>Limited</td>
                    <td>Limited</td>
                    <td>Limited</td>
                    <td>Moderate</td>
                    <td>Moderate</td>
                </tr>
                <tr>
                    <td>Wildfires</td>
                    <td>Limited</td>
                    <td>Limited</td>
                    <td>Limited</td>
                    <td>Limited</td>
                    <td>Limited</td>
                    <td>Limited</td>
                </tr>
                <tr>
                    <td>Water Stress and Droughts</td>
                    <td>Low</td>
                    <td>Moderate</td>
                    <td>Moderate</td>
                    <td>Moderate</td>
                    <td>Moderate</td>
                    <td>Moderate</td>
                </tr>
            </table>
        </div>
    </div>

    <div class="section">
        <div class="section-title">Transitional Risks</div>
        <div class="content">
            <p>Our assessment of transitional risks and opportunities is based on <span class="highlight">${data.selectedBusinessSite}</span></p>
            
            <table>
                <tr>
                    <th>Transition Driver</th>
                    <th>Type</th>
                    <th>2027</th>
                    <th>2030</th>
                    <th>2050</th>
                    <th>Financial Impact</th>
                </tr>
                <tr>
                    <td>Mandatory carbon pricing</td>
                    <td>Risk</td>
                    <td>High</td>
                    <td>Moderate</td>
                    <td>Low</td>
                    <td>Moderate</td>
                </tr>
                <tr>
                    <td>Tightening of supply and rising competition</td>
                    <td>Risk</td>
                    <td>Moderate</td>
                    <td>Moderate</td>
                    <td>Low</td>
                    <td>High</td>
                </tr>
                <tr>
                    <td>Tightened access to capital for carbon-intensive activities</td>
                    <td>Risk</td>
                    <td>Limited</td>
                    <td>Limited</td>
                    <td>Limited</td>
                    <td>Moderate</td>
                </tr>
                <tr>
                    <td>Increasing stakeholder scrutiny over climate disclosures</td>
                    <td>Risk</td>
                    <td>Limited</td>
                    <td>—</td>
                    <td>—</td>
                    <td>Limited</td>
                </tr>
                <tr>
                    <td>Promotion of circular Economy</td>
                    <td>Opportunity</td>
                    <td>Moderate</td>
                    <td>Moderate</td>
                    <td>Low</td>
                    <td>High</td>
                </tr>
                <tr>
                    <td>Increase in demand for more efficient products</td>
                    <td>Opportunity</td>
                    <td>Moderate</td>
                    <td>Moderate</td>
                    <td>Low</td>
                    <td>High</td>
                </tr>
                <tr>
                    <td>Enablers for low carbon energy technologies</td>
                    <td>Opportunity</td>
                    <td>Limited</td>
                    <td>Low</td>
                    <td>High</td>
                    <td>High</td>
                </tr>
                <tr>
                    <td>Near zero emission technologies</td>
                    <td>Risk</td>
                    <td>Limited</td>
                    <td>Limited</td>
                    <td>Moderate</td>
                    <td>High</td>
                </tr>
                <tr>
                    <td>Energy efficiency and electrification</td>
                    <td>Opportunity</td>
                    <td>Moderate</td>
                    <td>Moderate</td>
                    <td>Moderate</td>
                    <td>High</td>
                </tr>
            </table>
        </div>
    </div>

    <div class="section">
        <div class="section-title">Climate-related Risk Management</div>
        <div class="content">
            <p>At <span class="highlight">${data.companyName}</span>, we recognize the critical importance of managing climate-related risks and opportunities, as outlined by <span class="highlight">${data.reportingStandards}</span>, viewing it as a cornerstone for sustaining operational resilience and long-term success in the <span class="highlight">${data.sectorIndustryName}</span> industry. We will also incorporate climate-related RoadMaps scenarios issued by <span class="highlight">${data.ipccAndIea}</span>.</p>
            <p>The following steps outline our targeted process:</p>
            
            <p><span class="highlight">Identification of Climate Risks and Opportunities</span></p>
            <p>Identification through scenario modelling such as <span class="highlight">${data.transitionRiskScenarios}</span> and <span class="highlight">${data.physicalRisksScenarios}</span> and conducting a review of domestic and international literature, performing sustainability assessments, and consultations with experts.</p>
            
            <p><span class="highlight">Impact and Likelihood Evaluation</span></p>
            <p>Using our ERM framework, we assess how risks like stricter energy policies could affect schedules and costs. External datasets from <span class="highlight">${data.ipccAndIea}</span> are applied to scenario modelling, enabling precise evaluation of potential disruptions to our supply chain or cost structures. Financial modelling identifies material risks, such as those causing reduction of more than <span class="highlight">${data.benchmarkDetail}</span> triggering immediate escalation to our Board for strategic response.</p>
            
            <p><span class="highlight">Strategic Mitigation and Adaptation</span></p>
            <p>To reduce emissions, we transition energy sources to <span class="highlight">${data.energySource}</span>, minimizing our reliance on <span class="highlight">${data.energySource}</span>. Adaptive measures are implemented to secure supply chain resilience. As well as we are planning to use <span class="highlight">${data.innovativeFacility}</span> to reduce our Carbon emissions making us aligned with IPCC's 1.5°C Temperature Goal.</p>
            
            <p><span class="highlight">Continuous Monitoring and Adjustment</span></p>
            <p>Advanced monitoring tools such as <span class="highlight">${data.toolsUsed}</span> will track climate indicators like energy efficiency, emissions intensity. Regular audits by <span class="highlight">${data.externalAuditorAppointed}</span> and stakeholder engagements will ensure our strategies addressing the most pressing climate challenges faced by the <span class="highlight">${data.companyName}</span>.</p>
            
            <p><span class="highlight">Climate-Focused Transparency</span></p>
            <p>Our sustainability report, along with sustainability-related risks, will detail climate-related risks, mitigation measures, and their outcomes, adhering to IFRS S2 and demonstrating accountability to stakeholders. Insights from these disclosures will guide continuous improvement and position <span class="highlight">${data.companyName}</span> as a leader in climate-conscious <span class="highlight">${data.sectorIndustryName}</span>.</p>
        </div>
    </div>

    <div class="section">
        <div class="section-title">Metrics and Targets</div>
        <div class="content">
            <p>Metrics of <span class="highlight">${data.companyName}</span> are clearly defined, explaining what it measures, how it's calculated, and its relevance to sustainability goals including <span class="highlight">scope</span>, <span class="highlight">period</span> of measurement, and the <span class="highlight">methodology</span> used to calculate the metric.</p>
            <p>Metrics of <span class="highlight">${data.companyName}</span> have been taken with thorough analysis and meticulous review and are in alignment with the <span class="highlight">${data.reportingStandards}</span>.</p>
        </div>
    </div>
</body>
</html>
`;
}
