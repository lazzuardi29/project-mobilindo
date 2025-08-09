# 3N MOBILINDO - Car Showroom Website

A modern car showroom website built with Next.js, Tailwind CSS, and Supabase. This project features a beautiful, responsive design with admin functionality for managing cars and gallery content.

## 🚗 Features

### Public Features
- **Home Page**: Hero section, featured cars, benefits, gallery preview, and company description
- **List Harga**: Complete car listing with prices and details
- **Galeri**: Photo gallery showcasing showroom activities and events
- **Kontak**: Contact information and contact form
- **Responsive Design**: Mobile-first approach with modern UI/UX

### Admin Features
- **Admin Login**: Secure authentication system
- **Dashboard**: Overview and navigation to all admin functions
- **Car Management**: Add, edit, and delete cars with images and prices
- **Gallery Management**: Add, edit, and delete gallery items with descriptions
- **Profile Management**: Edit admin credentials and profile information

## 🎨 Design Theme

The website follows a premium car showroom design with:
- **Primary Colors**: White, Silver/Gray, and Red (#DC2626)
- **Typography**: Clean, modern fonts
- **Layout**: Professional, spacious design with excellent user experience
- **Branding**: Custom 3N MOBILINDO logo and styling

## 🛠 Tech Stack

- **Frontend**: Next.js 15, React 19, Tailwind CSS 4
- **Backend**: Supabase (Database, Authentication, Storage)
- **Styling**: Tailwind CSS with custom design system
- **Deployment**: Vercel-ready

## 📁 Project Structure

```
proj-mobilindo/
├── app/
│   ├── admin/
│   │   ├── cars/
│   │   │   ├── add/page.js
│   │   │   ├── edit/[id]/page.js
│   │   │   └── page.js
│   │   ├── gallery/
│   │   │   ├── add/page.js
│   │   │   ├── edit/[id]/page.js
│   │   │   └── page.js
│   │   ├── login/page.js
│   │   ├── dashboard/page.js
│   │   └── profile/page.js
│   ├── components/
│   │   ├── Header.js
│   │   └── Footer.js
│   ├── galeri/page.js
│   ├── kontak/page.js
│   ├── list-harga/page.js
│   ├── globals.css
│   ├── layout.js
│   └── page.js
├── lib/
│   └── supabase.js
├── public/
└── README.md
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Supabase account

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd proj-mobilindo
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up Supabase**
   - Create a new Supabase project
   - Set up the following tables:
     
     **Cars Table:**
     ```sql
     CREATE TABLE cars (
       id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
       name TEXT NOT NULL,
       price NUMERIC NOT NULL,
       image_url TEXT,
       created_at TIMESTAMP DEFAULT NOW()
     );
     ```
     
     **Gallery Table:**
     ```sql
     CREATE TABLE gallery (
       id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
       description TEXT NOT NULL,
       image_url TEXT,
       created_at TIMESTAMP DEFAULT NOW()
     );
     ```
     
     **Admin Table:**
     ```sql
     CREATE TABLE admin (
       id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
       username TEXT NOT NULL,
       admin_code TEXT NOT NULL,
       created_at TIMESTAMP DEFAULT NOW()
     );
     ```

   - Create storage buckets named `cars` and `gallery`
   - Copy your Supabase URL and API keys

4. **Configure environment variables**
   - Update `lib/supabase.js` with your Supabase credentials:
     ```javascript
     const supabaseUrl = 'YOUR_SUPABASE_URL'
     const supabaseAnonKey = 'YOUR_SUPABASE_ANON_KEY'
     const supabaseServiceKey = 'YOUR_SUPABASE_SERVICE_KEY'
     ```

5. **Run the development server**
   ```bash
   npm run dev
   ```

6. **Open your browser**
   - Navigate to `http://localhost:3000`
   - Admin panel: `http://localhost:3000/admin/login`

## 📊 Database Schema

### Cars Table
- `id` (UUID): Primary key
- `name` (TEXT): Car name/model
- `price` (NUMERIC): Car price
- `image_url` (TEXT): Image URL from Supabase Storage
- `created_at` (TIMESTAMP): Creation timestamp

### Gallery Table
- `id` (UUID): Primary key
- `description` (TEXT): Activity/event description
- `image_url` (TEXT): Image URL from Supabase Storage
- `created_at` (TIMESTAMP): Creation timestamp

### Admin Table
- `id` (UUID): Primary key
- `username` (TEXT): Admin username for login
- `admin_code` (TEXT): Admin password/code for login
- `created_at` (TIMESTAMP): Creation timestamp

## 🔐 Admin Access

1. **First-time setup**
   - Insert an admin record into the `admin` table:
     ```sql
     INSERT INTO admin (username, admin_code) 
     VALUES ('admin', 'your-secure-password');
     ```

2. **Access admin panel**
   - Navigate to `/admin/login`
   - Use your admin credentials to log in

3. **Admin features**
   - Dashboard overview
   - Manage cars (CRUD operations)
   - Manage gallery (CRUD operations)
   - Edit admin profile

## 🎯 Key Features Implementation

### Responsive Design
- Mobile-first approach
- Breakpoints: sm (640px), md (768px), lg (1024px), xl (1280px)
- Flexible grid layouts
- Touch-friendly interfaces

### Image Management
- Supabase Storage integration
- Image upload and URL management
- Responsive image display
- Fallback images for missing content

### User Experience
- Smooth transitions and animations
- Loading states
- Error handling
- Form validation
- Success notifications

## 🚀 Deployment

### Vercel Deployment
1. Push code to GitHub
2. Connect repository to Vercel
3. Configure environment variables in Vercel dashboard
4. Deploy automatically

### Environment Variables
Set these in your deployment platform:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_KEY`

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 📞 Support

For support and questions:
- Email: info@3nmobilindo.com
- Phone: +62 21 1234 5678

---

**3N MOBILINDO** - Premium Car Showroom Website
Built with ❤️ using Next.js and Supabase
