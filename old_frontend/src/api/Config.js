import axios from "axios"
import { URL } from "../config/Settings"

export const apiClient = axios.create({
    baseURL: URL,
}) 