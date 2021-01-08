import React, { useState, useContext } from 'react';
import { css } from '@emotion/core';
import { useRouter } from 'next/router';
import Layout from '../components/layout/Layout';
import { Formulario, Campo, InputSubmit, Error } from '../components/ui/Formulario';
import { FirebaseContext } from '../firebase';
import Error404 from '../components/layout/404';
 
// validaciones
import useValidacion from '../hooks/useValidacion';
import validarCrearProducto from '../validacion/validarCrearProducto';
 
const STATE_INICIAL = {
  nombre: '',
  empresa: '',
  url: '',
  descripcion: ''
}
 
const NuevoProducto = () => {
 
  const [ error, guardarError] = useState(false);
  const [ image, setImage ] = useState(null);
 
  const { valores, errores, handleSubmit, handleChange, handleBlur } = useValidacion(STATE_INICIAL, validarCrearProducto, crearProducto);
 
  const { nombre, empresa, url, descripcion } = valores;
 
  // hook de routing para redireccionar
  const router = useRouter();
 
  // context con las operaciones crud de firebase
  const { usuario, firebase } = useContext(FirebaseContext);
  
  const handleFile = e => {
    if(e.target.files[0]){
      console.log(e.target.files[0])
      setImage(e.target.files[0])
    }
  }
 
  const handleUpload = async () => {
    const uploadTask = await firebase.storage.ref(`productos/${image.lastModified}${image.name}`).put(image);
    const downloadURL = await uploadTask.ref.getDownloadURL();
    return downloadURL
  }
 
  async function crearProducto() {
    // si el usuario no esta autenticado llevar al login
    if(!usuario) {
      return router.push('/login');
    }
 
    // crear el objeto de nuevo producto 
    const producto = {
        nombre, 
        empresa, 
        url, 
        urlimagen: await handleUpload(),
        descripcion,
        votos: 0,
        comentarios: [],
        creado: Date.now(), 
        creador: {
          id: usuario.uid,
          nombre: usuario.displayName
        }, 
        haVotado: []
    }
 
    // insertarlo en la bd
    await firebase.db.collection('productos').add(producto);
 
    return router.push('/');
  }
 
  return (
    <div>
      <Layout>
        { !usuario ? <Error404 /> : (
          <>
            <h1
              css={css`
                text-align: center;
                margin-top: 5rem;
              `}
            >Nuevo Producto</h1>
            <Formulario
              onSubmit={handleSubmit}
              noValidate
            >
 
              <fieldset>
                <legend>Información General </legend>
            
                <Campo>
                    <label htmlFor="nombre">Nombre</label>
                    <input 
                        type="text"
                        id="nombre"
                        placeholder="Nombre del Producto"
                        name="nombre"
                        value={nombre}
                        onChange={handleChange}
                        onBlur={handleBlur}
                    />
                </Campo>
 
                {errores.nombre && <Error>{errores.nombre}</Error> }
    
                <Campo>
                    <label htmlFor="empresa">Empresa</label>
                    <input 
                        type="text"
                        id="empresa"
                        placeholder="Nombre Empresa o Compañia"
                        name="empresa"
                        value={empresa}
                        onChange={handleChange}
                        onBlur={handleBlur}
                    />
                </Campo>
 
                {errores.empresa && <Error>{errores.empresa}</Error> }
    
                <Campo>
                    <label htmlFor="image">Imagen</label>
                    <input
                        type="file"
                        accept="image/*"
                        id="image"
                        name="image"
                        onInput={(e) => handleFile(e)}
                    />
                </Campo>
 
                <Campo>
                    <label htmlFor="url">URL</label>
                    <input 
                        type="url"
                        id="url"
                        name="url"
                        placeholder="URL de tu producto"
                        value={url}
                        onChange={handleChange}
                        onBlur={handleBlur}
                    />
                </Campo>
 
                {errores.url && <Error>{errores.url}</Error> }
 
              </fieldset>
 
              <fieldset>
                <legend>Sobre tu Producto</legend>
 
                <Campo>
                    <label htmlFor="descripcion">Descripcion</label>
                    <textarea 
                        id="descripcion"
                        name="descripcion"
                        value={descripcion}
                        onChange={handleChange}
                        onBlur={handleBlur}
                    />
                </Campo>
 
                {errores.descripcion && <Error>{errores.descripcion}</Error> }
              </fieldset>
 
                {error && <Error>{error} </Error>}
    
                <InputSubmit 
                  type="submit"
                  value="Crear Producto"
                />
            </Formulario>
          </>
        ) }
        
      </Layout>
    </div>
  )
}
 
export default NuevoProducto