export function formatPhoneToInternational(
    phone: string,
    country: string,
): string {
    if (country === "nga") {
        if (phone.startsWith("0")) {
            return `234${phone.slice(1)}`;
        }
        return `234${phone}`;
    }
    return "";
}

export function formatPhoneToLocal(phone: string, country: string): string {
    if (country === "nga") {
        return `0${phone}`;
    }
    return "";
}
  