import React, { useState } from "react";
import { FiChevronDown, FiChevronUp } from "react-icons/fi";
import { usePayment } from "../context/PaymentContext";
import { getActiveBankAccounts } from "../data/mocks/bankAccounts";
import "./BankAccountSelector.css";


/**
 * Grilla de cuentas bancarias seleccionables. El encabezado de la
 * sección ("Selecciona tu cuenta bancaria destino" + el hint del QR)
 * lo aporta Payment.jsx a través de PaySectionHeader, para que el
 * título/subtítulo se vea igual en todas las secciones de la página.
 */
export default function BankAccountSelector() {
    const { payment, updatePayment } = usePayment();
    const [copiedId, setCopiedId] = useState(null);
    const [isExpanded, setIsExpanded] = useState(() => !payment?.bankAccountId);

    const activeAccounts = getActiveBankAccounts();
    const selectedAccount = activeAccounts.find(
        (account) => account.bankAccountId === payment?.bankAccountId
    );

    const handleSelect = (account) => {
        updatePayment({
            bankAccountId: account.bankAccountId,
        });
        setIsExpanded(false);
    };

    const handleCopy = (e, accountNumber, accountId) => {
        e.stopPropagation(); // Evita que se seleccione la tarjeta al hacer clic en copiar
        navigator.clipboard.writeText(accountNumber);
        setCopiedId(accountId);
        setTimeout(() => setCopiedId(null), 2000);
    };

    return (
        <div className="bank-account-selector">
            <button
                type="button"
                className="bank-account-toggle"
                aria-expanded={isExpanded}
                onClick={() => setIsExpanded((expanded) => !expanded)}
            >
                <span className="bank-account-toggle-copy">
                    <strong>
                        {selectedAccount && !isExpanded
                            ? `Cuenta seleccionada: ${selectedAccount.bankName}`
                            : isExpanded
                              ? "Ocultar cuentas bancarias"
                              : "Seleccionar cuenta bancaria"}
                    </strong>
                    <small>
                        {isExpanded
                            ? "Elige la cuenta a la que realizarás la transferencia."
                            : "Pulsa para ver o cambiar las cuentas disponibles."}
                    </small>
                </span>
                {isExpanded ? <FiChevronUp aria-hidden="true" /> : <FiChevronDown aria-hidden="true" />}
            </button>

            {isExpanded && (
                <div className="bank-account-grid">
            {activeAccounts.map((account) => {
                const isSelected =
                    payment?.bankAccountId === account.bankAccountId;

                return (
                    <div
                        key={account.bankAccountId}
                        onClick={() => handleSelect(account)}
                        className={`bank-account-card ${
                            isSelected ? "bank-account-selected" : ""
                        }`}
                    >
                        {/* Insignia de Recomendado */}
                        {account.isRecommended && (
                            <div className="bank-account-badge-recommended">
                                ✓ RECOMENDADO
                            </div>
                        )}

                        {/* Encabezado del Banco */}
                        <div className="bank-account-title">
                            <div className="bank-account-info">
                                <div
                                    className={`bank-account-logo ${
                                        account.bankCode || "default"
                                    }`}
                                >
                                    {account.bankName
                                        .substring(0, 2)
                                        .toUpperCase()}
                                </div>

                                <div>
                                    <strong>{account.bankName}</strong>
                                    <small>
                                        {account.accountType || "Cuenta bancaria"}
                                    </small>
                                </div>
                            </div>

                            <div
                                className={`bank-account-radio ${
                                    isSelected ? "active" : ""
                                }`}
                            >
                                {isSelected && (
                                    <div className="bank-account-radio-dot" />
                                )}
                            </div>
                        </div>

                        {/* Datos del Titular y NIT */}
                        <div className="bank-account-holder">
                            <div>
                                <strong>Titular:</strong> {account.accountHolder}
                            </div>
                            {account.nit && (
                                <div>
                                    <strong>NIT:</strong> {account.nit}
                                </div>
                            )}
                        </div>

                        {/* Número de Cuenta y Botón Copiar */}
                        <div className="bank-account-number-box">
                            <div>
                                <span className="bank-account-number-label">
                                    NÚMERO DE CUENTA
                                </span>
                                <span className="bank-account-number-value">
                                    {account.accountNumber}
                                </span>
                            </div>
                            <button
                                type="button"
                                className="bank-account-copy-btn"
                                onClick={(e) =>
                                    handleCopy(
                                        e,
                                        account.accountNumber,
                                        account.bankAccountId
                                    )
                                }
                            >
                                <svg
                                    width="14"
                                    height="14"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                >
                                    <rect
                                        x="9"
                                        y="9"
                                        width="13"
                                        height="13"
                                        rx="2"
                                        ry="2"
                                    ></rect>
                                    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                                </svg>
                                {copiedId === account.bankAccountId
                                    ? "Copiado!"
                                    : "Copiar"}
                            </button>
                        </div>

                        {/* Sección del Código QR */}
                        <div className="bank-account-qr">
                            <p className="bank-account-qr-title">
                                <span className="bank-account-qr-icon">📱</span>
                                CÓDIGO QR PARA {account.bankName.toUpperCase()}
                            </p>

                            <div className="bank-account-qr-frame">
                                <img
                                    src={account.qrImageUrl}
                                    alt={`Código QR de ${account.bankName}`}
                                />
                            </div>

                            <small className="bank-account-qr-subtitle">
                                Escanea para transferir directamente desde tu{" "}
                                <strong>App {account.bankName}</strong>
                            </small>

                            {/* Acciones y Etiquetas Inferiores */}
                            <div className="bank-account-qr-footer">
                                <a
                                    href={account.qrImageUrl}
                                    download
                                    className="bank-account-download-link"
                                    onClick={(e) => e.stopPropagation()}
                                >
                                    📥 Descargar QR
                                </a>
                                <span className="bank-account-dot-separator">
                                    •
                                </span>
                                <span className="bank-account-tag-badge">
                                    {account.tagLabel || "Cero comisión"}
                                </span>
                            </div>
                        </div>
                    </div>
                );
            })}
                </div>
            )}
        </div>
    );
}
