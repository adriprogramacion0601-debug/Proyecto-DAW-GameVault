import { useEffect, useState } from "react";

function App() {
    const [users, setUsers] = useState([]);

    useEffect(() => {
        fetch("/api/auth/allUsers")
            .then(async res => {
                console.log("STATUS:", res.status);
                const data = await res.json();
                console.log("DATA:", data);
                setUsers(data);
            })
            .catch(err => console.error("ERROR:", err));
    }, []);

    return (
        <div style={{ padding: "20px" }}>
            <h1>Usuarios</h1>

            {users.length === 0 && <p>No hay usuarios o no se cargaron aún.</p>}

            <ul>
                {users.map(u => (
                    <li key={u.id}>
                        <strong>{u.nombre}</strong> — {u.email}
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default App;
