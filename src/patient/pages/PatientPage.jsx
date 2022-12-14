import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import { add, addDays, format, fromUnixTime, getUnixTime, sub } from "date-fns";
import queryString from "query-string";
import { Line } from "react-chartjs-2";
import { Chart as ChartJS } from "chart.js/auto";
import { faker } from '@faker-js/faker';


import { useForm } from "../../hooks";
import { startLogout } from "../../store/auth";
import {
    startLoadingCurrentPatient,
    startLoadingPatientInfo,
    startUpdatingCurrentPatientAnamnesis,
    startUpdatingCurrentPatientDiagnosis,
    startUpdatingCurrentPatientIndications,
    startUpdatingCurrentPatientPhysical_exam,
    startUpdatingCurrentPatientStature,
    startUpdatingCurrentPatientWeight,
    updateCurrentPatientAnamnesis,
    updateCurrentPatientDiagnosis,
    updateCurrentPatientIndications,
    updateCurrentPatientPhysical_exam,
    updateCurrentPatientStature,
    updateCurrentPatientWeight,
} from "../../store/currentPatient";

import { AppLayout } from "../../layout/AppLayout";
import { GirlsFromBirthToTwoYears, PatientData } from "../../data";
import { ModalUpdatePatientValues } from "../../ui/ModalUpdatePatientValues";


export const PatientPage = () => {

    
    const { uid, displayName, photoURL, isNutritionistStatus } = useSelector( state => state.auth )
    
    const {
      patientName,
      nextConsultation,
      anamnesis,
      physical_exam,
      diagnosis,
      indications,
      weight,
      stature,
      unixBirthday
    } = useSelector((state) => state.currentPatient);

    const [showHideReferenceChart, setShowHideReferenceChart] = useState(true)

    const [referenceData, setReferenceData] = useState({
        labels: GirlsFromBirthToTwoYears.map( (data) => data.months ),
        datasets: [
            {
                label: "-2DE (Kg)",
                data: GirlsFromBirthToTwoYears.map( (data) => data.Minus2DE ),
                borderColor: 'rgba(0,174,239, 0.3)',
                backgroundColor: 'rgba(0,174,239, 0.3)',
                pointRadius: 1,
            },
            {
                label: "-1DE (Kg)",
                data: GirlsFromBirthToTwoYears.map( (data) => data.Minus1DE ),
                borderColor: 'rgba(237,2,140, 0.3)',
                backgroundColor: 'rgba(237,2,140, 0.3)',
                pointRadius: 1,
            },
            {
                label: "Mediana (Kg)",
                data: GirlsFromBirthToTwoYears.map( (data) => data.Median ),
                borderColor: 'rgba(35,31,32, 0.3)',
                backgroundColor: 'rgba(35,31,32, 0.3)',
                pointRadius: 1,
            },
            {
                label: "+1DE (Kg)",
                data: GirlsFromBirthToTwoYears.map( (data) => data.Plus1DE ),
                borderColor: 'rgba(237,2,140, 0.3)',
                backgroundColor: 'rgba(237,2,140, 0.3)',
                pointRadius: 1,
            },
            {
                label: "+2DE (Kg)",
                data: GirlsFromBirthToTwoYears.map( (data) => data.Plus2DE ),
                borderColor: 'rgba(0,174,239, 0.3)',
                backgroundColor: 'rgba(0,174,239, 0.3)',
                pointRadius: 1,
            },
        ]
    });

    const [userData, setUserData] = useState({
        labels: [ '1 dia','2 semanas','3 semanas','1 mes','2 meses','3 meses','4 meses','6 meses','1 a??o' ],
        datasets: [
            
            {
                label: "P/E del paciente (Kg)",
                data: [ 3.2, 3.4, 3.7, 3.9, 4.5, 4.8, 5.3, 5.8, 7.2 ],
                borderColor: '#F58220',
                backgroundColor: '#F58220',
            },
        ]
    });

    // TODO:
    // TODO:
    // TODO:
    // TODO:
    // TODO:
    // DEBERIA PONER UNA ALERTA EN ALG??N LUGAR DE LA TARJETA DEL PACIENTE, QUE SEG??N EL PESO, TALLA Y EDAD,
    // ME DIGA SI EL PACIENTE TIENE OBESIDAD, POR EJEMPLO.

    const options = {
        maintainAspectRatio : false,
        plugins: {
        legend: {
            position: 'bottom',
        },
        title: {
            display: true,
            text: 'Gr??fico P/E del paciente (0 a 2 a??os)',
        },
        },
    };

    const calculateAge = () => {
        let d1 = fromUnixTime( unixBirthday ).getDate();
        let m1 = fromUnixTime( unixBirthday ).getMonth();
        let y1 = fromUnixTime( unixBirthday ).getFullYear();
        let date = new Date();
        let d2 = date.getDate();
        let m2 = date.getMonth();
        let y2 = date.getFullYear();
        let month = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
        if (d1 > d2) {
            d2 = d2 + month[m2];
            m2 = m2 - 1;
        }
        if (m1 > m2) {
            m2 = m2 + 12;
            y2 = y2 - 1;
        }
        let d = d2 - d1;
        let m = m2 - m1;
        let y = y2 - y1;
        if( y === 0 ){
            
            return m + " meses " + d + " d??as";
        }else{
            return y + " a??os " + m + " meses " + d + " d??as";
        }
    }

    const age = calculateAge();
    
    const defaultPatient = {
        unixAge: 0,
        weight: 0,
        stature: 0,
        anamnesis: anamnesis,
        physical_exam: physical_exam,
        diagnosis: diagnosis,
        indications: indications,
        graphs: "Escribe aqu?? :)",
    }

    const { consultationHours, consultationMinutes } = useSelector( state => state.journal )

    const dispatch = useDispatch();

    const location = useLocation();

    const {
      formWeight,
      formStature,
      formAnamnesis,
      formPhysical_exam,
      formDiagnosis,
      formIndications,
      graphs,
      onInputChange,
    } = useForm(defaultPatient);

    const { patientID = '' } = queryString.parse( location.search );

    useEffect(() => {
        
        if( patientID === '' ){

            dispatch( startLoadingPatientInfo( displayName, photoURL ) )
    
        }else{
    
            dispatch( startLoadingCurrentPatient( uid, patientID ) )
        }
    
    }, [patientID])
    
    const onLogout = () => {
            
        dispatch( startLogout() );
    
    }

    const onAnamnesisSubmit = ( event ) => {
        event.preventDefault();

        dispatch( updateCurrentPatientAnamnesis({ formAnamnesis }) )
        dispatch( startUpdatingCurrentPatientAnamnesis( uid, patientID, formAnamnesis ) )
    }
    const onPhysical_examSubmit = ( event ) => {
        event.preventDefault();

        dispatch( updateCurrentPatientPhysical_exam({ formPhysical_exam }) )
        dispatch( startUpdatingCurrentPatientPhysical_exam( uid, patientID, formPhysical_exam ) )
    }
    const onDiagnosisSubmit = ( event ) => {
        event.preventDefault();

        dispatch( updateCurrentPatientDiagnosis({ formDiagnosis }) )
        dispatch( startUpdatingCurrentPatientDiagnosis( uid, patientID, formDiagnosis ) )
    }
    const onIndicationsSubmit = ( event ) => {
        event.preventDefault();

        dispatch( updateCurrentPatientIndications({ formIndications }) )
        dispatch( startUpdatingCurrentPatientIndications( uid, patientID, formIndications ) )
    }
    const onWeightSubmit = ( event ) => {
        event.preventDefault();

        dispatch( updateCurrentPatientWeight({ formWeight }) )
        dispatch( startUpdatingCurrentPatientWeight( uid, patientID, formWeight ) )
    }
    const onStatureSubmit = ( event ) => {
        event.preventDefault();

        dispatch( updateCurrentPatientStature({ formStature }) )
        dispatch( startUpdatingCurrentPatientStature( uid, patientID, formStature ) )
    }

    const onShowHideReferenceChart = () => {
        setShowHideReferenceChart( !showHideReferenceChart )
    }

    return (
      <>
        <AppLayout>
            <div className="main-content">
                <div className="logout">
                <button className="btn-logout" type="button" onClick={onLogout}>
                    Cerrar sesi??n
                </button>
                </div>
                <div className="patient-card">
                <div className="patient-data">
                    <div className="patient-avatar">
                    {patientName.substring(0, 2)}
                    </div>
                    <div className="patient-name">{patientName}</div>
                    <div className="patient-consultation-time"></div>
                    <div className="patient-consultation-time">
                    {nextConsultation !== null
                        ? format(fromUnixTime(nextConsultation), "hh:mm") +
                        " - " +
                        format(
                            add(fromUnixTime(nextConsultation), {
                            hours: consultationHours,
                            minutes: consultationMinutes,
                            }),
                            "hh:mm"
                        )
                        : "hh:mm"}
                    </div>
                    <div className="patient-consultation-time">
                    {nextConsultation !== null
                        ? format(fromUnixTime(nextConsultation), "dd/MMM/yyyy")
                        : "hh:mm"}
                    </div>
                </div>

                <div className="patient-weight">
                    <div className="weight-icon">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="43"
                        height="43"
                        fill="none"
                        viewBox="0 0 43 43"
                    >
                        <circle cx="21.5" cy="21.5" r="21.5" fill="#F5EEFF" />
                        <path
                        stroke="#452372"
                        strokeLinecap="round"
                        strokeWidth="2"
                        d="M33.591 26.106a12 12 0 1 0-23.182 0M22 11v2.667m-8.485.847L15.4 16.4m15.085-1.886L28.6 16.4m4.991 9.705-2.576-.69m-20.606.69 2.576-.69"
                        />
                        <path
                        stroke="#927CB0"
                        strokeWidth="2"
                        d="M24.717 22.618c.485 1.04-.204 2.388-1.54 3.01-1.334.622-2.81.284-3.294-.756-.553-1.186-2.143-7.956-2.964-11.532-.12-.522.547-.833.87-.405 2.212 2.927 6.375 8.497 6.928 9.683Z"
                        />
                    </svg>
                    </div>
                    <div className="weight-title">
                        Peso
                        <span className="weight-indicator-panel"><p>Obesidad</p></span>
                    </div>
                    <div className="weight">
                        <p className= "weight-value"> { weight } </p>
                        <div className="weight-kg">Kg</div>
                        <ModalUpdatePatientValues type='peso' age={ age } />
                    </div>
                    
                </div>
                <div className="patient-stature">
                    <div className="stature-icon">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="43"
                        height="43"
                        fill="none"
                        viewBox="0 0 43 43"
                    >
                        <circle cx="21.5" cy="21.5" r="21.5" fill="#FFF3F1" />
                        <path
                        fill="#FF8976"
                        d="m18 12-.707-.707.707-.707.707.707L18 12Zm1 15a1 1 0 1 1-2 0h2Zm-6.707-10.707 5-5 1.414 1.414-5 5-1.414-1.414Zm6.414-5 5 5-1.414 1.414-5-5 1.414-1.414ZM19 12v15h-2V12h2Zm7 20-.707.707.707.707.707-.707L26 32Zm1-15a1 1 0 1 0-2 0h2Zm-6.707 10.707 5 5 1.414-1.414-5-5-1.414 1.414Zm6.414 5 5-5-1.414-1.414-5 5 1.414 1.414ZM27 32V17h-2v15h2Z"
                        />
                    </svg>
                    </div>
                    <div className="stature-title">Talla</div>
                    <div className="stature">
                        <p className= "stature-value"> { stature } </p>
                        <div className="stature-cm">Cm</div>
                        <ModalUpdatePatientValues type='estatura' age={ age }/>
                    </div>
                </div>
                <div className="patient-age">
                    <div className="age-icon">
                        <svg xmlns="http://www.w3.org/2000/svg" width="43" height="43" fill="none" viewBox="0 0 43 43">
                            <circle cx="21.5" cy="21.5" r="21.5" fill="#DBFFD6"/>
                            <circle cx="20" cy="17" r="4" stroke="#5EC151" strokeLinecap="round" strokeWidth="2"/>
                            <path fill="#5EC151" fillRule="evenodd" d="M21.327 24.076C20.889 24.026 20.445 24 20 24c-1.92 0-3.806.474-5.369 1.373-1.562.9-2.75 2.197-3.3 3.738a1 1 0 0 0 1.883.672c.362-1.01 1.182-1.967 2.415-2.676 1.014-.584 2.235-.957 3.529-1.07a3.005 3.005 0 0 1 2.169-1.961Z" clipRule="evenodd"/>
                            <rect width="9" height="8" x="22" y="23" stroke="#5EC151" strokeWidth="2" rx="2"/>
                            <path fill="#5EC151" d="M22 25a2 2 0 0 1 2-2h5a2 2 0 0 1 2 2h-9Z"/>
                            <path stroke="#5EC151" strokeLinecap="round" strokeWidth="2" d="M24 22v1m5-1v1"/>
                            <rect width="2" height="1" x="24" y="26" fill="#5EC151" rx=".5"/>
                            <rect width="2" height="1" x="24" y="28" fill="#5EC151" rx=".5"/>
                            <rect width="2" height="1" x="27" y="26" fill="#5EC151" rx=".5"/>
                            <rect width="2" height="1" x="27" y="28" fill="#5EC151" rx=".5"/>
                        </svg>
                    </div>
                    <div className="age-title">Edad</div>
                    <div className="age">
                        <p className="age-value">
                            { calculateAge() }
                        </p>
                    </div>
                </div>
                <button type="submit" hidden></button>
                </div>
                <div className="accordion-container">
                <div className="left-container">
                    <form onSubmit={onAnamnesisSubmit}>
                    <div className="accordion">
                        <input
                        className="accordion-input"
                        type="checkbox"
                        // defaultChecked
                        name="patient_accordion"
                        id="anamnesis"
                        />
                        <label className="accordion-label" htmlFor="anamnesis">
                        Anamnesis
                        </label>
                        <div className="accordion-content">
                        <textarea
                            className="input-text-patient-page"
                            name="formAnamnesis"
                            spellCheck={false}
                            defaultValue={defaultPatient.anamnesis}
                            onChange={onInputChange}
                            readOnly={ !isNutritionistStatus }
                        ></textarea>
                        {/* <input className="input-text-patient-page" type="text" value="Lorem ipsum dolor sit, amet consectetur adipisicing elit. Ratione at praesentium sed rerum voluptatibus quo aut aspernatur temporibus corrupti eos consequuntur quidem nam quisquam esse dolor, illo tenetur libero repudiandae nulla, recusandae autem. Molestias quam saepe officia dolor nulla eos, eaque aliquam quaerat adipisci recusandae inventore sit maxime possimus asperiores quas omnis debitis non accusamus. Laborum, aspernatur numquam obcaecati tempora quo, assumenda minima, nostrum dolorum eveniet quasi optio quae blanditiis ducimus. Voluptatibus aut aperiam quis quasi ipsum perferendis sapiente nulla itaque" name="name"/> */}
                        {/* <input type="text">Lorem ipsum dolor sit amet consectetur adipisicing elit. Eveniet inventore quis repellendus veniam unde sit, laboriosam, perspiciatis ullam voluptate, dolor tempore. Quisquam, numquam? Vero nesciunt dignissimos possimus laborum accusantium veniam maxime, delectus assumenda aspernatur, illo unde modi optio quia non magni consequatur reprehenderit eveniet ad! Eveniet consectetur minima aperiam corporis maxime perspiciatis, velit similique fugit quasi, est quaerat consequatur qui laborum deleniti eos necessitatibus quas reiciendis quibusdam nam aut excepturi repellat aliquam obcaecati voluptatum? Veniam, provident consequuntur itaque recusandae ad dicta facere quam culpa molestiae vel corporis nesciunt, exercitationem corrupti repellendus cum rerum perferendis eaque distinctio tenetur quibusdam! Eius, voluptates.</input> */}
                        {   ( isNutritionistStatus )
                            ?   <button
                                className="btn-save-changes"
                                type="submit"
                                ></button>
                            : null
                        }
                        </div>
                    </div>
                    </form>
                    <form onSubmit={onPhysical_examSubmit}>
                    <div className="accordion">
                        <input
                        className="accordion-input"
                        type="checkbox"
                        // defaultChecked
                        name="patient_accordion"
                        id="examen_fisico"
                        />
                        <label className="accordion-label" htmlFor="examen_fisico">
                        Examen f??sico
                        </label>
                        <div className="accordion-content">
                        <textarea
                            className="input-text-patient-page"
                            name="formPhysical_exam"
                            spellCheck={false}
                            defaultValue={defaultPatient.physical_exam}
                            onChange={onInputChange}
                            readOnly={ !isNutritionistStatus }
                        ></textarea>
                        {   ( isNutritionistStatus )
                            ?   <button
                                className="btn-save-changes"
                                type="submit"
                                ></button>
                            : null
                        }
                        </div>
                    </div>
                    </form>
                    <form onSubmit={onDiagnosisSubmit}>
                    <div className="accordion">
                        <input
                        className="accordion-input"
                        type="checkbox"
                        // defaultChecked
                        name="patient_accordion"
                        id="diagnostico"
                        />
                        <label className="accordion-label" htmlFor="diagnostico">
                        Diagn??stico
                        </label>
                        <div className="accordion-content">
                        <textarea
                            className="input-text-patient-page"
                            name="formDiagnosis"
                            spellCheck={false}
                            defaultValue={defaultPatient.diagnosis}
                            onChange={onInputChange}
                            readOnly={ !isNutritionistStatus }
                        ></textarea>
                        {   ( isNutritionistStatus )
                            ?   <button
                                className="btn-save-changes"
                                type="submit"
                                ></button>
                            : null
                        }
                        </div>
                    </div>
                    </form>
                </div>
                <div className="right-container">
                    <form onSubmit={onIndicationsSubmit}>
                    <div className="accordion">
                        <input
                        className="accordion-input"
                        type="checkbox"
                        // defaultChecked
                        name="patient_accordion"
                        id="indicaciones"
                        />
                        <label className="accordion-label" htmlFor="indicaciones">
                        Indicaciones
                        </label>
                        <div className="accordion-content">
                        <textarea
                            className="input-text-patient-page"
                            name="formIndications"
                            spellCheck={false}
                            defaultValue={defaultPatient.indications}
                            onChange={onInputChange}
                            readOnly={ !isNutritionistStatus }
                        ></textarea>
                        {   ( isNutritionistStatus )
                            ?   <button
                                className="btn-save-changes"
                                type="submit"
                                ></button>
                            : null
                        }
                        </div>
                    </div>
                    </form>
                    <div className="accordion">
                    <input
                        className="accordion-input"
                        type="checkbox"
                        defaultChecked
                        name="patient_accordion"
                        id="graficos"
                    />
                    <label className="accordion-label" htmlFor="graficos">
                        Gr??ficos
                    </label>
                    <div className="accordion-content">
                        <div className="canvas">
                            <Line data={ userData } options={ options } />

                        </div>
                        <button className="btn-save-changes" type="button" onClick={ onShowHideReferenceChart }>
                        </button>
                        <div className="canvas" hidden={ showHideReferenceChart }>
                            <Line data={ referenceData } options={ options } />

                        </div>
                    </div>
                    </div>
                </div>
                </div>
            </div>
        </AppLayout>
      </>
    );
}
