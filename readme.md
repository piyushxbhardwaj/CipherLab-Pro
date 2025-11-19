CipherLab Pro 🔐

A sleek and modern text encryption/decryption studio built for learning cryptography.

CipherLab Pro is a clean, responsive, and feature-rich web application that allows users to encrypt and decrypt text using custom shift-based logic. It is designed with polished UI/UX, theme persistence, smooth animations, and accessibility in mind — making it ideal for students, cybersecurity beginners, or anyone exploring basic cryptography concepts.

⚠️ Educational Purpose Only — Not secure for real-world encryption.

🚀 Features
✔ Modern UI

Glassmorphism-inspired design

Smooth animations & transitions

Fully responsive (desktop + mobile)

✔ Encryption / Decryption

Custom shift-based cipher logic

Preserve case (optional)

Preserve punctuation (optional)

✔ Controls

Slider to select shift value

Encrypt/Decrypt mode switching

Clear, Copy, Swap buttons

✔ Theme System

Light & Dark modes

Theme saved in localStorage

Smooth transitions

✔ UX Improvements

Toast notifications

Click output to auto-select

Keyboard shortcut: Ctrl + Enter

Output updates only when Process is pressed

🧩 Tech Stack

HTML5

CSS3

JavaScript (ES6+)

LocalStorage API

📁 Project Structure
CipherLab-Pro/
│
├── index.html
├── style.css
├── script.js
└── README.md

🖥️ Live Demo (GitHub Pages)

If hosted on GitHub Pages:

https://your-username.github.io/CipherLab-Pro/

🔧 How to Run Locally
1️⃣ Clone the repository
git clone https://github.com/your-username/CipherLab-Pro.git

2️⃣ Navigate to project folder
cd CipherLab-Pro

3️⃣ Open in a browser

Simply open:

index.html


Or start a local server:

python -m http.server


Then visit:

http://localhost:8000

📚 How It Works

CipherLab Pro uses a shift-based substitution cipher:

“Encrypt” shifts letters forward

“Decrypt” shifts letters backward

Characters wrap around A–Z

Case & punctuation can be preserved

Example:

Input:  HELLO
Shift:     3
Output: KHOOR

🗂️ Future Improvements

Add other cipher algorithms (Vigenère, ROT13, XOR, etc.)

Add PWA support

Add export/import text features

Add animated output transitions

🎯 Why This Project is Portfolio-Ready

Modern interface

Clean code structure

Demonstrates DOM manipulation skills

Includes theme system + persistence

Shows cybersecurity & cryptography interest

🤝 Contributing

Contributions, issues, and feature requests are welcome.

📄 License

This project is licensed under the MIT License.
