import axios from "axios";
import type {
    DOJAHBvnResponse,
    DOJAHNinResponse,
} from "../../types/dojah";
import { logger } from "../../utils/logger";

const baseUrl = process.env.DOJAH_API_URL;

logger.info(
    `Dojah API URL: ${baseUrl}, App ID: ${process.env.DOJAH_API_ID}, Secret Key: ${process.env.DOJAH_SK}`,
);

export async function lookUpBVN(
    bvn: string,
): Promise<DOJAHBvnResponse> {
    try {
        const response = await axios.get<DOJAHBvnResponse>(
            `${baseUrl}/api/v1/kyc/bvn/full?bvn=${bvn}`,
            {
                headers: {
                    AppId: process.env.DOJAH_API_ID,
                    Authorization: process.env.DOJAH_SK,
                },
            },
        );

        return response.data;

    } catch (error: any) {
        if (axios.isAxiosError(error) && error.response) {
            console.error(
                'Error looking up BVN:', error.message, error.response.data.message, error.stack,
            );
            throw new Error(
                `API Error: ${error.response.status} - ${error.response.data.message}`,
            );
        } else {
            console.error('Error looking up BVN:', error);
            throw new Error(`Unexpected Error: ${error.message}`);
        }
    }
}

export async function lookUpNIN(
    nin: string,
): Promise<DOJAHNinResponse> {
    try {
        const response = await axios.get<DOJAHNinResponse>(
            `${baseUrl}/api/v1/kyc/nin?nin=${nin}`,
            {
                headers: {
                    AppId: process.env.DOJAH_API_ID,
                    Authorization: process.env.DOJAH_SK,
                },
            },
        );

        return response.data;

    } catch (error: any) {
        if (axios.isAxiosError(error) && error.response) {
            console.error(
                'Error looking up NIN:', error.message, error.response.data.message, error.stack,
            );
            throw new Error(
                `API Error: ${error.response.status} - ${error.response.data.message}`,
            );
        } else {
            console.error('Error looking up NIN:', error);
            throw new Error(`Unexpected Error: ${error.message}`);
        }
    }
}
