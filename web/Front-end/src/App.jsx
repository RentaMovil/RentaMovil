import './App.css'
import 'leaflet/dist/leaflet.css';
import React, { useState, useEffect } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';

// Auth
import Login from './features/auth/pages/Login.jsx';
import Account from './features/count/pages/Account.jsx';
import AccountAdmin from './features/count/pages/AccountAdmin.jsx';

import ChangePassword from './features/auth/pages/ChangePassword.jsx';

import VehicleInventory from './features/admin/VehicleInventory/pages/VehicleInventory.jsx';
// Vehicles
import Home from './features/vehicles/pages/Home.jsx';
import HomeS from './features/vehicles/pages/HomeS.jsx';

// Booking
import Reservation from './features/booking//pages/Reservation.jsx';
import HistorialReservation from './features/booking/pages/HistorialReservation.jsx';

// Payment
import Payment from './features/payment/pages/Payment.jsx';

// Notification
import Notification from './features/notification/pages/Notification.jsx';
import NotificationAdmin from './features/notification/pages/NotificationAdmin.jsx';

// Admin - Vehicles
import RegisterVehicle from './features/admin/registerVehicle/pages/RegisterVehicle.jsx';

// Admin - Maintenance
import Maintenance from './features/admin/registerMaintenance/pages/Maintenance.jsx';

// Admin - HomeAdmin
import HomeAdmin from './features/admin/HomeAdmin/Pages/HomeAdmin.jsx';

import InsuranceTypes from './features/admin/insuranceTypes/pages/InsuranceTypes.jsx';
import Branches from './features/admin/branches/pages/Branches.jsx';
import ReservationsList from './features/admin/reservations/pages/ReservationsList.jsx';
import ReservationDetail from './features/admin/reservations/pages/ReservationDetail.jsx';


import History from './features/admin/historyMaintenance/pages/History.jsx';

import RegisterForm from './features/auth/components/RegisterForm.jsx';

import EmailVerification from './features/auth/pages/EmailVerification.jsx';

import CodeVerification from "./features/auth/pages/CodeVerification.jsx";

import ChangePasswordLogin from './features/auth/pages/ChangePasswordLogin.jsx';

//----------
import { httpClient } from './shared/api/httpClient';
import { tokenStore } from './shared/api/tokenStore.js';

// Super Admin
import UserManagement from './features/admin/users/pages/UserManagement.jsx';
import BankAccounts from './features/admin/bankAccounts/pages/BankAccounts.jsx';




function App() {
  const [isRestoring, setIsRestoring] = useState(true);
  const [theme, setTheme] = useState(
    () => localStorage.getItem("theme") || "light"
  );

  useEffect(() => {
    document.documentElement.className = theme;
    localStorage.setItem("theme", theme);
  }, [theme]);
  
  useEffect(() => {
        async function restoreSession() {
            const refreshToken = localStorage.getItem('rentamovil_refresh_token');
                document.documentElement.className = theme;
    localStorage.setItem("theme", theme);
            if (!refreshToken) { setIsRestoring(false); return; }

            try {
                const data = await httpClient.post('/auth/refresh', { refreshToken });
                tokenStore.setAccessToken(data.accessToken);
            } catch {
                localStorage.removeItem('rentamovil_refresh_token');
            } finally {
                setIsRestoring(false);
            }
        }
        restoreSession();
    }, [theme]);

    if (isRestoring) return <p>Cargando sesión...</p>;


  return (
    <BrowserRouter>

      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<RegisterForm />} />
        <Route path="/account" element={<Account theme={theme} setTheme={setTheme} />} />
        <Route path="/account/admin" element={<AccountAdmin theme={theme} setTheme={setTheme} />} />
        <Route path="/ChangePassword" element={<ChangePassword />} />
        <Route path="/home" element={<Home />} />
        <Route path="/homeS" element={<HomeS />} />
        <Route path="/reservation" element={<Reservation />} />
        <Route path="/HistorialReservation" element={<HistorialReservation />} />
        <Route path="/payment" element={<Payment />} />
        <Route path="/Notification" element={<Notification />} />
        <Route path="/NotificationAdmin" element={<NotificationAdmin />} />
        <Route path="/notificationAdmin" element={<NotificationAdmin />} />
        <Route path="/RegisterVehicle" element={<RegisterVehicle />} />
        <Route path="/Maintenance" element={<Maintenance />} />
        <Route path="/HomeAdmin" element={<HomeAdmin />} />
        <Route path="/homeAdmin" element={<HomeAdmin />} />
        <Route path="/home-admin" element={<HomeAdmin />} />
        <Route path="/History" element={<History />} />
        <Route path="/VehicleInventory" element={<VehicleInventory />} />
        <Route path="/Register" element={<RegisterForm />} />
        <Route path="/EmailVerification" element={<EmailVerification />} />
        <Route path="/CodeVerification" element={<CodeVerification />} />
        <Route path="/ChangePasswordLogin" element={<ChangePasswordLogin />} />
        <Route path="/admin/users" element={<UserManagement />} />
        <Route path="/admin/bank-accounts" element={<BankAccounts />} />
        <Route path="/insurance-types" element={<InsuranceTypes />} />
        <Route path="/branches" element={<Branches />} />
        <Route path="/reservations" element={<ReservationsList />} />
        <Route path="/reservations/:id" element={<ReservationDetail />} />

      </Routes>
    </BrowserRouter>
  );
}

export default App;
