export interface GRIReportData {
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

export function generateGRIReport(data: GRIReportData): string {
    return `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>GRI Sustainability Report</title>
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
                <div class="section-title">Board's Statement on Sustainability</div>
                <div class="content">
                    <p><span class="highlight">A Word from Our ${data.leadershipTitle}, Charting Our Sustainable Path</span></p>
                    <p>We extend our sincere appreciation for your continued trust and support as we work collectively toward a more sustainable and resilient future.</p>
                    <p>The past year has underscored the growing urgency of global challenges, including the escalating impacts of climate change, socio-economic uncertainties, and evolving stakeholder expectations. These developments call for strong, adaptive, and responsible action.</p>
                    <p>Recognizing the significance of these issues, we remain committed to embedding sustainability at the heart of our strategy. Our focus areas—ranging from environmental stewardship and climate action to workforce development, health and safety, and community engagement—reflect our dedication to creating long-term value while contributing to a better world.</p>
                    <p>We continue to make progress by reducing our environmental footprint, adopting cleaner technologies, promoting diversity and inclusion, and supporting communities through targeted development initiatives. These efforts are grounded in a broader commitment to ethical conduct, transparency, and accountability.</p>
                    <p>Our sustainability approach is informed by globally recognized standards and frameworks, including the <span class="highlight">${data.reportingStandards}</span></p>
                    <p>As we look ahead, we remain focused on evolving our sustainability practices to meet emerging challenges and opportunities, ensuring our continued contribution to a more inclusive, equitable, and sustainable future for all.</p>
                    <p>Sincerely,<br>
                    <span class="highlight">${data.leadershipTitle}</span><br>
                    <span class="highlight">${data.companyName}</span></p>
                    
                    <p><span class="highlight">Milestones in Sustainability: Our Strategic Roadmap:</span></p>
                    <p>At <span class="highlight">${data.companyName}</span>, sustainability is not just a goal but a responsibility to redefine responsible business practices while fostering innovation and resilience in a changing world.</p>
                    <p>We focus on creating long-term value for all stakeholders—customers, employees, communities, and the planet—by integrating economic growth with environmental stewardship and social well-being. It is the foundation of our business, driving innovation, future-proofing operations, and meeting the rising expectations of conscious consumers and investors.</p>
                    <p>We recognize that sustainability is a shared journey, requiring collaboration from all stakeholders, and this strategy outlines our commitment to achieving a greener, more equitable future for all.</p>
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
