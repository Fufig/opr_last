export function getToken() {
    return localStorage.getItem("basic_token") || "";
}

export async function apiUpload(url, formData, method = "POST") {
    const token = getToken();
    const headers = {
        ...(token && { Authorization: `Basic ${token}` }),
    };

    const resp = await fetch(url, {
        method,
        headers,
        body: formData,
    });

    if (!resp.ok) {
        const err = await resp.json().catch(() => ({}));
        throw new Error(err.msg || resp.statusText);
    }

    return resp.json();
} 