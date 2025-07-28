# 📈 AI Stock Predictor - Full Stack Application

A comprehensive full-stack web application built with Next.js 15 that features AI-powered stock price prediction using neural networks, user authentication, admin dashboard, and real-time data visualization.

## 🌐 Live Demo

**Deployed Version:** https://full-stack-stockapp-one.vercel.app/ 

## ✨ Features

- 🤖 **AI Stock Prediction**: Neural network-powered stock price forecasting using Brain.js
- 🔐 **Authentication System**: Secure login with NextAuth.js (Credentials + Google OAuth)
- 👥 **User Management**: Role-based access control (User/Admin)
- 📊 **Interactive Charts**: Real-time data visualization with Chart.js
- 🛡️ **Admin Dashboard**: User management, analytics, and audit logging
- 📱 **Responsive Design**: Mobile-friendly interface with Tailwind CSS
- 🗄️ **Database Integration**: MongoDB Atlas for data persistence

## 🚀 How to Run Locally

### Prerequisites

- Node.js 18+ and npm
- MongoDB Atlas account
- Google OAuth credentials (optional)

### 1. Clone the Repository

```bash
git clone https://github.com/RaniJames17/Full-Stack-Stockapp.git
cd Full-Stack-Stockapp/full-stack-app
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Environment Setup

Create a `.env.local` file in the project root:

```

### 4. Database Setup

1. Create a MongoDB Atlas cluster
2. Create a database user with read/write permissions
3. Whitelist your IP address (or use 0.0.0.0/0 for development)
4. Update the `MONGODB_URI` in your `.env.local`

### 5. Run the Application

```bash
# Development mode
npm run dev

# Production build
npm run build
npm start
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

## 📊 Dataset Format and Usage

### Stock Data Format

The application uses the following data structure for stock entries:

```typescript
interface StockEntry {
  symbol: string;    // Stock symbol (e.g., "AMZN", "GOOGL")
  date: string;      // Date in YYYY-MM-DD format
  price: number;     // Stock price in USD
}
```

### Data Input Methods

1. **Manual Entry**: Add individual stock data points through the UI
2. **Sample Data Generation**: Auto-generate 60 days of sample data for testing
3. **Supported Stocks**: AMZN, GOOGL, CRM, MSFT, NVDA

### Data Validation

- Price must be positive numbers
- Dates must be unique per dataset
- Minimum 10 entries required for AI prediction

## 🧠 Model Logic

### Neural Network Architecture

The AI prediction system uses **Brain.js** with the following configuration:

```javascript
const network = new brain.NeuralNetwork({
  hiddenLayers: [10, 8]  // Two hidden layers
});
```

### Training Process

1. **Data Preprocessing**:
   - Normalize price data to [0,1] range using min-max scaling
   - Create sliding windows of 5 consecutive prices

2. **Training Data Structure**:
   ```javascript
   {
     input: [price1, price2, price3, price4, price5],  // 5 normalized prices
     output: [price6]                                   // Next price (normalized)
   }
   ```

3. **Training Parameters**:
   - **Iterations**: 2000
   - **Learning Algorithm**: Backpropagation
   - **Input Window**: 5 previous prices
   - **Output**: 1 future price

4. **Prediction Generation**:
   - Generates 5-day forward predictions
   - Uses rolling window approach
   - Includes confidence scoring (70-80% range)

### Model Performance

- **Minimum Training Data**: 10 stock entries
- **Optimal Training Data**: 30+ entries
- **Prediction Horizon**: 5 days ahead
- **Data Normalization**: Min-max scaling for stability

## 📚 Third-Party Libraries

### Core Framework
- **Next.js 15.4.3**: React framework with App Router
- **React 19**: UI library with latest features
- **TypeScript**: Type-safe development

### AI & Data Visualization
- **Brain.js**: Neural network library for stock prediction
- **Chart.js 4.5.0**: Interactive charts and data visualization

### Authentication & Security
- **NextAuth.js 4.24.10**: Authentication framework
- **bcryptjs 2.4.3**: Password hashing
- **MongoDB**: Database for user and session management

### UI & Styling
- **Tailwind CSS 3.4.17**: Utility-first CSS framework
- **Responsive Design**: Mobile-first approach

### Database & Backend
- **MongoDB Atlas**: Cloud database service
- **Mongoose/MongoDB Driver**: Database connectivity

### Development Tools
- **ESLint**: Code linting
- **TypeScript**: Static type checking

## 🏗️ Project Structure

```
src/
├── app/                    # Next.js App Router
│   ├── api/               # API routes
│   ├── admin/             # Admin dashboard pages
│   ├── stock-predictor/   # AI prediction interface
│   └── dashboard/         # User dashboard
├── components/            # Reusable UI components
├── lib/                   # Utility functions
│   ├── auth.ts           # NextAuth configuration
│   └── mongodb.ts        # Database connection
└── middleware.ts          # Route protection

public/                    # Static assets
```

## 🔐 Authentication System

### User Roles
- **User**: Access to stock predictor and personal dashboard
- **Admin**: Full system access including user management

### Authentication Methods
1. **Credentials**: Email/password authentication
2. **Google OAuth**: Social login integration

### Protected Routes
- `/dashboard`: User dashboard
- `/stock-predictor`: AI prediction tool
- `/admin/*`: Admin-only routes

## 🛠️ API Endpoints

### Authentication
- `POST /api/auth/[...nextauth]`: NextAuth.js endpoints
- `POST /api/register`: User registration

### Stock Prediction
- `GET /api/test-mongodb`: Database connection test
- `GET /api/env-check`: Environment variables validation

### Admin Functions
- `GET /api/admin/users`: User management
- `GET /api/admin/analytics`: System analytics
- `GET /api/admin/audit-logs`: Activity monitoring

## 🚀 Deployment

### Vercel Deployment

1. **Connect Repository**: Link your GitHub repo to Vercel
2. **Environment Variables**: Set all required environment variables
3. **Build Settings**:
   - Framework: Next.js
   - Root Directory: `full-stack-app`
   - Build Command: `npm run build`

### Required Environment Variables for Production

```bash
NEXTAUTH_URL=https://your-app.vercel.app
NEXTAUTH_SECRET=production-secret-key
MONGODB_URI=your-mongodb-atlas-uri
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
```

## 🧪 Testing

### Manual Testing Steps

1. **Authentication**: Test login/logout functionality
2. **Stock Predictor**: Add data and generate predictions
3. **Admin Features**: Test user management (admin role required)
4. **Responsive Design**: Test on different screen sizes

### Debug Tools

- `/auth-debug`: Authentication state debugging
- `/api/env-check`: Environment variables validation
- `/api/test-mongodb`: Database connection testing

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📝 License

This project is for educational purposes. Feel free to use and modify.

## 👨‍💻 Author

**Rani James**
- GitHub: [@RaniJames17](https://github.com/RaniJames17)
- Email: ranimariya17@gmail.com

## 🔮 Future Enhancements

- Real-time stock data integration
- More sophisticated ML models
- Portfolio management features
- Advanced analytics dashboard
- Mobile app development

---

**Built with Next.js, Brain.js, and modern web technologies**
