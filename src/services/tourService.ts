import { driver } from 'driver.js'
import type { Driver } from 'driver.js'
import 'driver.js/dist/driver.css'

let tourDriverInstance: Driver | null = null

export const initTour = (): Driver => {
  if (tourDriverInstance) {
    return tourDriverInstance
  }

  const driverObj = driver({
    showProgress: true,
    animate: true,
    allowClose: true,
    stagePadding: 6,
    stageRadius: 0,
    popoverClass: 'derivlab-driver-popover',
    nextBtnText: 'Siguiente →',
    prevBtnText: '← Anterior',
    doneBtnText: 'Finalizar Tutorial',
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
          description: 'Ajusta los deslizadores (a, b, c) o los campos numéricos. La curva cartesiana se deforma en tiempo real respetando la Teoría de Registros Semióticos de Duval. Al mover un parámetro, el tutorial avanzará automáticamente.',
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

  tourDriverInstance = driverObj
  return driverObj
}

export const startTutorial = (force = false) => {
  if (!force && localStorage.getItem('derivlab_tutorial_v1') === 'completed') {
    return
  }
  const d = initTour()
  d.drive()
}
