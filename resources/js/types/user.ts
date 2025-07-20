export interface User {
    id: number;
    name: string;
    email: string;
    email_verified_at: string | null;
    password?: string;

    two_factor_secret: string | null;
    two_factor_recovery_codes: string[] | null;
    two_factor_confirmed_at: string | null;

}
