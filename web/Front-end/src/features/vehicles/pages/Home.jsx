import './Home.css';
import Navbar from "../../../shared/components/layout/Navbar.jsx";
import Footer from "../../../shared/components/layout/Footer.jsx";
import CartVehicule from "../components/CartVehicule";
import FiltrerBrand from "../components/FiltrerBrand";
import FiltrerPrice from "../components/FiltrerPrice";
import FiltrerType from "../components/FilterType";
import FiltreCategory from '../components/FiltrerCategory.jsx';
import FiltrerModel from "../components/FiltrerModel.jsx";
import Banner from "../../../shared/components/layout/Banner.jsx";
import img1 from "../../../assets/img/img1.png";
import img2 from "../../../assets/img/img2.jpg";
import img3 from "../../../assets/img/img3.webp";
import { useLocation, useNavigate } from "react-router-dom";
import ProcessSteps from "../components/CardsInfo.jsx";
import FilterCalendar from "../components/FilterCalendar.jsx";
import { useState, useEffect, useRef } from "react";
import { getCars } from "../Services/carsService.js";
import { useIsMobile } from "../../../shared/hooks/useIsMobile.js";
import { FaSearch, FaBars } from "react-icons/fa";
import { filterAvailableVehicles } from "../utils/filterAvilableCars.js";
import { filterVehicles } from "../utils/vehiclesFilters.js";

function Home() {
  const [cars, setCars] = useState([]);
  const [hasSearchedCars, setHasSearchedCars] = useState(false);
  const [carsFiltered, setCarsFiltered] = useState([]);
  const location = useLocation();
  const navigate = useNavigate();
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

  useEffect(() => {
    const loadCars = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await getCars();
        setCars(data);
      } catch (err) {
        console.error("Error cargando vehículos:", err);
        setError("No fue posible cargar los vehículos.");
      } finally {
        setLoading(false);
      }
    };
    loadCars();
  }, []);

  useEffect(() => {
    if (location.state?.triggerSearch && location.state?.rentalSearch && cars.length > 0) {
        const { branch, startDate, endDate } = location.state.rentalSearch;

        // 1. Rellenamos el calendario del Home con las nuevas fechas
        setSearchData({ branch, startDate, endDate });

        // 2. Ejecutamos tu función de filtrado nativa
        const disponibles = filterAvailableVehicles(cars, branch, startDate, endDate);
        setCarsFiltered(disponibles);
        setHasSearchedCars(true);

        // 3. Limpiamos el estado de la ruta para que no se repita el filtro al recargar la web
        navigate(location.pathname, { replace: true, state: {} });
    }
}, [location.state, cars, navigate]);

const handleSearch = async ({ branch, startDate, endDate }) => {
  try {
    setLoading(true);
    setError(null);

    const newSearchData = {
      branch,
      startDate,
      endDate
    };

    setSearchData(newSearchData);

    const disponibles = filterAvailableVehicles(
      cars,
      branch,
      startDate,
      endDate
    );

    setCarsFiltered(disponibles);
    setHasSearchedCars(true);

  } catch (err) {
    console.error("Error buscando vehículos:", err);

    setCarsFiltered([]);
    setHasSearchedCars(false);

    setError("No fue posible realizar la búsqueda.");

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

  const [searchData, setSearchData] = useState({
    branch: null,
    startDate: "",
    endDate: ""
});
  const visibleCars = filterVehicles(carsFiltered, {
    brand: brandFilter,
    type: typeFilter,
    category: categoryFilter,
    model: modelFilter,
    price: priceFilter
  });

  return (
    <>
      <Navbar />

      {/* 1. SECCIÓN INICIAL: Banner y Calendario de búsqueda (Siempre visibles arriba) */}
      <div className="banner-wrapper">
        <div className="banner-container">
          <Banner imgs={[img1, img2, img3]} />
          <FilterCalendar
            ref={filterCalendarRef}
            onSearch={handleSearch}
            value={searchData}
            onChange={setSearchData}
          />
        </div>
      </div>

      {/* 2. PASOS HORIZONTALES: Solo se renderizan si NO se ha realizado una búsqueda */}
      {!hasSearchedCars && <ProcessSteps />}

      {/* 3. SECCIÓN DE RESULTADOS: Solo aparece cuando hasSearchedCars es true */}
      {hasSearchedCars && (
        <section className="catalog-layout-container">
          
          {/* BARRA LATERAL IZQUIERDA (Filtros estables de ancho fijo) */}
          {!isMobile && (
            <aside className="catalog-sidebar">
              <div className="sidebar-sticky-content">
                <h3 className="filters-title">
                  <span className="catalog-sidebar-dot" aria-hidden="true" />
                  Flota Disponible
                </h3>
                <p className="filters-subtitle">Encuentra el vehículo perfecto para tu viaje.</p>

                <FiltrerBrand cars={carsFiltered} onFilter={setBrandFilter} />
                <FiltrerPrice cars={carsFiltered} onFilter={setPriceFilter} />
                <FiltrerModel cars={carsFiltered} onFilter={setModelFilter} />
                <FiltrerType cars={carsFiltered} onFilter={setTypeFilter} />
                <FiltreCategory cars={carsFiltered} onFilter={setCategoryFilter} />
                <button className="btn-clear-filters" onClick={handleClearFilters}>
                  Limpiar filtros
                </button>
              </div>
            </aside>
          )}

          {/* COLUMNA DERECHA (Mensajes de carga, errores y tarjetas de vehículos) */}
          <div className="catalog-main-content">
            {isMobile && (
              <div className="filters-mobile-header">
                <button className="filters-toggle-btn" onClick={() => setShowFiltersModal(true)}>
                  <FaBars /> <span>Filtrar Flota</span>
                </button>
              </div>
            )}

            <div className="card-vehicule-container">
              {loading && <p className="search-message">Buscando vehículos...</p>}
              {!loading && error && <p className="notFound">{error}</p>}
              
              {!loading && !error && visibleCars.length === 0 && (
                <p className="notFound">
                  No hay vehículos disponibles con esos filtros <FaSearch />
                </p>
              )}

              {!loading && !error && visibleCars.length > 0 &&
                visibleCars.map((car) => (
                  <CartVehicule
                    key={car.vehicle_id}
                    vehicle={car}
                    rentalSearch={searchData}
                  />
                ))
              }
            </div>
          </div>
        </section>
      )}

      <Footer />
    </>
  );
}

export default Home;
