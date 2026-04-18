const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: 'smtp-relay.brevo.com',
  port: 587,
  secure: false, 
  auth: {
    user: process.env.MAIL_USER || '',
    pass: process.env.MAIL_PASS || ''
  },
  tls: {
    rejectUnauthorized: false
  }
});

const verificarConexion = async () => {
  try {
    await transporter.verify();
    console.log('Servicio de correo configurado correctamente');
    return true;
  } catch (error) {
    console.error('Error en configuración de correo:', error.message);
    return false;
  }
};

async function enviarNotificacionEstado(cliente, pedido, estadoAnterior, comentarios) {
  try {
    const mensajes = {
      'pendiente': {
        asunto: '✅Pedido Recibido',
        mensaje: 'Tu pedido ha sido recibido y está pendiente de procesamiento.'
      },
      'en proceso': {
        asunto: '🔄Pedido en Proceso',
        mensaje: 'Tu pedido está siendo procesado. Pronto estará listo.'
      },
      'entregado': {
        asunto: '🎉Pedido Entregado',
        mensaje: '¡Tu pedido ha sido entregado! Esperamos que disfrutes tu compra.'
      }
    };

    const info = mensajes[pedido.estado] || mensajes['pendiente'];

    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #2563eb; color: white; padding: 20px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
          .pedido-info { background: white; padding: 15px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #2563eb; }
          .estado { display: inline-block; padding: 5px 10px; border-radius: 5px; font-weight: bold; }
          .estado-pendiente { background: #fef3c7; color: #92400e; }
          .estado-proceso { background: #dbeafe; color: #1e40af; }
          .estado-entregado { background: #d1fae5; color: #065f46; }
          .footer { text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb; font-size: 12px; color: #6b7280; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h2> Sistema de Seguimiento de Pedidos</h2>
          </div>
          <div class="content">
            <h3>Hola ${cliente.nombre},</h3>
            <p>${info.mensaje}</p>
            
            <div class="pedido-info">
              <h4>Detalles del Pedido:</h4>
              <p><strong>Número de pedido:</strong> ${pedido.numero_pedido}</p>
              <p><strong>Fecha:</strong> ${new Date(pedido.fecha_pedido).toLocaleDateString('es-CL')}</p>
              <p><strong>Estado anterior:</strong> ${estadoAnterior}</p>
              <p><strong>Estado actual:</strong> ${pedido.estado}</p>
              ${comentarios ? `<p><strong>Comentarios:</strong> ${comentarios}</p>` : ''}
              <p><strong>Detalle del pedido:</strong></p>
              <p>${pedido.detalle_pedido || 'Sin detalles adicionales'}</p>
            </div>
            
            <p>¡Gracias por confiar en nosotros!</p>
          </div>
          <div class="footer">
            <p>Este es un correo automático, por favor no responder.</p>
          </div>
        </div>
      </body>
      </html>
    `;

    const infoCorreo = await transporter.sendMail({
      from: `"Sistema de Pedidos" <${process.env.MAIL_DOM || 'notificaciones@sistema.com'}>`,
      to: cliente.email,
      subject: `${info.asunto} - Pedido #${pedido.numero_pedido}`,
      html: htmlContent,
      text: `
        Hola ${cliente.nombre},
        
        ${info.mensaje}
        
        Detalles del Pedido:
        - Número: ${pedido.numero_pedido}
        - Fecha: ${new Date(pedido.fecha_pedido).toLocaleDateString('es-CL')}
        - Estado: ${pedido.estado}
        ${comentarios ? `- Comentarios: ${comentarios}` : ''}
        - Detalle: ${pedido.detalle_pedido || 'Sin detalles'}
        
        ¡Gracias por confiar en nosotros!
      `
    });

    console.log(`Correo enviado a ${cliente.email} - Estado: ${pedido.estado} - ID: ${infoCorreo.messageId}`);
    return { success: true, messageId: infoCorreo.messageId };
  } catch (error) {
    console.error('Error al enviar correo:', error.message);
    return { success: false, error: error.message };
  }
}

module.exports = {
  enviarNotificacionEstado,
  verificarConexion
};