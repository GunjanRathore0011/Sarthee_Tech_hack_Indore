# CyberSentinel – AI-Powered Cybercrime Reporting & Investigation Platform  

## Table of Contents  

- [Project Overview](#project-overview)  
- [Features](#features)  
- [Technologies Used](#technologies-used)  
- [Installation](#installation)  
- [Usage](#usage)  
- [Future Enhancements](#future-enhancements)  
- [Contributing](#contributing)  
- [Contact](#contact)  

---

## Project Overview  

**CyberSentinel** is a full-stack web application designed to streamline **cybercrime reporting, case investigation, and digital enforcement**.  

The platform empowers citizens to file complaints with supporting evidence (text, images, audio, or documents), while **officers and admins** can investigate, verify, and manage cases via dedicated dashboards.  

With integrated **AI & Security tools**, CyberSentinel enhances trust and efficiency by providing:  
- **Malware/evidence scanning**  
- **Fake evidence detection**  
- **Complaint categorization**  
- **Pattern-based fraud detection**  

This project was developed as part of the **Indore Tech Hackathon 2025** under the theme *Cybercrime Detection & Digital Enforcement*.  

📂 **GitHub Repo:** [CyberSentinel](https://github.com/GunjanRathore0011/Sarthee_Tech_hack_Indore)  

---

## Features  

### 👤 User Features  
- File complaints across categories (fraud, phishing, harassment, financial scams, etc.)  
- Upload **text, images, audio, or documents** as supporting evidence  
- Track complaint status in real-time  
- Secure authentication (Email/Google OAuth)  

### 🕵️ Officer Features  
- View, filter, and prioritize assigned complaints  
- Evidence scanning & verification tools  
- Access to **IP Geolocation & WHOIS lookup** for suspect tracing  
- Generate case investigation reports  

### 🔐 Admin Features  
- Role-based access (Admin, Officer, User)  
- Manage users, officers, and cases  
- Assign complaints to officers  
- Visual analytics dashboard (complaint hotspots, trends, fraud patterns)  

### 🤖 AI & Security Integrations  
- **Evidence Malware Scan** (VirusTotal + Google Safe Browsing API)  
- **Fraud/Pattern Detection** (TensorFlow/PyTorch models)  
- **Evidence Tamper Detection** (image analysis ML models)  
- **Case Categorization & NLP Insights** (Gemini API)  

### 📄 Additional Pages  
- **Cyber Awareness Portal** – Safety tips, reporting guidelines, awareness campaigns  
- **About Page** – Project background & objectives  
- **Contact Page** – Support and queries  

---

## Technologies Used  

### 💻 Frontend (User & Admin Dashboards)  
- React.js  
- TailwindCSS + ShadCN UI  
- Redux + Redux Persist (state management)  

### 🌐 Backend & APIs  
- Node.js + Express.js  
- REST APIs (GraphQL optional in future)  
- MongoDB (case data, user profiles)  
- Cloudinary (evidence file hosting)  

### 🧠 AI & Security  
- Python (AI/ML service integration)  
- TensorFlow/PyTorch (fraud detection, tamper detection models)  
- Gemini API (NLP for case summarization & insights)  
- VirusTotal API + Google Safe Browsing API  
- IP Geolocation + WHOIS APIs  

---

## Installation  

### ⚙️ Prerequisites  
- Node.js & npm  
- MongoDB instance  
- Cloudinary account  
- API keys: VirusTotal, Google Safe Browsing, Gemini API  

---

### 🔧 Backend Setup  

```bash
git clone https://github.com/GunjanRathore0011/Sarthee_Tech_hack_Indore.git
cd Sarthee_Tech_hack_Indore/backend
npm install
```

Create a `.env` file with the following structure:  

```env
PORT=5000
MONGODB_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
CLOUDINARY_CLOUD_NAME=your_cloudinary_name
CLOUDINARY_API_KEY=your_cloudinary_key
CLOUDINARY_API_SECRET=your_cloudinary_secret
GEMINI_API_KEY=your_gemini_api_key
VIRUSTOTAL_API_KEY=your_virustotal_api_key
SAFE_BROWSING_API_KEY=your_safe_browsing_api_key
```

Start the backend server:  

```bash
npm start
```

---

### 💻 Frontend Setup  

```bash
cd ../frontend
npm install
```

Create a `.env` file:  

```env
REACT_APP_API_BASE_URL=http://localhost:5000/api
```

Start the frontend:  

```bash
npm start
```

---

## Usage  

1. Open **CyberSentinel** in your browser  
2. Register/Login as a user  
3. File a cybercrime complaint with detailed evidence  
4. Officers/Admins can log in to investigate and manage complaints  
5. Track complaint progress through your personal dashboard  

---

## Future Enhancements  

- 🔔 Real-time notifications (SMS/Email) for case updates  
- 📊 AI-powered fraud trend prediction & heatmaps  
- 🛰️ Live crowdsource reporting system (citizen-police collaboration)  
- 🗂️ Blockchain-based tamper-proof evidence storage  

---

## Contributing  

Contributions are welcome!  

### Steps:  
1. Fork the repository  
2. Create a feature branch  
   ```bash
   git checkout -b feature/YourFeature
   ```  
3. Commit and push changes  
   ```bash
   git commit -m "Add Your Feature"
   git push origin feature/YourFeature
   ```  
4. Open a pull request  

---

## 👥 Team Members  

**Gunjan Rathore**  
🔗 [LinkedIn](https://www.linkedin.com/in/gunjanrathore11/)  
💻 [GitHub](https://github.com/GunjanRathore0011)  

**Jeevan Parmar**  
🔗 [LinkedIn](https://www.linkedin.com/in/jeevan-parmar-8b8a2424b/)  
💻 [GitHub](https://github.com/jeevanparmar)  

**Ritesh Parmar**  
🔗 [LinkedIn](https://www.linkedin.com/in/riteshpx/)  
