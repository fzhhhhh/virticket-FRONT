const distintosRoles = [
  {
    id: 1,
    roleName: "Usuario",
    value: "user",
    description: "Acceso básico a la aplicación, puede ver eventos y realizar compras.",
  },
  {
    id: 2,
    roleName: "Administrador",
    value: "admin",
    description: "Acceso a la gestión de eventos (agregar, editar, eliminar), y algunas configuraciones de usuario.",
  },
  {
    id: 3,
    roleName: "Super Administrador",
    value: "superAdmin", // ← corregido
    description: "Control total de la aplicación, incluyendo gestión de usuarios, roles, y configuraciones avanzadas del sistema.",
  },
];

export const ROLES = {
  USER: "user",
  ADMIN: "admin",
  SUPER_ADMIN: "superAdmin"
};

export default distintosRoles;