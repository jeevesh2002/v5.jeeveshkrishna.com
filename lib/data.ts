export const siteConfig = {
  name: "Jeevesh Krishna Arigala",
  siteUrl: "https://jeeveshkrishna.com",
  title: "Computer Scientist",
  subtitle: "MS CS · UMass Amherst",
  tagline:
    "I work on networks and security. I think about how technology and policy shape civilization and whether we make it to the next rung on the Kardashev scale.",
  email: "contactme@jeeveshkrishna.com",
  github: "https://github.com/jeevesh2002",
  linkedin: "https://www.linkedin.com/in/jeevesh-krishna-arigala/",
};

export interface DiscontinuedSite {
  name: string;
  archiveUrl?: string;
}

export const discontinuedSites: DiscontinuedSite[] = [
  { name: "Portfolio v1", archiveUrl: "https://portfoliov1.jeeveshkrishna.com" },
  { name: "Portfolio v2", archiveUrl: "https://portfoliov2.jeeveshkrishna.com" },
  { name: "Portfolio v3", archiveUrl: "https://portfoliov3.jeeveshkrishna.com" },
  { name: "Retro", archiveUrl: "https://retro.jeeveshkrishna.com" },
  { name: "Car Game", archiveUrl: "https://car-game.jeeveshkrishna.com" },
  { name: "Kodex Draw", archiveUrl: "https://kodex-draw.jeeveshkrishna.com" },
  { name: "Cynaptic", archiveUrl: "https://cynaptic.jeeveshkrishna.com" },
  { name: "Books", archiveUrl: "https://books.jeeveshkrishna.com" },
  { name: "Blog", archiveUrl: "https://blog.jeeveshkrishna.com" },
  { name: "Kodex API", archiveUrl: "https://api.jeeveshkrishna.com" },
];

export interface InterestLink {
  title: string;
  source: string;
  url: string;
  description: string;
  hidden?: boolean;
}

export interface InterestSection {
  id: string;
  title: string;
  intro: string;
  links: InterestLink[];
}

const _interests: InterestSection[] = [
  {
    id: "foundations",
    title: "Foundations",
    intro: "Science, ideas, and how to think.",
    links: [
      {
        title: "The Importance of Scientific Research",
        source: "Carl Sagan",
        url: "https://www.youtube.com/watch?v=2dxsLFH0c20",
        description:
          "Sagan on why a society that stops investing in curiosity-driven research cannot sustain itself.",
      },
      {
        title: "What is Science?",
        source: "Richard Feynman",
        url: "https://www.fotuva.org/feynman/what_is_science.html",
        description:
          "A 1966 address to science teachers. On the difference between knowing the name of something and actually understanding it.",
      },
      {
        title: "The Selfish Gene",
        source: "Richard Dawkins",
        url: "https://global.oup.com/academic/product/the-selfish-gene-9780198788607",
        description:
          "The gene-centered view of evolution. Rewired how I think about natural selection, cooperation, and why organisms exist at all.",
      },
      {
        title: "The Bitter Lesson",
        source: "Rich Sutton",
        url: "http://www.incompleteideas.net/IncIdeas/BitterLesson.html",
        description:
          "The most important pattern in AI research: methods that leverage scale always win over methods that encode human knowledge. Short and still being ignored.",
      },
    ],
  },
  {
    id: "gcr",
    title: "Global Catastrophic Risks",
    intro: "Research and policy on the risks that could cause civilizational-scale harm.",
    links: [
      {
        title: "Global Priorities Research",
        source: "80,000 Hours",
        url: "https://80000hours.org/problem-profiles/",
        description:
          "Which problems are most important to work on? Rigorous analysis of AI safety, biosecurity, and other pressing risks.",
      },
      {
        title: "Global Catastrophic Risk Institute",
        source: "GCRI",
        url: "https://gcri.org/",
        description:
          "Research on catastrophic and existential risk governance and decision-making under deep uncertainty.",
      },
      {
        title: "Center for Health Security",
        source: "Johns Hopkins",
        url: "https://centerforhealthsecurity.org/",
        description:
          "Pandemic preparedness, biosecurity research, and global health security policy.",
      },
      {
        title: "Nuclear Threat Initiative",
        source: "NTI",
        url: "https://www.nti.org/",
        description:
          "Policy and research working to reduce nuclear and biological threats globally.",
      },
      {
        title: "The Vulnerable World Hypothesis",
        source: "Nick Bostrom",
        url: "https://nickbostrom.com/papers/vulnerable.pdf",
        description:
          "A framework for thinking about how technological progress could produce catastrophic outcomes even without any actor intending harm.",
      },
    ],
  },
  {
    id: "engineering",
    title: "Engineering & Systems",
    intro: "Papers and resources on building systems that work at scale.",
    links: [
      {
        title: "High Scalability",
        source: "highscalability.com",
        url: "https://highscalability.com/",
        description:
          "Architecture case studies of real high-traffic systems. How Discord, Stripe, and others actually work.",
      },
      {
        title: "Reflections on Trusting Trust",
        source: "Ken Thompson",
        url: "https://www.cs.cmu.edu/~rdriley/487/papers/Thompson_1984_ReflectionsonTrustingTrust.pdf",
        description:
          "Thompson's 1984 Turing Award lecture. Why you cannot fully verify the integrity of a system you did not build yourself.",
      },
      {
        title: "Time, Clocks, and the Ordering of Events in a Distributed System",
        source: "Leslie Lamport",
        url: "https://lamport.azurewebsites.net/pubs/time-clocks.pdf",
        description:
          "The 1978 paper that introduced logical clocks. Still the clearest explanation of why distributed time is hard.",
      },
      {
        title: "Dynamo: Amazon's Highly Available Key-value Store",
        source: "Amazon",
        url: "https://www.allthingsdistributed.com/files/amazon-dynamo-sosp2007.pdf",
        description:
          "The paper behind much of how we think about eventual consistency and availability tradeoffs in distributed databases.",
      },
      {
        title: "KoveSDM White Paper",
        source: "Kove",
        url: "https://kove.com/kovesdm-white-paper",
        description:
          "Software-defined memory architecture that disaggregates DRAM from compute nodes. Relevant to how memory-intensive workloads can be scaled without physical hardware constraints.",
      },
    ],
  },
];

export const interests: InterestSection[] = _interests.map((section) => ({
  ...section,
  links: section.links.filter((link) => !link.hidden),
}));
