/**
 * Utilidades para manejar la navegación y prevenir que los usuarios 
 * naveguen hacia atrás después de autenticarse
 */

// Previene que el usuario regrese a la página de login con el botón de atrás
export const preventBackNavigation = (): void => {
  // Agregar un estado al historial para evitar que el usuario regrese
  window.history.pushState(null, '', window.location.href);
  
  // Escuchar el evento de popstate para detectar cuándo el usuario intenta ir hacia atrás
  window.addEventListener('popstate', () => {
    // Volver a agregar el estado actual para mantener al usuario en la página actual
    window.history.pushState(null, '', window.location.href);
  });
};

// Limpia el evento de prevención de navegación hacia atrás
export const clearBackNavigationProtection = (): void => {
  // Eliminar el listener para evitar posibles fugas de memoria
  window.removeEventListener('popstate', () => {});
};

// Verifica si el usuario está autenticado y aplica protección de navegación
export const setupAuthNavigationProtection = (isAuthenticated: boolean): void => {
  if (isAuthenticated) {
    preventBackNavigation();
  }
};