import "./Account.css";
import AccountView from "../../auth/components/AccountView";

// Perfil del cliente: la misma pantalla que el admin (AccountView), con la navbar de cliente
function Account({ theme, setTheme }) {
    return <AccountView theme={theme} setTheme={setTheme} />;
}

export default Account;
