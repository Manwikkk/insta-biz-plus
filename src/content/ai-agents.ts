/** AI agent development — verbatim from website-content/services/ai-agent-development.md. */

export const aiAgents = {
  tag: 'Agentic AI',
  tagNote: 'Production-grade AI agents, shipped fast',
  h1: 'AI Agent Development Company in India',
  intro:
    'Insta Biz Web is an AI agent development company in India building custom agentic AI workflows, RAG chatbots, voice agents and multi-agent systems for startups, SMBs and enterprises across India and overseas. From prototype in 7 days to production in 7 weeks.',
  introLink: { label: 'agentic AI workflows', href: 'https://www.langchain.com/langgraph' },
  primary: 'Get a Free AI Strategy Call',
  secondary: 'WhatsApp Us',
  stats: [
    { value: '25+', label: 'AI agents shipped' },
    { value: '4.9/5', label: 'Client rating' },
    { value: '60%', label: 'Avg. cost saved' },
    { value: '<24h', label: 'First response' },
  ],
  shift: {
    eyebrow: 'The agentic AI shift',
    title: 'From chatbots to digital coworkers.',
    paragraphs: [
      {
        text: 'The global AI agent market is projected to grow from $7.6 billion in 2025 to over $182 billion by 2033. In India, businesses from real estate to e-commerce to healthcare are racing to deploy autonomous AI agents that qualify leads, answer customer queries, automate operations and unlock 24/7 productivity.',
        link: {
          label: '$7.6 billion in 2025 to over $182 billion by 2033',
          href: 'https://cloud.google.com/resources/content/ai-agent-trends-2026',
        },
      },
      {
        text: "But most agencies still ship demo-grade chatbots that hallucinate in production. We don't. We build production-grade AI agents with proper evaluations, guardrails, observability, cost monitoring and human-in-the-loop fallbacks. The difference shows in week 4, when your agent is handling real customers without breaking.",
        link: { label: 'evaluations', href: 'https://platform.openai.com/docs/guides/evals' },
      },
    ],
    deepDive: {
      label: 'AI agents in 2026: from chatbots to digital coworkers',
      href: '/blogs/ai-agents-2026-from-chatbots-to-digital-coworkers',
    },
  },
  types: {
    eyebrow: 'What we build',
    title: 'Six types of AI agents we develop.',
    intro: 'From simple RAG chatbots to multi-agent orchestration platforms, our team has shipped them all.',
    items: [
      {
        title: 'RAG Chatbots',
        body: 'Retrieval-Augmented Generation chatbots that answer questions from your private knowledge base, documents, PDFs, Notion or Google Drive with citations.',
        tech: ['LangChain', 'OpenAI', 'Pinecone', 'ChromaDB'],
        price: 'From ₹40,000',
      },
      {
        title: 'AI Voice Agents',
        body: '24/7 voice agents that handle inbound and outbound calls, qualify leads, book appointments and update your CRM. Hindi, English and regional languages.',
        tech: ['VAPI', 'Retell', 'Twilio', 'ElevenLabs'],
        price: 'From ₹85,000',
      },
      {
        title: 'Workflow Automation Agents',
        body: 'Multi-step agents that read emails, summarize documents, fill forms, scrape data and post to Slack. Connect 5,000+ apps via n8n, Zapier or custom code.',
        tech: ['n8n', 'Zapier', 'Make.com', 'Python'],
        price: 'From ₹60,000',
      },
      {
        title: 'Sales & Lead Qualification Agents',
        body: 'AI SDRs that engage website visitors, qualify leads, route hot prospects to your team and follow up over WhatsApp, email and SMS.',
        tech: ['GPT-4', 'Claude', 'Twilio', 'HubSpot'],
        price: 'From ₹75,000',
      },
      {
        title: 'Multi-Agent Orchestration',
        body: 'Teams of specialized AI agents that collaborate: one researches, one writes, one reviews, one publishes. Built on CrewAI, AutoGen or OpenAI Swarm.',
        tech: ['CrewAI', 'AutoGen', 'LangGraph', 'Swarm'],
        price: 'From ₹1,80,000',
      },
      {
        title: 'Custom AI Copilots',
        body: 'Domain-specific copilots embedded in your SaaS or internal tools. Code copilots, sales copilots, support copilots, all trained on your data.',
        tech: ['RAG', 'Fine-tuning', 'Vector DB', 'OpenAI'],
        price: 'From ₹2,50,000',
      },
    ],
  },
  useCases: {
    eyebrow: 'Real-world use cases',
    title: 'AI agents shipping in production today.',
    intro:
      'Every agent we build solves a measurable business problem. Here are six industries where AI agents are already paying for themselves.',
    items: [
      {
        title: 'E-commerce & D2C',
        points: [
          'Product recommendation agents',
          'Cart abandonment WhatsApp recovery',
          'Order tracking and returns chatbot',
          'AI-powered product search',
        ],
      },
      {
        title: 'Real Estate',
        points: [
          'Lead qualification voice agent',
          'Property recommendation chatbot',
          'Site visit booking automation',
          'Builder document RAG search',
        ],
      },
      {
        title: 'Customer Support',
        points: [
          'Tier-1 support chatbot (handles 70% tickets)',
          'Ticket triage and routing agent',
          'Knowledge base RAG agent',
          'Agent assist copilot for human reps',
        ],
      },
      {
        title: 'Healthcare & Clinics',
        points: [
          'Appointment booking voice agent',
          'Patient intake form chatbot',
          'Insurance pre-auth automation',
          'Lab report summarization agent',
        ],
      },
      {
        title: 'B2B Sales & SaaS',
        points: [
          'AI SDR for outbound prospecting',
          'Inbound lead qualification agent',
          'Demo scheduling automation',
          'Onboarding copilot for new users',
        ],
      },
      {
        title: 'Internal Operations',
        points: [
          'Email summarization and triage',
          'Invoice processing agent',
          'Meeting notes and action items',
          'Internal HR and IT chatbot',
        ],
      },
    ],
  },
  why: {
    eyebrow: 'Why teams pick us',
    title: 'Six reasons we are a top AI agent development company.',
    items: [
      {
        title: 'MVP in 7 days, not 7 months',
        body: 'We ship working agents in 1 week. Big consultancies take 6 months and a 200-page strategy deck. We build, you test, we iterate.',
      },
      {
        title: 'Production-grade, not demo-ware',
        body: 'Evals, guardrails, observability, cost monitoring, fallback paths and human-in-the-loop. Built to handle real traffic, not just demo videos.',
      },
      {
        title: 'Model-agnostic architecture',
        body: 'We pick the right model for each task: GPT-5, Claude Sonnet 4.6, Gemini, or open-source Llama. Switch providers without rewriting your stack.',
      },
      {
        title: 'You own the code, weights & prompts',
        body: 'Full source code, prompt library, eval datasets and infrastructure handed over from day one. No vendor lock-in. No hidden API keys.',
      },
      {
        title: 'Transparent INR pricing with GST',
        body: 'Fixed quotes in Indian Rupees with GST invoice. Token cost monitoring built in so you never get a surprise OpenAI bill.',
      },
      {
        title: 'Senior AI engineers, not interns',
        body: 'Every project is led by a senior engineer who has shipped production AI. No junior developers, no offshoring, no babysitting required.',
      },
    ],
  },
  pricing: {
    eyebrow: 'Transparent pricing',
    title: 'AI agent development cost in India.',
    intro: 'Fixed INR pricing with GST invoice. Three tiers from MVP to enterprise. No hourly billing, no surprise costs.',
    tiers: [
      {
        name: 'Starter Agent',
        tagline: 'Single-task chatbot or workflow',
        price: '₹40,000 - ₹1,50,000',
        timeline: 'Timeline: 2 - 4 weeks',
        points: [
          '1 agent, 1 use case',
          'RAG over your documents',
          'Web chat or WhatsApp deployment',
          'Basic analytics dashboard',
          '30 days post-launch support',
        ],
        popular: false,
      },
      {
        name: 'Production Agent',
        tagline: 'Multi-channel, integrated agent',
        price: '₹1,80,000 - ₹6,00,000',
        timeline: 'Timeline: 5 - 10 weeks',
        points: [
          'Multi-channel deployment (web, WhatsApp, voice)',
          'CRM, helpdesk and DB integrations',
          'Evals and quality monitoring',
          'Cost and token dashboards',
          'Custom admin panel',
          '60 days support + retainer option',
        ],
        popular: true,
      },
      {
        name: 'Enterprise Multi-Agent',
        tagline: 'Custom multi-agent platform',
        price: '₹8,00,000+',
        timeline: 'Timeline: 12 - 20 weeks',
        points: [
          'Multi-agent orchestration (CrewAI / LangGraph)',
          'Custom fine-tuning if needed',
          'On-prem or VPC deployment',
          'SOC 2 / DPDP-compliant infrastructure',
          'Dedicated AI engineer on retainer',
          'SLA-backed uptime and accuracy',
        ],
        popular: false,
      },
    ],
    cta: 'Get fixed quote',
    note: 'Need something custom? We also offer bundled engagements with web development, mobile apps and CRM integration. All prices exclude GST and OpenAI / Anthropic API token costs, which are billed at-cost with full token dashboards.',
  },
  process: {
    eyebrow: 'How we work',
    title: 'A 6-step process from idea to production.',
    intro: 'We ship a working prototype in 7 days. You test it with real users. Then we scale it to production.',
    steps: [
      {
        n: '01',
        title: 'Free AI strategy call',
        body: '30-minute call to understand your business problem, current workflow and where AI agents will create the most leverage. No sales pitch.',
      },
      {
        n: '02',
        title: 'Use-case discovery & ROI map',
        body: "We document the agent's job, success metrics, integrations needed and projected ROI. You approve before any code is written.",
      },
      {
        n: '03',
        title: 'Rapid prototype in 7 days',
        body: 'We ship a working proof-of-concept in 1 week so you can test the agent with real users before committing to full build.',
      },
      {
        n: '04',
        title: 'Production build & integrations',
        body: 'We engineer the production agent with proper observability, evals, guardrails, fallback paths and integration to your CRM, helpdesk or DB.',
      },
      {
        n: '05',
        title: 'Deployment & monitoring',
        body: 'Cloud deployment on AWS, GCP or Vercel with logging, error tracking, cost dashboards and weekly performance reviews.',
      },
      {
        n: '06',
        title: 'Ongoing tuning & support',
        body: 'Monthly retainer to refine prompts, add new tools, handle edge cases and keep your agent performing as your business evolves.',
      },
    ],
  },
  stack: {
    eyebrow: 'Modern AI stack',
    title: 'Built with the same tools as OpenAI, Anthropic and Google.',
    items: [
      { label: 'OpenAI GPT-5', href: 'https://platform.openai.com/' },
      { label: 'Claude Sonnet 4.6', href: 'https://www.anthropic.com/' },
      { label: 'Google Gemini 2.5', href: 'https://ai.google.dev/' },
      { label: 'LangChain', href: 'https://www.langchain.com/' },
      { label: 'LangGraph', href: 'https://www.langchain.com/langgraph' },
      { label: 'OpenAI Agents SDK', href: 'https://openai.github.io/openai-agents-python/' },
      { label: 'CrewAI', href: 'https://www.crewai.com/' },
      { label: 'AutoGen', href: 'https://microsoft.github.io/autogen/' },
      { label: 'Pinecone', href: 'https://www.pinecone.io/' },
      { label: 'ChromaDB', href: 'https://www.trychroma.com/' },
      { label: 'Vercel AI SDK', href: 'https://sdk.vercel.ai/' },
      { label: 'n8n', href: 'https://n8n.io/' },
      { label: 'VAPI', href: 'https://vapi.ai/' },
      { label: 'Retell AI', href: 'https://www.retellai.com/' },
      { label: 'Twilio', href: 'https://www.twilio.com/' },
      { label: 'ElevenLabs', href: 'https://elevenlabs.io/' },
    ],
  },
  faqEyebrow: 'FAQs',
  faqTitle: 'AI agent development: questions answered.',
  ready: {
    title: 'Ready to build your first AI agent?',
    body: 'Book a free 30-minute strategy call with a senior AI engineer. We will scope your use case, estimate ROI and propose a fixed INR price.',
    cta: 'Book a free AI strategy call',
  },
  hq: {
    eyebrow: 'Headquartered in India',
    title: 'Talk to a real AI engineering team.',
    intro:
      'We are headquartered in Ahmedabad, Gujarat with senior engineers across India. Walk into our office, hop on a Google Meet, or meet us at your office anywhere in Bangalore, Mumbai, Delhi, Pune or Hyderabad.',
    also: { label: 'Also: Web Development Company in Ahmedabad', href: '/web-development-company-in-ahmedabad' },
    primary: 'Book free strategy call',
    secondary: 'Contact options',
  },
  idea: {
    title: 'Already have an idea?',
    body: 'Tell us your use case in 2 sentences and we will reply within 24 hours with a free scoping document, ROI estimate and fixed INR quote.',
    points: ['No NDA required for first call', 'No 200-page strategy decks, ever', 'Working prototype in 7 days'],
    cta: 'Send your idea',
  },
  more: {
    eyebrow: 'Explore Insta Biz Web',
    title: 'More services and insights',
    links: [
      { label: 'All web, mobile, AI and CRM services', href: '/services' },
      { label: 'Web Development Company in Ahmedabad', href: '/web-development-company-in-ahmedabad' },
      {
        label: 'Blog: AI Agents 2026 - from chatbots to digital coworkers',
        href: '/blogs/ai-agents-2026-from-chatbots-to-digital-coworkers',
      },
      {
        label: 'Blog: AEO and GEO - rank in Google AI Overviews and ChatGPT',
        href: '/blogs/aeo-geo-how-to-rank-in-google-ai-overviews-and-chatgpt',
      },
      { label: 'Portfolio: AI projects we have shipped', href: '/portfolio' },
      { label: 'Contact: Book a free AI strategy call', href: '/contact-us' },
    ],
  },
  resources: {
    eyebrow: 'AI development resources',
    title: 'Learn more about agentic AI',
    links: [
      { label: 'OpenAI: Building AI Agents Guide', href: 'https://platform.openai.com/docs/guides/agents' },
      { label: 'Anthropic: Building Effective AI Agents', href: 'https://www.anthropic.com/research/building-effective-agents' },
      { label: 'Google Cloud: AI Agent Trends 2026 Report', href: 'https://cloud.google.com/resources/content/ai-agent-trends-2026' },
      { label: 'LangChain: Agents Concepts Documentation', href: 'https://python.langchain.com/docs/concepts/agents/' },
      { label: 'Wikipedia: Intelligent Agent', href: 'https://en.wikipedia.org/wiki/Intelligent_agent' },
      { label: 'IndiaAI: Government of India AI Mission', href: 'https://www.meity.gov.in/indiaai' },
    ],
  },
}

export const aiAgentFaqs = [
  {
    q: 'What is AI agent development?',
    a: 'AI agent development is the process of building autonomous software systems that can perceive their environment, reason about goals, use tools (APIs, databases, browsers), and execute multi-step tasks with minimal human supervision. Unlike traditional chatbots that follow rigid scripts, AI agents adapt their behaviour based on context and feedback to achieve business outcomes.',
  },
  {
    q: 'How much does it cost to build an AI agent in India?',
    a: 'AI agent development cost in India ranges from ₹40,000 for a single-task chatbot, ₹1,80,000 to ₹6,00,000 for a production-grade integrated agent, and ₹8,00,000+ for enterprise multi-agent systems. Final pricing depends on integrations, model choice, expected traffic, and accuracy requirements. We provide fixed INR quotes with GST invoice within 24 hours of your enquiry.',
  },
  {
    q: 'How long does it take to develop an AI agent?',
    a: 'A simple RAG chatbot or workflow agent takes 2 to 4 weeks. A production agent with CRM and helpdesk integrations takes 5 to 10 weeks. Enterprise multi-agent systems take 12 to 20 weeks. We always ship a working prototype in the first 7 days so you can validate the use case before full investment.',
  },
  {
    q: 'What is the difference between a chatbot and an AI agent?',
    a: 'A traditional chatbot follows pre-defined decision trees and intents. An AI agent uses a large language model to reason about its goal, decide which tools to call (search, database, API, calculator), execute multi-step plans, and self-correct when something fails. Agents are non-deterministic, tool-using, and goal-oriented, while chatbots are scripted and reactive.',
  },
  {
    q: 'Which AI models do you use?',
    a: 'We are model-agnostic. We use OpenAI GPT-5 for general reasoning and tool use, Anthropic Claude Sonnet 4.6 for long-context document analysis and coding, Google Gemini 2.5 for multimodal tasks, and open-source Llama or Mistral models when data privacy or cost requires on-premise deployment. We pick the right model per task, not per fashion.',
  },
  {
    q: 'Can you build voice agents that speak Hindi and Indian languages?',
    a: "Yes. We build voice agents in Hindi, English, Gujarati, Tamil, Telugu, Marathi and Bengali using ElevenLabs, Sarvam AI, and OpenAI's voice models. They handle inbound and outbound calls over Twilio or Exotel, integrate with your CRM, and are tuned for Indian accents and code-mixed conversation.",
  },
  {
    q: 'What integrations can the AI agent connect to?',
    a: 'Our agents integrate with HubSpot, Zoho, Salesforce, Freshdesk, Zendesk, Intercom, Slack, Microsoft Teams, Google Workspace, Notion, Airtable, WhatsApp Business API, Razorpay, Shopify, WooCommerce, Odoo, Tally, custom databases (Postgres, MySQL, MongoDB), and any REST or GraphQL API.',
  },
  {
    q: 'How do you ensure the AI agent is accurate and safe?',
    a: 'We build evaluation datasets specific to your use case, run automated evals before every deployment, add guardrails using libraries like Guardrails AI or NeMo Guardrails, implement human-in-the-loop for high-stakes decisions, log every agent action for audit, and monitor token costs and latency in production. Quality is engineered, not hoped for.',
  },
  {
    q: 'Do you offer ongoing support and improvements?',
    a: 'Yes. After launch, we offer monthly retainers starting at ₹35,000 per month for prompt tuning, eval improvements, new tool integration, edge-case handling and model upgrades. Most clients stay on retainer because AI agents need continuous improvement as your business and the underlying models evolve.',
  },
  {
    q: 'Can the AI agent be deployed on our own cloud or on-premise?',
    a: 'Yes. We deploy on AWS, Google Cloud, Azure, Vercel, or your own VPC. For sensitive workloads we deploy fully on-premise using open-source models like Llama 3.3 or Mistral, with no data ever leaving your infrastructure. We also handle DPDP, SOC 2 and ISO 27001 compliance requirements.',
  },
]
