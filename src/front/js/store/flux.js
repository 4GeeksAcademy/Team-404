import axios from "axios"

const getState = ({ getStore, getActions, setStore }) => {
	return {
		store: {
			message: null,
			demo: [
				{
					title: "FIRST",
					background: "white",
					initial: "white"
				},
				{
					title: "SECOND",
					background: "white",
					initial: "white"
				}
			],
			userData: {}
		},

		actions: {
			// Use getActions to call a function within a fuction
			exampleFunction: () => {
				getActions().changeColor(0, "green");
			},

			fetchUserData: async () => {
				try {
					// 1. Comprobar si el token está disponible
					const token = localStorage.getItem("token");
					console.log("Token obtenido:", token);  // Verificar que se obtiene el token correctamente
			
					// 2. Verificar si el token es válido
					if (!token) {
						throw new Error("Token no disponible.");
					}
			
					// 3. Verificar la URL de la API
					const apiUrl = "https://refactored-space-couscous-69wrxv6769929wr-3001.app.github.dev/api/user";
					console.log("URL de la API:", apiUrl);  // Asegúrate de que la URL esté correcta
			
					// 4. Verificar los encabezados que se están enviando
					const headers = {
						Authorization: `Bearer ${token}`
					};
					console.log("Encabezados de la solicitud:", headers);  // Verificar los encabezados de autorización
			
					// 5. Realizar la solicitud
					console.log("Realizando la solicitud a la API...");
					const response = await axios.get(apiUrl, { headers });
			
					// 6. Verificar la respuesta de la API
					console.log("Respuesta de la API recibida:", response);  // Verificar que la respuesta llega correctamente
					console.log("Datos del usuario:", response.data);  // Verificar los datos del usuario
			
					// 7. Almacenar los datos en el store
					setStore({ userData: response.data });
					
				} catch (err) {
					// 8. Manejo de errores detallado
					console.log("Error al cargar los datos del usuario:", err.message);  // Verificar el mensaje de error
					if (err.response) {
						console.log("Detalles del error en la respuesta de la API:", err.response);  // Verificar si hay detalles adicionales en la respuesta del servidor
					} else if (err.request) {
						console.log("No se recibió respuesta del servidor:", err.request);  // Verificar si la solicitud fue enviada pero no hubo respuesta
					} else {
						console.log("Error en la configuración de la solicitud:", err.message);  // Verificar cualquier otro error
					}
				} finally {
					console.log("Finalizó la solicitud de usuario.");  // Indicar que se completó la solicitud (éxito o error)
				}
			},

			getMessage: async () => {
				try {
					// fetching data from the backend
					const resp = await fetch("https://refactored-space-couscous-69wrxv6769929wr-3001.app.github.dev/api/hello")
					const data = await resp.json()
					setStore({ message: data.message })
					// don't forget to return something, that is how the async resolves
					return data;
				} catch (error) {
					console.log("Error loading message from backend", error)
				}
			},
			changeColor: (index, color) => {
				//get the store
				const store = getStore();

				//we have to loop the entire demo array to look for the respective index
				//and change its color
				const demo = store.demo.map((elm, i) => {
					if (i === index) elm.background = color;
					return elm;
				});

				//reset the global store
				setStore({ demo: demo });
			}
		}
	};
};

export default getState;
