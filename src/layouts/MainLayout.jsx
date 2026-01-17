import React from 'react';
import Navbar from '../components/Navbar';
import { Outlet } from 'react-router-dom';

export default function MainLayout() {
    return (
        <div className="app-wrapper">
            <Navbar />
            <main className="main-content">
                <Outlet />
            </main>

            <footer className="footer">
                <div className="container">
                    <p>&copy; 2024 KiranaKart. Made for India with ❤️</p>
                </div>
            </footer>

            <style>{`
        .app-wrapper {
          min-height: 100vh;
          display: flex;
          flex-direction: column;
        }
        .main-content {
          flex: 1;
        }
        .footer {
          background: #1F2937;
          color: #9CA3AF;
          padding: 2rem 0;
          margin-top: 4rem;
          text-align: center;
        }
      `}</style>
        </div>
    );
}
