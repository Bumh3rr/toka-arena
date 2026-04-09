// src/pages/TestPage.tsx
import { useState } from 'react';
import axios from 'axios';

const BASE_URL = 'http://talentland-toka.eastus2.cloudapp.azure.com';
const APP_ID = '3500020265523984'; // reemplaza con tu App ID
const MERCHANT_CODE = '30100'; // exactamente 5 caracteres - ajusta al tuyo

interface PaymentState {
  paymentId: string | null;
  paymentUrl: string | null;
  status: 'idle' | 'creating' | 'paying' | 'success' | 'fail' | 'checking';
  result: Record<string, unknown> | null;
  error: string | null;
}

export default function TestPage() {
  const [amount, setAmount] = useState('100');
  const [title, setTitle] = useState('Poción Vida - Toka Arena');
  const [payment, setPayment] = useState<PaymentState>({
    paymentId: null,
    paymentUrl: null,
    status: 'idle',
    result: null,
    error: null,
  });

  const token = 'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMDEwMDAwMDEwOTk1NjY0IiwianRpIjoiMjI5OTdkODUtYmUxOS00MTM0LTlhMzAtNmEwOGFiNjE5NjhjIiwiZXhwIjoxNzc1NzIyNzkzfQ.HoTg3d82X1XXNVg6U6am_mvla_kCwE9Zigjz-hSSfntRoqX5-ZIcUacaVvFhr0qRfekVBoaNW_ZslVPyhntokyGMY72NWaP-kQYLSADB7htboZjQKz_lMzlqF5cFPo6tBRbupxAgFXKdcgdWenGzW5xuZTVAJmjsdp02res__6Q0xQhQi__482ZqGb7Iv7tel7p7PCPY20zWWXUG1ngmLSVVlIwbmEaP0fGBkSCy4HiHK82cmziUQeh7_sm9KaJ8rHxHIOl2AcTXch_7Iem-pD3ahr2BhTarLqlXn0zpVE0X2vUpxt0CyHaBrYvuGY9QIGItd6WZlUVQctSuu3HqnQ';

  // 1. Crear orden de pago
  const createPayment = async () => {
    if (!token) {
      setPayment(p => ({ ...p, error: 'No hay JWT. Autentícate primero.' }));
      return;
    }

    setPayment(p => ({ ...p, status: 'creating', error: null }));

    try {
      const res = await axios.post(
        `${BASE_URL}/v1/payment/create`,
        {
          userId: localStorage.getItem('toka_user_id') || '0000000000000000',
          orderTitle: title,
          orderAmount: { value: amount, currency: 'MXN' },
        },
        {
          headers: {
            'X-App-Id': APP_ID,
            'Authorization': `Bearer ${token}`,
            'Alipay-MerchantCode': MERCHANT_CODE,
          },
        }
      );

      const { paymentId, paymentUrl } = res.data.data;
      console.info('Pago creado:', paymentId, paymentUrl);

      setPayment(p => ({
        ...p,
        paymentId,
        paymentUrl,
        status: 'paying',
        error: null,
      }));

      // 2. Ejecutar pago en Mini Program
      triggerPayment(paymentUrl);

    } catch (err) {
      console.error('Error creando pago:', err);
      setPayment(p => ({ ...p, status: 'fail', error: 'Error al crear la orden de pago.' }));
    }
  };

  // 2. Enviar paymentUrl al Mini Program via postMessage
  const triggerPayment = (paymentUrl: string) => {
    console.info('Enviando paymentUrl al Mini Program:', paymentUrl);

    // Escuchar respuesta del Mini Program
    const handler = (e: MessageEvent) => {
      const data = typeof e.data === 'string' ? JSON.parse(e.data) : e.data;

      if (data?.type === 'PAY_SUCCESS') {
        window.removeEventListener('message', handler);
        console.info('PAY_SUCCESS recibido:', data);
        setPayment(p => ({ ...p, status: 'success', result: data }));
      } else if (data?.type === 'PAY_FAIL') {
        window.removeEventListener('message', handler);
        console.error('PAY_FAIL recibido:', data);
        setPayment(p => ({ ...p, status: 'fail', error: 'El pago fue rechazado o cancelado.', result: data }));
      }
    };

    window.addEventListener('message', handler);

    // Postmessage al Mini Program
    if (window.my) {
      window.my.postMessage({ type: 'PAY', paymentUrl });
    } else {
      // Fallback para desarrollo en browser — abre URL directamente
      console.warn('window.my no disponible, abriendo URL directamente');
      window.open(paymentUrl, '_blank');
    }
  };

  // 3. Consultar estado del pago manualmente
  const checkPayment = async () => {
    if (!payment.paymentId || !token) return;

    setPayment(p => ({ ...p, status: 'checking' }));

    try {
      const res = await axios.post(
        `${BASE_URL}/v1/payment/inquiry`,
        { paymentId: payment.paymentId },
        {
          headers: {
            'X-App-Id': APP_ID,
            'Authorization': `Bearer ${token}`,
          },
        }
      );

      console.info('Estado del pago:', res.data.data);
      setPayment(p => ({
        ...p,
        status: res.data.data.paymentStatus === 'SUCCESS' ? 'success' : 'fail',
        result: res.data.data,
      }));

    } catch (err) {
      console.error('Error consultando pago:', err);
      setPayment(p => ({ ...p, error: 'Error consultando el estado del pago.' }));
    }
  };

  // 4. Cancelar pago
  const closePayment = async () => {
    if (!payment.paymentId || !token) return;

    try {
      await axios.post(
        `${BASE_URL}/v1/payment/close`,
        { paymentId: payment.paymentId },
        {
          headers: {
            'X-App-Id': APP_ID,
            'Authorization': `Bearer ${token}`,
          },
        }
      );

      console.info('Pago cancelado');
      setPayment(p => ({ ...p, status: 'idle', paymentId: null, paymentUrl: null, result: null }));

    } catch (err) {
      console.error('Error cancelando pago:', err);
    }
  };

  const statusColor: Record<string, string> = {
    idle: '#888',
    creating: '#F97316',
    paying: '#3D99FF',
    checking: '#F97316',
    success: '#43A047',
    fail: '#e53935',
  };

  const statusLabel: Record<string, string> = {
    idle: 'Sin orden',
    creating: 'Creando orden...',
    paying: 'Esperando pago...',
    checking: 'Consultando...',
    success: 'Pago exitoso',
    fail: 'Pago fallido',
  };

  return (
    <div style={{
      padding: '24px',
      fontFamily: 'Nunito, sans-serif',
      maxWidth: '480px',
      margin: '0 auto',
      color: '#3D2B1F',
    }}>
      <h2 style={{ fontFamily: 'Fredoka, sans-serif', color: '#F97316', marginBottom: '24px' }}>
        Test de Pagos — Toka Arena
      </h2>

      {/* Estado actual */}
      <div style={{
        background: '#FFF8E7',
        border: '2.5px solid #3D2B1F',
        borderRadius: '12px',
        padding: '16px',
        marginBottom: '24px',
      }}>
        <p style={{ margin: 0 }}>
          Estado:{' '}
          <strong style={{ color: statusColor[payment.status] }}>
            {statusLabel[payment.status]}
          </strong>
        </p>
        {payment.paymentId && (
          <p style={{ margin: '8px 0 0', fontSize: '12px', wordBreak: 'break-all' }}>
            ID: <code>{payment.paymentId}</code>
          </p>
        )}
        {payment.error && (
          <p style={{ margin: '8px 0 0', color: '#e53935', fontSize: '13px' }}>
            {payment.error}
          </p>
        )}
      </div>

      {/* Formulario */}
      <div style={{ marginBottom: '16px' }}>
        <label style={{ display: 'block', marginBottom: '4px', fontWeight: 700 }}>
          Título de la orden
        </label>
        <input
          value={title}
          onChange={e => setTitle(e.target.value)}
          style={{
            width: '100%',
            padding: '10px',
            border: '2px solid #3D2B1F',
            borderRadius: '8px',
            fontFamily: 'Nunito, sans-serif',
            boxSizing: 'border-box',
          }}
        />
      </div>

      <div style={{ marginBottom: '24px' }}>
        <label style={{ display: 'block', marginBottom: '4px', fontWeight: 700 }}>
          Monto (MXN)
        </label>
        <input
          type="number"
          value={amount}
          onChange={e => setAmount(e.target.value)}
          style={{
            width: '100%',
            padding: '10px',
            border: '2px solid #3D2B1F',
            borderRadius: '8px',
            fontFamily: 'Nunito, sans-serif',
            boxSizing: 'border-box',
          }}
        />
      </div>

      {/* Botones */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        <button
          onClick={createPayment}
          disabled={payment.status === 'creating' || payment.status === 'paying'}
          style={{
            background: '#F97316',
            color: '#fff',
            border: '2.5px solid #3D2B1F',
            borderRadius: '12px',
            padding: '14px',
            fontFamily: 'Fredoka, sans-serif',
            fontSize: '16px',
            cursor: 'pointer',
            opacity: payment.status === 'creating' || payment.status === 'paying' ? 0.6 : 1,
          }}
        >
          Crear orden y pagar
        </button>

        <button
          onClick={checkPayment}
          disabled={!payment.paymentId || payment.status === 'checking'}
          style={{
            background: '#6B9E45',
            color: '#fff',
            border: '2.5px solid #3D2B1F',
            borderRadius: '12px',
            padding: '14px',
            fontFamily: 'Fredoka, sans-serif',
            fontSize: '16px',
            cursor: 'pointer',
            opacity: !payment.paymentId ? 0.4 : 1,
          }}
        >
          Consultar estado del pago
        </button>

        <button
          onClick={closePayment}
          disabled={!payment.paymentId}
          style={{
            background: '#FFF8E7',
            color: '#3D2B1F',
            border: '2.5px solid #3D2B1F',
            borderRadius: '12px',
            padding: '14px',
            fontFamily: 'Fredoka, sans-serif',
            fontSize: '16px',
            cursor: 'pointer',
            opacity: !payment.paymentId ? 0.4 : 1,
          }}
        >
          Cancelar orden
        </button>
      </div>

      {/* Resultado raw */}
      {payment.result && (
        <div style={{
          marginTop: '24px',
          background: '#1A1433',
          color: '#43A047',
          borderRadius: '12px',
          padding: '16px',
          fontSize: '12px',
          overflowX: 'auto',
        }}>
          <pre style={{ margin: 0 }}>
            {JSON.stringify(payment.result, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
}