export function formatPhoneToInternational(
    phone: string,
    country?: string,
): string {
    if (country === "nga") {
        if (phone.startsWith("234")) {
            return phone;
        }
        if (phone.startsWith("0")) {
            return `234${phone.slice(1)}`;
        }
        // If it's already in international format or doesn't start with 0, assume it's correct
        return phone;
    }
    return "";
}

export function formatPhoneToLocal(phone: string, country: string): string {
    if (country === "nga") {
        return `0${phone}`;
    }
    return "";
}
  