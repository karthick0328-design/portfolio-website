import aiVoiceImg from '../assets/projects/ai-voice.jpg';
import janoDownloaderImg from '../assets/projects/jano-downloader.jpg';
import marketingImg from '../assets/projects/as_photography-digital-marketing-1725340.jpg';
import molecularImg from '../assets/projects/images (7).jpg';
import ecommerceImg from '../assets/projects/andrespradagarcia-online-6817350.jpg';

export const portfolioData = {
  personalInfo: {
    name: "Karthick Pandi",
    role1: "Frontend Developer",
    role2: "Full Stack Developer",
    role3: "AI Enthusiast",
    email: "karthickpandi0328@gmail.com",
    location: "Madurai, Tamil Nadu, India",
    github: "https://github.com/karthick0328-design",
    linkedin: "https://linkedin.com/in/karthick-pandi-006156279", // Updated with actual LinkedIn
    availability: "Available for new opportunities"
  },
  about: {
    introduction: "Motivated Full Stack Developer with a Master's in Computer Applications and hands-on experience in React.js, Node.js, MongoDB, and modern web technologies. Proficient in Figma and passionate about UI/UX design, responsive interfaces, and user-centered experiences.",
    objective: "Currently expanding expertise in UI/UX design while building scalable, high-performance web applications. Seeking opportunities to contribute both development and design skills.",
    stats: [
      { label: "Projects Completed", value: "5+" },
      { label: "Technologies Mastered", value: "10+" },
      { label: "Years Experience", value: "1+" },
    ]
  },
  skills: {
    frontend: ["React.js", "JavaScript", "HTML5", "CSS3", "Tailwind CSS", "Bootstrap"],
    backend: ["Node.js", "Express.js", "Python"],
    database: ["MongoDB", "SQLite"],
    tools: ["Git", "GitHub", "Docker", "VS Code", "Postman", "Chart.js"],
    uiux: ["Figma", "Prototyping", "Components & Variants", "Wireframing"]
  },
  experience: [
    {
      id: 1,
      company: "Geosoft Technologies, Madurai, India",
      role: "Fullstack Developer (Intern)",
      duration: "Jan 2025 - Jun 2025",
      description: "Led development of AI-powered SEO/digital marketing tools, automating workflows with NLP for Yoast-compliant blog posts and competitor analysis.",
      achievements: [
        "Yielded 40% less manual work and boosted SEO analyst productivity.",
        "Designed responsive interfaces with ReactJS and TailwindCSS, achieving 25% faster page loads.",
        "Integrated Java backend (Spring Boot) for data handling and OpenAI/Google Analytics APIs."
      ]
    },
    {
      id: 2,
      company: "Ponnaiya's code and genome pvt ltd",
      role: "Full Stack Developer",
      duration: "July 2025 - July 2026",
      description: "Developed a full-stack e-commerce platform and 3D Molecular Visualization System, integrating RESTful APIs and real-time rendering.",
      achievements: [
        "Improved application performance and user experience through optimized frontend and backend development.",
        "Enabled researchers to explore biological compounds and molecular interactions through dynamic 3D models."
      ]
    }
  ],
  projects: [
    {
      id: 1,
      number: "01",
      title: "AI-Voice - Intelligent Speech Platform",
      shortTitle: "AI-Voice",
      subtitle: "Voice AI Calling Platform",
      category: "AI & Full Stack",
      featured: true,
      description: "An advanced real-time conversational AI voice platform featuring interactive speech synthesis, speech-to-text recognition, dynamic sound waves, and responsive audio visualizers.",
      technologies: ["React.js", "JavaScript", "Web Speech API", "AI Speech Synthesis", "Tailwind CSS"],
      toolsAndFeaturesText: "Voice AI, Calling Automation, CRM Integrations, Audio Waveforms",
      features: [
        "Real-time Conversational Voice AI",
        "Reactive Audio Waveform Visualizers",
        "Instant Speech-to-Text Transcription",
        "Natural Voice Synthesis & Playback"
      ],
      mockupHeadline: "Rapidly Create Your AI Caller with AI-Voice",
      mockupPills: [
        { icon: "🔊", text: "Human-like Interaction" },
        { icon: "📱", text: "Inbound & Outbound Calls" },
        { icon: "⚡", text: "Trained On Your Data" }
      ],
      badgeText: "Free Trial - No Credit Card Required",
      github: "https://github.com/karthick0328-design/AI-Voice",
      live: "https://ai-voice-tau-olive.vercel.app",
      status: "Live & Deployed",
      image: aiVoiceImg,
      gradient: "from-blue-600 via-indigo-600 to-purple-700"
    },
    {
      id: 2,
      number: "02",
      title: "Jano HD Video Downloader",
      shortTitle: "Jano HD",
      subtitle: "High-Performance Stream & Media Extractor",
      category: "Web Applications",
      featured: true,
      description: "A high-performance media downloader and stream extractor application allowing users to download high-definition media streams across multiple platforms with fast format conversion.",
      technologies: ["TypeScript", "Next.js / React", "Tailwind CSS", "Stream APIs"],
      toolsAndFeaturesText: "HD Video Streams, Format Conversion, Media Extraction, Cloud Speed",
      features: [
        "Multi-Resolution HD Download (1080p/4K)",
        "Instant Media Stream Link Extraction",
        "Fast Video & Audio Format Conversion",
        "Responsive Modern Glass UI Dashboard"
      ],
      mockupHeadline: "Extract & Convert HD Media Streams at Lightning Speed",
      mockupPills: [
        { icon: "🎥", text: "4K & 1080p Ultra HD" },
        { icon: "⚡", text: "Instant Multi-Stream Extraction" },
        { icon: "🔄", text: "Lossless Audio/Video Conversion" }
      ],
      badgeText: "High Speed Engine - Zero Watermark",
      github: "https://github.com/karthick0328-design/jano-hd-video-downloader",
      live: "https://jano-hd-video-downloader.vercel.app",
      status: "Live & Deployed",
      image: janoDownloaderImg,
      gradient: "from-cyan-500 via-blue-600 to-indigo-700"
    },
    {
      id: 3,
      number: "03",
      title: "AI Intelligent Digital Marketing Platform",
      shortTitle: "MarketAI",
      subtitle: "Automated SEO & Content Marketing Suite",
      category: "AI & Full Stack",
      featured: true,
      description: "A comprehensive digital marketing platform powered by AI to automate SEO, generate Yoast-compliant blog content, and perform automated competitor intelligence analysis.",
      technologies: ["React.js", "Node.js", "MongoDB", "Tailwind CSS", "Python"],
      toolsAndFeaturesText: "AI Content Engine, Competitor SEO, Real-time Analytics, Spring Boot",
      features: [
        "AI Blog & Content Generation Engine",
        "Automated Competitor SEO Analysis",
        "Analytics Dashboard with Real-time Metrics",
        "JWT Role-Based Secure Authentication"
      ],
      mockupHeadline: "Automate Growth & SEO with AI-Powered Intelligence",
      mockupPills: [
        { icon: "📈", text: "Yoast-Compliant AI Generator" },
        { icon: "🎯", text: "Competitor Intelligence Tracking" },
        { icon: "📊", text: "Real-Time Growth Metrics" }
      ],
      badgeText: "Enterprise Ready - 40% Productivity Boost",
      github: "https://github.com/karthick0328-design",
      live: "https://karthick-portfolio-six.vercel.app/",
      status: "Production Ready",
      image: marketingImg,
      gradient: "from-emerald-500 via-teal-600 to-cyan-700"
    },
    {
      id: 4,
      number: "04",
      title: "3D Molecular Visualization System",
      shortTitle: "Molecule3D",
      subtitle: "Interactive 3D Molecular Simulation Explorer",
      category: "3D & Creative Tech",
      featured: true,
      description: "An interactive scientific tool for visualizing 3D biological molecules and chemical compounds, rendering real-time atomic bonds and structures for researchers.",
      technologies: ["React.js", "Three.js", "Python", "Node.js", "WebGL"],
      toolsAndFeaturesText: "Three.js WebGL, 3D Atomic Bonds, Shader Shading, Scientific Data",
      features: [
        "Interactive 3D Atomic & Molecular Models",
        "Real-Time Scientific Data Processing",
        "WebGL Shader & Dynamic Lighting Rendering",
        "Compound Property Inspector"
      ],
      mockupHeadline: "Explore Complex Biomolecules in Interactive 3D",
      mockupPills: [
        { icon: "🧬", text: "Real-Time Atomic Bonds" },
        { icon: "✨", text: "WebGL Dynamic Lighting" },
        { icon: "🔬", text: "Scientific PDB Data Parsing" }
      ],
      badgeText: "Research Grade - WebGL Accelerated",
      github: "https://github.com/karthick0328-design",
      live: "https://karthick-portfolio-six.vercel.app/",
      status: "Research Tool",
      image: molecularImg,
      gradient: "from-amber-500 via-orange-600 to-rose-600"
    },
    {
      id: 5,
      number: "05",
      title: "Full-Stack E-Commerce & Admin Hub",
      shortTitle: "NovaShop",
      subtitle: "Full-Stack E-Commerce Platform & Admin Suite",
      category: "Web Applications",
      featured: true,
      description: "A full-featured scalable e-commerce application featuring real-time cart state management, product filtering, secure authentication, and an administrative control panel.",
      technologies: ["React.js", "Node.js", "Express.js", "MongoDB", "Tailwind CSS"],
      toolsAndFeaturesText: "Full-Stack Cart, JWT Authentication, Admin Inventory, RESTful APIs",
      features: [
        "Dynamic Cart & Checkout Flow",
        "Secure User & Admin Authentication",
        "Admin Product & Order Management Hub",
        "Optimized Performance & Responsive UX"
      ],
      mockupHeadline: "Modern Full-Stack Commerce with Real-Time Admin Hub",
      mockupPills: [
        { icon: "🛒", text: "Instant Cart & Checkout Flow" },
        { icon: "🔐", text: "Secure JWT Authentication" },
        { icon: "📊", text: "Live Inventory & Order Metrics" }
      ],
      badgeText: "High Performance - Scalable Architecture",
      github: "https://github.com/karthick0328-design",
      live: "https://karthick-portfolio-six.vercel.app/",
      status: "Full Stack App",
      image: ecommerceImg,
      gradient: "from-rose-500 via-pink-600 to-purple-700"
    }
  ],
  education: [
    {
      id: 1,
      degree: "Bachelor of Computer Science",
      institution: "The American College",
      year: "2020 - 2023"
    },
    {
      id: 2,
      degree: "Master of Computer Applications",
      institution: "KLN College of Engineering",
      year: "2023 - 2025"
    }
  ],
  caseStudies: [
    {
      id: 1,
      title: "Digital Marketing Platform Dashboard",
      role: "UI/UX Designer",
      description: "Designed an intuitive dashboard for SEO analysts to track metrics, analyze competitors, and generate content effortlessly.",
      image: "/projects/as_photography-digital-marketing-1725340.jpg",
      link: "#"
    },
    {
      id: 2,
      title: "E-Commerce User Flow Optimization",
      role: "Product Designer",
      description: "Revamped the checkout process for an e-commerce site, reducing cart abandonment and improving overall user experience.",
      image: "/projects/andrespradagarcia-online-6817350.jpg",
      link: "#"
    }
  ],
  faq: [
    {
      id: 1,
      question: "What services do you offer?",
      answer: "I specialize in Full Stack Web Development, UI/UX Design, and integrating AI into modern web applications."
    },
    {
      id: 2,
      question: "Are you available for freelance projects?",
      answer: "Yes, I am currently available for freelance projects as well as full-time opportunities."
    },
    {
      id: 3,
      question: "What is your design process?",
      answer: "My design process involves understanding user needs, wireframing, creating high-fidelity prototypes in Figma, and iterating based on feedback before handing off for development."
    }
  ]
};
