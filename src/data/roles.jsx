// src/data/roles.js

const distintosRoles = [
  {
    id: 1,
    roleName: "Usuario",
    value: "user",
    description: "Acceso básico: ver eventos y comprar entradas.",
  },
  {
    id: 2,
    roleName: "Productor",
    value: "productor",
    description: "Gestiona SUS eventos, reportes y staff.",
  },
  {
    id: 3,
    roleName: "Staff",
    value: "staff",
    description: "Valida entradas (check-in) en eventos asignados.",
  },
  {
    id: 4,
    roleName: "Super Administrador",
    value: "superAdmin",
    description: "Control total del sistema.",
  },
];

export const ROLES = {
  USER: "user",
  PRODUCTOR: "productor",
  STAFF: "staff",
  SUPER_ADMIN: "superAdmin",
};

export default distintosRoles;