import { router } from "expo-router";
import { useEffect, useState } from "react";
import { FlatList, Text, TouchableOpacity, View } from "react-native";

import { themes } from "../../../theme/themes";
import { useTheme } from "../../../theme/useTheme";
import { HomeStyles } from "./Home.styles";

import FilterModal, {
  FilterOptions,
  Filters,
} from "../../../shared/components/Filter/FilterModal";
import FilterCalendar, { SearchData } from "../components/Filter";
import ProcessSteps from "../components/ProcessSteps";

import { vehicleService } from "../../vehicles/services/vehicleService";
import VehicleCard from "../components/VehicleCard";


import { Vehicle } from "../../../types/vehicle";
import { useReservation } from "../../reservation/context/ReservationContext";

export default function HomePage() {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [searchData, setSearchData] = useState<SearchData | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const hasSearched = searchData !==null;
  const [emptyMessage, setEmptyMessage] = useState(
    "Primero debe realizar una búsqueda."
  );

  const [filters, setFilters] = useState<Filters>({
    brand: "",
    model: "",
    category: "",
    fuelType: "",
    minPrice: 0,
    maxPrice: 1000000,
    search: "",
  });

  const { createReservation } = useReservation();

  // El catalogo completo se carga una sola vez: las opciones del modal de
  // filtros deben ofrecer todos los valores, no solo los que ya survived
  // a los filtros activos.
  const [filterOptions, setFilterOptions] = useState<FilterOptions>({
    categories: [],
    brands: [],
    models: [],
    fuelTypes: [],
  });

  useEffect(() => {
    let cancelled = false;

    vehicleService.getVehicles().then((all) => {
      if (cancelled) {
        return;
      }

      setFilterOptions({
        categories: [...new Set(all.map((v) => v.vehicleType))],
        brands: [...new Set(all.map((v) => v.brand))],
        models: [...new Set(all.map((v) => v.model))],
        fuelTypes: [...new Set(all.map((v) => v.fuelType))],
      });
    });

    return () => {
      cancelled = true;
    };
  }, []);

  const runSearch = async (currentSearchData: SearchData | null, currentFilters: Filters) => {
    if (!currentSearchData) {
      setVehicles([]);
      setEmptyMessage("Primero debe realizar una búsqueda.");
      return;
    }

    setEmptyMessage("");

    // La API expone el vehiculo con `location` como texto libre y sin
    // disponibilidad por rango de fechas, asi que todavia no puede filtrar
    // por sucursal ni por fechas. Cuando `vehicles` exponga `branchId` y un
    // endpoint de disponibilidad, se anaden aqui los tres criterios.
    const filteredVehicles = await vehicleService.getVehicles({
      ...currentFilters,
    });

    setVehicles(filteredVehicles);

    if (filteredVehicles.length === 0) {
      setEmptyMessage("No hay vehículos disponibles para los filtros seleccionados.");
    } else {
      setEmptyMessage("");
    }
  };

  const handleSearch = async (data: SearchData) => {
    setSearchData(data);
    await runSearch(data, filters);
  };

  const handleApplyFilters = async () => {
    setShowFilters(false);
    await runSearch(searchData, filters);
  };

  const handleClearFilters = async () => {
    const reset: Filters = {
      brand: "",
      model: "",
      category: "",
      fuelType: "",
      minPrice: 0,
      maxPrice: 1000000,
      search: "",
    };

    setFilters(reset);

    if (searchData) {
      await runSearch(searchData, reset);
      return;
    }

    setVehicles([]);
    setShowFilters(true);

    setEmptyMessage("Primero debe realizar una búsqueda.");
  };

  const handleContinue = (vehicle: Vehicle) => {
    if (!searchData) {
      return;
    }

    createReservation(
      vehicle,
      searchData.branch,
      searchData.branch,
      searchData.startDate,
      searchData.endDate
    );

    router.push("/reservation");
  };

  const { themeName } = useTheme();
  const colors = themes[themeName as keyof typeof themes];
  const styles = HomeStyles(colors);

  return (
    <>
      <FlatList
        data={vehicles}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <VehicleCard vehicle={item} onContinue={handleContinue} />
        )}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateText}>{emptyMessage}</Text>
          </View>
        }
        ListHeaderComponent={
          <View>
            <FilterCalendar onSearch={handleSearch} />

            {/*
              Los 4 pasos, como en el web (`Home.jsx` los pinta con
              `!hasSearchedCars`). Antes de buscar explican el proceso; en
              cuanto hay resultados estorban, asi que se retiran.
            */}
            {!hasSearched && <ProcessSteps />}

            {hasSearched && (
            <TouchableOpacity
              onPress={() => setShowFilters(true)}
              style={{
                marginTop: 10,
                padding: 12,
                backgroundColor: "#d9d8d8",
                borderRadius: 10,
                marginBottom :10,
              }}
            >
              <Text>Filtrar vehículos</Text>
            </TouchableOpacity>
            )}
          </View>
        }
      />

      { hasSearched && (
      <FilterModal
        visible={showFilters}
        onClose={() => setShowFilters(false)}
        filters={filters}
        setFilters={setFilters}
        options={filterOptions}
        onApply={handleApplyFilters}
        onClear={handleClearFilters}
      />)}
    </>
  );
}
