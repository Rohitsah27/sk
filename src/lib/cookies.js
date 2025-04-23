// Check if cookies are allowed
export const hasCookieConsent = () => {
    if (typeof window === 'undefined') return false;
    return localStorage.getItem('cookieConsent') === 'accepted';
  };
  
  // Set a cookie (only if consent was given)
  export const setCookie = (name, value, days) => {
    if (!hasCookieConsent()) return false;
    
    const date = new Date();
    date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
    const expires = "expires=" + date.toUTCString();
    document.cookie = name + "=" + value + ";" + expires + ";path=/";
    return true;
  };
  
  // Get a cookie
  export const getCookie = (name) => {
    if (typeof document === 'undefined') return null;
    
    const cookieName = name + "=";
    const decodedCookie = decodeURIComponent(document.cookie);
    const cookieArray = decodedCookie.split(';');
    
    for (let i = 0; i < cookieArray.length; i++) {
      let cookie = cookieArray[i];
      while (cookie.charAt(0) === ' ') {
        cookie = cookie.substring(1);
      }
      if (cookie.indexOf(cookieName) === 0) {
        return cookie.substring(cookieName.length, cookie.length);
      }
    }
    return null;
  };