import { getCookieToken } from "./helper/CookieService";
import { envConfig } from "@/config/EnvConfig";
import { ImageUploadResponseSchema } from "@/schema/ImageSchema";

const API_URL = envConfig.API_URL;

export class ImageService {
    /**
     * Sube una imagen a Cloudinary
     */
    static async upload(file: File) {
        const formData = new FormData();
        formData.append('file', file);

        const token = await getCookieToken();
        const headers: HeadersInit = {};

        if (token) {
            headers.Authorization = `Bearer ${token}`;
        }

        const response = await fetch(`${API_URL}/images/upload`, {
            method: "POST",
            body: formData,
            headers
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(errorText);
        }

        const data = await response.json();
        console.log({data});
        return ImageUploadResponseSchema.parse(data);
    }
}
