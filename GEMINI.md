# Reglas de Proyecto: DerivLab Empresarial

Este documento establece las directrices arquitectónicas, pedagógicas y de diseño de cumplimiento obligatorio para todos los agentes y desarrolladores que interactúen con el proyecto **DerivLab Empresarial**.

---

## 1. Restricciones Matemáticas y Curriculares Estrictas

- **PROHIBICIÓN TOTAL DE FUNCIONES TRIGONOMÉTRICAS Y LOGARÍTMICAS:**
  - Queda terminantemente prohibido incluir funciones o ejercicios con $\sin(x)$, $\cos(x)$, $\tan(x)$, $\sec(x)$, $\csc(x)$, $\cot(x)$, así como logaritmos naturales $\ln(x)$ o en cualquier otra base $\log_a(x)$.
  - El currículo está enfocado exclusivamente en estudiantes de 5.º y 6.º de secundaria en el ámbito de **Matemáticas Empresariales**.

- **ENFOQUE EXCLUSIVO EN MATEMÁTICAS EMPRESARIALES:**
  Todos los casos, fórmulas y simulaciones deben pertenecer a las siguientes categorías:
  1. **Análisis Marginal:**
     - Función de Costo Total $C(x)$ y Costo Marginal $C'(x) = \frac{dC}{dx}$.
     - Función de Ingreso Total $I(x) = p(x) \cdot x$ e Ingreso Marginal $I'(x)$.
     - Función de Utilidad $U(x) = I(x) - C(x)$ y Utilidad Marginal $U'(x)$.
  2. **Criterio de la Segunda Derivada y Concavidad:**
     - Concavidad hacia arriba ($f''(x) > 0$, costo mínimo).
     - Concavidad hacia abajo ($f''(x) < 0$, utilidad máxima).
     - Puntos de inflexión y rendimientos decrecientes.
  3. **Lote Económico de Pedido (EOQ - Economic Order Quantity):**
     - Funciones con exponentes negativos $x^{-1}$ y regla del cociente:
       $$CT(Q) = \frac{D \cdot S}{Q} + \frac{H \cdot Q}{2} = D \cdot S \cdot Q^{-1} + \frac{H}{2} \cdot Q$$
  4. **Interés Compuesto Continuo y Crecimiento/Depreciación:**
     - Funciones exponenciales en base $e$ con regla de la cadena:
       $$V(t) = P \cdot e^{kt} \implies V'(t) = k \cdot P \cdot e^{kt}$$

---

## 2. Flujo Pedagógico: "Candado Analítico" de 3 Pasos

Para garantizar el aprendizaje significativo y evitar que la simulación sea un mero juguete pasivo, **la simulación interactiva siempre debe estar bloqueada** hasta que el estudiante complete satisfactoriamente los siguientes 3 pasos en orden:

```
[ Paso 1: Elegir Regla ] ──▶ [ Paso 2: Derivar Término a Término ] ──▶ [ Paso 3: Hallar Punto Crítico f'(x)=0 ] ──▶ [ DESBLOQUEO SIMULADOR ]
```

1. **Paso 1: Identificación de la Regla de Derivación:**
   - El estudiante selecciona la regla aplicable (Regla de la Potencia, Regla de la Constante, Regla de la Suma/Resta, Regla del Producto, Regla del Cociente, Regla de la Cadena / Exponencial $e^u$).
2. **Paso 2: Derivación Analítica Término a Término:**
   - El estudiante completa o valida algebraicamente cada término derivado con retroalimentación inmediata.
3. **Paso 3: Localización del Punto Crítico:**
   - Se plantea la ecuación $f'(x) = 0$ y se despeja el valor óptimo (ej. cantidad de producción óptima $x^*$, costo mínimo o punto de equilibrio marginal).
4. **Desbloqueo y Celebración:**
   - Solo al completar los 3 pasos se desbloquean los controles interactivos del gráfico (sliders táctiles, proyecciones en tiempo real) junto con sonido de logro y animación de confetti.

---

## 3. Principios de Diseño: Mobile-First y 100% Táctil

- **Optimización para Teléfonos Inteligentes:**
  - Todo componente debe diseñarse y probarse prioritariamente para pantallas móviles de ancho reducido (360px a 430px).
  - Áreas táctiles mínimas de 48px $\times$ 48px para botones, pestañas y sliders (Touch Target Guidelines WCAG 2.1).
  - Tipografía legible sin necesidad de zoom (`text-base` o superior en inputs, `text-sm` como mínimo absoluto para notas).
  - Cero hover dependency: Todas las interacciones deben responder a eventos táctiles (`tap`, `drag`, `touch`).
- **Renderizado Matemático Nítido:**
  - Uso de KaTeX para expresiones matemáticas legibles en pantallas Retina/OLED móviles.
- **Acceso Local Rápido:**
  - Servidor Vite configurado con `host: true` y plugin de código QR para prueba instantánea desde el celular conectado a la red Wi-Fi local.
