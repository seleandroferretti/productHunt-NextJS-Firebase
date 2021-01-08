import React, { useState, useEffect } from 'react';

const useValidacion = (stateInicial, validar, fn) => {
    
    const [ valores, guardarValores ] = useState(stateInicial);
    const [ errores, guardarErrores ] = useState({});
    const [ submitForm, guardarSubmitForm ] = useState(false);

    useEffect(() => {
        if(submitForm) {
            const noErrores = Object.keys(errores).length === 0;

            if(noErrores) {
                fn(); // fn = funcion que se ejecute en el componente (crear producto, iniciar sesion o crear cuenta)
            }

            guardarSubmitForm(false);
        }
    }, [errores]);

    // fn que se ejecute conforme el usuario escribe
    const handleChange = e => {
        guardarValores({
            ...valores,
            [e.target.name] : e.target.value
        })
    }

    // fn que se ejecuta cuando el usuario hace submit
    const handleSubmit = e => {
        e.preventDefault();
        const erroresValidacion = validar(valores);
        guardarErrores(erroresValidacion);
        guardarSubmitForm(true);
    }

    // cuando se realiza el evento de blur
    const handleBlur = () => {
        const erroresValidacion = validar(valores);
        guardarErrores(erroresValidacion);
    }
    
    return {
        valores,
        errores,
        handleChange,
        handleSubmit,
        handleBlur
    };
}
 
export default useValidacion;