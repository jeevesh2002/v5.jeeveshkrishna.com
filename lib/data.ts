export const siteConfig = {
  name: "Jeevesh Krishna Arigala",
  title: "Computer Scientist",
  subtitle: "MS CS · UMass Amherst",
  tagline: "I work on networks and security. I think about how technology and policy shape civilization and whether we make it to the next rung on the Kardashev scale.",
  email: "contactme@jeeveshkrishna.com",
  github: "https://github.com/jeevesh2002",
  linkedin: "https://www.linkedin.com/in/jeevesh-krishna-arigala/",
  resume: "/resume.pdf",
};

export const experience = [
  {
    company: "Rivos (Now Acquired by Meta)",
    role: "Infrastructure & DevOps Engineer Intern",
    location: "Santa Clara, CA, USA",
    period: "June 2025 – November 2025",
    bullets: [
      "Automated infrastructure with Puppet and migrated legacy configs to OpenVox with zero downtime following the Puppet acquisition.",
      "Migrated all user VMs from VMware to a Proxmox HA cluster; stood up Ceph (MONs + OSDs), validated failover, and completed node/VM cutovers with minimal disruption.",
      "Built a unified monitoring and alerting stack using Prometheus and Grafana, managing telemetry for over 500 SLURM nodes and power distribution units (PDUs).",
      "Designed and implemented power-aware scheduling for SLURM clusters by integrating SNMP-derived PDU power metrics; adjusted node weights dynamically to improve energy efficiency.",
      "Developed WAN performance metrics and observability solutions to monitor network health across offices worldwide, enabling faster troubleshooting.",
    ],
  },
  {
    company: "NatWest Group",
    role: "Security Software Development Engineer Intern",
    location: "Chennai, TN, India",
    period: "June 2023 – August 2023",
    bullets: [
      "Developed a Spring Framework application automating SSO token generation and consumption, reducing sign-in time across internal systems.",
      "Integrated the bank's Identity Provider (IDP) system, enhancing security for over 1,000 users and streamlining access to over 15 software suites.",
      "Deployed the application in User Acceptance Testing (UAT) across three bank branches, reducing average sign-in time from 40 seconds to under 10 seconds.",
      "Implemented SAML and SOAP protocols, reducing manual authentication errors.",
    ],
  },
];

export const education = [
  {
    school: "University of Massachusetts – Amherst",
    degree: "Master of Science in Computer Science",
    location: "Amherst, MA, USA",
    period: "August 2024 – May 2026",
    gpa: "3.9",
    courses: [
      "Computer Networks and Security",
      "Secure and Distributed Systems",
      "Cryptography",
      "Distributed Operating Systems",
      "Quantum Communication Networks",
    ],
  },
  {
    school: "Anna University | SSN College of Engineering",
    degree: "Bachelor of Engineering in Computer Science",
    location: "Chennai, TN, India",
    period: "August 2020 – June 2024",
    gpa: "8.77",
    courses: [],
  },
];

export const skills = {
  Languages: ["Python", "JavaScript", "TypeScript", "Java", "C", "C++", "Bash", "SQL", "HTML/CSS"],
  Frameworks: ["React.js", "Next.js", "Node.js", "Express.js", "Django", "Flask", "TailwindCSS", "TensorFlow", "OpenCV"],
  "Infrastructure & Tools": ["Docker", "Kubernetes", "Puppet", "Ansible", "Prometheus", "Grafana", "Git", "Linux/Unix", "SLURM"],
  Networking: ["SNMP", "NETCONF", "YANG", "Wireshark", "iptables", "HAProxy", "Caddy"],
  "Cloud & Databases": ["AWS", "GCP", "Vercel", "Digital Ocean", "PostgreSQL", "MongoDB", "MySQL", "Firebase"],
};

export const projects = [
  {
    title: "Secure-by-Design Federated Learning Protocol",
    tags: ["Cryptography", "ML", "Privacy", "FHE"],
    bullets: [
      "Developed a zero-trust privacy-preserving ML protocol using Fully Homomorphic Encryption for secure distributed training and inference.",
      "Implemented a custom modification of SecAgg+ for collaborative learning, optimized FHE performance via quantization and programmable bootstrapping.",
      "Created a disease prediction model on encrypted data, matching non-encrypted accuracy while preserving privacy.",
    ],
  },
  {
    title: "HPC Workflow Management System Integration",
    tags: ["HPC", "SLURM", "Python", "Distributed Systems"],
    bullets: [
      "Integrated Covalent plugin with university's SLURM-managed HPC cluster, enabling dynamic job scheduling and resource allocation.",
      "Resolved critical Prefect workflow monitoring challenges by eliminating indefinite worker processes and mitigating port exhaustion.",
      "Designed a custom SLURM job wrapper to enforce policy compliance during high-throughput ML tasks.",
    ],
  },
  {
    title: "High-Performance Network Infrastructure",
    tags: ["Kubernetes", "Homelab", "Networking", "DevOps"],
    bullets: [
      "Built a Kubernetes cluster with 1 master + 4 worker nodes on Raspberry Pi 4s with containerd runtime.",
      "Configured Caddy as reverse proxy with automatic SSL/TLS via Let's Encrypt ACME and HAProxy as L4 load balancer.",
      "Implemented comprehensive network security using UFW/iptables with stateful packet filtering, rate limiting, and DDoS protection.",
    ],
  },
  {
    title: "Zero-Trust Network Architecture",
    tags: ["Security", "OpenZiti", "Homelab", "VLANs"],
    bullets: [
      "Deployed OpenZiti with mutual TLS (mTLS) and granular RBAC for secure access without public internet exposure.",
      "Implemented network segmentation using VLANs (10/20/30) for logical isolation across personal, community, and management networks.",
      "Configured Layer 3 subnet isolation with custom iptables rulesets for inter-VLAN routing and UFW for stateful packet filtering.",
    ],
  },
  {
    title: "Distributed Computing Beowulf Cluster",
    tags: ["HPC", "Raspberry Pi", "MPI", "SLURM"],
    bullets: [
      "Designed and built a Beowulf cluster using 6 Raspberry Pi nodes (1 head, 5 compute) connected via Gigabit Ethernet.",
      "Implemented SLURM for workload management integrated with OpenMPI for parallel computing.",
      "Deployed Ganglia for real-time cluster performance metrics; tested with distributed matrix operations and Monte Carlo simulations.",
    ],
  },
];

export const awards = [
  {
    title: "IBM Quantum Spring Challenge 2023",
    org: "IBM Quantum",
    description: "7th person globally to complete all labs successfully.",
  },
  {
    title: "MIT iQuHACK 2023",
    org: "MIT iQuISE",
    description: "4th place in Microsoft's challenge focused on optimizing quantum circuits and quantum oracles.",
  },
  {
    title: "NSEJS National Top 1%",
    org: "IAPT (Indian Association of Physics Teachers)",
    description: "Awarded the National Top 1% certificate in the National Standard Examination in Junior Science.",
  },
];

export const certifications = [
  "Introduction to TensorFlow for AI, ML, and Deep Learning - DeepLearning.AI",
  "MIT 6.S191: Introduction to Deep Learning - MIT",
  "Quantum Algorithms and Cryptography - IIT Madras",
  "Introduction to Cryptography (CMSC 456) - University of Maryland",
  "Quantum Computation and Quantum Information (15-859BB) - Carnegie Mellon University",
  "Qubit by Qubit (EQCI) - IBM / Qubit by Qubit",
  "CS50's Introduction to Artificial Intelligence with Python - HarvardX",
  "CS50's Introduction to Computer Science - HarvardX",
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
        description: "Sagan on why a society that stops investing in curiosity-driven research cannot sustain itself.",
      },
      {
        title: "What is Science?",
        source: "Richard Feynman",
        url: "https://www.fotuva.org/feynman/what_is_science.html",
        description: "A 1966 address to science teachers. On the difference between knowing the name of something and actually understanding it.",
      },
      {
        title: "The Selfish Gene",
        source: "Richard Dawkins",
        url: "https://global.oup.com/academic/product/the-selfish-gene-9780198788607",
        description: "The gene-centered view of evolution. Rewired how I think about natural selection, cooperation, and why organisms exist at all.",
      },
      {
        title: "The Bitter Lesson",
        source: "Rich Sutton",
        url: "http://www.incompleteideas.net/IncIdeas/BitterLesson.html",
        description: "The most important pattern in AI research: methods that leverage scale always win over methods that encode human knowledge. Short and still being ignored.",
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
        description: "Which problems are most important to work on? Rigorous analysis of AI safety, biosecurity, and other pressing risks.",
      },
      {
        title: "Global Catastrophic Risk Institute",
        source: "GCRI",
        url: "https://gcri.org/",
        description: "Research on catastrophic and existential risk governance and decision-making under deep uncertainty.",
      },
      {
        title: "Center for Health Security",
        source: "Johns Hopkins",
        url: "https://centerforhealthsecurity.org/",
        description: "Pandemic preparedness, biosecurity research, and global health security policy.",
      },
      {
        title: "Nuclear Threat Initiative",
        source: "NTI",
        url: "https://www.nti.org/",
        description: "Policy and research working to reduce nuclear and biological threats globally.",
      },
      {
        title: "The Vulnerable World Hypothesis",
        source: "Nick Bostrom",
        url: "https://nickbostrom.com/papers/vulnerable.pdf",
        description: "A framework for thinking about how technological progress could produce catastrophic outcomes even without any actor intending harm.",
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
        description: "Architecture case studies of real high-traffic systems. How Discord, Stripe, and others actually work.",
      },
      {
        title: "Reflections on Trusting Trust",
        source: "Ken Thompson",
        url: "https://www.cs.cmu.edu/~rdriley/487/papers/Thompson_1984_ReflectionsonTrustingTrust.pdf",
        description: "Thompson's 1984 Turing Award lecture. Why you cannot fully verify the integrity of a system you did not build yourself.",
      },
      {
        title: "Time, Clocks, and the Ordering of Events in a Distributed System",
        source: "Leslie Lamport",
        url: "https://lamport.azurewebsites.net/pubs/time-clocks.pdf",
        description: "The 1978 paper that introduced logical clocks. Still the clearest explanation of why distributed time is hard.",
      },
      {
        title: "Dynamo: Amazon's Highly Available Key-value Store",
        source: "Amazon",
        url: "https://www.allthingsdistributed.com/files/amazon-dynamo-sosp2007.pdf",
        description: "The paper behind much of how we think about eventual consistency and availability tradeoffs in distributed databases.",
      },
      {
        title: "KoveSDM White Paper",
        source: "Kove",
        url: "https://kove.com/kovesdm-white-paper",
        description: "Software-defined memory architecture that disaggregates DRAM from compute nodes. Relevant to how memory-intensive workloads can be scaled without physical hardware constraints.",
      },
    ],
  },
];

export const interests: InterestSection[] = _interests.map((section) => ({
  ...section,
  links: section.links.filter((link) => !link.hidden),
}));
