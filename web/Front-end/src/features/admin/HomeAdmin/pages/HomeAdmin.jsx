import "./HomeAdmin.css";
import NavbarAdmin from "../../../../shared/components/layout/NavBarAdmin.jsx";
import FooterAdmin from "../../../../shared/components/layout/FooterAdmin.jsx";
import CartVehicule from "../../../vehicles/components/CartVehicule.jsx";
import FiltrerBrand from "../../../vehicles/components/FiltrerBrand";
import FiltrerPrice from "../../../vehicles/components/FiltrerPrice";
import FiltrerType from "../../../vehicles/components/FiltrerType";
import FiltrerModel from '../../../vehicles/components/FiltrerModel.jsx';
import Banner from "../../../../shared/components/layout/Banner.jsx";
import img1 from "../../../../assets/img/img1.png";
import img2 from "../../../../assets/img/img2.jpg";
import img3 from "../../../../assets/img/img3.webp";
import FilterCalendar from '../../../vehicles/components/FilterCalendar.jsx';
import { useState, useEffect } from 'react';
import { getCars } from '../../../vehicles/Services/carsService.js';
import { FaSearch, FaSearchengin, FaSearchPlus } from 'react-icons/fa';

function Home() {
  const [cars, setCars]               = useState([]);
  const [carsFiltered, setCarsFiltered] = useState([]);
  const [brandFilter, setBrandFilter]   = useState("");
  const [priceFilter, setPriceFilter]   = useState(null);
  const [typeFilter,  setTypeFilter]    = useState("");
  const [modelFilter, setModelFilter]   = useState(null);

  useEffect(() => {
    getCars().then(data => {
      setCars(data);
      setCarsFiltered(data);
    });
  }, []);

  const isAvailable = (car, start, end) =>
    !car.reservas.some(r => start <= r.end && end >= r.start);

  const handleSearch = ({ branch, startDate, endDate }) => {
    const disponibles = cars.filter(car =>
      car.branch.toLowerCase().includes(branch.toLowerCase()) &&
      isAvailable(car, startDate, endDate)
    );
    setCarsFiltered(disponibles);
  };

  const visibleCars = carsFiltered
    .filter(car => brandFilter ? car.brand === brandFilter : true)
    .filter(car => typeFilter  ? car.type  === typeFilter  : true)
    .filter(car => modelFilter ? (car.model >= modelFilter.min && car.model <= modelFilter.max) : true)
    .filter(car => priceFilter ? (car.price >= priceFilter.min && car.price <= priceFilter.max) : true);

  return (
    <>
      <NavbarAdmin/>
      <div className="banner-wrapper">
        <div className="banner-container">
          <Banner imgs={[img1, img2, img3]} />
          <FilterCalendar onSearch={handleSearch}/>
        </div>
      </div>
      <section className="home-container">
        <div className="main-column">
          <div className="card-vehicule-container">
            {visibleCars.length === 0 ? (
              <p className='notFound'>No hay vehículos disponibles in the middle loloo<FaSearch/></p>
            ) : (
              visibleCars.map(car => (
                <CartVehicule
                  key={car.id}
                  name={car.name}
                  price={car.price}
                  img={car.img}
                  branch={car.branch}
                />
              ))
            )}
          </div>
        </div>
        <aside className="sidebar-container">
          <FiltrerBrand cars={cars} onFilter={setBrandFilter} />
          <FiltrerPrice cars={cars} onFilter={setPriceFilter} />
          <FiltrerModel cars={cars} onFilter={setModelFilter} />
          <FiltrerType  cars={cars} onFilter={setTypeFilter}  />
        </aside>
      </section>
      <FooterAdmin/>
    </>
  );
}

export default Home;
