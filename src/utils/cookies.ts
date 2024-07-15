export function getCookie(name: string): string | null {
    if (typeof document === 'undefined') {
        // Return null if not running in a browser environment
        return null;
    }

    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) {
        return parts.pop()?.split(';').shift() || null;
    }
    console.log("HTTP Client Constructed with token: ",parts.pop()?.split(';').shift() || null );
    return null;
}

export function deleteCookie(name: string, path?: string, domain?: string) {
    if (path === undefined) {
        path = '/';
    }
    
    if (domain) {
        document.cookie = `${name}=; path=${path}; domain=${domain}; expires=Thu, 01 Jan 1970 00:00:00 GMT`;
    } else {
        document.cookie = `${name}=; path=${path}; expires=Thu, 01 Jan 1970 00:00:00 GMT`;
    }
}


export function parseCookie(cookie: string) {
    const jsonString = decodeURIComponent(cookie);
    const dataObject = JSON.parse(jsonString);
    return dataObject;
}


// Contoh penggunaan:
// const myCookie = getCookie('cookieName');
// console.log(myCookie); // Mencetak nilai cookie 'cookieName'