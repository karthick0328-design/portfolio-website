import { portfolioData } from '../../../data/portfolioData';

/**
 * Structured Portfolio Knowledge Base for Karthick Pandi
 * Grounded specifically in existing portfolio data to prevent hallucination.
 */
export const portfolioKnowledge = {
  ...portfolioData,
  
  developerProfile: {
    fullName: "Karthick Pandi",
    shortName: "Karthick",
    title: "Full Stack Developer & UI/UX Designer",
    roles: ["Full Stack Developer", "Frontend Developer", "AI Enthusiast", "UI/UX Designer"],
    location: "Madurai, Tamil Nadu, India",
    email: "karthickpandi0328@gmail.com",
    github: "https://github.com/karthick0328-design",
    linkedin: "https://linkedin.com/in/karthick-pandi-006156279",
    availability: "Available for full-time roles and freelance opportunities",
    bio: "Motivated Full Stack Developer with a Master's in Computer Applications (MCA) and hands-on experience in React.js, Node.js, Python, MongoDB, and modern web technologies. Passionate about building scalable, high-performance web applications, interactive 3D visualizations with Three.js, and clean UI/UX designs."
  },

  skillsSummary: {
    frontend: "React.js, JavaScript (ES6+), HTML5, CSS3, Tailwind CSS, Bootstrap",
    backend: "Node.js, Express.js, Python, REST APIs",
    databases: "MongoDB, SQLite",
    tools: "Git, GitHub, Docker, VS Code, Postman, Chart.js",
    uiux: "Figma, Wireframing, Prototyping, Component Systems & Design Tokens",
    threeD: "Three.js, 3D Molecular Visualization, Dynamic 3D Rendering, React Three Fiber"
  },

  notableProjects: [
    {
      name: "AI Intelligent Digital Marketing Platform",
      summary: "An AI-powered SEO and content generation platform that automates blog generation, analyzes competitors, and automates SEO workflows.",
      tech: "React.js, Node.js, MongoDB, Tailwind CSS, Python",
      highlights: "AI Blog Generator, Competitor Analysis, SEO Automation, JWT Auth, Analytics Dashboard"
    },
    {
      name: "E-Commerce Website",
      summary: "A modern full-featured e-commerce platform with responsive shopping flow and complete administrative control.",
      tech: "React.js, Node.js, MongoDB, Tailwind CSS",
      highlights: "Shopping cart, secure authentication, administrative order management, responsive UI"
    },
    {
      name: "3D Molecular Visualization System",
      summary: "An interactive scientific 3D web application allowing researchers to visualize biological compounds and molecular interactions with real-time rendering.",
      tech: "React.js, Python, Node.js, 3D Rendering / Three.js",
      highlights: "Interactive 3D molecular models, real-time scientific data processing, interactive manipulation"
    }
  ],

  workHistory: [
    {
      company: "Ponnaiya's code and genome pvt ltd",
      role: "Full Stack Developer",
      period: "July 2025 - July 2026",
      keyWork: "Developed full-stack web applications including an e-commerce platform and 3D Molecular Visualization System, enabling researchers to explore biological compounds through dynamic 3D models."
    },
    {
      company: "Geosoft Technologies, Madurai",
      role: "Fullstack Developer (Intern)",
      period: "Jan 2025 - Jun 2025",
      keyWork: "Led development of AI-driven SEO tools automating Yoast-compliant blog posts and competitor analysis. Resulted in 40% reduction in manual effort and 25% faster page loads with ReactJS and TailwindCSS."
    }
  ],

  educationSummary: [
    {
      degree: "Master of Computer Applications (MCA)",
      institution: "KLN College of Engineering",
      years: "2023 - 2025"
    },
    {
      degree: "Bachelor of Computer Science (B.Sc)",
      institution: "The American College",
      years: "2020 - 2023"
    }
  ]
};
