import { AuthProvider } from '../context/AuthContext';
import './globals.css';

export const metadata = {
  title: 'Digital Heroes | Play with Purpose',
  description: 'Premium performance tracking tied to high-impact charitable giving.',
};

export default function RootLayout({ children }) {
  return (
    // FIX: Adding className="dark" and style={{ colorScheme: 'dark' }} 
    // guarantees your app stays locked to dark mode globally on all screens!
    <html lang="en" className="dark" style={{ colorScheme: 'dark' }}>
      <body className="bg-slate-950 text-slate-100 antialiased selection:bg-amber-500 selection:text-slate-950">
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}