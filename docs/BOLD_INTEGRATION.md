# Estudio Bold.co — Integracion de Pagos

## Resumen

Bold.co es una pasarela de pagos colombiana que soporta tarjetas (nacionales e internacionales), PSE, Nequi y Daviplata. Katherin ya tiene un flujo establecido con Bold.

Portal de desarrolladores: [developers.bold.co](https://www.developers.bold.co/)

---

## APIs Disponibles

| API | Uso | Relevancia |
|-----|-----|------------|
| **Pagos en Linea** | Procesar pagos desde web/app | Principal |
| **Link de Pagos** | Generar links de pago programaticamente | Secundario (WhatsApp/email) |
| **Webhooks** | Recibir notificaciones de estado de pago | Principal |
| API Integrations | Integracion POS/datafono | No aplica |

---

## Metodos de Pago Soportados

| Metodo | Comision | Notas |
|--------|----------|-------|
| Tarjetas credito/debito (nacionales) | ~2.89% + $300 COP | Base |
| Tarjetas internacionales | Base + 1% | Recargo adicional |
| PSE | 2.89-3.49% + $300 COP | Debito directo bancario |
| Nequi | 1.50% | Billetera digital |
| Daviplata | 1.50% | Billetera digital |

- Tarifas no incluyen IVA ni retenciones externas
- Liquidacion: siguiente dia habil (gratis) o instantanea con cuenta Bold

---

## Formas de Integracion

### 1. Boton de Pago (Embed)
Script tag con parametros. La opcion mas simple.
```html
<script src="bold-checkout.js" data-render-mode="embedded" ...></script>
```

### 2. API Directa (Sin redirect)
POST a `/payments/app-checkout`. El cliente no sale del sitio.
Requiere consciencia de PCI DSS.

### 3. Link de Pagos (API)
Genera links compartibles via WhatsApp/email. Redirect a pagina hosted de Bold.

**Recomendacion para el proyecto**: API Directa para la mejor UX en compra de cursos.

---

## Sandbox / Testing

Bold provee un ambiente sandbox completo:
- API keys separadas para sandbox
- Simulacion de transacciones sin dinero real
- Forzar escenarios de 3DS y fraud engine con montos especificos
- Webhooks configurables como tipo "Sandbox"

---

## Pagos Recurrentes / Suscripciones

**LIMITACION CRITICA**: Bold **no soporta pagos recurrentes nativos** via API.

Bold recomienda tokenizar informacion del pagador y disparar cobros recurrentes manualmente. Estan desarrollando APIs independientes para recurrentes/membresías, pero no estan disponibles aun.

### Estrategias para Suscripciones

#### Opcion A: Bold + Logica Propia
- Tokenizar tarjeta en primer pago via Bold
- Convex scheduled jobs para cobros mensuales
- Manejar reintentos, pagos fallidos, cancelaciones
- **Pro**: Un solo proveedor, menor complejidad comercial
- **Contra**: Mas desarrollo, riesgo de compliance con tokenizacion

#### Opcion B: Bold (compras) + Wompi (suscripciones)
- Bold para compras individuales de cursos
- Wompi (Bancolombia) para suscripciones recurrentes
- **Pro**: Cada proveedor en lo que es fuerte, menos riesgo
- **Contra**: Dos integraciones de pago, dos dashboards, dos reconciliaciones

#### Opcion C: Solo Wompi
- Wompi para todo (compras + suscripciones)
- **Pro**: Una sola integracion, suscripciones nativas
- **Contra**: Katherin ya tiene flujo con Bold, cambio de proveedor

#### Opcion D: Cobro Manual con Bold
- Generar link de pago mensual via API de Bold
- Enviar por email con Resend
- **Pro**: Simple, sin tokenizacion
- **Contra**: Mala UX, depende de accion del cliente, mayor churn

### Recomendacion

**Opcion B** es la mas robusta: Bold para compras individuales (Katherin ya lo usa) + Wompi para suscripciones (soporte nativo). Evaluar en cotizacion el costo de doble integracion vs simplificacion con Opcion C.

---

## Webhooks

- Hasta 5 URLs registrables
- Configuracion separada sandbox/produccion
- Eventos de cambio de estado de transaccion
- Verificacion de firma para seguridad

---

## Consideraciones Regulatorias

- Facturacion electronica: evaluar integracion con DIAN (requerimiento colombiano)
- Politica de reembolsos: definir con Katherin
- Retencion en la fuente: Bold maneja retenciones segun tipo de contribuyente
