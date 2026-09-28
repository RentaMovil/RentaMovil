import "./Account.css";
import AccountView from "../components/AccountView";

function AccountAdmin({ theme, setTheme }) {
    return <AccountView theme={theme} setTheme={setTheme} admin />;
}

export default AccountAdmin;
