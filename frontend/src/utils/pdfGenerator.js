import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { format } from 'date-fns';

/**
 * Generate PDF for a single audit log
 */
export const generateAuditLogPDF = (log) => {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  
  // Header with gradient effect (simulated with rectangles)
  doc.setFillColor(6, 182, 212); // Cyan
  doc.rect(0, 0, pageWidth, 40, 'F');
  
  // Logo/Title
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(24);
  doc.setFont('helvetica', 'bold');
  doc.text('AUDIT LOG REPORT', pageWidth / 2, 20, { align: 'center' });
  
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text(`Generated: ${format(new Date(), 'MMM dd, yyyy HH:mm:ss')}`, pageWidth / 2, 30, { align: 'center' });
  
  // Reset text color
  doc.setTextColor(0, 0, 0);
  
  let yPos = 50;
  
  // Log ID and Timestamp
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text('Log Information', 14, yPos);
  yPos += 10;
  
  doc.autoTable({
    startY: yPos,
    head: [['Field', 'Value']],
    body: [
      ['Log ID', `#${log.id}`],
      ['Timestamp', format(new Date(log.createdAt), 'MMM dd, yyyy HH:mm:ss')],
      ['Status', log.status],
    ],
    theme: 'grid',
    headStyles: { fillColor: [6, 182, 212], textColor: 255 },
    margin: { left: 14, right: 14 },
  });
  
  yPos = doc.lastAutoTable.finalY + 15;
  
  // User Information
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text('User Information', 14, yPos);
  yPos += 10;
  
  doc.autoTable({
    startY: yPos,
    head: [['Field', 'Value']],
    body: [
      ['User ID', log.userId || 'N/A'],
      ['Email', log.userEmail || 'N/A'],
      ['Role', log.userRole || 'N/A'],
    ],
    theme: 'grid',
    headStyles: { fillColor: [6, 182, 212], textColor: 255 },
    margin: { left: 14, right: 14 },
  });
  
  yPos = doc.lastAutoTable.finalY + 15;
  
  // Action Details
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text('Action Details', 14, yPos);
  yPos += 10;
  
  doc.autoTable({
    startY: yPos,
    head: [['Field', 'Value']],
    body: [
      ['Action', log.action],
      ['Entity', log.entity],
      ['Entity ID', log.entityId || 'N/A'],
      ['Description', log.description],
    ],
    theme: 'grid',
    headStyles: { fillColor: [6, 182, 212], textColor: 255 },
    margin: { left: 14, right: 14 },
    columnStyles: {
      1: { cellWidth: 'auto' }
    }
  });
  
  yPos = doc.lastAutoTable.finalY + 15;
  
  // Technical Details
  if (yPos > pageHeight - 60) {
    doc.addPage();
    yPos = 20;
  }
  
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text('Technical Details', 14, yPos);
  yPos += 10;
  
  doc.autoTable({
    startY: yPos,
    head: [['Field', 'Value']],
    body: [
      ['IP Address', log.ipAddress || 'N/A'],
      ['User Agent', log.userAgent || 'N/A'],
    ],
    theme: 'grid',
    headStyles: { fillColor: [6, 182, 212], textColor: 255 },
    margin: { left: 14, right: 14 },
    columnStyles: {
      1: { cellWidth: 'auto' }
    }
  });
  
  // Metadata
  if (log.metadata) {
    yPos = doc.lastAutoTable.finalY + 15;
    
    if (yPos > pageHeight - 40) {
      doc.addPage();
      yPos = 20;
    }
    
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text('Additional Metadata', 14, yPos);
    yPos += 10;
    
    doc.setFontSize(9);
    doc.setFont('courier', 'normal');
    const metadataText = JSON.stringify(log.metadata, null, 2);
    const splitMetadata = doc.splitTextToSize(metadataText, pageWidth - 28);
    doc.text(splitMetadata, 14, yPos);
  }
  
  // Footer
  const totalPages = doc.internal.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setTextColor(128, 128, 128);
    doc.text(
      `Page ${i} of ${totalPages} | Confidential - For Authorized Use Only`,
      pageWidth / 2,
      pageHeight - 10,
      { align: 'center' }
    );
  }
  
  // Save the PDF
  doc.save(`Audit_Log_${log.id}_${format(new Date(), 'yyyyMMdd_HHmmss')}.pdf`);
};

/**
 * Generate PDF for multiple audit logs
 */
export const generateBulkAuditLogPDF = (logs, filename = 'Audit_Logs') => {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  
  // Header
  doc.setFillColor(6, 182, 212);
  doc.rect(0, 0, pageWidth, 40, 'F');
  
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(24);
  doc.setFont('helvetica', 'bold');
  doc.text('AUDIT LOGS REPORT', pageWidth / 2, 20, { align: 'center' });
  
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text(`Generated: ${format(new Date(), 'MMM dd, yyyy HH:mm:ss')}`, pageWidth / 2, 30, { align: 'center' });
  
  // Summary
  doc.setTextColor(0, 0, 0);
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text(`Total Logs: ${logs.length}`, 14, 50);
  
  // Table
  const tableData = logs.map(log => [
    format(new Date(log.createdAt), 'MM/dd/yyyy HH:mm'),
    log.userEmail || 'System',
    log.action,
    log.entity,
    log.status,
    log.description.substring(0, 50) + (log.description.length > 50 ? '...' : ''),
  ]);
  
  doc.autoTable({
    startY: 60,
    head: [['Timestamp', 'User', 'Action', 'Entity', 'Status', 'Description']],
    body: tableData,
    theme: 'grid',
    headStyles: { 
      fillColor: [6, 182, 212], 
      textColor: 255,
      fontSize: 9,
      fontStyle: 'bold'
    },
    bodyStyles: {
      fontSize: 8
    },
    columnStyles: {
      0: { cellWidth: 30 },
      1: { cellWidth: 35 },
      2: { cellWidth: 25 },
      3: { cellWidth: 20 },
      4: { cellWidth: 20 },
      5: { cellWidth: 'auto' }
    },
    margin: { left: 14, right: 14 },
    didDrawPage: (data) => {
      // Footer on each page
      doc.setFontSize(8);
      doc.setTextColor(128, 128, 128);
      doc.text(
        `Page ${doc.internal.getCurrentPageInfo().pageNumber} | Confidential - For Authorized Use Only`,
        pageWidth / 2,
        pageHeight - 10,
        { align: 'center' }
      );
    }
  });
  
  // Save the PDF
  doc.save(`${filename}_${format(new Date(), 'yyyyMMdd_HHmmss')}.pdf`);
};
