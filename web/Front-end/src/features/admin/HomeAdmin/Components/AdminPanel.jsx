import "./AdminPanel.css";
import { useState } from "react";
import { Link } from "react-router-dom";
import { TiArrowSortedDown } from "react-icons/ti";
import { FaCar } from "react-icons/fa";
import { FaMapMarkedAlt } from "react-icons/fa";
import { FaTools } from "react-icons/fa";
import { LiaFileContractSolid } from "react-icons/lia";
import {
  FaUserShield,
  FaShieldAlt,
  FaBuilding,
  FaClipboardList,
} from "react-icons/fa";
import { useTranslation } from "react-i18next";
import { useAuth } from "../../../../contexts/AuthContext";
function AdminPanel({ open, onClose }) {
  const { t } = useTranslation();
  const { user } = useAuth();

  // Solo SUPER_ADMIN tiene estos permisos (seed de iam)
  const canManageUsers = user?.permissions?.includes("roles:grant");
  const canManageBankAccounts = user?.permissions?.includes(
    "bank-accounts:manage",
  );
  const [expandedSection, setExpandedSection] = useState(null);

  const toggleSection = (section) => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  return (
    <div>
      <aside className={`admin-panel ${open ? "active" : ""}`}>
        <h2>{t("adminPanel.title")}</h2>

        <div className="admin-section">
          <div className="admin-item" onClick={() => toggleSection("vehiculo")}>
            <span className="admin-icon">
              <FaCar />
            </span>
            <p>{t("adminPanel.vehicle")}</p>
            <TiArrowSortedDown
              className={`icono-flecha ${expandedSection === "vehiculo" ? "rotated" : ""}`}
            />
          </div>
          {expandedSection === "vehiculo" && (
            <div className="admin-subsection">
              <Link
                to="/RegisterVehicle"
                className="admin-subitem"
                onClick={onClose}
              >
                • {t("adminPanel.ve-agg")}
              </Link>
              <Link
                to="/VehicleInventory"
                className="admin-subitem"
                onClick={onClose}
              >
                • {t("adminPanel.ve-inventory")}
              </Link>
            </div>
          )}
        </div>

        <div className="admin-section">
          <div
            className="admin-item"
            onClick={() => toggleSection("localizacion")}
          >
            <span className="admin-icon">
              <FaMapMarkedAlt />
            </span>
            <p>{t("adminPanel.location")}</p>
            <TiArrowSortedDown
              className={`icono-flecha ${expandedSection === "localizacion" ? "rotated" : ""}`}
            />
          </div>
          {expandedSection === "localizacion" && (
            <div className="admin-subsection">
              <Link
                to="/VehicleLocation"
                className="admin-subitem"
                onClick={onClose}
              >
                • {t("adminPanel.loc-fleet")}
              </Link>
              <Link
                to="/RouteHistory"
                className="admin-subitem"
                onClick={onClose}
              >
                • {t("adminPanel.loc-routes")}
              </Link>
            </div>
          )}
        </div>

        <div className="admin-section">
          <div
            className="admin-item"
            onClick={() => toggleSection("sucursales")}
          >
            <span className="admin-icon">
              <FaBuilding />
            </span>
            <p>{t("adminPanel.branches")}</p>
            <TiArrowSortedDown
              className={`icono-flecha ${expandedSection === "sucursales" ? "rotated" : ""}`}
            />
          </div>
          {expandedSection === "sucursales" && (
            <div className="admin-subsection">
              <Link to="/branches" className="admin-subitem" onClick={onClose}>
                • {t("adminPanel.br-manage")}
              </Link>
            </div>
          )}
        </div>

        <div className="admin-section">
          <div className="admin-item" onClick={() => toggleSection("reservas")}>
            <span className="admin-icon">
              <FaClipboardList />
            </span>
            <p>{t("adminPanel.reservations")}</p>
            <TiArrowSortedDown
              className={`icono-flecha ${expandedSection === "reservas" ? "rotated" : ""}`}
            />
          </div>
          {expandedSection === "reservas" && (
            <div className="admin-subsection">
              <Link
                to="/reservations"
                className="admin-subitem"
                onClick={onClose}
              >
                • {t("adminPanel.res-all")}
              </Link>
            </div>
          )}
        </div>

        <div className="admin-section">
          <div
            className="admin-item"
            onClick={() => toggleSection("mantenimiento")}
          >
            <span className="admin-icon">
              <FaTools />
            </span>
            <p>{t("adminPanel.maintenance")}</p>
            <TiArrowSortedDown
              className={`icono-flecha ${expandedSection === "mantenimiento" ? "rotated" : ""}`}
            />
          </div>
          {expandedSection === "mantenimiento" && (
            <div className="admin-subsection">
              <Link
                to="/Maintenance"
                className="admin-subitem"
                onClick={onClose}
              >
                • {t("adminPanel.man-new")}
              </Link>
              <Link to="/History" className="admin-subitem" onClick={onClose}>
                • {t("adminPanel.man-history")}
              </Link>
            </div>
          )}
        </div>

        <div className="admin-section">
          <div className="admin-item" onClick={() => toggleSection("seguros")}>
            <span className="admin-icon">
              <FaShieldAlt />
            </span>
            <p>{t("adminPanel.insurance")}</p>
            <TiArrowSortedDown
              className={`icono-flecha ${expandedSection === "seguros" ? "rotated" : ""}`}
            />
          </div>
          {expandedSection === "seguros" && (
            <div className="admin-subsection">
              <Link
                to="/insurance-types"
                className="admin-subitem"
                onClick={onClose}
              >
                • {t("adminPanel.ins-types")}
              </Link>
            </div>
          )}
        </div>

        {(canManageUsers || canManageBankAccounts) && (
          <div className="admin-section">
            <div
              className="admin-item"
              onClick={() => toggleSection("superadmin")}
            >
              <span className="admin-icon">
                <FaUserShield />
              </span>
              <p>{t("adminPanel.superadmin")}</p>
              <TiArrowSortedDown
                className={`icono-flecha ${expandedSection === "superadmin" ? "rotated" : ""}`}
              />
            </div>
            {expandedSection === "superadmin" && (
              <div className="admin-subsection">
                {canManageUsers && (
                  <Link
                    to="/admin/users"
                    className="admin-subitem"
                    onClick={onClose}
                  >
                    • {t("adminPanel.sa-users")}
                  </Link>
                )}
                {canManageBankAccounts && (
                  <Link
                    to="/admin/bank-accounts"
                    className="admin-subitem"
                    onClick={onClose}
                  >
                    • {t("adminPanel.sa-bank")}
                  </Link>
                )}
              </div>
            )}
          </div>
        )}
      </aside>

      {open && <div className="admin-overlay" onClick={onClose}></div>}
    </div>
  );
}

export default AdminPanel;
