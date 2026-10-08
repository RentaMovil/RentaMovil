import { useEffect, useState } from "react";
import "./PaymentCountdown.css";

// INV-015 (rtm-booking-reservation): la reserva expira sola a CANCELLED si nadie sube un
// comprobante aprobado dentro de esta ventana. Mismo valor que
// APP_BOOKING_RESERVATION_PAYMENT_WINDOW_HOURS en el backend.
const PAYMENT_WINDOW_HOURS = 24;
const URGENT_THRESHOLD_MS = 60 * 60 * 1000; // último tramo: se resalta en rojo

function remainingMs(createdAt) {
    const deadline = new Date(createdAt).getTime() + PAYMENT_WINDOW_HOURS * 60 * 60 * 1000;
    return deadline - Date.now();
}

function formatRemaining(ms) {
    if (ms <= 0) return "Expirando...";
    const totalMinutes = Math.floor(ms / 60000);
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
    if (hours > 0) return `${hours}h ${minutes}m restantes`;
    return `${minutes}m restantes`;
}

/**
 * Cuenta regresiva de la ventana de pago (INV-015). Es solo informativa: quien expira
 * de verdad la reserva es el job de booking, no esta pantalla — al llegar a 0 el texto
 * cambia a "Expirando..." hasta que un refetch traiga el status ya en CANCELLED.
 */
export default function PaymentCountdown({ createdAt }) {
    const [remaining, setRemaining] = useState(() => remainingMs(createdAt));

    useEffect(() => {
        const interval = setInterval(() => setRemaining(remainingMs(createdAt)), 30000);
        return () => clearInterval(interval);
    }, [createdAt]);

    const isUrgent = remaining > 0 && remaining <= URGENT_THRESHOLD_MS;

    return (
        <span className={`payment-countdown ${isUrgent ? "urgent" : ""}`}>
            ⏱ {formatRemaining(remaining)}
        </span>
    );
}
