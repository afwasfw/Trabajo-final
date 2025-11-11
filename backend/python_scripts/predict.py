# python_scripts/predict.py
import sys
import json
import pandas as pd
import joblib
import os

def predecir_prioridad(datos_json):
    """
    Carga el modelo entrenado y predice la prioridad para una nueva solicitud.
    """
    try:
        # Cargar los datos de entrada
        datos_entrada = json.loads(datos_json)

        # Convertir los datos a un DataFrame de pandas, que es lo que el pipeline espera
        df = pd.DataFrame([datos_entrada])

        # Construir la ruta al modelo. El script se ejecuta desde la raíz del proyecto backend.
        # Asegúrate de que 'ml_models' esté en la raíz de tu carpeta 'backend'
        ruta_modelo = os.path.join('ml_models', 'modelo_prioridad_realista.joblib')
        
        # Cargar el pipeline del modelo
        pipeline = joblib.load(ruta_modelo)

        # Realizar la predicción
        prediccion = pipeline.predict(df)

        # Devolver la predicción (el primer elemento del array resultante)
        return prediccion[0]

    except Exception as e:
        # Si algo sale mal, devuelve un mensaje de error
        return f"Error en Python: {str(e)}"

if __name__ == '__main__':
    # El script espera recibir un único argumento: el string JSON con los datos
    if len(sys.argv) > 1:
        input_json = sys.argv[1]
        resultado = predecir_prioridad(input_json)
        # Imprimir el resultado a la salida estándar para que Node.js lo capture
        print(resultado)

