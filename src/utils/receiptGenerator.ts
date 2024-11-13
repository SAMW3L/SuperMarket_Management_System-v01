import { Sale } from '../types';

export function generateReceipt(
  sale: Sale,
  storeInfo: any,
  receiptSettings: any
): string {
  const date = new Date(sale.timestamp).toLocaleString();
  
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <style>
          body { font-family: monospace; line-height: 1.4; padding: 20px; }
          .header { text-align: center; margin-bottom: 20px; }
          .divider { border-top: 1px dashed #000; margin: 10px 0; }
          .total { font-weight: bold; margin-top: 10px; }
          .footer { text-align: center; margin-top: 20px; font-size: 0.9em; }
          .logo { max-width: 200px; max-height: 100px; margin-bottom: 10px; }
        </style>
      </head>
      <body>
        <div class="header">
          ${receiptSettings.showLogo && receiptSettings.logo ? 
            `<img src="${receiptSettings.logo}" alt="Store Logo" class="logo" />` : ''}
          <h2>${storeInfo.name}</h2>
          <p>${storeInfo.address}</p>
          <p>Tel: ${storeInfo.phone}</p>
          ${storeInfo.taxId ? `<p>Tax ID: ${storeInfo.taxId}</p>` : ''}
        </div>

        <div class="divider"></div>

        <p>Date: ${date}</p>
        ${receiptSettings.printOrderId ? `<p>Order ID: ${sale.id}</p>` : ''}
        <p>Payment Method: ${sale.paymentMethod}</p>
        <p>Served by: ${sale.employeeName}</p>

        <div class="divider"></div>

        <table style="width: 100%">
          <tr>
            <th style="text-align: left">Item</th>
            <th style="text-align: right">Qty</th>
            <th style="text-align: right">Price</th>
            <th style="text-align: right">Total</th>
          </tr>
          ${sale.items.map(item => `
            <tr>
              <td>${item.name}</td>
              <td style="text-align: right">${item.quantity}</td>
              <td style="text-align: right">$${item.price.toFixed(2)}</td>
              <td style="text-align: right">$${(item.quantity * item.price).toFixed(2)}</td>
            </tr>
          `).join('')}
        </table>

        <div class="divider"></div>

        <div class="total">
          <p>Total: $${sale.total.toFixed(2)}</p>
        </div>

        <div class="footer">
          <p>${receiptSettings.footerMessage}</p>
          <p>Thank you for shopping with us!</p>
        </div>
      </body>
    </html>
  `;
}