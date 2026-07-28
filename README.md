# Karthick Pandi - Premium React Portfolio

A highly optimized, fully responsive, and beautifully animated personal portfolio website built with React.js and Tailwind CSS.

## 🚀 Technologies Used
- **React.js** (Create React App)
- **Tailwind CSS** (Styling & Dark Mode)
- **Framer Motion** (Animations)
- **React Router DOM** (Navigation)
- **EmailJS** (Contact Form)
- **React Icons** (SVG Icons)

## 📁 Project Structure
- `src/components/`: Reusable UI components (Navbar, Footer, Cards).
- `src/pages/`: Main views for routing (Home, About, Projects, etc.).
- `src/data/portfolioData.js`: Centralized data file. Edit this to update your portfolio text, links, and skills without touching the UI code!
- `src/context/ThemeContext.jsx`: Manages Dark/Light mode state.

## ⚙️ Setup & Local Development

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Start Development Server**
   ```bash
   npm start
   ```

3. **EmailJS Configuration**
   To make the contact form work, create an account on [EmailJS](https://www.emailjs.com/) and update the credentials in `src/pages/Contact.jsx`:
   - `YOUR_SERVICE_ID`
   - `YOUR_TEMPLATE_ID`
   - `YOUR_PUBLIC_KEY`

4. **Update Placeholders**
   - **Profile Image:** Replace `https://via.placeholder.com/400` in `Home.jsx` with your actual image path or URL.
   - **Resume:** Replace `public/resume.pdf` with your actual resume PDF.
   - **Data:** Update the values (links, texts, institution names) in `src/data/portfolioData.js`.

## 🌐 Deployment Guide (Vercel / Netlify)

This project is production-ready. 

### GitHub Repository Setup
1. Initialize Git (if not already done): `git init`
2. Add files: `git add .`
3. Commit: `git commit -m "Initial commit"`
4. Push to your GitHub repo.

### Vercel Deployment
1. Log in to [Vercel](https://vercel.com).
2. Click "Add New..." > "Project".
3. Import your GitHub repository.
4. Leave build settings as default (`npm run build`).
5. Click **Deploy**.

### Netlify Deployment
1. Log in to [Netlify](https://www.netlify.com/).
2. Click "Add new site" > "Import an existing project".
3. Connect your GitHub and select the repo.
4. Build command: `npm run build`, Publish directory: `build`.
5. Click **Deploy site**.

### Custom Domain & SEO
- **Custom Domain:** Configure via Vercel/Netlify dashboard under "Domains". Update your DNS records (A record, CNAME) as instructed by the platform.
- **Google Analytics:** Create a property on Google Analytics and paste the global site tag (`<script>`) into the `<head>` of `public/index.html`.
- **Google Search Console:** After deployment, submit your domain and the URL to your `sitemap.xml` (`https://yourdomain.com/sitemap.xml`) to Google Search Console to get indexed quickly.

### SEO Checklist
- [x] Meta tags and Open Graph implemented in `public/index.html`.
- [x] `robots.txt` added.
- [x] `sitemap.xml` added.
- [x] Semantic HTML5 used across components.
- [x] Lighthouse optimized (fast loading, accessible).

---
*Built by AI Assistant.*
