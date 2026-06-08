import { Injectable } from '@nestjs/common';
import { ProductosService } from '../productos/productos.service';
// eslint-disable-next-line @typescript-eslint/no-require-imports
const PDFDocument = require('pdfkit');

@Injectable()
export class ReportesService {
  constructor(private productosService: ProductosService) {}

  async generateInventoryReport(): Promise<Buffer> {
    const productos = await this.productosService.findAllForReport();

    return new Promise((resolve, reject) => {
      const doc = new PDFDocument({
        size: 'LETTER',
        margin: 50,
        bufferPages: true,
      });

      const buffers: Buffer[] = [];
      doc.on('data', (chunk: Buffer) => buffers.push(chunk));
      doc.on('end', () => resolve(Buffer.concat(buffers)));
      doc.on('error', reject);

      // Title
      doc
        .fontSize(24)
        .font('Helvetica-Bold')
        .fillColor('#7c3aed')
        .text('FULL Accesorios', { align: 'center' });

      doc.moveDown(0.5);
      doc
        .fontSize(14)
        .font('Helvetica')
        .fillColor('#4b5563')
        .text('Reporte General de Inventario', { align: 'center' });

      doc.moveDown(0.3);
      doc
        .fontSize(9)
        .fillColor('#9ca3af')
        .text(`Generado el: ${new Date().toLocaleString('es-BO')}`, {
          align: 'center',
        });

      doc.moveDown(1);

      // Separator line
      doc
        .moveTo(50, doc.y)
        .lineTo(562, doc.y)
        .stroke();
      doc.moveDown(1);

      // Group products by category
      const groupedProducts: {
        [key: string]: typeof productos;
      } = {};

      for (const producto of productos) {
        const categoryName = producto.categoria
          ? producto.categoria.nombre
          : 'Sin Categoría';
        if (!groupedProducts[categoryName]) {
          groupedProducts[categoryName] = [];
        }
        groupedProducts[categoryName].push(producto);
      }

      let totalProductos = 0;
      let totalStock = 0;
      let valorTotal = 0;

      // Render each category
      for (const [categoryName, categoryProducts] of Object.entries(
        groupedProducts,
      )) {
        // Check if we need a new page
        if (doc.y > 650) {
          doc.addPage();
        }

        // Category header
        doc.moveDown(1);
        doc
          .fontSize(12)
          .font('Helvetica-Bold')
          .fillColor('#ffffff');

        // Draw a background rectangle for the category header
        doc.rect(50, doc.y - 2, 512, 20).fill('#7c3aed');
        doc.fillColor('#ffffff').text(`Categoría: ${categoryName.toUpperCase()}`, 55, doc.y + 3);

        doc.moveDown(0.5);

        // Table header
        doc.moveDown(0.5);
        const tableTop = doc.y;
        const col1 = 55;  // Nombre
        const col2 = 290; // Precio
        const col3 = 390; // Stock
        const col4 = 470; // Subtotal

        doc
          .fontSize(9)
          .font('Helvetica-Bold')
          .fillColor('#4b5563');

        doc.text('PRODUCTO', col1, tableTop);
        doc.text('PRECIO (Bs)', col2, tableTop, { width: 70, align: 'right' });
        doc.text('STOCK', col3, tableTop, { width: 50, align: 'center' });
        doc.text('SUBTOTAL', col4, tableTop, { width: 80, align: 'right' });

        doc.moveDown(0.3);
        doc
          .moveTo(50, doc.y)
          .lineTo(562, doc.y)
          .stroke('#e5e7eb');
        doc.moveDown(0.3);

        // Table rows
        doc.font('Helvetica').fontSize(9);
        let i = 0;

        for (const producto of categoryProducts) {
          if (doc.y > 700) {
            doc.addPage();
          }

          const y = doc.y;
          const precio = Number(producto.precio);
          const subtotal = precio * producto.stock;

          totalProductos++;
          totalStock += producto.stock;
          valorTotal += subtotal;

          // Zebra striping
          if (i % 2 === 0) {
            doc.rect(50, y - 2, 512, 16).fill('#f9fafb');
          }
          doc.fillColor('#1f2937');

          doc.text(
            producto.nombre.length > 40
              ? producto.nombre.substring(0, 40) + '...'
              : producto.nombre,
            col1,
            y + 2,
            { width: 230 },
          );
          doc.text(precio.toFixed(2), col2, y + 2, { width: 70, align: 'right' });
          doc.text(producto.stock.toString(), col3, y + 2, { width: 50, align: 'center' });
          doc.text(subtotal.toFixed(2), col4, y + 2, { width: 80, align: 'right' });

          doc.moveDown(0.5);
          i++;
        }

        doc.moveDown(0.5);
      }

      // Summary section
      if (doc.y > 600) {
        doc.addPage();
      }

      doc.moveDown(1);
      doc
        .moveTo(50, doc.y)
        .lineTo(562, doc.y)
        .stroke('#2c3e50');
      doc.moveDown(1);

      doc
        .fontSize(14)
        .font('Helvetica-Bold')
        .fillColor('#7c3aed')
        .text('Resumen Final del Inventario', { align: 'center' });

      doc.moveDown(0.5);
      
      // Draw summary box
      doc.rect(150, doc.y, 312, 70).fill('#f3f4f6');
      const boxY = doc.y;
      
      doc.fontSize(10).font('Helvetica-Bold').fillColor('#374151');
      doc.text('Total de productos registrados:', 170, boxY + 15);
      doc.text('Unidades físicas en stock:', 170, boxY + 30);
      doc.text('Valor comercial estimado:', 170, boxY + 45);

      doc.font('Helvetica').fillColor('#1f2937');
      doc.text(`${totalProductos}`, 350, boxY + 15, { width: 90, align: 'right' });
      doc.text(`${totalStock}`, 350, boxY + 30, { width: 90, align: 'right' });
      doc.text(`Bs. ${valorTotal.toFixed(2)}`, 350, boxY + 45, { width: 90, align: 'right' });

      // Footer
      const pageCount = doc.bufferedPageRange().count;
      for (let i = 0; i < pageCount; i++) {
        doc.switchToPage(i);
        doc
          .fontSize(8)
          .fillColor('#999999')
          .text(
            `FULL Accesorios - Reporte de Inventario | Página ${i + 1} de ${pageCount}`,
            50,
            740,
            { align: 'center' },
          );
      }

      doc.end();
    });
  }
}
