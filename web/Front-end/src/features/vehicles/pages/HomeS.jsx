import './Home.css';
import Navbar from "../../../shared/components/layout/Navbar.jsx";
import Footer from "../../../shared/components/layout/Footer.jsx";
import CartVehicule from "../components/CartVehiculeS.jsx";
import FiltrerBrand from "../components/FiltrerBrand.jsx";
import FiltrerPrice from "../components/FiltrerPrice.jsx";
import FiltrerType from "../components/FilterType.jsx";
import FiltrerModel from "../components/FiltrerModel.jsx";
import Banner from "../../../shared/components/layout/Banner.jsx";
import img1 from "../../../assets/img/img1.png";
import img2 from "../../../assets/img/img2.jpg";

import img3 from "../../../assets/img/img3.webp";
import FilterCalendar from "../components/FilterCalendar.jsx";
import { useState, useEffect, useRef } from "react";
import { getCars } from "../Services/carsService.js";
import { FaSearch, FaBars, FaTimes } from "react-icons/fa";

function Home() {
  const [cars, setCars] = useState([]);
  const [carsFiltered, setCarsFiltered] = useState([]);

  const [brandFilter, setBrandFilter] = useState("");
  const [priceFilter, setPriceFilter] = useState(null);
  const [typeFilter, setTypeFilter] = useState("");
  const [modelFilter, setModelFilter] = useState(null);
  const [activeTab, setActiveTab] = useState("availability");
  const [calendarFilters, setCalendarFilters] = useState(null);

  const [showFiltersModal, setShowFiltersModal] = useState(false);
  const filterCalendarRef = useRef(null);

  const [isMobile, setIsMobile] = useState(
    window.innerWidth <= 992
  );

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 1024);
    };

    window.addEventListener("resize", handleResize);

    return () => 
      window.removeEventListener(
        "resize",
        handleResize
      );
  }, []);

  useEffect(() => {
    getCars().then((data) => {
      setCars(data);
      setCarsFiltered(data);
    });
  }, []);

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape") {
        setShowFiltersModal(false);
      }
    };

    if (showFiltersModal) {
      document.addEventListener(
        "keydown",
        handleEscape
      );
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener(
        "keydown",
        handleEscape
      );
      document.body.style.overflow = "unset";
    };
  }, [showFiltersModal]);

  const isAvailable = (car, start, end) =>
    !car.reservas.some(
      (r) => start <= r.end && end >= r.start
    );

  const handleSearch = ({
    branch,
    startDate,
    endDate,
  }) => {
    setCalendarFilters((current) => ({
      ...current,
      branch,
      startDate,
      endDate,
    }));

    const disponibles = cars.filter(
      (car) =>
        car.branch.id === branch.id &&
        isAvailable(
          car,
          startDate,
          endDate
        )
    );

    setCarsFiltered(disponibles);
  };

  const handleClearFilters = () => {
    setBrandFilter("");
    setPriceFilter(null);
    setModelFilter(null);
    setTypeFilter("");
  };

const handleApplyFilters = () => {

  if (activeTab === "availability") {

    const valid =
      filterCalendarRef.current?.submit();

    if (!valid) return;
  }

  setShowFiltersModal(false);
};

const handleClearAllFilters = () => {

  handleClearFilters();

  filterCalendarRef.current?.clear();
};

  const visibleCars = carsFiltered
    .filter((car) =>
      brandFilter
        ? car.brand === brandFilter
        : true
    )
    .filter((car) =>
      typeFilter
        ? car.type === typeFilter
        : true
    )
    .filter((car) =>
      modelFilter
        ? car.model >= modelFilter.min &&
          car.model <= modelFilter.max
        : true
    )
    .filter((car) =>
      priceFilter
        ? car.price >= priceFilter.min &&
          car.price <= priceFilter.max
        : true
    );

  return (
    <>
      <Navbar />

      <div className="banner-wrapper">
        <div className="banner-container">
          <Banner imgs={[img1, img2, img3]} />

          <FilterCalendar
            onSearch={handleSearch}
            value={calendarFilters}
            onChange={setCalendarFilters}
          />
        </div>
      </div>

      <section className="home-container">

        <div className="main-column">

          {isMobile && (
            <div className="filters-mobile-header">
              <button
                className="filters-toggle-btn"
                onClick={() =>
                  setShowFiltersModal(true)
                }
              >
                <FaBars />
                <span>Filtros</span>
              </button>
            </div>
          )}

          <div className="card-vehicule-container">
            {visibleCars.length === 0 ? (
              <p className="notFound">
                No hay vehículos disponibles
                <FaSearch />
              </p>
            ) : (
              visibleCars.map((car) => (
                <CartVehicule
                  key={car.id}
                  name={car.name}
                  price={car.price}
                  img={car.img}
                  branch={car.branch}
                  model={car.model}
                  type={car.type}
                  door= {car.door}
                  capacity={car.capacity}
                  rentalSearch={calendarFilters}
                />
              ))
            )}
          </div>

        </div>

        {!isMobile && (
          <aside className="sidebar-container">
            <h3 className="filters-title">
              <span className="catalog-sidebar-dot" aria-hidden="true" />
              Filtros
            </h3>

            <FiltrerBrand
              cars={cars}
              onFilter={setBrandFilter}
            />

            <FiltrerPrice
              cars={cars}
              onFilter={setPriceFilter}
            />

            <FiltrerModel
              cars={cars}
              onFilter={setModelFilter}
            />

            <FiltrerType
              cars={cars}
              onFilter={setTypeFilter}
            />

            <button
              className="btn-clear-filters"
              onClick={handleClearFilters}
            >
              Limpiar filtros
            </button>
          </aside>
        )}

        {isMobile && showFiltersModal && (
          <>
            <div
              className="filters-modal-backdrop"
              onClick={() =>
                setShowFiltersModal(false)
              }
            />

            <div className="filters-modal">

                <div className="filters-modal-header">

                <div className="filters-tabs">
                  <button
                    className={`tab-btn ${
                      activeTab === "availability" ? "active" : ""
                    }`}
                    onClick={() => setActiveTab("availability")}
                    type="button"
                  >
                    Disponibilidad
                  </button>

                  <button
                    className={`tab-btn ${
                      activeTab === "features" ? "active" : ""
                    }`}
                    onClick={() => setActiveTab("features")}
                    type="button"
                  >
                    Características
                  </button>
                </div>

                <button
                  className="btn-close-modal"
                  onClick={() => setShowFiltersModal(false)}
                >
                  <FaTimes />
                </button>
              </div>

              <div className="filters-modal-content">

                {activeTab === "availability" && (
                  <FilterCalendar
                    ref={filterCalendarRef}
                    onSearch={handleSearch}
                    variant="normal"
                    value={calendarFilters}
                    onChange={setCalendarFilters}
                  />
                )}

                {activeTab === "features" && (
                  <>
                    <FiltrerBrand
                      cars={cars}
                      onFilter={setBrandFilter}
                    />

                    <FiltrerPrice
                      cars={cars}
                      onFilter={setPriceFilter}
                    />

                    <FiltrerModel
                      cars={cars}
                      onFilter={setModelFilter}
                    />

                    <FiltrerType
                      cars={cars}
                      onFilter={setTypeFilter}
                    />
                  </>
                )}

              </div>

              <div className="filters-modal-footer">

                <button
                  className="btn-clear-filters"
                  onClick={() => {
                    handleClearAllFilters();
                    setShowFiltersModal(false);
                  }}
                >
                  Limpiar
                </button>

                <button
                  type="button"
                  className="btn-apply-filters"
                  onClick={handleApplyFilters}
                >
                  Aplicar
                </button>

              </div>

            </div>
          </>
        )}

      </section>

      <Footer />
    </>
  );
}

export default Home;
