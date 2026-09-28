import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  FiArrowLeft,
  FiPrinter,
  FiAlertCircle,
  FiXCircle,
  FiCheckCircle,
  FiX,
  FiMapPin,
  FiClock,
  FiCreditCard,
  FiFileText,
  FiZoomIn,
  FiExternalLink,
  FiInfo,
  FiKey,
  FiChevronRight,
} from "react-icons/fi";
import { FaCar, FaShieldAlt, FaSatelliteDish } from "react-icons/fa";
import NavBarAdmin from "../../../../shared/components/layout/NavBarAdmin";
import FooterAdmin from "../../../../shared/components/layout/FooterAdmin";
import { ReservationsMock } from "../services/ReservationsMock";
import { getTotal, getDisplayStatus, statusMeta, formatDate, formatTime, formatMoney } from "../services/reservationHelpers";
import "./Reservations.css";
import "./ReservationDetail.css";

const FUEL_LEVELS = ["full", "3/4", "1/2", "1/4"];

export default function ReservationDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();

  const [reservation, setReservation] = useState(() =>
    ReservationsMock.find((r) => r.id === id)
  );
  const [rejectOpen, setRejectOpen] = useState(false);
  const [rejectReason, setRejectReason] = useState("");
  const [rejectReasonError, setRejectReasonError] = useState(false);
  const [rejectAction, setRejectAction] = useState("reupload");
  const [operationOpen, setOperationOpen] = useState(false);
  const [receiptOpen, setReceiptOpen] = useState(false);

  const anyModalOpen = rejectOpen || operationOpen || receiptOpen;
  useEffect(() => {
    document.body.style.overflow = anyModalOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [anyModalOpen]);

  if (!reservation) {
    return (
      <div className="rs-page">
        <NavBarAdmin />
        <div className="rs-wrapper">
          <p className="rd-not-found">{t("reservations.notFound")}</p>
          <Link to="/reservations" className="rs-btn-outline">
            <FiArrowLeft /> {t("reservations.backToList")}
          </Link>
        </div>
        <FooterAdmin />
      </div>
    );
  }

  const meta = statusMeta(getDisplayStatus(reservation), t);
  const total = getTotal(reservation);
  const operationMode = reservation.rental?.status === "IN_PROGRESS" ? "return" : "pickup";
  const canOperate = reservation.status === "CONFIRMED";
  const trackingAvailable = !!reservation.rental;

  const openReject = () => {
    setRejectReason("");
    setRejectReasonError(false);
    setRejectAction("reupload");
    setRejectOpen(true);
  };
  const closeReject = () => setRejectOpen(false);

  const confirmApprove = () => {
    setReservation((prev) => ({
      ...prev,
      status: "CONFIRMED",
      payment: { ...prev.payment, reviewedBy: "Admin RentaMovil", reviewedAt: new Date().toISOString() },
    }));
  };

  const confirmReject = () => {
    if (!rejectReason.trim()) {
      setRejectReasonError(true);
      return;
    }
    setReservation((prev) => ({
      ...prev,
      status: rejectAction === "cancel" ? "CANCELLED" : "PENDING_PAYMENT",
      payment: {
        ...prev.payment,
        reviewedBy: "Admin RentaMovil",
        reviewedAt: new Date().toISOString(),
        rejectionReason: rejectReason.trim(),
        rejectionOutcome: rejectAction === "cancel" ? "RESERVATION_CANCELLED" : "RETRY_ALLOWED",
      },
    }));
    closeReject();
  };

  const openOperation = () => setOperationOpen(true);
  const closeOperation = () => setOperationOpen(false);

  const handleOperationSubmit = (e) => {
    e.preventDefault();
    const data = new FormData(e.target);
    const mileage = Number(data.get("mileage"));
    const fuel = data.get("fuel");

    if (operationMode === "pickup") {
      const gps = data.get("gps");
      setReservation((prev) => ({
        ...prev,
        rental: {
          status: "IN_PROGRESS",
          pickupMileage: mileage,
          pickupAt: new Date().toISOString(),
          fuelOut: fuel,
          gpsDevice: gps,
        },
      }));
    } else {
      setReservation((prev) => ({
        ...prev,
        status: "COMPLETED",
        rental: {
          ...prev.rental,
          status: "COMPLETED",
          returnMileage: mileage,
          returnAt: new Date().toISOString(),
          fuelIn: fuel,
        },
      }));
    }
    closeOperation();
  };

  return (
    <div className="rs-page">
      <NavBarAdmin />

      <div className="rs-wrapper rd-wrapper">
        <div className="rd-top">
          <div>
            <div className="rd-title-row">
              <h1 className="rd-title">{t("reservations.detailTitle", { id: reservation.id })}</h1>
              <span className={`rs-status-badge ${meta.className}`}>
                <span className="rs-status-dot" />
                {meta.label}
              </span>
            </div>
            <p className="rd-description">{t(`reservations.description.${getDisplayStatus(reservation)}`)}</p>
          </div>

          <div className="rd-header-actions">
            <Link to="/reservations" className="rs-btn-outline">
              <FiArrowLeft /> {t("reservations.backToList")}
            </Link>
            <button type="button" className="rs-btn-outline" onClick={() => window.print()}>
              <FiPrinter /> {t("reservations.print")}
            </button>
          </div>
        </div>

        {reservation.status === "PENDING_REVIEW" && (
          <div className="rd-action-bar">
            <div className="rd-action-bar-info">
              <span className="rd-action-bar-icon">
                <FiAlertCircle />
              </span>
              <div>
                <h3>{t("reservations.actionBarTitle")}</h3>
                <p>
                  {t("reservations.actionBarText", { amount: formatMoney(reservation.payment.amount) })}
                </p>
              </div>
            </div>
            <div className="rd-action-bar-buttons">
              <button type="button" className="rd-btn-reject" onClick={openReject}>
                <FiXCircle /> {t("reservations.rejectPayment")}
              </button>
              <button type="button" className="rd-btn-approve" onClick={confirmApprove}>
                <FiCheckCircle /> {t("reservations.approvePayment")}
              </button>
            </div>
          </div>
        )}

        <div className="rd-grid">
          {/* ── Columna izquierda ── */}
          <div className="rd-col-left">
            <div className="rd-card">
              <div className="rd-card-header">
                <span className="rd-eyebrow">{t("reservations.vehicleSection")}</span>
                <span className="rs-status-badge emerald">
                  <span className="rs-status-dot" />
                  {t("reservations.vehicleAvailable")}
                </span>
              </div>
              <div className="rd-vehicle-row">
                <div className="rd-vehicle-photo">
                  <FaCar />
                </div>
                <div className="rd-vehicle-info">
                  <div className="rd-vehicle-name">
                    <h2>{reservation.vehicle.name}</h2>
                    <span className="rd-plate">{reservation.vehicle.plate}</span>
                  </div>
                  <p className="rd-vehicle-specs">
                    {reservation.vehicle.category} • {reservation.vehicle.transmission} •{" "}
                    {reservation.vehicle.fuel} • {t("reservations.seats", { count: reservation.vehicle.seats })}
                  </p>
                  <div className="rd-vehicle-tags">
                    <span>
                      {t("reservations.mileage", {
                        km: reservation.vehicle.mileage.toLocaleString("es-CO"),
                      })}
                    </span>
                    <span className="ok">
                      <FaShieldAlt /> {t("reservations.soatOk")}
                    </span>
                  </div>
                </div>
              </div>

              <div className="rd-customer-strip">
                <div className="rd-customer-id">
                  <div className="rd-avatar">
                    {reservation.customer.name
                      .split(" ")
                      .slice(0, 2)
                      .map((w) => w[0])
                      .join("")}
                  </div>
                  <div>
                    <p className="rd-customer-name">{reservation.customer.name}</p>
                    <p className="rd-customer-contact">
                      {reservation.customer.email} • {reservation.customer.phone}
                    </p>
                  </div>
                </div>
                <div className="rd-customer-doc">
                  <span>
                    {t("reservations.docId", {
                      id: reservation.customer.docId,
                      city: reservation.customer.docCity,
                    })}
                  </span>
                  <span className="ok">{t("reservations.license", { status: reservation.customer.licenseStatus })}</span>
                </div>
              </div>
            </div>

            <div className="rd-card">
              <span className="rd-eyebrow block">{t("reservations.itinerarySection")}</span>
              <div className="rd-itinerary-grid">
                <div className="rd-itinerary-box">
                  <div className="rd-itinerary-label pickup">
                    <FiClock /> {t("reservations.pickupLabel")}
                  </div>
                  <p className="rd-itinerary-date">
                    {formatDate(reservation.pickup.date, i18n.language)} —{" "}
                    {formatTime(reservation.pickup.date, i18n.language)}
                  </p>
                  <div className="rd-itinerary-address">
                    <FiMapPin />
                    <span>
                      <strong>{reservation.pickup.branchName}:</strong> {reservation.pickup.branchAddress}
                    </span>
                  </div>
                </div>
                <div className="rd-itinerary-box">
                  <div className="rd-itinerary-label dropoff">
                    <FiClock /> {t("reservations.dropoffLabelFull")}
                  </div>
                  <p className="rd-itinerary-date">
                    {formatDate(reservation.dropoff.date, i18n.language)} —{" "}
                    {formatTime(reservation.dropoff.date, i18n.language)}
                  </p>
                  <div className="rd-itinerary-address">
                    <FiMapPin />
                    <span>
                      <strong>{reservation.dropoff.branchName}:</strong> {reservation.dropoff.branchAddress}
                    </span>
                  </div>
                </div>
              </div>
              <div className="rd-duration-banner">
                <span>
                  <FiClock /> {t("reservations.durationBanner", { count: reservation.durationDays })}
                </span>
                <span className="strong">
                  {reservation.pickup.branchName === reservation.dropoff.branchName
                    ? t("reservations.sameBranch")
                    : t("reservations.differentBranch")}
                </span>
              </div>
            </div>

            <div className="rd-card">
              <span className="rd-eyebrow block">{t("reservations.billingSection")}</span>
              <div className="rd-billing-list">
                <div className="rd-billing-row">
                  <span>
                    {t("reservations.billingRental", {
                      name: reservation.vehicle.name,
                      days: reservation.durationDays,
                      rate: (reservation.rentalSubtotal / reservation.durationDays).toLocaleString("es-CO"),
                    })}
                  </span>
                  <span className="strong">{formatMoney(reservation.rentalSubtotal)}</span>
                </div>
                <div className="rd-billing-row">
                  <span>
                    {reservation.insurance.name} <span className="rd-pill">{t("reservations.included")}</span>
                  </span>
                  <span className="strong">{formatMoney(reservation.insurance.amount)}</span>
                </div>
                <div className="rd-billing-row muted">
                  <span>{t("reservations.deposit")}</span>
                  <span>{formatMoney(reservation.deposit)}</span>
                </div>
                <div className="rd-billing-total">
                  <div>
                    <span className="label">{t("reservations.total")}</span>
                    <span className="sub">{t("reservations.totalSub")}</span>
                  </div>
                  <span className="amount">{formatMoney(total)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* ── Columna derecha ── */}
          <div className="rd-col-right">
            <div className="rd-card">
              <div className="rd-card-header">
                <span className="rd-eyebrow icon">
                  <FiCreditCard /> {t("reservations.paymentSection")}
                </span>
                <span className={`rs-status-badge ${meta.className}`}>
                  <span className="rs-status-dot" />
                  {meta.label}
                </span>
              </div>

              {!reservation.payment ? (
                <div className="rd-empty-payment">
                  <FiInfo />
                  <p>{t("reservations.awaitingReceipt")}</p>
                </div>
              ) : (
                <>
                  <div className="rd-payment-grid">
                    <div className="rd-payment-item">
                      <span>{t("reservations.amountTransferred")}</span>
                      <strong>{formatMoney(reservation.payment.amount)}</strong>
                    </div>
                    <div className="rd-payment-item">
                      <span>{t("reservations.bankEntity")}</span>
                      <strong>{reservation.payment.bank}</strong>
                    </div>
                    <div className="rd-payment-item">
                      <span>{t("reservations.reference")}</span>
                      <strong className="mono">{reservation.payment.reference}</strong>
                    </div>
                    <div className="rd-payment-item">
                      <span>{t("reservations.receiptDateTime")}</span>
                      <strong>
                        {formatDate(reservation.payment.receivedAt, i18n.language)},{" "}
                        {formatTime(reservation.payment.receivedAt, i18n.language)}
                      </strong>
                    </div>
                  </div>

                  {reservation.payment.rejectionReason && (
                    <div className="rd-rejection-box">
                      <FiAlertCircle />
                      <div>
                        <strong>{t("reservations.rejectionReasonLabel")}</strong>
                        <p>{reservation.payment.rejectionReason}</p>
                      </div>
                    </div>
                  )}

                  <div>
                    <div className="rd-receipt-head">
                      <label>
                        <FiFileText /> {t("reservations.receiptLabel")}
                      </label>
                      <button type="button" className="rd-link-btn" onClick={() => setReceiptOpen(true)}>
                        <FiZoomIn /> {t("reservations.enlarge")}
                      </button>
                    </div>
                    <div className="rd-receipt-preview" onClick={() => setReceiptOpen(true)}>
                      <img src={reservation.payment.receiptImageUrl} alt={t("reservations.receiptLabel")} />
                    </div>
                    <p className="rd-receipt-caption">
                      {t("reservations.uploadedBy", { name: reservation.payment.uploadedBy })}
                    </p>
                  </div>

                  <div className="rd-invoice-row">
                    <div>
                      <span className="title">{t("reservations.invoiceTitle")}</span>
                      <span className="sub">
                        {reservation.status === "CONFIRMED" || reservation.status === "COMPLETED"
                          ? t("reservations.invoiceReady")
                          : t("reservations.invoiceLocked")}
                      </span>
                    </div>
                    <button
                      type="button"
                      className="rd-btn-secondary"
                      disabled={!(reservation.status === "CONFIRMED" || reservation.status === "COMPLETED")}
                    >
                      <FiFileText /> {t("reservations.downloadInvoice")}
                    </button>
                  </div>
                </>
              )}
            </div>

            <div className="rd-card">
              <div className="rd-card-header">
                <span className="rd-eyebrow">{t("reservations.operationSection")}</span>
              </div>

              {reservation.status === "PENDING_PAYMENT" || reservation.status === "PENDING_REVIEW" ? (
                <p className="rd-operation-muted">{t("reservations.operationLockedPayment")}</p>
              ) : reservation.status === "CANCELLED" ? (
                <p className="rd-operation-muted">{t("reservations.operationCancelled")}</p>
              ) : (
                <>
                  {canOperate && (
                    <button type="button" className="rd-btn-primary" onClick={openOperation}>
                      <FiKey />
                      {operationMode === "pickup" ? t("reservations.registerPickup") : t("reservations.registerReturn")}
                    </button>
                  )}
                  {canOperate && (
                    <p className="rd-operation-hint">
                      {operationMode === "pickup"
                        ? t("reservations.pickupHint")
                        : t("reservations.returnHint")}
                    </p>
                  )}
                  {reservation.status === "COMPLETED" && (
                    <div className="rd-completed-strip">
                      <FiCheckCircle />
                      {t("reservations.completedStrip", {
                        date: formatDate(reservation.rental.returnAt, i18n.language),
                      })}
                    </div>
                  )}

                  {trackingAvailable && (
                    <a className="rd-tracking-row" href="#tracking">
                      <span className="rd-tracking-label">
                        <span className="rd-tracking-icon">
                          <FiMapPin />
                        </span>
                        {t("reservations.viewTracking")}
                      </span>
                      {reservation.rental.status === "IN_PROGRESS" && (
                        <span className="rd-tracking-badge">
                          <FaSatelliteDish /> {t("reservations.gpsOnline")}
                        </span>
                      )}
                    </a>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      <FooterAdmin />

      {/* ── Modal: Rechazar pago ── */}
      {rejectOpen && (
        <div className="rd-modal-overlay" onClick={closeReject}>
          <div className="rd-modal" onClick={(e) => e.stopPropagation()}>
            <div className="rd-modal-header reject">
              <h3>
                <FiAlertCircle /> {t("reservations.rejectModal.title")}
              </h3>
              <button type="button" className="rd-modal-close" onClick={closeReject}>
                <FiX />
              </button>
            </div>
            <div className="rd-modal-form">
              <label className="rd-field">
                {t("reservations.rejectModal.reason")}
                <textarea
                  rows={3}
                  value={rejectReason}
                  onChange={(e) => {
                    setRejectReason(e.target.value);
                    if (rejectReasonError) setRejectReasonError(false);
                  }}
                  placeholder={t("reservations.rejectModal.reasonPlaceholder")}
                />
                {rejectReasonError && (
                  <p className="rd-error-message">
                    <FiAlertCircle /> {t("reservations.rejectModal.reasonError")}
                  </p>
                )}
              </label>

              <div className="rd-radio-group">
                <span className="rd-field-label">{t("reservations.rejectModal.actionLabel")}</span>
                <label className={`rd-radio-option ${rejectAction === "reupload" ? "active" : ""}`}>
                  <input
                    type="radio"
                    checked={rejectAction === "reupload"}
                    onChange={() => setRejectAction("reupload")}
                  />
                  <div>
                    <strong>{t("reservations.rejectModal.reuploadTitle")}</strong>
                    <p>{t("reservations.rejectModal.reuploadText")}</p>
                  </div>
                </label>
                <label className={`rd-radio-option ${rejectAction === "cancel" ? "active" : ""}`}>
                  <input
                    type="radio"
                    checked={rejectAction === "cancel"}
                    onChange={() => setRejectAction("cancel")}
                  />
                  <div>
                    <strong>{t("reservations.rejectModal.cancelTitle")}</strong>
                    <p>{t("reservations.rejectModal.cancelText")}</p>
                  </div>
                </label>
              </div>
            </div>
            <div className="rd-modal-footer">
              <button type="button" className="rd-btn-secondary" onClick={closeReject}>
                {t("reservations.cancel")}
              </button>
              <button type="button" className="rd-btn-reject solid" onClick={confirmReject}>
                {t("reservations.rejectModal.confirm")}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Modal: Pickup / Devolución ── */}
      {operationOpen && (
        <div className="rd-modal-overlay" onClick={closeOperation}>
          <div className="rd-modal" onClick={(e) => e.stopPropagation()}>
            <div className="rd-modal-header pickup">
              <h3>
                <FiKey />{" "}
                {operationMode === "pickup"
                  ? t("reservations.pickupModal.title")
                  : t("reservations.pickupModal.titleReturn")}
              </h3>
              <button type="button" className="rd-modal-close" onClick={closeOperation}>
                <FiX />
              </button>
            </div>
            <form id="operationForm" className="rd-modal-form" onSubmit={handleOperationSubmit}>
              <div className="rd-vehicle-compact">
                <div>
                  <strong>{reservation.vehicle.name}</strong>
                  <span>
                    {operationMode === "pickup" ? reservation.pickup.branchName : reservation.dropoff.branchName}
                  </span>
                </div>
                <span className="mono">{reservation.vehicle.plate}</span>
              </div>

              <div className="rd-field-row">
                <label className="rd-field">
                  {operationMode === "pickup"
                    ? t("reservations.pickupModal.mileageOut")
                    : t("reservations.pickupModal.mileageIn")}
                  <input
                    name="mileage"
                    type="number"
                    required
                    defaultValue={
                      operationMode === "pickup" ? reservation.vehicle.mileage : reservation.rental?.pickupMileage
                    }
                  />
                </label>
                <label className="rd-field">
                  {t("reservations.pickupModal.fuelLevel")}
                  <select name="fuel" defaultValue="full">
                    {FUEL_LEVELS.map((level) => (
                      <option key={level} value={level}>
                        {t(`reservations.pickupModal.fuel.${level.replace("/", "")}`)}
                      </option>
                    ))}
                  </select>
                </label>
              </div>

              {operationMode === "pickup" ? (
                <div className="rd-gps-box">
                  <div className="rd-gps-head">
                    <span>
                      <FaSatelliteDish /> {t("reservations.pickupModal.gpsDevice")}
                    </span>
                  </div>
                  <select name="gps" defaultValue="Geotab R-809">
                    <option value="Geotab R-809">{t("reservations.pickupModal.gpsOption1")}</option>
                    <option value="Queclink GL300">{t("reservations.pickupModal.gpsOption2")}</option>
                    <option value="none">{t("reservations.pickupModal.gpsOption3")}</option>
                  </select>
                </div>
              ) : (
                <div className="rd-gps-box readonly">
                  <FaSatelliteDish />
                  {t("reservations.pickupModal.gpsAssigned", { device: reservation.rental?.gpsDevice })}
                </div>
              )}

              <div className="rd-checklist">
                <label>
                  <input type="checkbox" defaultChecked />
                  {t("reservations.pickupModal.inspectionCheck")}
                </label>
                <label>
                  <input type="checkbox" defaultChecked />
                  {operationMode === "pickup"
                    ? t("reservations.pickupModal.depositLocked", { amount: formatMoney(reservation.deposit) })
                    : t("reservations.pickupModal.depositReleased", { amount: formatMoney(reservation.deposit) })}
                </label>
              </div>
            </form>
            <div className="rd-modal-footer">
              <button type="button" className="rd-btn-secondary" onClick={closeOperation}>
                {t("reservations.cancel")}
              </button>
              <button type="submit" form="operationForm" className="rd-btn-primary small">
                {operationMode === "pickup"
                  ? t("reservations.pickupModal.confirmPickup")
                  : t("reservations.pickupModal.confirmReturn")}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Modal: Comprobante en alta resolución ── */}
      {receiptOpen && reservation.payment && (
        <div className="rd-modal-overlay" onClick={() => setReceiptOpen(false)}>
          <div className="rd-modal rd-modal-wide" onClick={(e) => e.stopPropagation()}>
            <div className="rd-modal-header">
              <div>
                <h3>{t("reservations.receiptModal.title")}</h3>
                <p className="rd-modal-subtitle">
                  {t("reservations.receiptModal.subtitle", { reference: reservation.payment.reference })}
                </p>
              </div>
              <div className="rd-modal-header-actions">
                <a href={reservation.payment.receiptImageUrl} target="_blank" rel="noreferrer">
                  <FiExternalLink />
                </a>
                <button type="button" className="rd-modal-close" onClick={() => setReceiptOpen(false)}>
                  <FiX />
                </button>
              </div>
            </div>
            <div className="rd-receipt-full">
              <img src={reservation.payment.receiptImageUrl} alt={t("reservations.receiptLabel")} />
            </div>
            {reservation.status === "PENDING_REVIEW" && (
              <div className="rd-modal-footer">
                <button
                  type="button"
                  className="rd-btn-reject"
                  onClick={() => {
                    setReceiptOpen(false);
                    openReject();
                  }}
                >
                  <FiXCircle /> {t("reservations.rejectPayment")}
                </button>
                <button
                  type="button"
                  className="rd-btn-approve"
                  onClick={() => {
                    setReceiptOpen(false);
                    confirmApprove();
                  }}
                >
                  <FiCheckCircle /> {t("reservations.approvePayment")}
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
