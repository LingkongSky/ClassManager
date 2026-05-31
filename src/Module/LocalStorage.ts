export function getCookie(key: string): string | null {
    const cookies = document.cookie.split(';');
    
    for (let i = 0; i < cookies.length; i++) {
        const cookie = cookies[i].trim();
        if (cookie.startsWith(`${key}=`)) {
            return decodeURIComponent(cookie.substring(key.length + 1));
        }
    }
    
    return null;
}

export function setCookie(key: string, value: string, time?: number | Date) {
    let invalid = new Date();;
    if (time) {
        switch (typeof time) {
            case 'number':
                invalid.setTime(invalid.getTime() + time)
                break;
            default:
                invalid = time
        }
    } else {
        invalid.setTime(invalid.getTime() + 86400)
    }
    window.document.cookie = key + "=" + value + ";path=/;expires=" + invalid.toUTCString();
};


export function deleteCookie(key: string): void {
    setCookie(key, '', -1);
}


