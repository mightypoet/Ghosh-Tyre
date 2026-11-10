import { BUSINESS_INFO } from '../data/initialData';
import { EnquiryItem, Product } from '../types';

export function getWhatsAppUrl(message: string): string {
  const encoded = encodeURIComponent(message);
  return `https://wa.me/${BUSINESS_INFO.whatsappNumber}?text=${encoded}`;
}

export function getProductWhatsAppUrl(product: Product, quantity = 1): string {
  const specText = product.tyreSpecs?.width
    ? ` (${product.tyreSpecs.width}/${product.tyreSpecs.aspectRatio} ${product.tyreSpecs.rimDiameter})`
    : '';
  const msg = `Hello Ghosh Tyre Zone, I am interested in ${product.name}${specText} [Brand: ${product.brand}, Qty: ${quantity}]. Please share the price, availability and further details.`;
  return getWhatsAppUrl(msg);
}

export function getServiceWhatsAppUrl(serviceName: string): string {
  const msg = `Hello Ghosh Tyre Zone, I would like to enquire about ${serviceName} for my vehicle. Please share appointment availability and details.`;
  return getWhatsAppUrl(msg);
}

export function getCartWhatsAppUrl(
  items: EnquiryItem[],
  customerName?: string,
  vehicleInfo?: string,
  referenceNumber?: string
): string {
  const itemLines = items
    .map((item, idx) => `${idx + 1}. ${item.productName} (${item.brand}) - Qty: ${item.quantity}`)
    .join('\n');
  const header = referenceNumber
    ? `Hello Ghosh Tyre Zone, I have submitted Enquiry Ref: ${referenceNumber}.`
    : `Hello Ghosh Tyre Zone, I am interested in the following products:`;
  const customerLine = customerName ? `\nName: ${customerName}` : '';
  const vehicleLine = vehicleInfo ? `\nVehicle: ${vehicleInfo}` : '';
  const msg = `${header}${customerLine}${vehicleLine}\n\nProducts:\n${itemLines}\n\nPlease share the price, availability and installation details.`;
  return getWhatsAppUrl(msg);
}
