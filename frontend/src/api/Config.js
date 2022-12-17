import axios from "axios"
import { BACKEND_URL } from "../config/Settings"

export const apiClient = axios.create({
    baseURL: BACKEND_URL,
}) 