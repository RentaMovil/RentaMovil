import { useCallback, useEffect, useState } from "react";
import { countService } from "../services/countService";
import { toProfileViewModel } from "../services/countMapper";

export function useCount() {
    const [profile, setProfile] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchProfile = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        try {
            const response = await countService.getProfile();
            setProfile(toProfileViewModel(response));
        } catch (err) {
            setError(err.message || "No se pudo cargar el perfil");
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => { fetchProfile(); }, [fetchProfile]);

    return { profile, isLoading, error, refetch: fetchProfile };
}