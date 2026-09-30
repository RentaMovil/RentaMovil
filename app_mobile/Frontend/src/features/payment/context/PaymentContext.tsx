import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";

import { createPayment as createPaymentService } from "../services/paymentService";

import type {
  BankAccount,
  Payment,
  PaymentDraft,
  PaymentStatus,
} from "../../../types";

type PaymentContextType = {
  /** Cuenta bancaria de destino elegida por el cliente. */
  selectedBankAccount: BankAccount | null;
  setSelectedBankAccount: (account: BankAccount | null) => void;

  /** Pago registrado, con su estado de revision. */
  payment: Payment | null;
  paymentStatus: PaymentStatus | null;

  processPayment: (draft: PaymentDraft) => Promise<Payment>;

  clearPayment: () => void;
};

const PaymentContext = createContext<PaymentContextType | null>(null);

type Props = {
  children: ReactNode;
};

export function PaymentProvider({ children }: Props) {
  const [selectedBankAccount, setSelectedBankAccount] =
    useState<BankAccount | null>(null);
  const [payment, setPayment] = useState<Payment | null>(null);
  const [paymentStatus, setPaymentStatus] = useState<PaymentStatus | null>(null);

  const processPayment = useCallback(
    async (draft: PaymentDraft): Promise<Payment> => {
      try {
        const created = await createPaymentService(draft);

        setPayment(created);
        setPaymentStatus(created.status);

        return created;
      } catch (error) {
        setPayment(null);
        setPaymentStatus(null);
        throw error;
      }
    },
    [],
  );

  const clearPayment = useCallback(() => {
    setSelectedBankAccount(null);
    setPayment(null);
    setPaymentStatus(null);
  }, []);

  const value = useMemo<PaymentContextType>(
    () => ({
      selectedBankAccount,
      setSelectedBankAccount,
      payment,
      paymentStatus,
      processPayment,
      clearPayment,
    }),
    [
      selectedBankAccount,
      payment,
      paymentStatus,
      processPayment,
      clearPayment,
    ],
  );

  return (
    <PaymentContext.Provider value={value}>{children}</PaymentContext.Provider>
  );
}

export function usePayment(): PaymentContextType {
  const context = useContext(PaymentContext);

  if (!context) {
    throw new Error("usePayment debe utilizarse dentro de PaymentProvider");
  }

  return context;
}
