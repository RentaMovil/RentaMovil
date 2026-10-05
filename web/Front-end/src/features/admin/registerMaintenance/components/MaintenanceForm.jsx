import style from './MaintenanceForm.module.css';
import { AiOutlineDashboard } from 'react-icons/ai';
import Animation from '../../../../shared/components/layout/Animation';
import { useEffect, useMemo, useState } from 'react';
import ValidateDate from './ValidateDate';
import VehicleCard from './VehcileCard';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import FilterVehicle from './FilterVehicle';
import { useVehicles } from '../../registerVehicle/hooks/useVehicles';
import { maintenanceService } from '../../maintenance/service/maintenanceService';
import { VEHICLE_STATUS } from '../../registerVehicle/constans/vehicleStatus';
import { useCreateMaintenance } from '../hooks/useCreateMaintenance';

function MaintenanceForm() {
    const navigate = useNavigate();
    const { t } = useTranslation();
    const { register, formState: { errors }, handleSubmit, reset, setValue, setError } = useForm();
    const [mos, setMos] = useState(false);
    const [search, setSearch] = useState('');
    const [selectedVehicle, setSelectedVehicle] = useState(null);

    const { vehicles, refetch } = useVehicles();
    const { createMaintenance, isLoading } = useCreateMaintenance();
    const [maintenanceTypes, setMaintenanceTypes] = useState([]);

    useEffect(() => {
        maintenanceService.getTypes().then(setMaintenanceTypes).catch(() => setMaintenanceTypes([]));
    }, []);

    const filteredVehicles = useMemo(() => {
        const searchTerm = search.trim().toLowerCase();
        const schedulableStatuses = new Set([VEHICLE_STATUS.AVAILABLE, VEHICLE_STATUS.IN_USE]);
        return vehicles
            .filter((vehicle) => schedulableStatuses.has(vehicle.status))
            .filter((vehicle) => {
                const vehicleName = [vehicle.brandName, vehicle.modelName]
                    .filter(Boolean)
                    .join(' ')
                    .toLowerCase();
                const plate = String(vehicle.plate || '').toLowerCase();
                return !searchTerm || vehicleName.includes(searchTerm) || plate.includes(searchTerm);
            });
    }, [search, vehicles]);

    function selectVehicle(vehicle) {
        setSelectedVehicle(vehicle);
        setValue('plate', vehicle.plate, { shouldValidate: true });
        setValue('model', vehicle.modelName, { shouldValidate: true });
        setValue('brand', vehicle.brandName, { shouldValidate: true });
    }

    async function insert(data) {
        if (isLoading) return;

        if (!selectedVehicle) {
            setError('plate', {
                type: 'manual',
                message: t('MaintenanceForm.selectVehicle', {
                    defaultValue: 'Selecciona un vehículo de la lista'
                })
            });
            return;
        }

        try {
            setMos(true);

            data.vehicleId = selectedVehicle.id;
            data.plate = data.plate.toUpperCase();
            data.image = selectedVehicle.image || ''; // reutiliza la foto del registro del vehículo

            // Abrir el mantenimiento ya pasa el vehículo a MAINTENANCE en fleet
            await createMaintenance(data);
            await refetch();

            reset();
            setSelectedVehicle(null);
            setSearch('');
        } catch (error) {
            console.error('Error al enviar los datos:', error);
        } finally {
            setMos(false);
        }
    }

    return (
        <div className={style['maintenance-container']}>
            <div className={style['maintenance-sidebar']}>
                <div className={style['maintenance-panel']}>
                    <div className={style['panel-header']}>
                        <div>
                            <h3>{t('MaintenanceForm.title')}</h3>
                            <p>{t('MaintenanceForm.search')}</p>
                        </div>
                    </div>
                    <FilterVehicle query={search} setSearch={setSearch} />
                    <VehicleCard
                        vehicles={filteredVehicles}
                        selectedVehicle={selectedVehicle}
                        onSelect={selectVehicle}
                        emptyMessage={t('MaintenanceForm.noFound')}
                    />
                </div>
            </div>
            <form className={style['maintenance-form']} onSubmit={handleSubmit(insert)}>
                <div className={style['maintenance-form-left']}>
                    <div className={style['maintenance-continerfor']}>
                        <h2>{t('MaintenanceForm.newMaintenance')}</h2>
                        <div className={style['maintenance-form-input']}>
                            <label htmlFor="plate">{t('CheckStatus.modal.plate')}</label>
                            <input
                                type="text"
                                placeholder={t('CheckStatus.modal.platePlaceholder')}
                                readOnly={Boolean(selectedVehicle)}
                                {...register('plate', {
                                    required: t('CheckStatus.modal.requiredPlate'),
                                    pattern: {
                                        value: /^[A-Z]{3}[0-9]{2}[A-Z0-9]?$/,
                                        message: t('CheckStatus.modal.formatInvalidPlate')
                                    },
                                    onChange: (e) => {
                                        e.target.value = e.target.value.toUpperCase();
                                    }
                                })}
                            />
                            {errors.plate && (
                                <p className={style['error-message']}>
                                    <AiOutlineDashboard /> {errors.plate.message}
                                </p>
                            )}
                        </div>

                        <div className={style['maintenance-form-input']}>
                            <label htmlFor="model">{t('MaintenanceForm.model')}</label>
                            <input
                                type="text"
                                placeholder={t('MaintenanceForm.modelPlaceholder')}
                                readOnly={Boolean(selectedVehicle)}
                                {...register('model', {
                                    required: t('MaintenanceForm.requiredModel'),
                                    minLength: { value: 2, message: t('MaintenanceForm.requiredModelMinLength') },
                                    maxLength: { value: 30, message: t('MaintenanceForm.requiredModelMaxLength') },
                                    pattern: {
                                        value: /^[A-Za-z0-9\s\-]{2,30}$/,
                                        message: t('MaintenanceForm.formatInvalidModel')
                                    }
                                })}
                            />
                            {errors.model && (
                                <p className={style['error-message']}>
                                    <AiOutlineDashboard /> {errors.model.message}
                                </p>
                            )}
                        </div>
                        <div className={style['maintenance-form-right']}>
                            <div className={style['maintenance-form-input']}>
                                <label htmlFor="brand">{t('MaintenanceForm.brand')}</label>
                                <input
                                    type="text"
                                    placeholder={t('MaintenanceForm.brandPlaceholder')}
                                    list="brand-options"
                                    readOnly={Boolean(selectedVehicle)}
                                    {...register('brand', {
                                        required: t('MaintenanceForm.requiredBrand'),
                                        minLength: { value: 2, message: t('MaintenanceForm.minLenghtBrand') },
                                        maxLength: { value: 30, message: t('MaintenanceForm.maxLenghtBrand') },
                                        pattern: {
                                            value: /^[A-Za-z0-9\s\-]{2,30}$/,
                                            message: t('MaintenanceForm.ivalidBrand')
                                        }
                                    })}
                                />
                                <datalist id="brand-options">
                                    <option value="Chevrolet" />
                                    <option value="Renault" />
                                    <option value="Toyota" />
                                    <option value="Mazda" />
                                    <option value="Kia" />
                                    <option value="Hyundai" />
                                    <option value="Nissan" />
                                    <option value="Ford" />
                                    <option value="Volkswagen" />
                                    <option value="BMW" />
                                    <option value="Mercedes-Benz" />
                                    <option value="Honda" />
                                    <option value="Suzuki" />
                                    <option value="Bajaj" />
                                    <option value="Yamaha" />
                                </datalist>
                                {errors.brand && (
                                    <p className={style['error-message']}>
                                        <AiOutlineDashboard /> {errors.brand.message}
                                    </p>
                                )}
                            </div>
                            <div className={style['maintenance-form-input']}>
                                <label htmlFor="date">{t('MaintenanceForm.date')}</label>
                                <input
                                    type="date"
                                    placeholder={t('MaintenanceForm.datePlaceholder')}
                                    {...register('date', {
                                        required: t('MaintenanceForm.requiredDate'),
                                        validate: ValidateDate
                                    })}
                                />
                                {errors.date && (
                                    <p className={style['error-message']}>
                                        <AiOutlineDashboard /> {errors.date.message}
                                    </p>
                                )}
                            </div>
                            <div className={style['maintenance-form-input']}>
                                <label htmlFor="price">{t("vehicleForm.price")}</label>
                                <input
                                    type="number"
                                    placeholder="Ej: 100000"
                                    step="100"
                                    {...register('price', {
                                        required: t("vehicleForm.priceRequired"),
                                        valueAsNumber: true,
                                        min: { value: 0, message: t("vehicleForm.minLenghtPrice") },
                                        max: { value: 100000000, message: t("vehicleForm.maxLenghtPrice") }
                                    })}
                                />
                                {errors.price && (
                                    <p className={style['error-message']}>
                                        <AiOutlineDashboard /> {errors.price.message}
                                    </p>
                                )}
                            </div>
                            <div className={style['maintenance-form-input']}>
                                <label htmlFor="maintenanceType">{t("MaintenanceForm.Type")}</label>
                                <input
                                    type="text"
                                    placeholder={t("MaintenanceForm.placeholderType")}
                                    list="maintenance-options"
                                    {...register('maintenanceType', {
                                        required: t("MaintenanceForm.requiredType"),
                                        minLength: { value: 3, message: t("MaintenanceForm.minLenghtType") },
                                        maxLength: { value: 60, message: t("MaintenanceForm.maxLenghtType") },
                                        pattern: {
                                            value: /^[A-Za-zÀ-ÿ0-9\s\-\,\.]{3,60}$/,
                                            message: t("MaintenanceForm.invalidType")
                                        }
                                    })}
                                />
                                {/* Los tipos válidos son los del catálogo de fleet (maintenance_type) */}
                                <datalist id="maintenance-options">
                                    {maintenanceTypes.map((type) => (
                                        <option key={type.id} value={type.name} />
                                    ))}
                                </datalist>
                                {errors.maintenanceType && (
                                    <p className={style['error-message']}>
                                        <AiOutlineDashboard /> {errors.maintenanceType.message}
                                    </p>
                                )}
                            </div>
                        </div>
                        <div className={style['maintenance-form-observations']}>
                            <div className={style['maintenance-form-input']}>
                                <label htmlFor="maintenance-notes">{t("MaintenanceForm.observations")}</label>
                                <textarea
                                    placeholder={t("MaintenanceForm.placeholderObservations")}
                                    className={style['maintenance-observatios']}
                                    rows={2}
                                    {...register('observations', {
                                        minLength: { value: 5, message: t("MaintenanceForm.minLenghtObservations") },
                                        maxLength: { value: 200, message: t("MaintenanceForm.maxLenghtObservations") }
                                    })}
                                    onInput={(e) => {
                                        e.target.style.height = 'auto';
                                        e.target.style.height = `${e.target.scrollHeight}px`;
                                    }}
                                />
                                {errors.observations?.type === 'minLength' && (
                                    <p className={style['error-message']}>
                                        <AiOutlineDashboard /> {errors.observations.message}
                                    </p>
                                )}
                                {errors.observations?.type === 'maxLength' && (
                                    <p className={style['error-message']}>
                                        <AiOutlineDashboard /> {errors.observations.message}
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>
                    <div className={style['maintenance-form-buttons']}>
                        <button className="save" type="submit" disabled={isLoading}>
                            {isLoading ? t("MaintenanceForm.saving") : t("MaintenanceForm.save")}
                        </button>
                        <span className={style['vehicule-animation']}>
                            {mos && <Animation />}
                        </span>
                        <button className="history" type="button" onClick={() => navigate('/History')}>
                            {t("MaintenanceForm.history")}
                        </button>
                    </div>
                </div>
            </form>
        </div>
    );
}

export default MaintenanceForm;