
import style from "./FiltrerHistory.module.css"
import { AiOutlineSearch, AiOutlineClose } from "react-icons/ai";
import { useTranslation } from "react-i18next";

function FiltrerHistory({ query, setSearch, filterState, setFilterState }) {
    const { t } = useTranslation();
    const states = [
        { key: "all", label: t("FiltrerHistory.all") },
        { key: "SCHEDULED", label: t("FleetChartMaintenance.pending") },
        { key: "IN_PROGRESS", label: t("FleetChartMaintenance.inProgress") },
        { key: "COMPLETED", label: t("FleetChartMaintenance.completed") },
        { key: "CANCELLED", label: t("FleetChartMaintenance.cancel") },
    ];// Array de estados para el filtro, se puede modificar según los estados reales de los vehículos

    return (
        <>
            <div className={style['filter-card']}>
                <div className={style['search-box']}>
                    <AiOutlineSearch className={style['search-icon']} />
                    <input value={query} onChange={(e) => setSearch(e.target.value)}
                        placeholder={t("FiltrerHistory.placeholder")}
                        className={style['search-input']}
                    />
                    {query && (
                        <button
                            type="button"
                            onClick={() => setSearch('')}
                            className={style['clear-btn']}
                        >
                            <AiOutlineClose />
                        </button>
                    )}
                    
                </div>
                <div className={style['chips-container']}>
                    {states.map((state) => {
                        const isActive = filterState === state.key;

                        return (
                            <button
                                key={state.key}
                                onClick={() => setFilterState(state.key)}
                                className={`${style['chip']} ${isActive ? style['chip--active'] : ''}`}
                            >
                                {state.label}
                            </button>
                        );
                    })}
                </div>
            </div>
        </>

    )
}
export default FiltrerHistory;