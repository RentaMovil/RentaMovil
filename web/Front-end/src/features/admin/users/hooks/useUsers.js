import { useCallback, useEffect, useState } from "react";
import { userService } from "../services/userService";
import { toUserViewModel } from "../services/userMapper";

export function useUsers() {
    const [users, setUsers] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchUsers = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        try {
            const response = await userService.getAll();
            setUsers(response.map(toUserViewModel));
        } catch (err) {
            setError(err.message || "No se pudieron cargar los usuarios");
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => { fetchUsers(); }, [fetchUsers]);

    return { users, isLoading, error, refetch: fetchUsers };
}