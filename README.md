
# Order Management System (OMS) - Frontend

A modern, responsive web application for managing orders built with React, TypeScript, and Tailwind CSS.

## 🚀 Features

### User Features
- **Authentication**: Secure login and registration system
- **Dashboard**: Personal dashboard with order overview and statistics
- **Order Management**: Place new orders with product name and quantity
- **Order Tracking**: View order status (pending, processing, completed, cancelled)
- **Responsive Design**: Works seamlessly on desktop and mobile devices

### Admin Features
- **Admin Dashboard**: Complete overview of all orders and users
- **Order Management**: Update order status for any order
- **Search & Filter**: Find orders by product name, customer, or order ID
- **Analytics**: View order statistics and metrics

### Technical Features
- **Modern UI**: Clean, professional design inspired by Stripe and Notion
- **Real-time Updates**: Toast notifications for user feedback
- **State Management**: Context-based state management for auth and orders
- **Protected Routes**: Role-based access control
- **Responsive Navigation**: Adaptive navbar with user authentication state

## 🛠️ Tech Stack

- **Frontend Framework**: React 18 with TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: Shadcn/ui
- **Routing**: React Router DOM
- **State Management**: React Context API
- **Icons**: Lucide React
- **Notifications**: Sonner (Toast notifications)
- **Build Tool**: Vite

## 📁 Project Structure

```
src/
├── components/           # Reusable UI components
│   ├── Navbar.tsx       # Navigation component
│   └── ProtectedRoute.tsx # Route protection
├── contexts/            # Context providers
│   ├── AuthContext.tsx  # Authentication state
│   └── OrderContext.tsx # Order management state
├── pages/               # Application pages
│   ├── Login.tsx        # User login
│   ├── Register.tsx     # User registration
│   ├── Dashboard.tsx    # User dashboard
│   ├── PlaceOrder.tsx   # Order creation
│   └── AdminDashboard.tsx # Admin panel
└── App.tsx             # Main application component
```

## 🚦 Getting Started

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd oms-frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:8080`

## 🎨 Design System

The application uses a consistent design system with:

- **Color Palette**: Modern blue primary with gray accents
- **Typography**: Clean, readable fonts with proper hierarchy
- **Spacing**: Consistent spacing using Tailwind's spacing scale
- **Components**: Reusable UI components with proper states
- **Responsive**: Mobile-first responsive design
- **Accessibility**: Focus states and proper semantic HTML

## 📱 Responsive Design

The application is fully responsive and optimized for:
- **Desktop**: Full-featured interface with side-by-side layouts
- **Tablet**: Adapted layouts with proper touch targets
- **Mobile**: Stacked layouts with mobile-optimized navigation

## 🔐 Authentication & Authorization

- **JWT-like Authentication**: Mock authentication system (ready for backend integration)
- **Role-based Access**: Separate user and admin interfaces
- **Protected Routes**: Automatic redirection for unauthorized access
- **Persistent Sessions**: Login state preserved across browser sessions

## 📊 Order Management

### Order States
- **Pending**: Newly created orders awaiting review
- **Processing**: Orders being prepared/fulfilled
- **Completed**: Successfully fulfilled orders  
- **Cancelled**: Cancelled orders

### Features
- Create new orders with product name and quantity
- View order history with status tracking
- Admin can update order status
- Search and filter capabilities for admins

## 🔧 Customization

The application is built with modularity in mind:

- **Theme**: Easily customizable via Tailwind CSS variables
- **Components**: Reusable components with consistent props
- **State Management**: Clear separation of concerns with contexts
- **API Integration**: Ready for backend API integration

## 🚀 Deployment

The application is ready for deployment on any static hosting platform:

- **Vite Build**: Optimized production builds
- **Static Assets**: All assets properly bundled
- **Environment Ready**: Easy configuration for different environments

## 📈 Future Enhancements

Potential areas for expansion:
- Backend API integration
- Real-time notifications
- Advanced filtering and sorting
- Order history export
- Email notifications
- Payment integration
- Inventory management

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

---

Built with ❤️ using React, TypeScript, and modern web technologies.
