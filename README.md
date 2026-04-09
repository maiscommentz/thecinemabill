# THE CINEMA BILL

Convert your recent Letterboxd activity into a beautiful, stylized cinema receipt. Each film becomes a line item, complete with director, genres, and accurate runtimes, all itemized like a real thermal ticket and ready to share on social media.

🎬 Access the utility online: [thecinemabill.maiscommentz.ch](https://thecinemabill.maiscommentz.ch)

## 🛠️ Technologies
![Next.js](https://img.shields.io/badge/next.js-000000?style=for-the-badge&logo=nextdotjs&logoColor=white)
![TypeScript](https://img.shields.io/badge/typescript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/tailwindcss-%2338B2AC.svg?style=for-the-badge&logo=tailwind-css&logoColor=white)
![Framer Motion](https://img.shields.io/badge/Framer_Motion-0055FF?style=for-the-badge&logo=framer&logoColor=white)
![Docker](https://img.shields.io/badge/docker-%232496ED.svg?style=for-the-badge&logo=docker&logoColor=white)
![Letterboxd](https://img.shields.io/badge/Letterboxd-%23ff8000.svg?style=for-the-badge&logo=letterboxd&logoColor=white)
![TMDB](https://img.shields.io/badge/TMDB-%2301b4e4.svg?style=for-the-badge&logo=themoviedatabase&logoColor=white)

## ✨ Key Features
- **RSS Data Sync:** Connects directly to your Letterboxd RSS feed to fetch your most recent logs automatically.
- **TMDB Enrichment:** Parallel fetching of movie metadata including film durations, director names, and genre listings.
- **Multiple Aesthetic Themes:** Choose between "Classic Thermal", "Midnight OLED", "Eco-Kraft", and "Premiere VIP" styles.
- **Interactive Sidebar:** Change the amount of films, toggle ratings, and customize subtitles (Year, Director, etc.).
- **Social Ready:** Generate shareable images with QR code or barcode designed for Instagram Stories and other social sharing platforms.

## 📁 Project Structure
```
.
├── app/                  
│   ├── api/fetch-bill/   # TMDB & RSS integration logic
│   ├── layout.tsx        # Root layout and metadata
│   └── page.tsx          # Main page
├── components/           
│   ├── Receipt.tsx       # The core receipt visualizer
│   ├── Sidebar.tsx       # Customization controls
│   └── ui.tsx            # Brutalist UI components
└── lib/                  
    ├── downloadStory.ts  # Share & download logic
    ├── parseUrlParams.ts # URL state reconstruction
    ├── receiptData.ts    # Film nterface and mock data
    └── receiptUtils.ts   # Logic for barcode & auth codes
```

## 🚀 Installation and Usage

### Prerequisites
- Node.js 20.x or higher
- A TMDB Read Access Token (v4)

### Local Setup
1. Clone the repository and install dependencies:
```bash
npm install
```

2. Create a `.env` file in the root and add your TMDB token:
```env
TMDB_TOKEN=your_v4_token_here
```

3. Launch the development server:
```bash
npm run dev
```

### Using Docker
```bash
docker compose up -d
```

## 🔄 Continuous Integration and Deployment (CI/CD)
The project features a robust automated pipeline via **GitHub Actions**:

- **Build & Package:** On every push, the app is built in `standalone` mode and compressed into a tarball to preserve hidden directories.
- **Automated Deployment:** Artifacts are securely transferred via SCP to a self-hosted server.
- **Environment Auto-Provisioning:** The CI automatically generates the server-side `.env` file and restarts the Docker containers.
- **Reverse Proxy:** Integrated with Nginx Proxy Manager for easy SSL management and internal networking.

## ❤️ Inspiration
Inspired by the aesthetic of [Receiptify](https://receiptify.herokuapp.com/) by Michelle Liu, reimagined for the cinephile community.

## 📜 License
This project is licensed under the [MIT License](LICENSE).
