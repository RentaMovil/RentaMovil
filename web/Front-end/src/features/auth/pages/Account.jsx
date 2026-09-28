import "./Account.css";
import AccountView from "../components/AccountView";

function Account({ theme, setTheme }) {
    return <AccountView theme={theme} setTheme={setTheme} />;
}

export default Account;
