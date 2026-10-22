import { driver } from 'driver.js'
import type { Driver } from 'driver.js'
import 'driver.js/dist/driver.css'

// RUTA A: Aprender desde Cero (Pedagogía Conceptual y Registros Semióticos)
export const initRouteATour = (): Driver => {
  const driverObj = driver({
    showProgress: true,
    animate: true,
    allowClose: true,
    stagePadding: 6,
    stageRadius: 0,
    popoverClass: 'derivlab-driver-popover',
    nextBtnText: 'Siguiente →',
    prevBtnText: '← Anterior',
    doneBtnText: 'Finalizar Ruta A',
    progressText: 'Paso {{current}} de {{total}}',
    disableActiveInteraction: false,
    onDestroyStarted: () => {
      localStorage.setItem('derivlab_tutorial_v1', 'completed')
      driverObj.destroy()
    },
    steps: [
      {
        element: '#step-parametric-controls',
        popover: {
          title: 'Paso 1: Sensibilidad Paramétrica y Acoplamiento Bidireccional',
          description: 'Ajusta los coeficientes (a, b, c) o modifica el vértice naranja V*. La curva cartesiana se deforma en tiempo real respetando la Teoría de Registros Semióticos de Duval. Al mover un parámetro, el tutorial avanzará automáticamente.',
          side: 'top',
          align: 'start'
        },
        disableActiveInteraction: false,
        onHighlighted: () => {
          const container = document.getElementById('step-parametric-controls')
          if (!container) return
          
          const handleInputOnce = () => {
            container.removeEventListener('input', handleInputOnce)
            setTimeout(() => {
              if (driverObj.isActive() && driverObj.getActiveIndex() === 0) {
                driverObj.moveNext()
              }
            }, 600)
          }

          container.addEventListener('input', handleInputOnce, { once: true })
        }
      },
      {
        element: '#step-synchronized-graphs',
        popover: {
          title: 'Paso 2: Conversión Semiótica Total vs. Marginal',
          description: 'Fig. 1 traza la Función Total f(x) con el nodo de evaluación P y el vértice V*. En Fig. 2 se proyecta en sincronía estricta la Función Marginal f\'(x), mostrando que el cruce con el eje horizontal f\'(x)=0 coincide con el valor óptimo.',
          side: 'top',
          align: 'start'
        }
      },
      {
        element: '#step-limit-control',
        popover: {
          title: 'Paso 3: Paso al Límite Diferencial (lim Δx → 0)',
          description: 'Haz clic en "Ejecutar paso al límite Δx→0". La animación mecánica reduce el incremento de la secante bermellón hasta fundirse con la recta tangente verde esmeralda (derivada instantánea).',
          side: 'bottom',
          align: 'end'
        },
        disableActiveInteraction: false
      },
      {
        element: '#step-algebraic-lock',
        popover: {
          title: 'Paso 4: Hoja de Resolución y Validación Formal',
          description: 'Supera las 3 Etapas analíticas (Axioma de Regla, Derivación Término a Término y Condición f\'=0). En "Modo Reto Estudiante", el andamiaje didáctico oculta la solución hasta que completes formalmente estos pasos.',
          side: 'left',
          align: 'start'
        }
      }
    ]
  })

  return driverObj
}

// RUTA B: Tour Rápido Modo Libre (Pizarra de Borrador + Gráfico en Vivo)
export const initRouteBTour = (): Driver => {
  const driverObj = driver({
    showProgress: true,
    animate: true,
    allowClose: true,
    stagePadding: 6,
    stageRadius: 0,
    popoverClass: 'derivlab-driver-popover',
    nextBtnText: 'Siguiente →',
    prevBtnText: '← Anterior',
    doneBtnText: '¡Entendido!',
    progressText: 'Paso {{current}} de {{total}}',
    disableActiveInteraction: false,
    onDestroyStarted: () => {
      localStorage.setItem('derivlab_tutorial_v1', 'completed')
      driverObj.destroy()
    },
    steps: [
      {
        element: '#step-free-mode',
        popover: {
          title: 'Paso 1: Ejercicio Empresarial y Respuesta Directa',
          description: 'Selecciona cualquiera de los 20 problemas en la barra superior. Lee la función a derivar y escribe tu respuesta en la caja. Si el problema tiene máximo o mínimo, completa también el punto donde da 0.',
          side: 'bottom',
          align: 'center'
        }
      },
      {
        element: '#step-whiteboard',
        popover: {
          title: 'Paso 2: Pizarra de Borrador',
          description: 'Usa este espacio libre para hacer tus operaciones y bocetos a mano antes de escribir tu respuesta definitiva.',
          side: 'right',
          align: 'start'
        }
      },
      {
        element: '#step-graphing-calc',
        popover: {
          title: 'Paso 3: Gráfico en Vivo Automático',
          description: 'A medida que escribes tu derivada, se dibuja automáticamente en verde en tiempo real sobre la curva azul. Puedes acercar, alejar y mover el punto sobre la curva con el control inferior.',
          side: 'left',
          align: 'start'
        }
      }
    ]
  })

  return driverObj
}

export const startTutorial = (route: 'A' | 'B' = 'A', force = false) => {
  if (!force && localStorage.getItem('derivlab_tutorial_v1') === 'completed') {
    return
  }
  const d = route === 'B' ? initRouteBTour() : initRouteATour()
  d.drive()
}
