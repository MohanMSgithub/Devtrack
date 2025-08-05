
import { useEffect, useState } from "react";
import { getUserFromToken } from "../services/authService";

export const useAuth = () => {
    const [user, setUser] = useState(null);

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (token) {
            const userInfo = getUserFromToken(token);
            setUser(userInfo);
        }
    }, []);

    return { user };
};
