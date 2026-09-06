/**
 * Intelligent Conversational Engine for Karthick Pandi's Portfolio
 * Grounded in portfolio data with human developer persona, natural conversational rhythm,
 * and multi-turn context memory.
 */

class ConversationEngine {
  constructor() {
    this.context = {
      lastTopic: null, // 'intro' | 'skills' | 'projects' | '3d' | 'experience' | 'education' | 'hire' | 'contact' | 'design'
      lastProject: null,
      conversationTurn: 0,
      history: []
    };
  }

  /**
   * Reset conversation memory
   */
  resetContext() {
    this.context = {
      lastTopic: null,
      lastProject: null,
      conversationTurn: 0,
      history: []
    };
  }

  /**
   * Process a user query and return a natural, spoken-ready response
   * @param {string} userQuery - The transcribed or typed user message
   * @returns {string} - The conversational response ready for speech synthesis
   */
  generateResponse(userQuery) {
    if (!userQuery || typeof userQuery !== 'string') {
      return "I'm here! Feel free to ask about my projects, skills, 3D experience, or background.";
    }

    const query = userQuery.trim().toLowerCase();
    this.context.conversationTurn++;
    this.context.history.push({ role: 'user', text: userQuery });

    let response = '';

    // 1. GREETINGS & INTRODUCTIONS
    if (this.isGreeting(query)) {
      response = this.handleGreeting();
    }
    // 2. WHO IS KARTHICK / GENERAL INTRODUCTION
    else if (this.isAboutKarthick(query)) {
      response = this.handleAbout();
    }
    // 3. 3D DEVELOPMENT & MOLECULAR VISUALIZATION SPECIFIC
    else if (this.is3DQuery(query)) {
      response = this.handle3D();
    }
    // 4. SPECIFIC PROJECTS OR PROJECTS IN GENERAL
    else if (this.isProjectQuery(query)) {
      response = this.handleProjects(query);
    }
    // 5. SKILLS & TECHNOLOGIES
    else if (this.isSkillsQuery(query)) {
      response = this.handleSkills(query);
    }
    // 6. WORK EXPERIENCE & COMPANIES
    else if (this.isExperienceQuery(query)) {
      response = this.handleExperience(query);
    }
    // 7. EDUCATION & DEGREES
    else if (this.isEducationQuery(query)) {
      response = this.handleEducation();
    }
    // 8. HIRING, AVAILABILITY, CONTACT & WHY HIRE
    else if (this.isHiringQuery(query)) {
      response = this.handleHiring(query);
    }
    // 9. UI/UX DESIGN & FIGMA
    else if (this.isDesignQuery(query)) {
      response = this.handleDesign();
    }
    // 10. CONTEXTUAL FOLLOW-UPS (e.g., "tell me more", "what else", "what tech was used")
    else if (this.isFollowUp(query)) {
      response = this.handleFollowUp(query);
    }
    // 11. GENERAL SMART FALLBACK
    else {
      response = this.handleFallback(query);
    }

    this.context.history.push({ role: 'assistant', text: response });
    return response;
  }

  // --- Intent Detectors ---

  isGreeting(query) {
    return /^(hi|hello|hey|good\s(morning|afternoon|evening)|what's\s*up|yo|howdy|sup)\b/i.test(query);
  }

  isAboutKarthick(query) {
    return /(who\s+is\s+karthick|tell\s+me\s+about\s+(karthick|yourself|him|you)|about\s+karthick|introduction|introduce\s+(yourself|him)|who\s+are\s+you|bio|background)/i.test(query);
  }

  is3DQuery(query) {
    return /(3d|three\.?js|fiber|molecular|visualization|dynamic\s+3d|rendering|interactive\s+3d)/i.test(query);
  }

  isProjectQuery(query) {
    return /(project|built|developed|created|portfolio\s+work|marketing\s+platform|seo|ecommerce|e-commerce|molecular)/i.test(query);
  }

  isSkillsQuery(query) {
    return /(skill|tech\s*stack|technologies|tools|frontend|backend|database|frameworks|language|react|node|python|mongodb|programming)/i.test(query);
  }

  isExperienceQuery(query) {
    return /(experience|work\s+history|company|companies|job|ponnaiya|geosoft|internship|career|years)/i.test(query);
  }

  isEducationQuery(query) {
    return /(education|degree|college|university|mca|bachelor|master|kln|american\s+college|study|studied|graduat)/i.test(query);
  }

  isHiringQuery(query) {
    return /(hire|hiring|available|availability|contact|email|reach|freelance|opportunity|job|work\s+with|why\s+should\s+i\s+hire)/i.test(query);
  }

  isDesignQuery(query) {
    return /(ui\/?ux|design|figma|wireframe|prototype|user\s+experience|interface)/i.test(query);
  }

  isFollowUp(query) {
    return /(tell\s+me\s+more|what\s+else|more\s+details|elaborate|and\s+then|what\s+about\s+(that|it)|technologies\s+used\s+in\s+that)/i.test(query);
  }

  // --- Response Generators (Natural, human, professional tone) ---

  handleGreeting() {
    const greetings = [
      "Hey there! Great to meet you. I'm here to share Karthick's work in Full Stack development, 3D interactive experiences, and modern web apps. What would you like to explore?",
      "Hello! Welcome to Karthick's portfolio. You can ask me anything about his projects, tech stack, 3D development, or experience. How can I help?",
      "Hi! Thanks for visiting. Feel free to ask about Karthick's work with React, Node.js, Python, 3D visualizations, or his recent projects."
    ];
    this.context.lastTopic = 'intro';
    return greetings[Math.floor(Math.random() * greetings.length)];
  }

  handleAbout() {
    this.context.lastTopic = 'intro';
    return "Karthick Pandi is a Full Stack Developer and UI/UX enthusiast with a Master's in Computer Applications. He specializes in building scalable web apps with React, Node.js, Python, and MongoDB, combined with interactive 3D visualizations using Three.js.";
  }

  handle3D() {
    this.context.lastTopic = '3d';
    this.context.lastProject = '3D Molecular Visualization';
    return "Karthick has strong hands-on experience in interactive 3D development with Three.js and React Three Fiber. He built a 3D Molecular Visualization System that renders complex biological compounds in real-time for researchers.";
  }

  handleProjects(query) {
    this.context.lastTopic = 'projects';

    if (query.includes('voice') || query.includes('speech') || query.includes('ai-voice')) {
      this.context.lastProject = 'AI-Voice Platform';
      return "AI-Voice is an intelligent conversational speech platform built by Karthick using React, Web Speech API, and Tailwind CSS. It features real-time speech-to-text recognition, dynamic waveform audio visualizers, and interactive voice synthesis. You can test the live demo online!";
    }

    if (query.includes('jano') || query.includes('downloader') || query.includes('video')) {
      this.context.lastProject = 'Jano HD Video Downloader';
      return "Jano HD Video Downloader is a high-performance web utility built with TypeScript and Next.js that allows users to download and extract high-definition video and audio streams seamlessly with multiple format options.";
    }

    if (query.includes('marketing') || query.includes('seo') || query.includes('ai intelligent')) {
      this.context.lastProject = 'AI Marketing Platform';
      return "The AI Intelligent Digital Marketing Platform is an automated SEO tool built with React, Node.js, Python, and MongoDB. It automates blog generation, analyzes competitor rankings, and handles SEO workflows seamlessly.";
    }

    if (query.includes('commerce') || query.includes('shop') || query.includes('store')) {
      this.context.lastProject = 'E-Commerce Website';
      return "The E-Commerce project is a full-stack platform featuring a dynamic shopping cart, secure authentication, and a complete admin management dashboard built with React, Node.js, MongoDB, and Tailwind CSS.";
    }

    if (query.includes('molecular') || query.includes('3d molecule')) {
      this.context.lastProject = '3D Molecular Visualization';
      return "The 3D Molecular Visualization project is an interactive scientific tool built with React, Three.js, Python, and Node.js. It enables real-time rendering and interactive exploration of 3D biological molecules.";
    }

    // General projects summary
    return "Karthick has built several standout projects: AI-Voice Speech Assistant, Jano HD Video Downloader, 3D Molecular Visualization System, and an AI Intelligent Digital Marketing Platform. All are available on his GitHub at karthick0328-design. Which project would you like to explore?";
  }

  handleSkills(query) {
    this.context.lastTopic = 'skills';

    if (query.includes('frontend') || query.includes('front end')) {
      return "On the frontend, Karthick works extensively with React.js, JavaScript, Tailwind CSS, HTML5, CSS3, and Bootstrap, with a strong focus on responsive design and performance.";
    }

    if (query.includes('backend') || query.includes('back end')) {
      return "On the backend, he builds robust REST APIs and services using Node.js, Express.js, and Python, paired with MongoDB and SQLite for database architecture.";
    }

    if (query.includes('database') || query.includes('db')) {
      return "For data management, Karthick primarily uses MongoDB for flexible NoSQL document storage along with SQLite for lightweight relational database needs.";
    }

    return "Karthick's core stack combines React and Tailwind CSS on the frontend, Node.js and Python on the backend, MongoDB for data, and Three.js for interactive 3D graphics.";
  }

  handleExperience(query) {
    this.context.lastTopic = 'experience';

    if (query.includes('geosoft')) {
      return "At Geosoft Technologies in Madurai, Karthick worked as a Fullstack Developer Intern where he built AI-driven SEO tools, automating workflows and achieving 25% faster page loads.";
    }

    if (query.includes('ponnaiya')) {
      return "At Ponnaiya's Code and Genome, Karthick served as a Full Stack Developer, building full-stack platforms and the 3D Molecular Visualization system with real-time dynamic rendering.";
    }

    return "Karthick's career journey began as a Fullstack Developer Intern at Geosoft Technologies in Madurai, followed by his role as Full Stack Developer at Ponnaiya's Code and Genome, where he engineered high-performance web apps and 3D visualization systems.";
  }

  handleEducation() {
    this.context.lastTopic = 'education';
    return "Karthick completed his Bachelor of Computer Science at The American College (2020 to 2023), and earned his Master of Computer Applications (MCA) from KLN College of Engineering (2023 to 2025).";
  }

  handleHiring(query) {
    this.context.lastTopic = 'hire';

    if (query.includes('why') || query.includes('hire him') || query.includes('hire you')) {
      return "Karthick brings a rare combination of solid Full Stack engineering, modern UI/UX design in Figma, and interactive 3D capabilities. He delivers fast, polished products with clean code and great attention to detail.";
    }

    if (query.includes('contact') || query.includes('email') || query.includes('reach')) {
      return "You can reach Karthick directly at karthickpandi0328@gmail.com, or connect via LinkedIn and GitHub through the links on this portfolio.";
    }

    return "Yes! Karthick is actively available for full-time opportunities and select freelance projects. You can contact him directly via the contact form or email at karthickpandi0328@gmail.com.";
  }

  handleDesign() {
    this.context.lastTopic = 'design';
    return "Karthick is proficient in Figma, wireframing, and interactive prototyping. He bridges the gap between design and code to create clean, user-centered digital experiences.";
  }

  handleFollowUp(query) {
    const { lastTopic, lastProject } = this.context;

    if (lastTopic === '3d' || lastProject === '3D Molecular Visualization') {
      return "In his 3D molecular work, Karthick integrated real-time WebGL rendering to allow researchers to rotate, inspect, and analyze biological compounds directly in the browser.";
    }

    if (lastTopic === 'projects') {
      return "Each project was built with a specific focus: the AI Marketing platform optimizes SEO workflows, the E-Commerce site focuses on seamless checkout UX, and the 3D tool focuses on high-performance scientific visualization.";
    }

    if (lastTopic === 'skills') {
      return "Beyond frontend and backend, he is also skilled in Docker, Git, RESTful API design, Chart.js for data visualization, and Figma for design systems.";
    }

    if (lastTopic === 'experience') {
      return "Across his roles, he has consistently focused on performance optimization, automated workflows, and delivering intuitive interactive interfaces.";
    }

    return "Karthick focuses on crafting high-performance, user-centric web applications. Would you like to check out his specific projects, tech stack, or resume?";
  }

  handleFallback(query) {
    // Attempt friendly contextual fallback
    return `Karthick is a Full Stack Developer skilled in React, Node.js, Python, MongoDB, and Three.js. You can ask me about his projects, 3D visualization work, skills, or how to get in touch!`;
  }
}

// Export singleton instance
export const conversationEngine = new ConversationEngine();
