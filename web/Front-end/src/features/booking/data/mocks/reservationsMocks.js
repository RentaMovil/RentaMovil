    import img from "../../../../assets/carts/car1.jpg";

    // Las reservas del historial guardan pickupBranchId / returnBranchId
    // (ver src/types/reservation.ts — Reservation), NO un objeto de
    // sucursal embebido. El nombre/ciudad para mostrar se resuelve en
    // pantalla contra el catálogo único (shared/mocks/branches.js /
    // getBranchById), igual que haría un backend real que solo entrega
    // el id como foreign key.
    export const reservationsMock = [
    {
        id: "RES-9428",
        created_at: "20 Sep 2026",
        status: "activa",
        currency: "COP",
        
        vehicle: {
        id: "CAR-101",
        brand: "Toyota",
        model: "Corolla 2024",
        category: "Sedán Ejecutivo",
        transmission: "Automático",
        seats: 5,
        plate: "ABC-984",
        img: img
        },
        
        pickupBranchId: "BR-01",
        returnBranchId: "BR-02",
        
        tiempos: {
        // Fechas a futuro respecto a "hoy" para que la reserva "activa"
        // siga cayendo dentro de la ventana editable de INV-013 (más de
        // 3 días antes de end_date) y el flujo de edición de sucursal
        // de devolución sea verificable en la demo. "days" se deja en 4
        // para que siga cuadrando con billing.subtotal_vehicle (80000 x 4).
        start_date: "24 Sep 2026 10:00 AM",
        end_date: "01 Oct 2026 10:00 AM",
        days: 4
        },
        

        billing: {
        price_per_day: 80000,
        subtotal_vehicle: 320000,
        insurance_per_day: 20000,
        subtotal_insurance: 80000,
        total_price: 400000,
        insurance_included: true
        }
    },
    {
        id: "RES-3152",
        created_at: "10 Mar 2026",
        status: "completada",
        currency: "COP",
        
        vehicle: {
        id: "CAR-204",
        brand: "Mazda",
        model: "CX-5 2025",
        category: "SUV Premium",
        transmission: "Automático",
        seats: 5,
        plate: "XYZ-123",
        img: img
        },
        
        pickupBranchId: "BR-01",
        returnBranchId: "BR-02",
        
        tiempos: {
        start_date: "15 Mar 2026 08:00 AM",
        end_date: "18 Mar 2026 08:00 AM",
        days: 3
        },
        
        billing: {
        price_per_day: 120000,
        subtotal_vehicle: 360000,
        insurance_per_day: 30000,
        subtotal_insurance: 90000,
        total_price: 450000,
        insurance_included: true
        }
    },
    {
        id: "RES-1044",
        created_at: "02 Feb 2026",
        status: "cancelada",
        currency: "COP",
        
        vehicle: {
        id: "CAR-055",
        brand: "Chevrolet",
        model: "Onix 2023",
        category: "Compacto",
        transmission: "Mecánico",
        seats: 5,
        plate: "KMS-456",
        img: img
        },
        
        pickupBranchId: "BR-01",
        returnBranchId: "BR-02",
        
        tiempos: {
        start_date: "10 Feb 2026 02:00 PM",
        end_date: "12 Feb 2026 02:00 PM",
        days: 2
        },
        
        billing: {
        price_per_day: 65000,
        subtotal_vehicle: 130000,
        insurance_per_day: 15000,
        subtotal_insurance: 30000,
        total_price: 160000,
        insurance_included: false
        }
    }
    ];
