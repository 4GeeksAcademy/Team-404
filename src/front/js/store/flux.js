import axios from "axios";

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
            userData: {} // Aquí se almacenarán los datos del usuario
        },

        actions: {
            // Función de ejemplo
            exampleFunction: () => {
                getActions().changeColor(0, "green");
            },

            // Función para cargar los datos del usuario
            fetchUserData: async () => {
                try {
                    const token = localStorage.getItem("token");

                    if (!token) {
                        throw new Error("Token no disponible.");
                    }

                    const apiUrl = `${process.env.BACKEND_URL}/api/user`;
                    const headers = {
                        Authorization: `Bearer ${token}`
                    };

                    const response = await axios.get(apiUrl, { headers });

                    // Almacena los datos del usuario en el estado global
                    setStore({ userData: response.data });

                } catch (err) {
                    console.log("Error al cargar los datos del usuario:", err.message);
                }
            },

            // Nueva función para obtener el userId
            getUserId: () => {
                const store = getStore();
                return store.userData.id;  // Asegúrate de que esto apunte al ID correcto del usuario
            },

            // Nueva función para actualizar los datos del usuario
            updateUserData: (updatedUserData) => {
                setStore((prevStore) => ({
                    ...prevStore,
                    userData: updatedUserData
                }));
            },

            // Función para obtener el mensaje del backend
            getMessage: async () => {
                try {
                    const resp = await fetch(`${process.env.BACKEND_URL}/api/hello`);
                    if (!resp.ok) {
                        throw new Error(`HTTP error! status: ${resp.status}`);
                    }
                    const data = await resp.json();
                    setStore({ message: data.message });
                    return data;
                } catch (error) {
                    console.log("Error loading message from backend", error);
                }
            },

            // Cambiar el color en el array demo
            changeColor: (index, color) => {
                const store = getStore();
                const demo = store.demo.map((elm, i) => {
                    if (i === index) elm.background = color;
                    return elm;
                });
                setStore({ demo: demo });
            }
        }
    };
};

export default getState;