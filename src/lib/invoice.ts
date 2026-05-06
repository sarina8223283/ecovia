import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

export interface InvoiceItem {
  product_name: string;
  quantity_grams: number;
  unit_price: number;
  total_price: number;
}

export interface InvoiceData {
  orderNumber: string;
  invoiceNumber: string;
  date: string;
  customerName: string;
  customerEmail?: string;
  customerPhone: string;
  customerAddress: string;
  items: InvoiceItem[];
  subtotal: number;
  discount: number;
  total: number;
  couponCode?: string;
  paidVia?: string;
}

export function buildInvoiceNumber(orderNumber: string): string {
  return `INV-${orderNumber.replace('MTK-', '')}`;
}

export function generateInvoicePDF(data: InvoiceData): jsPDF {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();

  // Header
  doc.setFillColor(77, 122, 94); // emerald
  doc.rect(0, 0, pageWidth, 28, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFont('times', 'bold');
  doc.setFontSize(20);
  doc.text('Mittika by Ecovia Enterprises', 14, 14);
  doc.setFontSize(10);
  doc.setFont('times', 'normal');
  doc.text('100% Natural Herbal Powders', 14, 21);
  doc.text('ecovia.co.in  •  +91 87588 08684', pageWidth - 14, 21, { align: 'right' });

  // Invoice Title
  doc.setTextColor(0, 0, 0);
  doc.setFontSize(16);
  doc.setFont('times', 'bold');
  doc.text('TAX INVOICE', pageWidth / 2, 40, { align: 'center' });

  // Meta block
  doc.setFontSize(10);
  doc.setFont('times', 'normal');
  doc.text(`Invoice No: ${data.invoiceNumber}`, 14, 50);
  doc.text(`Order No: ${data.orderNumber}`, 14, 56);
  doc.text(`Date: ${data.date}`, 14, 62);
  if (data.paidVia) doc.text(`Payment: ${data.paidVia}`, 14, 68);

  // Customer
  doc.setFont('times', 'bold');
  doc.text('Bill To:', pageWidth - 90, 50);
  doc.setFont('times', 'normal');
  doc.text(data.customerName, pageWidth - 90, 56);
  if (data.customerPhone) doc.text(data.customerPhone, pageWidth - 90, 62);
  if (data.customerEmail) doc.text(data.customerEmail, pageWidth - 90, 68);
  const addrLines = doc.splitTextToSize(data.customerAddress || '', 80);
  doc.text(addrLines, pageWidth - 90, 74);

  // Items table
  autoTable(doc, {
    startY: 95,
    head: [['#', 'Product', 'Quantity', 'Unit Price', 'Total']],
    body: data.items.map((it, i) => [
      i + 1,
      it.product_name,
      it.quantity_grams >= 1000 ? `${it.quantity_grams / 1000} Kg` : `${it.quantity_grams} g`,
      `₹${Number(it.unit_price).toFixed(2)}/g`,
      `₹${Number(it.total_price).toFixed(2)}`,
    ]),
    theme: 'grid',
    headStyles: { fillColor: [77, 122, 94], font: 'times', fontStyle: 'bold' },
    styles: { font: 'times', fontSize: 10 },
  });

  const finalY = (doc as any).lastAutoTable.finalY || 120;
  let y = finalY + 10;
  doc.setFont('times', 'normal');
  doc.setFontSize(11);
  doc.text('Subtotal:', pageWidth - 60, y);
  doc.text(`₹${data.subtotal.toFixed(2)}`, pageWidth - 14, y, { align: 'right' });
  y += 6;
  if (data.discount > 0) {
    doc.text(`Discount${data.couponCode ? ` (${data.couponCode})` : ''}:`, pageWidth - 60, y);
    doc.text(`- ₹${data.discount.toFixed(2)}`, pageWidth - 14, y, { align: 'right' });
    y += 6;
  }
  doc.setFont('times', 'bold');
  doc.setFontSize(13);
  doc.text('Total:', pageWidth - 60, y + 2);
  doc.text(`₹${data.total.toFixed(2)}`, pageWidth - 14, y + 2, { align: 'right' });

  // Footer
  doc.setFont('times', 'italic');
  doc.setFontSize(9);
  doc.setTextColor(100, 100, 100);
  doc.text(
    'Thank you for choosing Mittika. 100% natural, no preservatives. No returns once dispatched.',
    pageWidth / 2, 285, { align: 'center' }
  );

  return doc;
}

export function downloadInvoice(data: InvoiceData) {
  const doc = generateInvoicePDF(data);
  doc.save(`${data.invoiceNumber}.pdf`);
}