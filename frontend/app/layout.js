
import { AuthProvider } from '../context/AuthContext';
import './globals.css';

export const metadata = {
  title: 'Digital Heroes | Play with Purpose',
  description: 'Premium performance tracking tied to high-impact charitable giving.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-slate-950 text-slate-100 antialiased selection:bg-amber-500 selection:text-slate-950">
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}