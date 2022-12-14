import { useState } from "react";
import Modal from 'react-modal';
import { useDispatch } from "react-redux";
import { CSSTransition } from "react-transition-group";

import { useForm } from "../hooks";
import { startEditJournal } from "../store/journal";

import './components';

export const ModalEditJournal = () => {

    const [openModal, setOpenModal] = useState(false);

    const dispatch = useDispatch()

    const { workingDayStartHours, workingDayStartMinutes, consultationHours, consultationMinutes, consultationsPerDay, onInputChange, formState } = useForm({
        workingDayStartHours: 8,
        workingDayStartMinutes: 0,
        consultationHours: 0,
        consultationMinutes: 0,
        consultationsPerDay: 8,
    });

    const onSubmit = ( event ) => {
        event.preventDefault();
        console.log({ workingDayStartHours, workingDayStartMinutes, consultationHours, consultationMinutes, consultationsPerDay });
        dispatch( startEditJournal( workingDayStartHours, workingDayStartMinutes, consultationHours, consultationMinutes, consultationsPerDay ) );
        
    }

    return (
        <>
            <button className="btn-edit" type="button" onClick={() => setOpenModal(true)}></button>
            <CSSTransition
                timeout={300}
                classNames="overlay"
            >
                <Modal
                closeTimeoutMS={500}
                isOpen={ openModal }
                ariaHideApp={false}
                className="modal-container"
                >
                <div className="btn-modal-close" onClick={ () => setOpenModal(false) }>
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                        <path stroke="#FFFFFF" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18 6 6 18M6 6l12 12"/>
                    </svg>
                </div>
                <h1 className="modal-header">
                    Editar agenda de consultas
                </h1>

                <form onSubmit={ onSubmit }>
                    <div className="container-form" onSubmit={ onSubmit }>

                        <div className="form-group">
                            <label className="edit-journal-label">Hora de inicio de la jornada:</label>
                            <div className="form-item w-50 pr-8">
                                <label className="input-label">Hora</label>
                                <select className="select-style" defaultValue={ workingDayStartHours } name="workingDayStartHours" onChange={ onInputChange }>
                                    <option value="0">00</option>
                                    <option value="1">01</option>
                                    <option value="2">02</option>
                                    <option value="3">03</option>
                                    <option value="4">04</option>
                                    <option value="5">05</option>
                                    <option value="6">06</option>
                                    <option value="7">07</option>
                                    <option value="8">08</option>
                                    <option value="9">09</option>
                                    <option value="10">10</option>
                                    <option value="11">11</option>
                                    <option value="12">12</option>
                                    <option value="13">13</option>
                                    <option value="14">14</option>
                                    <option value="15">15</option>
                                    <option value="16">16</option>
                                    <option value="17">17</option>
                                    <option value="18">18</option>
                                    <option value="19">19</option>
                                    <option value="20">20</option>
                                    <option value="21">21</option>
                                    <option value="22">22</option>
                                    <option value="23">23</option>
                                    
                                </select>
                            </div>
                            <div className="form-item w-50 pl-8">
                            <label className="input-label">Minutos</label>
                                <select className="select-style" placeholder="00" name="workingDayStartMinutes" onChange={ onInputChange }>
                                    <option value="0">00</option>
                                    <option value="5">05</option>
                                    <option value="10">10</option>
                                    <option value="15">15</option>
                                    <option value="20">20</option>
                                    <option value="25">25</option>
                                    <option value="30">30</option>
                                    <option value="35">35</option>
                                    <option value="40">40</option>
                                    <option value="45">45</option>
                                    <option value="50">50</option>
                                    <option value="55">55</option>
                                </select>
                            </div>      
                        </div>
                        <div className="form-group">
                            <label className="edit-journal-label">Tiempo de cada consulta:</label>
                            <div className="form-item w-50 pr-8">
                                <label className="input-label">Horas</label>
                                <select className="select-style" name="consultationHours" onChange={ onInputChange }>
                                    <option value="0">0</option>
                                    <option value="1">1</option>
                                    <option value="2">2</option>
                                </select>
                            </div>
                            <div className="form-item w-50 pl-8">
                                <label className="input-label">Minutos</label>
                                <select className="select-style" defaultValue={ consultationMinutes } name="consultationMinutes" onChange={ onInputChange }>
                                    <option value="0">00</option>
                                    <option value="15">15</option>
                                    <option value="20">20</option>
                                    <option value="25">25</option>
                                    <option value="30">30</option>
                                    <option value="35">35</option>
                                    <option value="40">40</option>
                                    <option value="45">45</option>
                                    <option value="50">50</option>
                                    <option value="55">55</option>
                                </select>
                            </div>      
                        </div>
                        <div className="form-group">
                            <label className="edit-journal-label">Cantidad de consultas en la jornada:</label>
                            <div className="form-item w-50 pr-8">
                                <label className="input-label">Consultas</label>
                                <select className="select-style" defaultValue={ consultationsPerDay } name="consultationsPerDay" onChange={ onInputChange }>
                                    <option value="1">1</option>
                                    <option value="2">2</option>
                                    <option value="3">3</option>
                                    <option value="4">4</option>
                                    <option value="5">5</option>
                                    <option value="6">6</option>
                                    <option value="7">7</option>
                                    <option value="8">8</option>
                                    <option value="9">9</option>
                                    <option value="10">10</option>
                                    <option value="11">11</option>
                                    <option value="12">12</option>
                                    <option value="13">13</option>
                                    <option value="14">14</option>
                                    <option value="15">15</option>
                                    <option value="16">16</option>
                                    <option value="17">17</option>
                                    <option value="18">18</option>
                                    <option value="19">19</option>
                                    <option value="20">20</option>
                                    
                                </select>
                            </div>
                            <div className="form-item w-50 pl-8"></div> 
                        </div>
                        <div className="form-btn">
                            <button className="btn-modal-submit" type="submit" onClick={ () => setOpenModal(false) }>
                                Aplicar
                            </button>
                        </div>
                    </div>
                </form>
                </Modal>
            </CSSTransition>
        </>
    )
}
