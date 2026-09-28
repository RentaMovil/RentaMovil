import "./Footer.css";
import { FaCar, FaInstagram, FaWhatsapp, FaTiktok } from "react-icons/fa";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";


function Footer() {
    const { t } = useTranslation();
return (
    <footer>
    <div className="footer-container">
        <div className="footer-links">
        <h3>{t("footer.links")}</h3>
        <div className="links">
        <Link to="/HomeAdmin">{t("footer.linkInit")}</Link>
        <Link to="/NotificationAdmin">{t("footer.linkNotifications")}</Link>
        <Link to="/account/admin">{t("footer.linkAccount")}</Link>

    </div>
        </div>
        <div className="footer-brand">
            <h2>
                <FaCar className="icon2" />
                RentaMovil
            </h2>
            <div className="social-icons">
                <FaInstagram className="icon"/>
                <FaWhatsapp className="icon" />
                <FaTiktok className="icon" />
            </div>
            <p>{t("footer.paragraph")}</p>
            </div>
        <div className="footer-contact">
        <h3>{t("footer.contact")}</h3>
        <p>📞 3164763160</p>
        <p> 📍Calle 25 #36-60</p>
        </div>
    </div>

    <div className="footer-bottom">
        <p>{t("footer.description")}</p>
    </div>
    </footer>
);
}

export default Footer;
