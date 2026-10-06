import React, { useState } from 'react';
import CartVehicleHistory from '../../historyMaintenance/components/CartVehicleHistory.jsx';
import style from './History.module.css';
import FooterAdmin from '../../../../shared/components/layout/FooterAdmin.jsx';
import { useForm } from 'react-hook-form';
import { AiOutlineDashboard } from 'react-icons/ai';
import ValidateDate from '../../registerMaintenance/components/ValidateDate.jsx';
import FiltrerStatus from "../../historyMaintenance/components/FiltrerHistory.jsx";
import { useTranslation } from "react-i18next";
import NavbarAdmin from '../../../../shared/components/layout/NavBarAdmin.jsx';
import FleetChartMaintenance from '../../historyMaintenance/components/FleetChartMaintenance.jsx';
import MonthlyChart from '../../historyMaintenance/components/MonthlyChart.jsx';
import { useMaintenances } from '../hooks/useMaintenances.js';
import { useUpdateMaintenance } from '../hooks/useUpdateMaintenance.js';
import { useDeleteMaintenance } from '../hooks/useDeleteMaintenance.js';
import { MAINTENANCE_STATUS } from '../../maintenance/constans/maintenanceStatus.js';
function History() {
  const { t } = useTranslation();
  const { register, formState: { errors }, handleSubmit, reset } = useForm();

  const { records, refetch } = useMaintenances();
  const { updateMaintenance } = useUpdateMaintenance();
  const { deleteMaintenance } = useDeleteMaintenance();

  const [selected, setSelected] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [query, setSearch] = useState("");
  const [filterState, setFilterState] = useState("");

  const filteredRecords = records
    .filter((c) => {
      const fs = String(filterState || '').toLowerCase();
      if (fs === 'all' || fs === '') return true;
      return String(c.status || '').toLowerCase() === fs;
    })
    .filter((c) => {
      const q = String(query || '').trim().toLowerCase();
      if (!q) return true;
      return (
        String(c.modelName || '').toLowerCase().includes(q) ||
        String(c.plate || '').toLowerCase().includes(q) ||
        String(c.typeMaintenance || '').toLowerCase().includes(q)
      );
    });

  const closeModal = () => {
    setSelected(null);
    setConfirmDelete(false);
    setIsEditing(false);
  };

  const deleteRecord = async (id) => {
    try {
      await deleteMaintenance(id);
      await refetch();
      closeModal();
    } catch (error) {
      console.error('Error al eliminar el registro:', error);
    }
  };

  const handleSaveEdit = async (data) => {
    try {
      await updateMaintenance(selected.id, data);
      await refetch();
      setIsEditing(false);
      closeModal();
    } catch (error) {
      console.error('Error al actualizar el registro:', error);
    }
  };

  const openEdit = (rec) => {
    setIsEditing(true);
    reset({
      model: rec.modelName,
      maintenanceType: rec.typeMaintenance,
      date: rec.date.slice(0, 10),
      observations: rec.description,
      status: rec.status,
    });
  };

  return (
    <>
      <NavbarAdmin />
      <div className={style["history-container"]}>
        <h2 className={style["history-h2"]}>{t("History.title")}</h2>
        <div className={style["card-container-setSearch"]}>
          <FiltrerStatus query={query} setSearch={setSearch} filterState={filterState} setFilterState={setFilterState} />
        </div>
        <div className={style["card-container-fleetc"]}>
          <FleetChartMaintenance records={filteredRecords} />
        </div>
        <MonthlyChart records={filteredRecords} />
        <div className={style.list}>
          {filteredRecords.map(r => (
            <CartVehicleHistory key={r.id} record={r} onViewMore={setSelected} />
          ))}
        </div>

        {selected && (
          <div className={style.modalBackdrop} onClick={closeModal}>
            <div className={style["history-modal"]} onClick={(e) => e.stopPropagation()}>
              <div className={style["history-modal-header"]}>
                <h3>{t("History.detail")} - {selected.plate}</h3>
                <button type="button" className={style["history-modal-close"]} onClick={closeModal} aria-label={t("CheckStatus.modal.close")}>×</button>
              </div>

              {isEditing ? (
                <form className={style["history-form"]} onSubmit={handleSubmit(handleSaveEdit)}>
                  <label htmlFor="model">{t("maintenanceForm.model")}</label>
                  <input
                    type="text"
                    placeholder={t("maintenanceForm.placeholderModel")}
                    {...register("model", {
                      required: t("maintenanceForm.requiredModel"),
                      minLength: { value: 2, message: t("maintenanceForm.minLenghtModel") },
                      maxLength: { value: 30, message: t("maintenanceForm.maxLenghtModel") },
                      pattern: { value: /^[A-Za-z0-9\s\-]{2,30}$/, message: t("maintenanceForm.invalidModel") }
                    })}
                  />
                  {errors.model && <p className={style['error-message']}><AiOutlineDashboard /> {errors.model.message}</p>}

                  <label htmlFor="maintenanceType">{t("maintenanceForm.TypeMaintenance")}</label>
                  <input
                    type="text"
                    placeholder={t("maintenanceForm.placeholderMaintenance")}
                    list="maintenance-options"
                    {...register("maintenanceType", {
                      required: t("maintenanceForm.requiredMaintenance"),
                      minLength: { value: 3, message: t("maintenanceForm.minLenghtMaintenance") },
                      maxLength: { value: 60, message: t("maintenanceForm.maxLenght") },
                      pattern: { value: /^[A-Za-zÀ-ÿ0-9\s\-\,\.]{3,60}$/, message: t("maintenanceForm.invalidMaintenance") }
                    })}
                  />
                  <datalist id="maintenance-options">
                    <option value={t("maintenanceForm.options.option1")} />
                    <option value={t("maintenanceForm.options.option2")} />
                  </datalist>
                  {errors.maintenanceType && <p className={style['error-message']}><AiOutlineDashboard /> {errors.maintenanceType.message}</p>}

                  <label htmlFor="date">{t("maintenanceForm.date")}</label>
                  <input type="date" placeholder={t("maintenanceForm.datePlaceholder")}
                    {...register("date", { required: t("maintenanceForm.requiredDate"), validate: ValidateDate })}
                  />
                  {errors.date && <p className={style['error-message']}><AiOutlineDashboard /> {errors.date.message}</p>}

                  <label htmlFor="maintenance-notes">{t("MaintenanceForm.observations")}</label>
                  <div className={style['history-form-observations']}>
                    <textarea
                      placeholder={t("maintenanceForm.placeholderObservations")}
                      className={style["MaintenanceForm.observations"]}
                      rows={2}
                      {...register("observations", {
                        minLength: { value: 5, message: t("maintenanceForm.PminLenghtObservations") },
                        maxLength: { value: 200, message: t("maintenanceForm.PmaxLenghtObservations") }
                      })}
                      onInput={(e) => {
                        e.target.style.height = 'auto';
                        e.target.style.height = e.target.scrollHeight + 'px';
                      }}
                    />
                  </div>
                  {errors.observations?.type === "minLength" && <p className={style['error-message']}><AiOutlineDashboard /> {errors.observations.message}</p>}
                  {errors.observations?.type === "maxLength" && <p className={style['error-message']}><AiOutlineDashboard /> {errors.observations.message}</p>}

                  <label>{t("FiltrerHistory.state")}</label>
                  <select defaultValue={selected.status} {...register("status")}>
                    <option value={MAINTENANCE_STATUS.COMPLETED}>{t("FiltrerHistory.completed")}</option>
                    <option value={MAINTENANCE_STATUS.PENDING}>{t("FiltrerHistory.pending")}</option>
                    <option value={MAINTENANCE_STATUS.IN_PROGRESS}>{t("FiltrerHistory.inProgress")}</option>
                    <option value={MAINTENANCE_STATUS.CANCELLED}>{t("CartVehiculeMaintenance.cancel")}</option>
                  </select>

                  <div className={style['modal-footer']}>
                    <button className={style['modal-button-secondary']} type="button" onClick={() => setIsEditing(false)}>{t("History.cancel")}</button>
                    <button className={style['modal-button-primary']} type="submit">{t("History.save")}</button>
                  </div>
                </form>
              ) : (
                <>
                  <div className={style["history-details"]}>
                    <p><strong>{t("History.model")} :</strong> <span>{selected.modelName}</span></p>
                    <p><strong>{t("maintenanceForm.TypeMaintenance")} :</strong> <span>{selected.typeMaintenance}</span></p>
                    <p><strong>{t("maintenanceForm.date")} :</strong> <span>{new Date(selected.date).toLocaleString()}</span></p>
                    <p><strong>{t("CheckStatus.modal.ubication")} :</strong> <span>{selected.location || 'Sin ubicación'}</span></p>
                    <p><strong>{t("History.status")} :</strong> <span>{selected.status}</span></p>
                    <p><strong>{t("MaintenanceForm.observations")} :</strong> <span>{selected.description || t("maintenanceForm.placeholderObservations")}</span></p>
                  </div>

                  <div className={style['modal-actions-btn']}>
                    <button className={style['modal-button-primary']} onClick={() => openEdit(selected)}>{t("History.edit")}</button>
                    {!confirmDelete && (
                      <button className={style['modal-button-danger']} onClick={() => setConfirmDelete(true)}>{t("History.delete")}</button>
                    )}
                    {confirmDelete && (
                      <div className={style["modal-confirm"]}>
                        <p>{t("History.delete")}:</p>
                        <button className={style['modal-button-danger']} onClick={() => deleteRecord(selected.id)}>{t("History.confirm")}</button>
                        <button className={style['modal-button-secondary']} onClick={() => setConfirmDelete(false)}>{t("History.cancel")}</button>
                      </div>
                    )}
                    <button className={style['modal-button-secondary']} onClick={closeModal}>{t("History.close")}</button>
                  </div>
                </>
              )}
            </div>
          </div>
        )}
      </div>
      <FooterAdmin />
    </>
  );
}
export default History;