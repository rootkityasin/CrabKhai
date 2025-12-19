# CrabKhai - Premium Seafood from Sundarbans 🦀

**CrabKhai** is a premium e-commerce platform dedicated to bringing the freshest live crab and seafood delicacies from the Sundarbans directly to your doorstep. Our mission is to provide an authentic, high-quality seafood experience with a touch of luxury.

## 🚀 Live Demo
- **Frontend**: [http://localhost:3000](http://localhost:3000) (Local Development)

## 🛠 Tech Stack
This project is built using the latest web technologies for speed, scalability, and developer experience.

- **Framework**: [Next.js 16](https://nextjs.org/) (App Router)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **UI Components**: [Radix UI](https://www.radix-ui.com/) & [Lucide Icons](https://lucide.dev/)
- **State Management**: [Zustand](https://github.com/pmndrs/zustand)
- **Database**: Prisma (ORM)
- **Fonts**: Playfair Display (Headings) & Inter (Body)

## 📂 Project Structure
Here's a quick overview of how the codebase is organized:

```
crab-khai/
├── app/                  # Next.js App Router
│   ├── (client)/         # Client-facing pages (Menu, Checkout)
│   ├── admin/            # Admin dashboard routes
│   └── page.tsx          # Landing page (Home)
├── components/           # Reusable UI components
│   ├── client/           # Components for the public store
│   ├── admin/            # Components for the admin panel
│   └── ui/               # Base UI elements (Buttons, Inputs)
├── lib/                  # Utilities and helper functions
├── prisma/               # Database schema and config
└── public/               # Static assets (images, fonts)
```

## ⚡ Getting Started

Follow these steps to get the project running locally on your machine.

### Prerequisites
Make sure you have [Node.js](https://nodejs.org/) (v18 or higher) installed.

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/rootkityasin/CrabKhai.git
   cd CrabKhai
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Run the development server**
   ```bash
   npm run dev
   ```

4. **Access the App**
   Open [http://localhost:3000](http://localhost:3000) in your browser.

## 🎨 Design System
We use a custom theme configured in `tailwind.config.ts` to reflect our brand identity:
- **Colors**: `crab-red` (Primary), `ocean-blue` (Secondary), `sand` (Accent).
- **Typography**: Serif headings for elegance, Sans-serif body for readability.

## 🤝 Contributing
Feel free to open issues or submit pull requests if you have ideas for improvements.

---
*Built with ❤️ by CrabKhai Engineering Team*
