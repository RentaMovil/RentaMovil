import '../../../vehicles/pages/Home.css';
import NavbarAdmin from "../../../../shared/components/layout/NavBarAdmin.jsx";
import FooterAdmin from "../../../../shared/components/layout/FooterAdmin.jsx";
import CartVehicule from "../../../vehicles/components/CartVehicule";
import FiltrerBrand from "../../../vehicles/components/FiltrerBrand";
import FiltrerPrice from "../../../vehicles/components/FiltrerPrice";
import FiltrerType from "../../../vehicles/components/FilterType";
import FiltreCategory from "../../../vehicles/components/FiltrerCategory.jsx";
import FiltrerModel from "../../../vehicles/components/FiltrerModel.jsx";
import Banner from "../../../../shared/components/layout/Banner.jsx";
import img1 from "../../../../assets/img/img1.png";
import img2 from "../../../../assets/img/img2.jpg";
import img3 from "../../../../assets/img/img3.webp";
import FilterCalendar from "../../../vehicles/components/FilterCalendar.jsx";
import { useState, useEffect, useRef } from "react";
import { useCars } from "../../../vehicles/hooks/useCars.js"; 
import { useIsMobile } from "../../../../shared/hooks/useIsMobile.js";
import { FaSearch, FaTimes } from "react-icons/fa";
import { filterAvailableVehicles } from "../../../vehicles/utils/filterAvilableCars.js";
import { filterVehicles } from "../../../vehicles/utils/vehiclesFilters.js";

function HomeAdmin() {
  // 1. Inyectamos tu hook real para que cargue los carros de la API automáticamente
  const { cars: backendCars, isLoading: hookLoading, error: hookError } = useCars();

  const [cars, setCars] = useState([]);
  const [carsFiltered, setCarsFiltered] = useState([]);
  const [brandFilter, setBrandFilter] = useState("");
  const [priceFilter, setPriceFilter] = useState(null);
  const [typeFilter, setTypeFilter] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [modelFilter, setModelFilter] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showFiltersModal, setShowFiltersModal] = useState(false);
  const filterCalendarRef = useRef(null);

  const isMobile = useIsMobile();

  const [searchData, setSearchData] = useState({
    branch: null,
    startDate: "",
    endDate: ""
  });

  // 2. Sincronizamos los datos reactivos del hook con el estado del catálogo
  useEffect(() => {
    if (backendCars && backendCars.length > 0) {
      setCars(backendCars);
      setCarsFiltered(backendCars);
    }
  }, [backendCars]);

  // 3. Sincronizamos errores y estados de carga globales
  useEffect(() => {
    setLoading(hookLoading);
    setError(hookError);
  }, [hookLoading, hookError]);

  const handleSearch = async ({ branch, startDate, endDate }) => {
    try {
      setLoading(true);
      setError(null);
      setSearchData({ branch, startDate, endDate });

      // Ejecuta el filtro por sucursal tolerante a tipos de datos combinados (String/Number)
      setCarsFiltered(filterAvailableVehicles(cars, branch, startDate, endDate));
    } catch (err) {
      console.error("Error buscando vehiculos:", err);
      setError("No fue posible realizar la busqueda.");
    } finally {
      setLoading(false);
    }
  };

  const handleClearFilters = () => {
    setBrandFilter("");
    setPriceFilter(null);
    setModelFilter(null);
    setTypeFilter("");
    setCategoryFilter("");
  };

  const visibleCars = filterVehicles(carsFiltered, {
    brand: brandFilter,
    type: typeFilter,
    category: categoryFilter,
    model: modelFilter,
    price: priceFilter
  });

  const filtros = (
    <>
      <FiltrerBrand cars={carsFiltered} onFilter={setBrandFilter} />
      <FiltrerPrice cars={carsFiltered} onFilter={setPriceFilter} />
      <FiltrerModel cars={carsFiltered} onFilter={setModelFilter} />
      <FiltrerType cars={carsFiltered} onFilter={setTypeFilter} />
      <FiltreCategory cars={carsFiltered} onFilter={setCategoryFilter} />
    </>
  );

  return (
    <>
      <NavbarAdmin />

      <div className="banner-wrapper">
        <div className="banner-container">
          <Banner imgs={[img1, img2, img3]} />
          <FilterCalendar
            ref={filterCalendarRef}
            onSearch={handleSearch}
            value={searchData}
          />
        </div>
      </div>

      <section className="catalog-layout-container">
        {!isMobile && (
          <aside className="catalog-sidebar">
            <div className="sidebar-sticky-content">
              <h3 className="filters-title">
                <span className="catalog-sidebar-dot" aria-hidden="true" />
                Flota Disponible
              </h3>
              <p className="filters-subtitle">Encuentra el vehiculo perfecto para tu viaje.</p>

              {filtros}

              <button className="btn-clear-filters" onClick={handleClearFilters}>
                Limpiar filtros
              </button>
            </div>
          </aside>
        )}

        <div className="catalog-main-content">
          {isMobile && (
            <div className="filters-mobile-header">
              <button
                className="filters-toggle-btn"
                onClick={() => setShowFiltersModal(true)}
              >
                Filtrar Flota
              </button>
            </div>
          )}

          <div className="card-vehicule-container">
            {loading && <p className="search-message">Buscando vehiculos...</p>}
            {!loading && error && <p className="notFound">{error}</p>}

            {!loading && !error && visibleCars.length === 0 && (
              <p className="notFound">
                No hay vehiculos disponibles con esos filtros <FaSearch />
              </p>
            )}

            {!loading &&
              !error &&
              visibleCars.length > 0 &&
              visibleCars.map((car) => (
                <CartVehicule 
                  key={car.vehicle_id || car.id} 
                  vehicle={car} 
                  rentalSearch={searchData} 
                />
              ))}
          </div>
        </div>

        {isMobile && showFiltersModal && (
          <>
            <div className="filters-modal-backdrop" onClick={() => setShowFiltersModal(false)} />

            <div className="filters-modal">
              <div className="filters-modal-header">
                <h3 className="filters-title">Flota Disponible</h3>
                <button
                  className="btn-close-modal"
                  onClick={() => setShowFiltersModal(false)}
                  aria-label="Cerrar"
                >
                  <FaTimes />
                </button>
              </div>

              <div className="filters-modal-content">{filtros}</div>

              <div className="filters-modal-footer">
                <button
                  className="btn-clear-filters"
                  onClick={() => {
                    handleClearFilters();
                    setShowFiltersModal(false);
                  }}
                >
                  Limpiar filtros
                </button>
                <button
                  type="button"
                  className="btn-apply-filters"
                  onClick={() => setShowFiltersModal(false)}
                >
                  Aplicar
                </button>
              </div>
            </div>
          </>
        )}
      </section>

      <FooterAdmin />
    </>
  );
}

export default HomeAdmin;
