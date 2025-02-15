
import { postAccountsSettings , getSettings, getApprovingActions, getProducts} from "./Responses.jsx";
// newProducts = getProducts(token)
// setProducts((prevProducts) => [...prevProducts, ...newProducts]);
import classes from "./Preferences.module.css";

export default function ProductBlock() {

    return (
        <>
            <div className={classes.PreferencesPage__Content__Block3}>
                <span> Арбитраж </span>
                <div>
                    <div> exp. 29.10.2024 </div>
                    <button> Продлить </button>
                </div>
            </div>

            <div className={classes.addMarket}>
            <button />
            </div>
        </>
    )
}