# 📦 Gestión de Categorías y Productos – Guía de Inicio

## 📋 Descripción

Este proyecto es una aplicación **web fullstack** que permite administrar categorías y productos con funcionalidades completas de:

- ✅ Crear
- ✅ Editar
- ✅ Eliminar
- ✅ Listar

Además, incluye un **resumen del promedio de precios por categoría**, lo cual facilita visualizar los costos promedio según el tipo de producto.

Ideal para pequeños negocios, prácticas académicas o demostraciones de aplicaciones CRUD básicas con React y Node.js.

---

## 🛠️ Tecnologías utilizadas

- **Backend:** Node.js + Express
- **Frontend:** React + Vite
- **Base de datos:** JSON Server (`db.json`) – *Simulación de una API REST*

Estas tecnologías fueron elegidas por su rapidez, sencillez y por permitir el desarrollo de funcionalidades tipo CRUD sin necesidad de un sistema de base de datos real.

---

## 🚀 Instalación y ejecución

### 1. Clonar el repositorio

git clone https://github.com/Areco-Github/Examen-Final-PW1-Jorge-Areco.git
cd Examen-Final-PW1-Jorge-Areco

### 2. Backend

cd apps/backend
npm install       # Instala las dependencias necesarias
npm start         # Inicia el servidor en http://localhost:3001

> El backend utiliza JSON Server para simular una API RESTful. Maneja peticiones para productos y categorías a través del archivo db.json.

### 3. Frontend

cd ../frontend
npm install       # Instala dependencias de React y Vite
npm run dev       # Inicia la aplicación en http://localhost:5173

> Asegurate de tener el backend corriendo antes de iniciar el frontend para evitar errores de conexión.

---

## 🧪 Funcionalidades principales

### 📂 Gestión de Categorías

- Crear nuevas categorías.  
  - ✅ **Validación:** solo se aceptan letras o letras con números, no solo números.
- Editar nombre de categorías existentes.
- Eliminar categorías.  
  - ⚠️ **Restricción:** solo si no tienen productos asociados.

### 📦 Gestión de Productos

- Crear productos vinculándolos a una categoría existente.
- Editar nombre, precio y categoría.
- Eliminar productos de forma individual.

  **Validaciones:**
  - El nombre debe contener letras.
  - El precio debe ser un número positivo.

### 📊 Resumen por Categoría

- Se muestra automáticamente el promedio de precios por cada categoría registrada en la parte inferior de la interfaz principal.

---

## ✅ Requisitos previos

- Node.js >= 16.x  
- npm >= 7.x  

Podés verificar tu versión con:

node -v
npm -v

---

## 🙋 Autor

**Jorge Ronaldo Areco Falcón**

Proyecto desarrollado como entrega final para la materia **Programación Web 1**  
Facultad de Ciencias y Tecnología – UNCA
EOF
