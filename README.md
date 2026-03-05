# Altamo - Aplicación Web Next.js

Una aplicación Next.js amigable para principiantes con servidor de desarrollo local y funcionalidad de recarga en vivo.

## 🚀 Inicio Rápido

### Requisitos Previos
- Node.js instalado en tu máquina
- Administrador de paquetes npm

### Iniciar el Servidor de Desarrollo

1. **Abre la terminal en el directorio del proyecto:**
   ```bash
   cd /Users/justinbyo/development/altamo
   ```

2. **Inicia el servidor de desarrollo:**
   ```bash
   npm run dev
   ```

3. **Abre tu navegador:**
   - El servidor normalmente se ejecuta en `http://localhost:3000`
   - Si el puerto 3000 está ocupado, usará `http://localhost:3001` (o el siguiente puerto disponible)
   - La terminal te mostrará la URL exacta a usar

4. **¡Empieza a programar!**
   - Cualquier cambio que hagas se actualizará automáticamente en el navegador
   - No necesitas reiniciar el servidor manualmente

### Detener el Servidor
- Presiona `Ctrl + C` en la terminal para detener el servidor de desarrollo

## 📁 Estructura del Proyecto

```
altamo/
├── app/                    # Directorio principal de la aplicación (App Router)
│   ├── checkout/           # Ruta de la página de pago
│   │   └── page.js        # Página de pago - resumen del pedido, pago, propina
│   ├── components/         # Componentes reutilizables
│   │   ├── DevPanel.js    # Panel de depuración para desarrollo con inspección de pedidos
│   │   ├── Navigation.js  # Barra de navegación con búsqueda y carrito
│   │   ├── OrderManagerTest.js # Suite de pruebas automatizadas para OrderManager
│   │   ├── Payment.js     # Selector de método de pago
│   │   ├── ProductItem.js # Tarjeta individual de artículo del menú con controles de cantidad
│   │   └── ProductList.js # Lista de artículos del menú por categoría
│   ├── data/              # Archivos de datos
│   │   └── products.js    # Artículos del menú organizados por categoría
│   ├── lib/               # Bibliotecas de utilidades y lógica de negocio
│   │   └── orderManager.js # Gestión central del estado de pedidos y persistencia
│   ├── order/             # Ruta de la página de pedido/menú
│   │   └── page.js        # Página principal del menú con selección de artículos
│   ├── schemas/           # Definiciones de estructura de datos
│   │   └── order.js       # Definiciones de estado de pedido y constantes
│   ├── summary/           # Ruta de la página de resumen del pedido
│   │   └── page.js        # Página de confirmación del pedido
│   ├── favicon.ico        # Icono del sitio web
│   ├── globals.css        # Estilos globales y Tailwind CSS
│   ├── layout.js          # Componente de diseño raíz (envuelve todas las páginas)
│   └── page.js            # Página de inicio/menú - interfaz principal de pedidos
├── public/                # Recursos estáticos (imágenes, iconos, etc.)
├── .eslintrc.json         # Configuración de ESLint para calidad de código
├── .gitignore             # Archivo de ignorados de Git
├── .next/                 # Salida de compilación (auto-generado, no editar)
├── next.config.js         # Configuración de Next.js
├── node_modules/          # Dependencias (auto-generado, no editar)
├── package.json           # Dependencias y scripts del proyecto
├── package-lock.json      # Archivo de bloqueo de dependencias
├── postcss.config.js      # Configuración de PostCSS para Tailwind
├── README.md              # Este archivo
└── tailwind.config.js     # Configuración de Tailwind CSS
```

## 📄 Páginas

### Inicio (`/` - `app/page.js`)
La página principal del menú donde los usuarios pueden:
- Explorar artículos del menú organizados por categoría (Cócteles, Cerveza, Vino, Aperitivos, Sándwiches, Pizza, Platos Principales, Postre)
- Buscar artículos específicos usando la barra de búsqueda
- Agregar artículos a su pedido
- Navegar al pago

### Pago (`/checkout` - `app/checkout/page.js`)
Página de revisión del pedido y pago donde los usuarios pueden:
- Revisar los artículos y cantidades de su pedido
- Seleccionar método de pago (Tarjeta de Crédito/Débito, Apple Pay, Google Pay, Efectivo)
- Elegir porcentaje de propina (15%, 18%, 20%, 25% o personalizado)
- Ver el resumen del pedido con subtotal, propina y total
- Enviar su pedido

### Resumen (`/summary` - `app/summary/page.js`)
Página de confirmación del pedido que muestra:
- Confirmación del pedido con número de pedido único
- Detalles completos del pedido
- Método de pago y desglose de la propina
- Opciones para editar el pedido o cambiar el pago/propina

## 🔄 Sistema de Estado de Edición

La aplicación soporta dos estados principales que cambian la interfaz y el comportamiento:

### **Estado Predeterminado** (Flujo Normal)
- **URL:** `/order` → `/checkout` → `/summary`
- **Flujo del Usuario:** Explorar menú → Agregar artículos → Seleccionar pago → Enviar pedido → Ver confirmación
- **Navegación:** El botón "Checkout" va a `/checkout`

### **Estado de Edición** (Modificación del Pedido)
- **URL:** `/order?edit` y `/checkout?edit`
- **Flujo del Usuario:** Desde la página de resumen → Editar pedido existente → Actualizar artículos/pago → Actualizar pedido
- **Navegación:** El botón "Add Items" va a `/checkout?edit`

### **Cómo Funciona el Estado de Edición**

1. **Parámetros de Consulta en la URL:**
   - El parámetro de consulta `?edit` activa el estado de edición en cualquier página
   - Ejemplo: `/order?edit`, `/checkout?edit`

2. **Detección de Estado:**
   ```javascript
   const searchParams = useSearchParams();
   const isEditMode = searchParams.get('edit') !== null;
   ```

3. **Paso de Props a Componentes:**
   ```javascript
   // Las páginas pasan el estado de edición al componente Navigation
   <Navigation 
     currentPage="order" 
     cartItemCount={cart.length}
     isEditMode={isEditMode}  // Prop crítico para comportamiento condicional
   />
   ```

4. **UI Condicional con Operadores Ternarios:**
   ```javascript
   // Los títulos de página cambian según el estado
   {isEditMode ? 'Edit Order - Add Items' : 'Menu'}
   
   // Los botones de navegación se adaptan
   {isEditMode ? 'Add Items' : 'Checkout'}
   
   // Las URLs cambian para preservar el estado
   href={isEditMode ? "/checkout?edit" : "/checkout"}
   ```

5. **Características del Estado de Edición:**
   - **`/order?edit`:** Muestra el título "Edit Order - Add Items", botón "Add Items"
   - **`/checkout?edit`:** Muestra el título "Edit Order", bloquea métodos de pago, botón "Update Order"
   - **La navegación hacia atrás preserva el estado:** `/checkout?edit` → "Back" → `/order?edit`

## 🧩 Componentes

### Navigation (`app/components/Navigation.js`)
Barra de navegación que se adapta según la página actual:
- **En Inicio:** Muestra campo de búsqueda y botón de pago con contador del carrito
- **En Pago:** Muestra enlace "Back to Order"

### ProductList (`app/components/ProductList.js`)
Muestra artículos del menú agrupados por categoría con soporte para filtrado por búsqueda

### ProductItem (`app/components/ProductItem.js`)
Tarjeta individual de artículo del menú que muestra nombre, descripción, precio y botón "Add to Order"

### Payment (`app/components/Payment.js`)
Selector de método de pago con soporte para:
- Tarjeta de Crédito/Débito (con campos de entrada)
- Apple Pay
- Google Pay
- Efectivo

## 📦 Sistema de Gestión de Estado de Pedidos

### **Clase OrderManager (`app/lib/orderManager.js`)**
Clase de utilidad central que gestiona todas las operaciones de pedidos con almacenamiento persistente:

#### **Estados del Ciclo de Vida del Pedido:**
```javascript
'building'   → El usuario está agregando artículos a un nuevo pedido
'submitted'  → Pedido completado, pago procesado  
'editing'    → El usuario está modificando un pedido enviado
```

#### **Métodos Principales:**
- **`generateOrderId()`** - Crea identificadores únicos de pedido (ORD-XXXXX)
- **`createOrder(orderId)`** - Inicializa un nuevo pedido con estado predeterminado
- **`getOrder(orderId)`** - Recupera el pedido de localStorage con manejo de errores
- **`addItems(orderId, items, isEditMode)`** - Agrega artículos con lógica consciente del estado
- **`submitOrder(orderId, paymentMethod, gratuity)`** - Procesa el envío del pedido
- **`getAllItems(order)`** - Devuelve todos los artículos (originales + artículos de edición)
- **`getCartItems(order)`** - Devuelve los artículos de la sesión actual para la interfaz
- **`getCurrentSessionItems(order)`** - Devuelve los artículos que se están agregando en la sesión actual
- **`calculateTotal(order)`** - Calcula subtotal, propina y total con registro

#### **Estructura de Datos:**
```javascript
// Estructura completa del objeto de pedido
{
  id: 'ORD-ABC123',           // Identificador único
  state: 'building',          // Estado actual del ciclo de vida
  items: [...],               // Artículos en construcción (estado building)
  originalItems: [...],       // Artículos del envío inicial  
  editItems: [...],          // Artículos agregados durante sesiones de edición
  payment: {
    method: 'card',           // Método de pago seleccionado
    isLocked: true,           // Previene cambios después del envío
    lastFour: '1234'          // Información de visualización de la tarjeta
  },
  gratuity: 18,              // Porcentaje de propina (no monto)
  createdAt: '2025-11-09...',
  submittedAt: '2025-11-09...',
  lastUpdated: '2025-11-09...'
}
```

#### **Características de Almacenamiento Persistente:**
- **Integración con localStorage:** Todos los pedidos se guardan automáticamente con manejo de errores
- **Sincronización de Estado por URL:** Los IDs de pedido se rastrean mediante parámetros `?order=ORD-XXXXX`
- **Persistencia entre Sesiones:** Los pedidos sobreviven a recargas del navegador y navegación
- **Monitoreo de Tamaño:** Detección de cuota de almacenamiento y registro para depuración

#### **Herramientas de Desarrollo y Depuración:**
- **Componente DevPanel:** Interfaz de inspección y gestión de pedidos en tiempo real
- **Suite de Pruebas Automatizadas:** Componente OrderManagerTest para pruebas de regresión  
- **Métodos de Depuración:** `debugOrder()` para inspección detallada en consola
- **Registro Completo:** Cambios de propina, adición de artículos, transiciones de estado

### **Componentes de UI Conscientes del Estado:**
- **Lógica del Contador del Carrito:** Muestra artículos de la sesión vs. artículos totales según el contexto
- **Sistema de Insignia NEW:** Indicadores visuales para artículos agregados durante sesiones de edición  
- **Bloqueo de Pago:** Previene cambios en el método de pago después del envío
- **Navegación Condicional:** Los botones de retroceso y las URLs preservan el estado del pedido y la edición

## 📊 Estructura de Datos

### Datos de Productos (`app/data/products.js`)
Artículos del menú organizados por categoría con:
- ID y nombre de categoría
- Detalles del artículo (id, nombre, descripción, precio)
- Funciones auxiliares para buscar y filtrar productos

## 🛠️ Archivos Clave para Editar

### `app/page.js` - Página de Inicio/Menú
La página principal de pedidos donde los usuarios exploran el menú y agregan artículos a su carrito. Incluye funcionalidad de búsqueda y navegación al pago.

### `app/checkout/page.js` - Página de Pago
Página de revisión del pedido con selección de método de pago y opciones de propina.

### `app/summary/page.js` - Confirmación del Pedido
Página de confirmación final que se muestra después del envío del pedido.

### `app/layout.js` - Diseño del Sitio
Esto envuelve todas tus páginas. Contiene metadatos globales y estructura del cuerpo.

### `app/components/` - Componentes Reutilizables
Crea y edita componentes de UI reutilizables aquí:
- Navigation.js - Navegación del sitio
- ProductList.js - Visualización del menú
- ProductItem.js - Artículos individuales del menú
- Payment.js - Selección de pago

### `app/data/products.js` - Datos del Menú
Contiene todos los artículos del menú organizados por categoría. Actualiza este archivo para modificar las opciones del menú.

### `app/globals.css` - Estilos Globales
Agrega tu CSS personalizado aquí. Tailwind CSS ya está configurado.

## 📝 Características de Desarrollo

- **Recarga en Vivo:** Los cambios aparecen instantáneamente en el navegador
- **Hot Module Replacement:** Actualizaciones sin perder el estado de la aplicación
- **ESLint:** Verificación automática de calidad de código
- **Tailwind CSS:** Framework CSS basado en utilidades
- **Turbopack:** Empaquetador rápido para compilaciones de desarrollo ágiles

## 🎯 Próximos Pasos para el Desarrollo

1. **Crear nuevas páginas:** Agrega nuevos archivos `.js` en el directorio `app/`
2. **Agregar componentes:** Crea componentes reutilizables en `app/components/`
3. **Estilizar con Tailwind:** Usa clases de Tailwind para un estilizado rápido
4. **Agregar imágenes:** Coloca imágenes en la carpeta `public/`

## 📚 Comandos Útiles

```bash
# Iniciar servidor de desarrollo
npm run dev

# Compilar para producción
npm run build

# Iniciar servidor de producción
npm start

# Ejecutar linting
npm run lint
```

## 🆘 Solución de Problemas

### ¿El servidor no inicia?
- Asegúrate de estar en el directorio correcto
- Ejecuta `npm install` para asegurar que las dependencias estén instaladas
- Verifica si otro proceso está usando el puerto

### ¿Los cambios no se muestran?
- Asegúrate de que el servidor de desarrollo esté en ejecución
- Verifica la caché del navegador (intenta una recarga forzada: Cmd+Shift+R en Mac)
- Revisa la terminal en busca de mensajes de error

### ¿Puerto ya en uso?
- Next.js encontrará automáticamente el siguiente puerto disponible
- Revisa la salida de la terminal para la URL correcta a usar

## 🔧 Construido Con

- **Next.js 15.5.4** - Framework de React
- **React 18** - Biblioteca de UI
- **Tailwind CSS** - Framework de estilos
- **ESLint** - Herramienta de calidad de código
- **Turbopack** - Empaquetador rápido

---

## 📋 Registro de Cambios de Desarrollo

### **9 de Noviembre de 2025 - Refinamientos de OrderManager y Depuración**

#### **🎯 Objetivo de Aprendizaje:** Corregir limitaciones del modo de edición, mejorar la depuración y optimizar la gestión de propinas

#### **Cambios Realizados:**

1. **Corrección del Límite de Artículos en Modo de Edición:**
   - **Problema:** Los usuarios solo podían agregar 1 artículo en modo de edición debido a un error en el manejo de estado
   - **Solución:** Se corrigió `addItems()` para manejar tanto el estado `'submitted'` como `'editing'`
   - **Patrón de código aprendido:**
     ```javascript
     // Manejar transiciones de estado correctamente en modo de edición
     if (isEditMode && (order.state === 'submitted' || order.state === 'editing')) {
       order.editItems = [...(order.editItems || []), ...itemsToAdd];
       order.state = 'editing';
     }
     ```

2. **Mejora de la Lógica del Contador del Carrito:**
   - Se creó el método `getCurrentSessionItems()` para una mejor experiencia de usuario en modo de edición
   - La insignia del carrito ahora muestra los artículos que se están agregando en la sesión actual, no los artículos totales
   - **Beneficios:** Interfaz menos confusa, indicación más clara de los nuevos artículos que se están agregando

3. **Implementación de la Insignia NEW:**
   - Se agregaron indicadores visuales para artículos agregados durante sesiones de edición
   - Visualización consistente de la insignia en las páginas de pago y resumen
   - **Patrón de código aprendido:**
     ```javascript
     {item.isNew && <span className="ml-2 text-xs bg-green-100 text-green-800 px-2 py-1 rounded">NEW</span>}
     ```

4. **Registro Completo de Gestión de Propinas:**
   - **Nuevo método:** `OrderManager.updateGratuity()` con registro de cambios
   - Se mejoró `submitOrder()` para registrar cambios de propina durante el envío
   - Se mejoró `calculateTotal()` para registrar desgloses de cálculos
   - **Página de pago:** Se agregó detección y registro de cambios de propina en tiempo real
   - **Patrón de código aprendido:**
     ```javascript
     // Detección de cambio de propina con registro
     const handleGratuityChange = (newGratuity) => {
       if (newGratuity !== gratuity) {
         console.log(`💰 User changed gratuity from ${gratuity}% to ${newGratuity}%`);
         setGratuity(newGratuity);
       }
     };
     ```

5. **Herramientas de Desarrollo Mejoradas:**
   - **DevPanel actualizado:** Inspección más detallada del estado del pedido
   - **Suite de Pruebas Automatizadas:** Componente `OrderManagerTest` para pruebas de regresión
   - **Métodos de Depuración:** `debugOrder()` para inspección detallada en consola
   - **Manejo de Errores:** Mejor detección y reporte de errores de localStorage

#### **🎓 Conceptos Clave Aprendidos:**
1. **Depuración de Máquinas de Estado** - Rastreo de transiciones de estado y manejo de casos límite
2. **Estado de Sesión vs. Total** - Diferentes contextos de UI necesitan diferentes representaciones de datos
3. **Retroalimentación en Tiempo Real al Usuario** - Registro en consola para desarrollo y depuración
4. **Pruebas Automatizadas** - Construcción de suites de pruebas para gestión de estado compleja
5. **Patrones de Límite de Error** - Manejo elegante de errores de localStorage y serialización

#### **🔄 Arquitectura Actual del Estado del Pedido:**
```javascript
// Estructura del objeto de pedido
{
  id: 'ORD-XXXXX',
  state: 'building' | 'submitted' | 'editing',
  items: [],        // Artículos en construcción (estado building)
  originalItems: [], // Artículos del envío inicial
  editItems: [],    // Artículos agregados durante sesiones de edición
  payment: { method, isLocked, lastFour },
  gratuity: 15,     // Porcentaje de propina
  createdAt: '2025-11-09T...',
  submittedAt: '2025-11-09T...' | null
}
```

---

### **9 de Noviembre de 2025 - Implementación de OrderManager**

#### **🎯 Objetivo de Aprendizaje:** Implementar gestión persistente del estado de pedidos con arquitectura adecuada

#### **Cambios Realizados:**

1. **Clase de Utilidad OrderManager:**
   - Se creó un sistema integral de gestión de pedidos
   - **Archivo creado:** `app/lib/orderManager.js`
   - **Características:** Creación de pedidos, gestión de artículos, manejo de pagos, persistencia de estado
   - **Patrón de código aprendido:**
     ```javascript
     // Métodos de clase estáticos para operaciones de utilidad
     export class OrderManager {
       static generateOrderId() { ... }
       static getOrder(orderId) { ... }
       static addItems(orderId, items, isEditMode) { ... }
     }
     ```

2. **Integración de Almacenamiento Persistente:**
   - Se usa localStorage para la persistencia de pedidos entre sesiones del navegador
   - Los datos del pedido sobreviven a recargas de página y navegación
   - **Patrón de código aprendido:**
     ```javascript
     // Uso seguro de localStorage con manejo de errores
     try {
       localStorage.setItem(`order-${orderId}`, JSON.stringify(orderData));
     } catch (error) { console.error('Error saving:', error); }
     ```

3. **Seguimiento de Pedidos Basado en URL:**
   - Los pedidos se rastrean mediante parámetros de URL `?order=ORD-XXXXX`
   - Generación automática de ID de pedido y actualización de URL
   - **Patrón de código aprendido:**
     ```javascript
     // Gestión de estado por URL con router
     const params = new URLSearchParams(searchParams);
     params.set('order', orderId);
     router.replace(`/order?${params.toString()}`, { scroll: false });
     ```

4. **Arquitectura del Estado del Pedido:**
   - **Estados:** `building` → `submitted` → `editing`
   - **Seguimiento de artículos:** Arrays separados para artículos originales vs. artículos de edición
   - **Bloqueo de pago:** Previene cambios después del envío inicial
   - **Patrón de código aprendido:**
     ```javascript
     // Gestión de artículos basada en estado
     if (isEditMode && order.state === 'submitted') {
       order.editItems = [...order.editItems, ...itemsToAdd];
       order.state = 'editing';
     }
     ```

5. **Actualizaciones de Integración de Componentes:**
   - **Página de Pedido:** Se integró OrderManager para adición de artículos y estado
   - **Página de Pago:** Datos reales de pedido en lugar de datos simulados
   - **Página de Resumen:** Visualización en vivo del pedido con funcionalidad de edición
   - **ProductItem:** Se agregaron controles de cantidad con botones +/-
   - **Navigation:** ID de pedido pasado a través de todos los enlaces de navegación

6. **Herramientas de Desarrollo:**
   - **Archivo creado:** `app/components/DevPanel.js`
   - Depuración y gestión de pedidos en tiempo real
   - Funcionalidad para borrar todos los pedidos para pruebas

#### **🎓 Conceptos Clave Aprendidos:**
1. **Métodos de Clase Estáticos** - Clases de utilidad con métodos estáticos para operaciones compartidas
2. **API de localStorage** - Almacenamiento persistente del lado del cliente con manejo de errores
3. **Gestión de Estado por URL** - Uso del router para gestionar el estado de la aplicación mediante URLs
4. **Máquinas de Estado** - Gestión del ciclo de vida del pedido con transiciones de estado definidas
5. **React useEffect** - Gestión de efectos secundarios para carga de pedidos y actualizaciones de URL
6. **Controles de Cantidad** - Componentes de UI interactivos con gestión de estado

#### **🔄 Flujo de Usuario Mejorado:**
- **Creación de Pedido:** Generación automática de ID y seguimiento por URL
- **Gestión de Artículos:** Selección de cantidad con estado persistente del carrito
- **Modo de Edición:** Separación adecuada de artículos originales vs. artículos de edición
- **Bloqueo de Pago:** Estado de pago seguro después del envío
- **Estado entre Páginas:** Los datos del pedido persisten en todas las páginas

---

### **8 de Noviembre de 2025 - Implementación del Sistema de Estado de Edición**

#### **🎯 Objetivo de Aprendizaje:** Implementar gestión de estado basada en URL y renderizado condicional de UI

#### **Cambios Realizados:**

1. **Actualización de la Estructura de URL:**
   - Se cambió la página principal de `/` a `/order` para un enrutamiento más claro
   - Se agregó redirección de `/` a `/order` para compatibilidad retroactiva
   - **Archivos modificados:** `app/page.js` (redirección), `app/order/page.js` (nueva página principal)

2. **Sistema de Estado de Edición:**
   - Se implementó el parámetro de consulta `?edit` para gestión de estado
   - Se agregó el hook `useSearchParams()` para detectar el modo de edición
   - **Archivos modificados:** `app/order/page.js`, `app/checkout/page.js`
   - **Patrón de código aprendido:**
     ```javascript
     const searchParams = useSearchParams();
     const isEditMode = searchParams.get('edit') !== null;
     ```

3. **Arquitectura de Paso de Props:**
   - Se actualizó el componente Navigation para recibir el prop `isEditMode`
   - Se aprendió sobre el principio de "los datos fluyen hacia abajo" de React
   - **Archivos modificados:** `app/components/Navigation.js`
   - **Patrón de código aprendido:**
     ```javascript
     // Definición de componente con props
     export default function Navigation({ currentPage, isEditMode = false }) {
     
     // Pasando props desde el padre
     <Navigation currentPage="order" isEditMode={isEditMode} />
     ```

4. **Operadores Ternarios para UI Condicional:**
   - Se implementó renderizado condicional basado en el estado de edición
   - Se aprendió la sintaxis y uso del operador ternario en JSX
   - **Patrones de código aprendidos:**
     ```javascript
     // Contenido de texto condicional
     {isEditMode ? 'Edit Order - Add Items' : 'Menu'}
     
     // URLs condicionales con preservación de estado
     href={isEditMode ? "/order?edit" : "/order"}
     
     // Texto de botón condicional
     {isEditMode ? 'Add Items' : 'Checkout'}
     ```

5. **Actualizaciones de Botones de la Página de Resumen:**
   - Se actualizaron los botones de navegación para usar URLs con estado de edición
   - **Archivo modificado:** `app/summary/page.js`
   - **Enlaces actualizados:** "Edit Order" → `/order?edit`, "Change Payment" → `/checkout?edit`

#### **🐛 Sesión de Depuración:**
- **Problema:** La navegación mostraba un valor incorrecto de `isEditMode` en la página de pago
- **Solución:** Se agregó depuración con console.log para rastrear el paso de props
- **Aprendizaje:** Cómo depurar sistemáticamente problemas de flujo de props en React

#### **🎓 Conceptos Clave Aprendidos:**
1. **Parámetros de Consulta en URL** - Uso de `useSearchParams()` para leer el estado de la URL
2. **Props de React** - Pasar datos de componentes padre a hijo
3. **Operadores Ternarios** - `condición ? valorSiVerdadero : valorSiFalso` para renderizado condicional
4. **Preservación de Estado** - Mantener el estado a través de la navegación entre páginas mediante URLs
5. **Técnicas de Depuración** - Uso de console.log para rastrear el flujo de datos en React

#### **🔄 Flujo de Usuario Ahora Funcional:**
- **Normal:** `/order` → `/checkout` → `/summary`
- **Edición:** `/summary` → "Edit Order" → `/order?edit` → "Add Items" → `/checkout?edit`
- **Navegación:** Los botones de retroceso preservan el estado de edición a lo largo del flujo
